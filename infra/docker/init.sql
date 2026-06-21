-- init.sql
-- Inicialización de base de datos — Planeador Académico UdeA
-- Se ejecuta automáticamente al crear el contenedor PostgreSQL

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- búsqueda fuzzy

-- Índices adicionales para consultas frecuentes
-- (Las tablas las crea SQLAlchemy automáticamente)

-- Datos iniciales: programas disponibles
CREATE TABLE IF NOT EXISTS programas (
    id VARCHAR PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    modalidad VARCHAR NOT NULL,
    escuela VARCHAR,
    creditos INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO programas (id, nombre, modalidad, escuela, creditos) VALUES
    ('ind-pre', 'Ingeniería Industrial', 'Presencial', 'Escuela de Ingeniería Industrial', 160),
    ('ind-vir', 'Ingeniería Industrial', 'Virtual', 'Escuela de Ingeniería Industrial', 160),
    ('civ-pre', 'Ingeniería Civil', 'Presencial', 'Escuela Ambiental', 160),
    ('san-pre', 'Ingeniería Sanitaria', 'Presencial', 'Escuela Ambiental', 160),
    ('amb-vir', 'Ingeniería Ambiental', 'Virtual', 'Escuela Ambiental', 182),
    ('tel-pre', 'Ingeniería de Telecomunicaciones', 'Presencial', 'Escuela de Telecomunicaciones', 175)
ON CONFLICT (id) DO NOTHING;

-- Tabla de versiones de modelo predictivo
CREATE TABLE IF NOT EXISTS versiones_modelo (
    id SERIAL PRIMARY KEY,
    version VARCHAR NOT NULL,
    tipo VARCHAR NOT NULL,  -- 'sintetico' | 'real'
    n_muestras INTEGER,
    accuracy FLOAT,
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO versiones_modelo (version, tipo, n_muestras, notas, activo) VALUES
    ('1.0-sintetico', 'sintetico', 500, 'Modelo inicial con datos sintéticos. Pendiente reentrenar con datos reales UdeA.', TRUE);
