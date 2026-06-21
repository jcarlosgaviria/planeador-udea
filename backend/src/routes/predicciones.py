"""
routes/predicciones.py
Endpoints de modelos predictivos
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np

router = APIRouter()


class PerfilEstudiante(BaseModel):
    semestre: int = Field(..., ge=1, le=10)
    materias: int = Field(..., ge=1, le=9)
    prom_acum: float = Field(..., ge=0, le=5)
    trabajo_horas: float = Field(0, ge=0, le=12)
    desplaz_horas: float = Field(1, ge=0, le=6)
    perdidas: int = Field(0, ge=0, le=20)
    canceladas: int = Field(0, ge=0)
    notas_parciales: List[float] = Field(default_factory=list)


class ResultadoRiesgo(BaseModel):
    materia_idx: int
    probabilidad: float
    nivel: str   # 'bajo' | 'medio' | 'alto'
    nota_parcial: float


class ResultadoDesercion(BaseModel):
    probabilidad: float
    nivel: str
    factores_riesgo: dict


class ResultadoGraduacion(BaseModel):
    semestres_restantes: int
    anio_estimado: int
    escenario_optimista: int
    escenario_pesimista: int


# ── Modelo en memoria (se inicializa al arrancar el servidor) ──
# En producción: cargar modelo entrenado desde archivo .pkl o BD
_modelo = None

def get_modelo():
    global _modelo
    if _modelo is None:
        from src.models.predictivo_py import entrenar_modelos
        _modelo = entrenar_modelos()
    return _modelo


@router.post("/riesgo", response_model=List[ResultadoRiesgo])
def predecir_riesgo(perfil: PerfilEstudiante):
    """
    Predice probabilidad de perder cada materia matriculada.
    Si no hay notas parciales, usa el promedio acumulado.
    """
    modelo = get_modelo()
    resultados = []

    notas = perfil.notas_parciales or [perfil.prom_acum] * perfil.materias

    for i, nota in enumerate(notas[:perfil.materias]):
        datos = {
            'trabajo': perfil.trabajo_horas,
            'desplaz': perfil.desplaz_horas,
            'materias': perfil.materias,
            'notaBase': nota,
            'perdidas': perfil.perdidas,
            'canceladas': perfil.canceladas,
        }
        prob = modelo['predecir_riesgo'](datos)
        nivel = 'alto' if prob >= 0.65 else 'medio' if prob >= 0.35 else 'bajo'
        resultados.append(ResultadoRiesgo(
            materia_idx=i,
            probabilidad=round(prob, 3),
            nivel=nivel,
            nota_parcial=nota,
        ))

    return sorted(resultados, key=lambda r: r.probabilidad, reverse=True)


@router.post("/desercion", response_model=ResultadoDesercion)
def predecir_desercion(perfil: PerfilEstudiante):
    """
    Predice probabilidad de deserción basada en perfil del estudiante.
    """
    modelo = get_modelo()
    datos = {
        'trabajo': perfil.trabajo_horas,
        'desplaz': perfil.desplaz_horas,
        'materias': perfil.materias,
        'promAcum': perfil.prom_acum,
        'perdidas': perfil.perdidas,
        'canceladas': perfil.canceladas,
    }
    prob = modelo['predecir_desercion'](datos)
    nivel = 'alto' if prob >= 0.6 else 'medio' if prob >= 0.35 else 'bajo'

    factores = {
        'carga_laboral': min(1.0, perfil.trabajo_horas / 10),
        'desplazamiento': min(1.0, perfil.desplaz_horas / 5),
        'perdidas_previas': min(1.0, perfil.perdidas / 8),
        'promedio_bajo': max(0, (3.0 - perfil.prom_acum) / 3.0),
        'sobrecarga_materias': max(0, (perfil.materias - 5) / 4),
    }

    return ResultadoDesercion(
        probabilidad=round(prob, 3),
        nivel=nivel,
        factores_riesgo=factores,
    )


@router.post("/graduacion", response_model=ResultadoGraduacion)
def predecir_graduacion(perfil: PerfilEstudiante):
    """
    Estima semestres restantes hasta graduación en 3 escenarios.
    """
    import datetime

    def calcular(p, extra_perdidas=0, reduccion_trabajo=0):
        extra = (
            (p.perdidas + extra_perdidas) * 0.6 +
            p.canceladas * 0.3 +
            (max(0, p.trabajo_horas - reduccion_trabajo) > 6 and 1.2 or
             max(0, p.trabajo_horas - reduccion_trabajo) > 3 and 0.5 or 0) +
            (p.prom_acum < 2.8 and 1.5 or p.prom_acum < 3.2 and 0.5 or 0)
        )
        return max(1, round(10 - p.semestre + extra))

    semestres_actual = calcular(perfil)
    semestres_opt = calcular(perfil, reduccion_trabajo=2)
    semestres_pes = calcular(perfil, extra_perdidas=2)

    anio_actual = datetime.datetime.now().year
    anio_grad = anio_actual + (semestres_actual // 2)

    return ResultadoGraduacion(
        semestres_restantes=semestres_actual,
        anio_estimado=anio_grad,
        escenario_optimista=semestres_opt,
        escenario_pesimista=semestres_pes,
    )
