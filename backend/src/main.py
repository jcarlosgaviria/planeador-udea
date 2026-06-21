"""
Planeador Académico UdeA — Backend API
FastAPI + PostgreSQL + Redis

Endpoints principales:
- /api/estudiantes     → CRUD de perfiles de estudiantes
- /api/notas          → Registro y consulta de notas
- /api/predicciones   → Modelos predictivos (riesgo, deserción, graduación)
- /api/ia             → Integración con Claude (Anthropic) para recomendaciones
- /api/mallas         → Datos curriculares por programa
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn

from src.routes import estudiantes, notas, predicciones, ia, mallas
from src.config.database import engine, Base
from src.config.settings import settings

# ── Crear tablas en BD ──
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Planeador Académico UdeA",
    description="API para planeación académica con modelos predictivos — Facultad de Ingeniería",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
)

# ── Middlewares ──
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(estudiantes.router, prefix="/api/estudiantes", tags=["Estudiantes"])
app.include_router(notas.router, prefix="/api/notas", tags=["Notas"])
app.include_router(predicciones.router, prefix="/api/predicciones", tags=["Predicciones IA"])
app.include_router(ia.router, prefix="/api/ia", tags=["Recomendaciones Claude"])
app.include_router(mallas.router, prefix="/api/mallas", tags=["Mallas curriculares"])


@app.get("/")
def root():
    return {
        "app": "Planeador Académico UdeA",
        "version": "1.0.0",
        "facultad": "Ingeniería",
        "programas_piloto": 6,
        "status": "ok"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )
