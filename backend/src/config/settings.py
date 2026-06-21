"""
config/settings.py
Configuración centralizada del backend
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── App ──
    APP_NAME: str = "Planeador Académico UdeA"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "cambia-esto-en-produccion"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440  # 24 horas

    # ── Base de datos ──
    DATABASE_URL: str = "postgresql://udea:udea2024@localhost:5432/planeador"

    # ── Redis ──
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL_PREDICCIONES: int = 3600  # 1 hora

    # ── Anthropic (Claude) ──
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-6"
    CLAUDE_MAX_TOKENS: int = 1000

    # ── CORS ──
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://planeador.ingenieria.udea.edu.co",  # dominio futuro
    ]

    # ── Modelos predictivos ──
    MODELO_N_MUESTRAS_SINTETICAS: int = 500
    MODELO_EPOCHS: int = 300
    MODELO_LR: float = 0.05

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
