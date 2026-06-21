# Planeador Académico — Facultad de Ingeniería UdeA

Aplicación web para planeación académica con modelos predictivos de riesgo y deserción.

## Estructura del proyecto

```
planeador-udea/
├── frontend/          → App React (interfaz del estudiante)
├── backend/           → API FastAPI (Python) + modelos predictivos
├── infra/             → Docker, Nginx, configs de despliegue
└── docs/              → Documentación técnica y de usuario
```

## Stack tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Frontend | React + Vite | Componentes reutilizables, rápido |
| Backend | FastAPI (Python) | Modelos ML, API REST |
| Base de datos | PostgreSQL | Datos de estudiantes |
| Cache | Redis | Sesiones y resultados de predicción |
| Nube | AWS / GCP / Azure | Escalable, piloto → producción |
| Contenedores | Docker + Compose | Deploy reproducible |
| Proxy | Nginx | SSL, balanceo, archivos estáticos |

## Inicio rápido (desarrollo local)

```bash
# 1. Clonar y entrar al proyecto
git clone <repo>
cd planeador-udea

# 2. Levantar todo con Docker Compose
docker compose up --build

# 3. Abrir en el navegador
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Docs API: http://localhost:8000/docs
```

## Despliegue en producción (nube)

Ver `infra/README.md` para instrucciones detalladas de AWS / GCP / Azure.

## Programas disponibles (piloto)

- Ingeniería Industrial (Presencial y Virtual)
- Ingeniería Ambiental (Virtual)
- Ingeniería Civil (Presencial)
- Ingeniería Sanitaria (Presencial)
- Ingeniería de Telecomunicaciones (Presencial)

## Roadmap

- [x] Prototipo interactivo con 6 programas
- [x] Módulo predictivo con datos sintéticos
- [x] Guardado persistente por estudiante
- [ ] Autenticación con correo UdeA
- [ ] Integración con datos reales del sistema académico
- [ ] Dashboard para asesores y docentes
- [ ] Extensión a otras facultades
