#!/bin/bash
# deploy.sh — Script de despliegue para AWS / GCP / Azure
# Uso: ./deploy.sh [ambiente]  →  ./deploy.sh staging  |  ./deploy.sh production

set -e  # salir si cualquier comando falla

AMBIENTE=${1:-staging}
APP_NAME="planeador-udea"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Desplegando $APP_NAME en ambiente: $AMBIENTE"

# ── 1. Verificar dependencias ──
command -v docker >/dev/null 2>&1 || { echo "❌ Docker no instalado"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose no instalado"; exit 1; }

# ── 2. Verificar variables de entorno ──
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado. Copiar .env.example como .env y completar."
    exit 1
fi

if [ -z "$ANTHROPIC_API_KEY" ] && ! grep -q "ANTHROPIC_API_KEY=" .env; then
    echo "⚠️  ANTHROPIC_API_KEY no configurado en .env"
fi

# ── 3. Build de imágenes ──
echo "📦 Construyendo imágenes Docker..."
docker compose build --no-cache

# ── 4. Backup de BD (solo producción) ──
if [ "$AMBIENTE" = "production" ]; then
    echo "💾 Creando backup de base de datos..."
    docker compose exec -T db pg_dump -U udea planeador > \
        "backups/backup_${TIMESTAMP}.sql" 2>/dev/null || echo "⚠️  Backup omitido (primera vez)"
fi

# ── 5. Migrations de BD ──
echo "🗄️  Ejecutando migraciones..."
docker compose run --rm backend alembic upgrade head

# ── 6. Levantar servicios ──
echo "▶️  Levantando servicios..."
docker compose up -d --remove-orphans

# ── 7. Health check ──
echo "🔍 Verificando salud de servicios..."
sleep 5

BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend no responde (HTTP $BACKEND_STATUS)"
    docker compose logs backend --tail=20
    exit 1
fi

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend: OK"
else
    echo "⚠️  Frontend: HTTP $FRONTEND_STATUS (puede estar iniciando)"
fi

# ── 8. Limpiar imágenes antiguas ──
echo "🧹 Limpiando imágenes no usadas..."
docker image prune -f

echo ""
echo "✅ Despliegue completado exitosamente"
echo "   Ambiente: $AMBIENTE"
echo "   Timestamp: $TIMESTAMP"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
