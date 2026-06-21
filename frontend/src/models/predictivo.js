/**
 * models/predictivo.js
 * Módulo de modelos predictivos — Planeador Académico UdeA
 *
 * Arquitectura: Regresión logística con descenso de gradiente (JS puro)
 * Sin dependencias externas → corre en frontend Y backend
 *
 * Para reemplazar datos sintéticos con datos reales:
 * - Sustituir la función `generarDatosSinteticos()` con una llamada
 *   al endpoint de la API del sistema académico UdeA
 * - Los datos deben tener el mismo shape que el objeto de entrenamiento
 * - Re-ejecutar `entrenarModelos()` con los nuevos datos
 */

// ── Utilidades matemáticas ──
const sigmoid = z => 1 / (1 + Math.exp(-z))

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function normalRandom(mu = 0, sigma = 1) {
  let u = 0, v = 0
  while (!u) u = Math.random()
  while (!v) v = Math.random()
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// ── Features de cada modelo ──
export const FEATURES = {
  riesgo: ['trabajo', 'desplaz', 'materias', 'notaBase', 'perdidas', 'canceladas'],
  desercion: ['trabajo', 'desplaz', 'materias', 'promAcum', 'perdidas', 'canceladas'],
}

// ── Labels legibles para la UI ──
export const FEATURE_LABELS = {
  trabajo: 'Horas de trabajo',
  desplaz: 'Desplazamiento diario',
  materias: 'N.° de materias',
  notaBase: 'Nota parcial promedio',
  promAcum: 'Promedio acumulado',
  perdidas: 'Materias perdidas previas',
  canceladas: 'Cancelaciones previas',
}

/**
 * Genera dataset sintético para entrenamiento inicial
 * REEMPLAZAR con datos reales del sistema académico UdeA
 */
export function generarDatosSinteticos(n = 500) {
  const datos = []
  for (let i = 0; i < n; i++) {
    const semestre = Math.ceil(Math.random() * 8)
    const trabajo = clamp(normalRandom(3, 2.5), 0, 10)
    const desplaz = clamp(normalRandom(1.5, 1), 0, 5)
    const materias = clamp(Math.round(normalRandom(5, 1)), 2, 8)
    const notaBase = clamp(normalRandom(3.3, 0.7), 0, 5)
    const promAcum = clamp(normalRandom(3.2, 0.6), 0, 5)
    const perdidas = Math.max(0, Math.round(normalRandom(1, 1.2)))
    const canceladas = Math.max(0, Math.round(normalRandom(0.5, 0.8)))

    const factorRiesgo =
      trabajo * 0.15 + desplaz * 0.08 + (5 - notaBase) * 0.4 +
      perdidas * 0.12 + canceladas * 0.06 + (materias - 5) * 0.05

    datos.push({
      semestre, trabajo, desplaz, materias,
      notaBase, promAcum, perdidas, canceladas,
      probPerdida: clamp(1 / (1 + Math.exp(-(factorRiesgo - 2.5))), 0.02, 0.98),
      probDesercion: clamp(1 / (1 + Math.exp(-(factorRiesgo * 0.8 + perdidas * 0.2 - 3))), 0.02, 0.95),
    })
  }
  return datos
}

// ── Normalización Z-score ──
function calcularStats(datos, features) {
  const stats = {}
  features.forEach(f => {
    const vals = datos.map(d => d[f])
    const mu = vals.reduce((a, b) => a + b, 0) / vals.length
    const sigma = Math.sqrt(vals.reduce((a, v) => a + (v - mu) ** 2, 0) / vals.length) || 1
    stats[f] = { mu, sigma }
  })
  return stats
}

// ── Entrenamiento regresión logística ──
function entrenarLogistico(datos, targetFn, features, stats, lr = 0.05, epochs = 300) {
  let w = new Array(features.length).fill(0)
  let b = 0

  for (let e = 0; e < epochs; e++) {
    const dw = new Array(features.length).fill(0)
    let db = 0

    datos.forEach(d => {
      const x = features.map(f => (d[f] - stats[f].mu) / stats[f].sigma)
      const y = targetFn(d)
      const pred = sigmoid(x.reduce((s, xi, i) => s + w[i] * xi, b))
      const err = pred - y
      x.forEach((xi, i) => (dw[i] += err * xi))
      db += err
    })

    w = w.map((wi, i) => wi - (lr * dw[i]) / datos.length)
    b = b - (lr * db) / datos.length
  }
  return { w, b }
}

/**
 * Entrena todos los modelos y retorna funciones de predicción
 * Llamar una sola vez al iniciar la app
 */
export function entrenarModelos(datos = null) {
  const dataset = datos || generarDatosSinteticos(500)

  const statsR = calcularStats(dataset, FEATURES.riesgo)
  const statsD = calcularStats(dataset, FEATURES.desercion)

  const modeloR = entrenarLogistico(
    dataset, d => (d.probPerdida > 0.5 ? 1 : 0),
    FEATURES.riesgo, statsR
  )
  const modeloD = entrenarLogistico(
    dataset, d => (d.probDesercion > 0.4 ? 1 : 0),
    FEATURES.desercion, statsD
  )

  // ── Funciones de predicción ──
  function predecirRiesgo(perfil) {
    const x = FEATURES.riesgo.map(f => (perfil[f] - statsR[f].mu) / statsR[f].sigma)
    const z = x.reduce((s, xi, i) => s + modeloR.w[i] * xi, modeloR.b)
    return clamp(sigmoid(z), 0.03, 0.97)
  }

  function predecirDesercion(perfil) {
    const x = FEATURES.desercion.map(f => (perfil[f] - statsD[f].mu) / statsD[f].sigma)
    const z = x.reduce((s, xi, i) => s + modeloD.w[i] * xi, modeloD.b)
    return clamp(sigmoid(z), 0.02, 0.95)
  }

  function predecirGraduacion(perfil) {
    const extra =
      perfil.perdidas * 0.6 +
      (perfil.canceladas || 0) * 0.3 +
      (perfil.trabajo > 6 ? 1.2 : perfil.trabajo > 3 ? 0.5 : 0) +
      (perfil.promAcum < 2.8 ? 1.5 : perfil.promAcum < 3.2 ? 0.5 : 0)
    return Math.max(1, Math.round(10 - perfil.semestre + extra))
  }

  function getPesosRiesgo() {
    return FEATURES.riesgo
      .map((f, i) => ({ feature: f, peso: Math.abs(modeloR.w[i]) }))
      .sort((a, b) => b.peso - a.peso)
  }

  return {
    predecirRiesgo,
    predecirDesercion,
    predecirGraduacion,
    getPesosRiesgo,
    meta: {
      nMuestras: dataset.length,
      featuresRiesgo: FEATURES.riesgo,
      featuresDesercion: FEATURES.desercion,
      epochs: 300,
      lr: 0.05,
    }
  }
}
