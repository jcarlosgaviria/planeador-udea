"""
models/database.py
Modelos de base de datos — SQLAlchemy ORM
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.config.database import Base
import uuid


class Estudiante(Base):
    __tablename__ = "estudiantes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=True)  # futuro: auth UdeA
    programa_id = Column(String, nullable=False)        # ej: 'ind-pre'
    modalidad = Column(String, nullable=False)          # 'Presencial' | 'Virtual'
    semestre_actual = Column(String, default="I")
    promedio_acumulado = Column(Float, default=0.0)
    creditos_aprobados = Column(Integer, default=0)
    materias_perdidas = Column(Integer, default=0)
    materias_canceladas = Column(Integer, default=0)
    horas_trabajo = Column(Float, default=0)
    horas_desplazamiento = Column(Float, default=1)
    horas_sueno = Column(Float, default=7)
    horas_otras = Column(Float, default=1)
    materias_aprobadas = Column(JSON, default=list)     # lista de códigos
    materias_matriculadas = Column(JSON, default=list)  # semestre actual
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    notas = relationship("Nota", back_populates="estudiante", cascade="all, delete-orphan")
    predicciones = relationship("Prediccion", back_populates="estudiante")


class Nota(Base):
    __tablename__ = "notas"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    estudiante_id = Column(String, ForeignKey("estudiantes.id"), nullable=False)
    codigo_materia = Column(String, nullable=False)
    nombre_materia = Column(String, nullable=False)
    semestre = Column(String, nullable=False)
    parcial_1 = Column(Float, nullable=True)
    parcial_2 = Column(Float, nullable=True)
    parcial_3 = Column(Float, nullable=True)
    nota_final = Column(Float, nullable=True)
    periodo = Column(String, nullable=False)            # ej: '2024-1'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    estudiante = relationship("Estudiante", back_populates="notas")


class Prediccion(Base):
    __tablename__ = "predicciones"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    estudiante_id = Column(String, ForeignKey("estudiantes.id"), nullable=False)
    tipo = Column(String, nullable=False)               # 'riesgo' | 'desercion' | 'graduacion'
    valor = Column(Float, nullable=False)               # probabilidad 0-1
    detalles = Column(JSON, nullable=True)              # breakdown por materia
    modelo_version = Column(String, default="1.0-sintetico")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    estudiante = relationship("Estudiante", back_populates="predicciones")


class LogIA(Base):
    """Registro de consultas a Claude para auditoría y mejora"""
    __tablename__ = "logs_ia"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    estudiante_id = Column(String, nullable=True)
    prompt_resumen = Column(Text, nullable=True)        # sin datos sensibles
    tokens_usados = Column(Integer, nullable=True)
    tiempo_respuesta_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
