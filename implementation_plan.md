# Arquetipo de Proyecto APK — UAN (NTE-UAN-APK-001)

## Objetivo

Crear una **plantilla institucional reutilizable** en `J:\Desarrollo_de_APK\_Plantilla_APK\` que encapsule toda la infraestructura técnica ya validada en el proyecto Teoría de Grafos, de modo que iniciar un nuevo proyecto APK educativo requiera únicamente:

1. Ejecutar un script de inicialización (`nuevo_proyecto.ps1`)
2. Completar el archivo de contenido educativo (`src/data/contenido.js`)
3. Agregar los assets específicos (ícono, escudo)

---

## Estructura propuesta

```
J:\Desarrollo_de_APK\
├── _Plantilla_APK\                   ← NUEVO — Arquetipo base
│   ├── __PROYECTO_ID__\              ← Carpeta raíz (renombrada por script)
│   │   ├── src\
│   │   │   ├── components\
│   │   │   │   └── Formula.jsx       ← KaTeX block + inline (listo)
│   │   │   ├── hooks\
│   │   │   │   └── useProgreso.js    ← localStorage (token APP_ID)
│   │   │   ├── data\
│   │   │   │   └── contenido.js      ← ÚNICO ARCHIVO A COMPLETAR por proyecto
│   │   │   ├── App.jsx               ← Shell completo (sidebar, quiz, tema, créditos)
│   │   │   ├── ThemeCtx.js           ← Paleta DARK/LIGHT + createContext
│   │   │   ├── main.jsx              ← Imports obligatorios (KaTeX CSS)
│   │   │   └── index.css             ← Fuente IBM Plex + reset + tokens CSS
│   │   ├── public\
│   │   │   └── favicon.svg           ← Ícono placeholder UAN
│   │   ├── index.html                ← Con tokens {{APP_NOMBRE}}, {{APP_DESC}}
│   │   ├── vite.config.js            ← base: './' fijo (no tocar)
│   │   ├── capacitor.config.json     ← Con tokens {{APP_ID}}, {{APP_NOMBRE}}
│   │   ├── package.json              ← Con token {{PACKAGE_NAME}}
│   │   ├── eslint.config.js          ← Igual al proyecto de referencia
│   │   ├── .gitignore                ← node_modules, dist, android, *.jks
│   │   └── README.md                 ← Guía de inicio rápido
│   └── nuevo_proyecto.ps1            ← Script interactivo de inicialización
│
├── Codigo_y_artefactos\
│   ├── compilar_apk_debug.ps1        ← Versión parametrizada (acepta $ProjectPath)
│   └── compilar_apk_release.ps1      ← Versión parametrizada (acepta $ProjectPath)
│
└── Teoria_de_Grafos\                 ← Proyecto de referencia (sin cambios)
```

---

## Tokens de personalización

Los archivos de la plantilla contienen marcadores `{{TOKEN}}` que el script `nuevo_proyecto.ps1` sustituye automáticamente:

| Token           | Descripción                          | Ejemplo              |
|-----------------|--------------------------------------|----------------------|
| `{{APP_ID}}`    | ID de Capacitor (dominio inverso)    | `mx.uan.calculo`     |
| `{{APP_NOMBRE}}`| Nombre visible en el dispositivo     | `Cálculo UAN`        |
| `{{APP_DESC}}`  | Meta description SEO (≤160 chars)    | `App educativa de...`|
| `{{PACKAGE_NAME}}`| nombre en package.json            | `uan-calculo`        |
| `{{MATERIA}}`   | Nombre de la materia (snake_case)    | `calculo`            |
| `{{AUTOR}}`     | Nombre del autor/docente             | `Dr. Juan Pérez`     |
| `{{ANIO}}`      | Año de creación                      | `2026`               |

---

## Componentes a crear

### 1. `nuevo_proyecto.ps1` — Script de inicialización

Script PowerShell interactivo que:
- Solicita los 7 tokens al usuario con prompts claros
- Valida el formato del `appId` (debe cumplir `mx.uan.<materia>`)
- Copia `_Plantilla_APK\__PROYECTO_ID__\` → `J:\Desarrollo_de_APK\<Materia>\`
- Ejecuta `npm install` en el nuevo directorio
- Inicializa `capacitor add android` si no existe la carpeta `android/`
- Muestra un resumen final con los pasos siguientes

### 2. `src/data/contenido.js` — Archivo de datos (a completar por proyecto)

Estructura vacía con comentarios guía que define:
- `CATEGORIAS` — array de módulos educativos
- `QUIZZES` — banco de preguntas
- `META` — metadatos del proyecto (autor, versión, materia)

```js
// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO PRINCIPAL DE CONTENIDO — Editar este archivo para personalizar la app
// Norma: NTE-UAN-APK-001 v1.2
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  materia:  "{{MATERIA}}",   // ← Nombre corto de la materia
  version:  "1.0.0",
  autor:    "{{AUTOR}}",
  anio:     "{{ANIO}}",
};

export const CATEGORIAS = [
  // ── Módulo 1: Ejemplo ─────────────────────────────────────────────────────
  {
    id:     "modulo_1",
    nombre: "Nombre del Módulo",   // ≤ 30 caracteres
    icon:   "📚",
    color:  "#58a6ff",
    temas: [
      {
        id:         "tema_1_1",
        titulo:     "Título del tema",         // ≤ 40 caracteres
        definicion: "Redacción académica...",  // ≥ 50 palabras
        formula:    "f(x) = x^2",             // LaTeX (opcional)
        notas:      ["Nota clave 1.", "Nota clave 2."],
      },
    ],
  },
];

