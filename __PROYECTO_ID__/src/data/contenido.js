// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVO DE CONTENIDO EDUCATIVO — NTE-UAN-APK-001 v1.3
// Universidad Autónoma de Nayarit — Tecnología Educativa
//
// ¡ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR PARA TU NUEVA APK!
//
// Instrucciones:
//   1. Completa META con los datos de tu proyecto.
//   2. Define tus CATEGORIAS (módulos) y sus temas.
//   3. Agrega QUIZZES (mínimo 30 preguntas, recomendado ≥50).
//   4. Si tus temas no usan grafos, omite el campo `grafo` en cada tema.
//
// Referencia completa: Normas_del_proyecto/NTE-UAN-APK-001.md
// ═══════════════════════════════════════════════════════════════════════════════

// ── METADATOS DEL PROYECTO ────────────────────────────────────────────────────
export const META = {
  materia:         "{{MATERIA}}",          // nombre corto de la materia
  nombreCompleto:  "{{APP_NOMBRE}}",       // nombre completo para la pantalla de créditos
  version:         "1.0.0",
  autor:           "{{AUTOR}}",            // nombre del docente responsable
  anio:            "{{ANIO}}",             // año de creación
  descripcion:     "{{APP_DESC}}",         // ≤160 caracteres para SEO
  unidad:          "Unidad Académica de Ciencias Básicas e Ingenierías",
  programa:        "Licenciatura en Matemáticas",
  norma:           "NTE-UAN-APK-001 v1.3",
};

// ── DATOS DE SIMULACIÓN (grafo de ejemplo para el Simulador) ──────────────────
// Modifica este grafo si quieres un ejemplo de simulación específico para tu materia.
// Si no usas simulador, puedes dejarlo tal cual — es solo un grafo de ejemplo.
export const GRAFO_SIM = {
  n: 6,
  vertices: ["0", "1", "2", "3", "4", "5"],
  adj:  [[1, 2], [0, 3, 4], [0, 4], [1, 5], [1, 2, 5], [3, 4]],
  wadj: [
    [[1, 4], [2, 2]],
    [[0, 4], [3, 1], [4, 5]],
    [[0, 2], [4, 3]],
    [[1, 1], [5, 2]],
    [[1, 5], [2, 3], [5, 1]],
    [[3, 2], [4, 1]],
  ],
  aristas: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]],
  pesos:   [4, 2, 1, 5, 3, 1, 1],
};

