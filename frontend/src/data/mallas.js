/**
 * mallas.js
 * Datos curriculares de los 6 programas piloto — Facultad de Ingeniería UdeA
 *
 * Para agregar un nuevo programa:
 * 1. Crear una nueva entrada en el objeto PROGRAMAS con el id del programa
 * 2. Llenar los campos: nombre, modalidad, creditos, materias[]
 * 3. Cada materia necesita: c (código), n (nombre), cr (créditos),
 *    s (semestre), pre (prerrequisitos[]), co (correquisitos[])
 * 4. Agregar bandera ing:true si es curso de inglés (equivale a 4h/semana por 1 crédito)
 */

export const PROGRAMAS = {
  'ind-pre': {
    nombre: 'Ingeniería Industrial',
    modalidad: 'Presencial',
    creditos: 160,
    escuela: 'Escuela de Ingeniería Industrial',
    materias: [
      // Semestre I
      { c: '2555101', n: 'Álgebra y trigonometría', cr: 3, s: 1, pre: [], co: [] },
      { c: '2555131', n: 'Cálculo diferencial', cr: 3, s: 1, pre: [], co: [] },
      { c: '2555121', n: 'Geometría vectorial y analítica', cr: 3, s: 1, pre: [], co: [] },
      { c: '2536101', n: 'Descubriendo la física', cr: 3, s: 1, pre: [], co: [] },
      { c: '2502911', n: 'Introducción a la ing. industrial', cr: 2, s: 1, pre: [], co: [] },
      { c: '2539101', n: 'Lectoescritura', cr: 3, s: 1, pre: [], co: [] },
      { c: '2538101', n: 'Inglés I', cr: 1, s: 1, pre: [], co: [], ing: true },
      { c: '2537101', n: 'Vivamos la universidad', cr: 1, s: 1, pre: [], co: [] },
      // Semestre II
      { c: '2555231', n: 'Cálculo integral', cr: 3, s: 2, pre: ['2555131'], co: [] },
      { c: '2555221', n: 'Álgebra lineal', cr: 3, s: 2, pre: ['2555121'], co: [] },
      { c: '2502921', n: 'Gestión de las organizaciones', cr: 3, s: 2, pre: [], co: [] },
      { c: '2502922', n: 'Habilidades gerenciales', cr: 3, s: 2, pre: [], co: [] },
      { c: '2538201', n: 'Inglés II', cr: 1, s: 2, pre: ['2538101'], co: [], ing: true },
      // Semestre III
      { c: '2536201', n: 'Física mecánica', cr: 3, s: 3, pre: ['2536101', '2555131'], co: [] },
      { c: '2502931', n: 'Gestión contable', cr: 3, s: 3, pre: ['2502921'], co: [] },
      { c: '2502932', n: 'Teoría general de sistemas', cr: 3, s: 3, pre: [], co: [] },
      { c: '2502934', n: 'Probabilidad e inferencia estadística', cr: 3, s: 3, pre: ['2555231'], co: [] },
      { c: '2502935', n: 'Algoritmia y programación', cr: 3, s: 3, pre: [], co: [] },
      { c: '2502933', n: 'Gestión de métodos y tiempos', cr: 4, s: 3, pre: ['2502921'], co: [] },
      { c: '2538301', n: 'Inglés III', cr: 1, s: 3, pre: ['2538201'], co: [], ing: true },
      // Semestre IV
      { c: '2502941', n: 'Ingeniería económica', cr: 3, s: 4, pre: ['2502931'], co: [] },
      { c: '2502942', n: 'Dinámica de sistemas', cr: 3, s: 4, pre: ['2502932'], co: ['2502934'] },
      { c: '2502943', n: 'Gestión por procesos', cr: 3, s: 4, pre: ['2502933'], co: [] },
      { c: '2502944', n: 'Diseño de experimentos y análisis de regresión', cr: 3, s: 4, pre: ['2502934'], co: [] },
      { c: '2502945', n: 'Optimización', cr: 3, s: 4, pre: ['2555221'], co: [] },
      { c: '2538401', n: 'Inglés IV', cr: 1, s: 4, pre: ['2538301'], co: [], ing: true },
      // Semestre V
      { c: '2502951', n: 'Gestión financiera', cr: 3, s: 5, pre: ['2502941'], co: [] },
      { c: '2502952', n: 'Gestión tecnológica', cr: 3, s: 5, pre: ['2502942'], co: [] },
      { c: '2502953', n: 'Normalización y control de calidad', cr: 3, s: 5, pre: ['2502943'], co: [] },
      { c: '2502954', n: 'Muestreo y series de tiempo', cr: 3, s: 5, pre: ['2502944'], co: [] },
      { c: '2502955', n: 'Procesos estocásticos y análisis de decisión', cr: 3, s: 5, pre: ['2502945'], co: [] },
      { c: '2538501', n: 'Inglés V', cr: 1, s: 5, pre: ['2538401'], co: [], ing: true },
      // Semestre VI
      { c: '2517351', n: 'Formación ciudadana y constitucional', cr: 0, s: 6, pre: [], co: [] },
      { c: '2502961', n: 'Diseño de sistemas productivos', cr: 3, s: 6, pre: ['2502953'], co: [] },
      { c: '2502962', n: 'Simulación discreta', cr: 3, s: 6, pre: ['2502955'], co: [] },
      { c: '2502963', n: 'Formulación de proyectos de investigación', cr: 3, s: 6, pre: ['2502944'], co: [] },
      { c: '2502964', n: 'Emprendimiento', cr: 2, s: 6, pre: ['2502952'], co: [] },
      { c: '2538601', n: 'Inglés VI', cr: 1, s: 6, pre: ['2538501'], co: [], ing: true },
      // Semestre VII
      { c: '2502971', n: 'Legislación', cr: 3, s: 7, pre: ['2517351'], co: [] },
      { c: '2502972', n: 'Administración de la producción y del servicio', cr: 3, s: 7, pre: ['2502961'], co: [] },
      // Semestre VIII
      { c: '2502981', n: 'Formulación y evaluación de proyectos de inversión', cr: 3, s: 8, pre: ['2502951'], co: [] },
      { c: '2502982', n: 'Gestión de la cadena de abastecimiento', cr: 3, s: 8, pre: ['2502972'], co: [] },
      // Semestre IX
      { c: '2502991', n: 'Gestión de proyectos', cr: 3, s: 9, pre: ['2502981'], co: [] },
      { c: '2502992', n: 'Ingeniería del mejoramiento continuo', cr: 3, s: 9, pre: [], co: [] },
      // Semestre X
      { c: '9013p', n: 'Práctica profesional', cr: 12, s: 10, pre: [], co: [] },
    ]
  },

  'ind-vir': {
    nombre: 'Ingeniería Industrial',
    modalidad: 'Virtual',
    creditos: 160,
    escuela: 'Escuela de Ingeniería Industrial',
    materias: [
      { c: '2559101', n: 'Álgebra y trigonometría', cr: 3, s: 1, pre: [], co: [] },
      { c: '2559131', n: 'Cálculo diferencial', cr: 3, s: 1, pre: [], co: [] },
      { c: '2559121', n: 'Geometría vectorial y analítica', cr: 3, s: 1, pre: [], co: [] },
      { c: '2567101', n: 'Descubriendo la física', cr: 3, s: 1, pre: [], co: [] },
      { c: '2553912', n: 'Introducción a la ing. industrial', cr: 1, s: 1, pre: [], co: [] },
      { c: '2564101', n: 'Lectoescritura', cr: 3, s: 1, pre: [], co: [] },
      { c: '2540101', n: 'Inglés I', cr: 1, s: 1, pre: [], co: [], ing: true },
      { c: '2565101', n: 'Vivamos la universidad', cr: 1, s: 1, pre: [], co: [] },
      { c: '2559231', n: 'Cálculo integral', cr: 3, s: 2, pre: ['2559131'], co: [] },
      { c: '2559221', n: 'Álgebra lineal', cr: 3, s: 2, pre: ['2559121'], co: [] },
      { c: '2553921', n: 'Gestión de las organizaciones', cr: 3, s: 2, pre: [], co: [] },
      { c: '2553922', n: 'Habilidades gerenciales', cr: 3, s: 2, pre: [], co: [] },
      { c: '2540201', n: 'Inglés II', cr: 1, s: 2, pre: ['2540101'], co: [], ing: true },
      { c: '2553931', n: 'Gestión contable', cr: 3, s: 3, pre: ['2553921'], co: [] },
      { c: '2553932', n: 'Teoría general de sistemas', cr: 3, s: 3, pre: [], co: [] },
      { c: '2553934', n: 'Probabilidad e inferencia estadística', cr: 3, s: 3, pre: ['2559231'], co: [] },
      { c: '2553935', n: 'Algoritmia y programación', cr: 3, s: 3, pre: [], co: [] },
      { c: '2567201', n: 'Física mecánica', cr: 3, s: 3, pre: ['2567101', '2559131'], co: [] },
      { c: '2553933', n: 'Gestión de métodos y tiempos', cr: 4, s: 3, pre: ['2553921'], co: [] },
      { c: '2540301', n: 'Inglés III', cr: 1, s: 3, pre: ['2540201'], co: [], ing: true },
      { c: '2553941', n: 'Ingeniería económica', cr: 3, s: 4, pre: ['2553931'], co: [] },
      { c: '2553942', n: 'Dinámica de sistemas', cr: 3, s: 4, pre: ['2553932'], co: ['2553934'] },
      { c: '2553943', n: 'Gestión por procesos', cr: 3, s: 4, pre: ['2553933'], co: [] },
      { c: '2553944', n: 'Diseño de experimentos y análisis de regresión', cr: 3, s: 4, pre: ['2553934'], co: [] },
      { c: '2553945', n: 'Optimización', cr: 3, s: 4, pre: ['2559221'], co: [] },
      { c: '2540401', n: 'Inglés IV', cr: 1, s: 4, pre: ['2540301'], co: [], ing: true },
      { c: '2553951', n: 'Gestión financiera', cr: 3, s: 5, pre: ['2553941'], co: [] },
      { c: '2553952', n: 'Gestión tecnológica', cr: 3, s: 5, pre: ['2553942'], co: [] },
      { c: '2553953', n: 'Normalización y control de calidad', cr: 3, s: 5, pre: ['2553943'], co: [] },
      { c: '2553954', n: 'Muestreo y series de tiempo', cr: 3, s: 5, pre: ['2553944'], co: [] },
      { c: '2553955', n: 'Procesos estocásticos y análisis de decisión', cr: 3, s: 5, pre: ['2553945'], co: [] },
      { c: '2540501', n: 'Inglés V', cr: 1, s: 5, pre: ['2540401'], co: [], ing: true },
      { c: '2553961', n: 'Diseño de sistemas productivos', cr: 3, s: 6, pre: ['2553953'], co: [] },
      { c: '2553962', n: 'Simulación discreta', cr: 3, s: 6, pre: ['2553955'], co: [] },
      { c: '2553963', n: 'Formulación de proyectos de investigación', cr: 3, s: 6, pre: ['2553944'], co: [] },
      { c: '2553964', n: 'Emprendimiento', cr: 2, s: 6, pre: ['2553952'], co: [] },
      { c: '2540601', n: 'Inglés VI', cr: 1, s: 6, pre: ['2540501'], co: [], ing: true },
      { c: '2553971', n: 'Legislación', cr: 3, s: 7, pre: [], co: [] },
      { c: '2553972', n: 'Administración de la producción y del servicio', cr: 3, s: 7, pre: ['2553961'], co: [] },
      { c: '2553981', n: 'Formulación y evaluación de proyectos de inversión', cr: 3, s: 8, pre: ['2553951'], co: [] },
      { c: '2553982', n: 'Gestión de la cadena de abastecimiento', cr: 3, s: 8, pre: ['2553972'], co: [] },
      { c: '2553991', n: 'Gestión de proyectos', cr: 3, s: 9, pre: ['2553981'], co: [] },
      { c: '2553992', n: 'Ingeniería del mejoramiento continuo', cr: 3, s: 9, pre: [], co: [] },
      { c: '9013v', n: 'Práctica profesional', cr: 12, s: 10, pre: [], co: [] },
    ]
  },

  // ── Para agregar los demás programas, seguir el mismo patrón ──
  // 'civ-pre': { ... },
  // 'san-pre': { ... },
  // 'amb-vir': { ... },
  // 'tel-pre': { ... },
}

/**
 * Calcula las horas de clase semanales según créditos
 * Regla UdeA: 3cr=4h, 4cr=7h, inglés=4h/cr, resto=2h/cr
 */
export function horasClase(materia) {
  if (materia.ing) return 4
  if (materia.cr >= 4) return 7
  if (materia.cr === 3) return 4
  if (materia.cr === 2) return 2
  return 2
}

/**
 * Calcula horas de estudio independiente semanales
 * Regla UdeA: 2h/materia + 20min lectura × 6 días
 */
export function horasEstudio() {
  return 2 + (20 / 60) * 6
}