export const QUIZZES = [
  // ── Módulo 1 ──────────────────────────────────────────────────────────────
  {
    id:          1,
    pregunta:    "¿...?",
    opciones:    ["A", "B", "C", "D"],
    correcta:    0,
    explicacion: "...",
    nivel:       "Nombre del Módulo",
    dificultad:  "facil",
  },
];
```

### 3. `App.jsx` — Shell paramétrico completo

Versión del `App.jsx` de Grafos **separada del contenido**:
- Importa `CATEGORIAS`, `QUIZZES`, `META` desde `./data/contenido.js`
- Mantiene toda la lógica de navegación (sidebar drawer), quiz, tema, créditos
- El contenido educativo NO está hardcodeado — viene de `contenido.js`
- Requiere **cero modificaciones** para una app nueva

### 4. Scripts de compilación parametrizados

`compilar_apk_debug.ps1` y `compilar_apk_release.ps1` actualizados para:
- Aceptar un parámetro `-ProjectPath` opcional
- Por defecto, preguntar el path si no se pasa como argumento
- Así un solo script sirve para todos los proyectos

---

## Flujo de trabajo con la plantilla

```
nuevo_proyecto.ps1
       │
       ▼
Ingresa: materia, appId, autor, descripción
       │
       ▼
Copia _Plantilla_APK → J:\Desarrollo_de_APK\<Materia>\
Sustituye {{TOKENS}} en todos los archivos de texto
Ejecuta: npm install
Ejecuta: npx cap add android
       │
       ▼
Desarrollador edita SOLO:
  └── src/data/contenido.js  (CATEGORIAS + QUIZZES)
  └── public/favicon.svg     (ícono de la materia)
       │
       ▼
compilar_apk_debug.ps1 -ProjectPath "J:\Desarrollo_de_APK\<Materia>"
       │
       ▼
APK listo en android\app\build\outputs\apk\debug\
```

---

## Archivos a crear/modificar

### Nuevos (en `_Plantilla_APK\`)

#### [NEW] `_Plantilla_APK\nuevo_proyecto.ps1`
Script PowerShell interactivo de inicialización.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\data\contenido.js`
Archivo de datos vacío con estructura guiada.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\App.jsx`
Shell paramétrico que importa de `contenido.js` (extraído de Grafos).

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\ThemeCtx.js`
Copiado de Grafos (sin cambios, ya genérico).

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\main.jsx`
Con imports obligatorios (KaTeX CSS).

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\index.css`
Copiado y limpiado de Grafos.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\components\Formula.jsx`
Copiado de Grafos (ya genérico).

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\src\hooks\useProgreso.js`
Con token `{{APP_ID}}` en la clave de localStorage.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\index.html`
Con tokens `{{APP_NOMBRE}}` y `{{APP_DESC}}`.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\capacitor.config.json`
Con tokens `{{APP_ID}}` y `{{APP_NOMBRE}}`.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\package.json`
Con token `{{PACKAGE_NAME}}`.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\vite.config.js`
Fijo — `base: './'` (igual que Grafos).

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\eslint.config.js`
Copiado de Grafos.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\.gitignore`
Igual que Grafos + `*.jks`.

#### [NEW] `_Plantilla_APK\__PROYECTO_ID__\README.md`
Guía de inicio rápido del proyecto.

### Modificados (en `Codigo_y_artefactos\`)

#### [MODIFY] `compilar_apk_debug.ps1`
Agregar parámetro `-ProjectPath` opcional.

#### [MODIFY] `compilar_apk_release.ps1`
Agregar parámetro `-ProjectPath` opcional.

---

## Preguntas abiertas para el usuario

> [!IMPORTANT]
> **¿El `App.jsx` de la plantilla debe incluir la visualización de grafos SVG?**
> La plantilla puede ser de dos tipos:
> - **Opción A — Genérica**: Sin GrafoSVG. Solo sidebar + VistaTema (texto + fórmula) + Quiz + Créditos. Apta para cualquier materia.
> - **Opción B — Con grafos**: Incluye el componente `GrafoSVG` completo (útil si futuras APKs también usan grafos). Agrega ~200 líneas de código en la plantilla.
>
> **¿Cuál prefieres?**

> [!IMPORTANT]
> **¿Deseas que el script `nuevo_proyecto.ps1` ejecute automáticamente `npx cap add android`?**
> Esto instala las dependencias de Capacitor y genera la carpeta `android/` en el nuevo proyecto (~3 minutos). Si lo omites, el desarrollador lo ejecuta manualmente antes del primer build.

> [!NOTE]
> **Actualización de NTE-UAN-APK-001**
> Al crear la plantilla se actualizará el estándar a la versión **1.3** para registrar la existencia del arquetipo y el flujo de `nuevo_proyecto.ps1`. ¿Estás de acuerdo?

---

## Plan de verificación

1. Ejecutar `nuevo_proyecto.ps1` → crear proyecto `uan-prueba` con datos ficticios
2. Editar `contenido.js` con 1 categoría de ejemplo, 2 temas y 5 preguntas
3. Ejecutar `compilar_apk_debug.ps1 -ProjectPath "J:\Desarrollo_de_APK\Prueba"`
4. Verificar que el APK se genera sin errores
5. Instalar en emulador o dispositivo físico y validar navegación básica