// ── CRÉDITOS — Equipos del proyecto ──────────────────────────────────────────
// Agrega aquí a los colaboradores del proyecto.
export const CREDITOS = [
  {
    rol:   "Docentes Investigadores",
    icono: "🎓",
    personas: [
      { nombre: "{{AUTOR}}",  detalle: "Investigador responsable" },
      // { nombre: "Nombre Colaborador", detalle: "Investigador colaborador" },
    ],
  },
  // {
  //   rol:   "Apoyo en el desarrollo de la Investigación",
  //   icono: "💻",
  //   personas: [
  //     { nombre: "Nombre Estudiante", detalle: "Estudiante — Licenciatura en Matemáticas" },
  //   ],
  // },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORÍAS (módulos educativos)
//
// Estructura de cada categoría:
//   id:     string snake_case único
//   nombre: texto ≤ 30 caracteres (aparece en el sidebar y el quiz)
//   icon:   emoji representativo
//   color:  color hexadecimal único para esta categoría
//   temas:  array de temas (ver estructura abajo)
//
// Estructura de cada TEMA:
//   id:         string snake_case único
//   titulo:     texto ≤ 40 caracteres
//   definicion: ≥ 50 palabras, redacción académica
//   formula:    cadena LaTeX (opcional — omitir si no aplica)
//   notas:      array de strings, 2–4 observaciones clave
//   grafo:      objeto de visualización SVG (opcional)
//     vertices:    array de etiquetas de vértices ["A", "B", ...]
//     aristas:     array de pares [[i, j], ...] (índices de vertices)
//     posiciones:  array de {x, y} opcionales para posiciones fijas
//     pesos:       array de números (uno por arista, opcional)
//     dirigido:    boolean (optional, default false)
//     resaltados:  array de índices de vértices a destacar (opcional)
//     aristaColor: objeto {"i-j": "#color"} para colorear aristas (opcional)
//     vertexColor: objeto {i: "#color"} para colorear vértices (opcional)
//     hyperEdges:  array de arrays [[i,j,k], ...] para hiperaristas (opcional)
//     grados:      array de números (grado de cada vértice, mostrado sobre él)
// ═══════════════════════════════════════════════════════════════════════════════

export const CATEGORIAS = [

  // ── Módulo 1 ────────────────────────────────────────────────────────────────
  {
    id:     "modulo_1",
    nombre: "Nombre del Módulo 1",     // ← EDITAR ≤30 caracteres
    icon:   "📌",
    color:  "#58a6ff",
    temas: [
      {
        id:         "tema_1_1",
        titulo:     "Título del Primer Tema",           // ← EDITAR ≤40 caracteres
        definicion: "Escribe aquí la definición académica del concepto. Debe tener al menos cincuenta palabras y estar redactada en términos formales adecuados para el nivel universitario. Incluye notación matemática cuando sea pertinente.",
        formula:    "f(x) = x^2",                      // ← LaTeX. Elimina esta línea si no aplica
        notas: [
          "Primera observación clave del tema.",
          "Segunda observación clave del tema.",
        ],
        grafo: {                                        // ← Elimina este bloque si el tema no tiene grafo
          vertices: ["A", "B", "C", "D"],
          aristas:  [[0, 1], [1, 2], [2, 3], [3, 0]],
        },
      },
      {
        id:         "tema_1_2",
        titulo:     "Título del Segundo Tema",
        definicion: "Definición académica del segundo concepto. Recuerda que el mínimo requerido es cincuenta palabras para mantener la profundidad conceptual esperada en una aplicación educativa de nivel universitario de la UAN.",
        formula:    "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
        notas: [
          "Primera observación clave.",
          "Segunda observación clave.",
        ],
        // Sin grafo — este tema solo tiene texto y fórmula
      },
    ],
  },

  // ── Módulo 2 ────────────────────────────────────────────────────────────────
  {
    id:     "modulo_2",
    nombre: "Nombre del Módulo 2",     // ← EDITAR
    icon:   "🔗",
    color:  "#39d353",
    temas: [
      {
        id:         "tema_2_1",
        titulo:     "Título del Tema 2.1",
        definicion: "Escribe aquí la definición del tercer concepto educativo. Procura una redacción clara y precisa que sea comprensible para estudiantes de licenciatura, con al menos cincuenta palabras de contenido académico real.",
        formula:    "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
        notas: [
          "Primera nota relevante.",
          "Segunda nota relevante.",
          "Tercera nota opcional.",
        ],
        grafo: {
          vertices:  ["u", "a", "b", "c", "v"],
          aristas:   [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
          dirigido:  true,
          resaltados: [0, 4],
        },
      },
    ],
  },

  // ── Módulo 3 (duplica esta sección para más módulos) ────────────────────────
  // {
  //   id:     "modulo_3",
  //   nombre: "Nombre del Módulo 3",
  //   icon:   "⬡",
  //   color:  "#bc8cff",
  //   temas: [ ... ],
  // },

];

// ═══════════════════════════════════════════════════════════════════════════════
// BANCO DE PREGUNTAS DE EVALUACIÓN
//
// Estructura de cada pregunta:
//   id:          entero único secuencial (1, 2, 3, ...)
//   pregunta:    texto de la pregunta
//   opciones:    array de 4 opciones ["A", "B", "C", "D"]
//   correcta:    índice 0–3 de la opción correcta
//   explicacion: ≥20 palabras explicando por qué es correcta
//   nivel:       debe coincidir EXACTAMENTE con cat.nombre de la categoría
//   dificultad:  "facil" | "medio" | "dificil"
//
// Mínimo: 30 preguntas. Recomendado: ≥50 (NTE-UAN-APK-001 §6.3)
// ═══════════════════════════════════════════════════════════════════════════════

export const QUIZZES = [

  // ── Módulo 1: Nombre del Módulo 1 ────────────────────────────────────────────
  {
    id:          1,
    pregunta:    "¿Cuál de las siguientes afirmaciones describe mejor el concepto del Primer Tema?",
    opciones:    ["Opción A incorrecta", "Opción correcta aquí", "Opción C incorrecta", "Opción D incorrecta"],
    correcta:    1,
    explicacion: "La opción B es correcta porque corresponde a la definición formal del concepto. Las demás opciones describen propiedades distintas que no corresponden al tema en cuestión.",
    nivel:       "Nombre del Módulo 1",   // ← debe coincidir con cat.nombre
    dificultad:  "facil",
  },
  {
    id:          2,
    pregunta:    "Segunda pregunta de ejemplo para el Módulo 1.",
    opciones:    ["Respuesta 1", "Respuesta 2", "Respuesta correcta", "Respuesta 4"],
    correcta:    2,
    explicacion: "La explicación de por qué la tercera opción es la correcta, con suficiente detalle académico para que el estudiante comprenda el concepto subyacente.",
    nivel:       "Nombre del Módulo 1",
    dificultad:  "medio",
  },

  // ── Módulo 2: Nombre del Módulo 2 ────────────────────────────────────────────
  {
    id:          3,
    pregunta:    "Pregunta de ejemplo para el Módulo 2.",
    opciones:    ["Opción A", "Opción B", "Opción C", "Opción D correcta"],
    correcta:    3,
    explicacion: "La cuarta opción es la correcta. Aquí debe incluirse una explicación académica clara de por qué esta respuesta es la adecuada y por qué las demás no lo son.",
    nivel:       "Nombre del Módulo 2",
    dificultad:  "dificil",
  },

  // ── Agrega más preguntas aquí ─────────────────────────────────────────────────
  // Recuerda: mínimo 30 preguntas para cumplir NTE-UAN-APK-001

];
