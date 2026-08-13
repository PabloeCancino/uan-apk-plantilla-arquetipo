# NTE-UAN-APK-001 v1.4

## Norma Técnica para el Desarrollo de APKs Educativas

### Universidad Autónoma de Nayarit — Tecnología Educativa

| Campo                                   | Valor                                                          |
| --------------------------------------- | -------------------------------------------------------------- |
| **Código**                       | NTE-UAN-APK-001                                                |
| **Versión**                      | 1.4                                                            |
| **Fecha de emisión**             | 2026-04-22                                                     |
| **Última actualización**        | 2026-08-10                                                     |
| **Primer proyecto de referencia** | Teoría de Grafos (`E:\Desarrollo_de_APK\Teoria_de_Grafos\`) |
| **Investigador Responsable**    | **Dr. Pablo Eduardo Cancino Marentes**                         |

### Historial de versiones

| Versión | Fecha      | Cambios principales                                                                                                                                                                                                             |
| -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0      | 2026-04-22 | Versión inicial                                                                                                                                                                                                                |
| 1.1      | 2026-04-22 | Integración KaTeX, hook useProgreso, corrección hiperaristas                                                                                                                                                                  |
| 1.2      | 2026-04-23 | Actualización de versiones reales; pipeline CLI sin GUI; banco de preguntas ≥50                                                                                                                                               |
| 1.3      | 2026-04-24 | **Arquetipo institucional**: `_Plantilla_APK/` + `nuevo_proyecto.ps1`; scripts de compilación parametrizados (`-ProjectPath`); `contenido.js` como única fuente de datos; `App.jsx` desacoplado del contenido |
| 1.4      | 2026-08-10 | **Distribución en Vivo y Suite de 30 Instrumentos**: Registro de 11 repositorios en GitHub; CI/CD automático con GitHub Actions (`deploy.yml`); distribución web en live GitHub Pages y binarios en GitHub Releases; atribución al Dr. Pablo Eduardo Cancino Marentes |

---

## 1. Objeto y Alcance

Esta norma establece los estándares mínimos obligatorios para diseño, desarrollo, prueba y distribución de aplicaciones Android educativas de la UAN, usando el stack **Vite + React + Capacitor**.

---

## 2. Stack Tecnológico Oficial

### 2.1 Pila obligatoria

| Capa               | Herramienta                | Versión mínima | Versión verificada  |
| ------------------ | -------------------------- | ---------------- | -------------------- |
| Empaquetado web    | **Vite**             | 6.x              | **8.0.9** ✅   |
| UI Framework       | **React**            | 18.x             | **19.2.5** ✅  |
| Empaquetado nativo | **Capacitor**        | 6.x              | **8.3.1** ✅   |
| Matemáticas       | **KaTeX**            | 0.16.x           | **0.16.45** ✅ |
| Lenguaje           | **JavaScript (JSX)** | ES2022+          | —                   |
| Node.js            | —                         | v18 LTS+         | —                   |
| JDK                | —                         | 17 LTS+          | **JDK 21** ✅  |
| Android SDK target | API 34                     | API 26 mín      | **API 36** ✅  |

> **Nota v1.2:** La columna "Versión verificada" refleja el entorno real del proyecto de referencia `mx.uan.grafos`. Versiones superiores son compatibles; no se deben usar versiones inferiores a las mínimas.

### 2.2 Tecnologías NO permitidas

| Tecnología         | Motivo                                      |
| ------------------- | ------------------------------------------- |
| React Native / Expo | Rompe `<div>`, `<svg>`, HTML estándar  |
| MathJax             | ~300 KB — inaceptable en WebView           |
| jQuery              | Obsoleto; conflicto con React               |
| Web Workers         | Incompatibilidad en algunos WebView Android |

---

## 3. Estructura de Directorios

```
<Proyecto>/
├── src/
│   ├── components/
│   │   └── Formula.jsx      ← wrapper KaTeX (OBLIGATORIO si hay fórmulas)
│   ├── hooks/
│   │   └── useProgreso.js   ← persistencia localStorage (OBLIGATORIO)
│   ├── data/
│   │   └── contenido.js     ← Único archivo a editar por proyecto (v1.3)
│   ├── App.jsx              ← shell genérico (importa de data/contenido.js)
│   ├── ThemeCtx.js
│   ├── main.jsx
│   └── index.css
├── android/                 ← generado por Capacitor (no editar manualmente)
│   └── local.properties     ← ruta local del SDK (no versionar)
├── dist/                    ← bundle generado por Vite (no versionar)
├── index.html               ← con metadatos SEO y viewport
├── vite.config.js           ← DEBE incluir base: './'
├── capacitor.config.json
└── package.json
```

> **Nota v1.3 — Arquetipo:** La estructura anterior se genera automáticamente con `_Plantilla_APK/nuevo_proyecto.ps1`. El único archivo que el desarrollador debe completar es `src/data/contenido.js`.

**Convenciones de nombres:**

- Componentes: `PascalCase.jsx`
- Hooks: `camelCase.js` con prefijo `use`
- Datos: `camelCase.js`

---

## 4. Configuración Obligatoria

### 4.1 `vite.config.js`

```js
export default defineConfig({
  plugins: [react()],
  base: './',   // OBLIGATORIO — rutas relativas para WebView de Capacitor
})
```

> [!CAUTION]
> Omitir `base: './'` causa pantalla en blanco en el APK. Es el error más frecuente al migrar de desarrollo web a APK.

### 4.2 `capacitor.config.json`

```json
{
  "appId": "mx.uan.<nombreapp>",
  "appName": "<Nombre Visible>",
  "webDir": "dist",
  "server": { "androidScheme": "https" },
  "android": {
    "allowMixedContent": true,
    "minSdkVersion": 26,
    "targetSdkVersion": 34
  }
}
```

Esquema de `appId`: `mx.uan.<materia>` en minúsculas (ej. `mx.uan.grafos`).

### 4.3 `src/main.jsx` — Imports obligatorios

```jsx
import 'katex/dist/katex.min.css'   // si el proyecto usa fórmulas
import './index.css'
import App from './App.jsx'
```

### 4.4 `index.html` — SEO mínimo

```html
<html lang="es">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <meta name="description" content="[descripción ≤160 chars]" />
  <meta name="theme-color" content="#010409" />
  <title>[Materia] — UAN</title>
</head>
```

### 4.5 `android/local.properties` — Configuración local del SDK

```properties
# Este archivo NO debe versionarse (agregar a .gitignore)
# Cada desarrollador debe apuntar a su instalación local:
sdk.dir=C\:\\Users\\<usuario>\\AppData\\Local\\Android\\Sdk
```

> **Nota v1.2 — Lección aprendida:** Si el proyecto proviene de otra máquina, `local.properties` contendrá la ruta del desarrollador original. **Siempre verificar y corregir esta ruta** antes del primer build.

---

## 5. Sistema de Diseño

### 5.1 Paleta de colores (tema oscuro — por defecto)

```js
const DARK = {
  bg:         "#010409",   // fondo principal
  surface:    "#0d1117",   // tarjetas y paneles
  surface2:   "#161b22",   // paneles secundarios
  border:     "#21262d",   // bordes
  text:       "#e6edf3",   // texto principal
  muted:      "#8b949e",   // texto secundario
  accent:     "#58a6ff",   // azul UAN
  accentSoft: "#58a6ff18",
  green:      "#3fb950",   // correcto / éxito
  greenSoft:  "#238636",
  orange:     "#f0883e",   // advertencia
  red:        "#f85149",   // error
  purple:     "#bc8cff",   // tipos especiales
  yellow:     "#e3b341",   // destacado
  teal:       "#39d353",   // conectividad
};
```

### 5.2 Paleta de colores (tema claro — opcional)

```js
const LIGHT = {
  bg: "#ffffff", surface: "#f6f8fa", surface2: "#eaeef2",
  border: "#d0d7de", accent: "#0969da", accentSoft: "#0969da15",
  green: "#1a7f37", greenSoft: "#dafbe1", orange: "#bc4c00",
  red: "#cf222e", text: "#1f2328", muted: "#656d76",
  purple: "#8250df", yellow: "#9a6700", teal: "#0f6e31",
};
```

> **Nota v1.2:** La implementación de referencia usa un `ThemeProvider` con `createContext` para propagar el tema activo. El usuario puede alternar entre oscuro y claro; la preferencia se guarda en `localStorage` bajo la clave `uan_tema`.

### 5.3 Tipografía

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
body { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
```

> **Advertencia:** Google Fonts requiere internet. Incluir la fuente como asset local si la app debe funcionar 100% offline.

### 5.4 Escala tipográfica

| Elemento              | Tamaño  | Peso     |
| --------------------- | -------- | -------- |
| Título H1            | 22–28px | 700–800 |
| Título H2 / sección | 16–18px | 600      |
| Cuerpo                | 13–14px | 400      |
| Secundario / notas    | 11–12px | 400      |
| Chips / etiquetas     | 10–11px | 500      |

---

## 6. Estándares de Contenido Educativo

### 6.1 Estructura de módulo (categoría)

```js
{
  id: "string_sin_espacios",     // snake_case único
  nombre: "Nombre del Módulo",   // ≤ 30 caracteres
  icon: "🔤",                    // emoji representativo
  color: "#hexcolor",            // color temático único
  temas: [ /* ver 6.2 */ ]
}
```

### 6.2 Estructura de tema (implementación de referencia)

```js
{
  id: "snake_case_unico",
  titulo: "Nombre del Tema",     // ≤ 40 caracteres
  definicion: "...",             // ≥ 50 palabras, redacción académica
  formula: "latex_string",       // LaTeX válido (escapar \\ en JS)
  notas: [                       // 2–4 observaciones clave
    "Nota 1.",
    "Nota 2.",
  ],
  grafo: {                       // objeto de visualización SVG
    vertices: ["A", "B", "C"],
    aristas: [[0,1], [1,2]],     // índices de pares de vértices
    posiciones: [...],           // opcional: posiciones fijas {x,y}
    pesos: [...],                // opcional: pesos de aristas
    dirigido: false,             // opcional: si es digrafo
    resaltados: [],              // opcional: índices de vértices resaltados
    aristaColor: {},             // opcional: colores de aristas específicas
    vertexColor: {},             // opcional: colores de vértices específicos
    hyperEdges: [],              // opcional: hiperaristas [[i,j,k],...]
  },
}
```

> **Nota v1.2 — Hiperaristas:** El componente `GrafoSVG` acepta la prop `hyperEdges` para dibujar hiperaristas como polígonos SVG rellenos (componente `HiperAristaSVG`). No truncar hiperaristas a pares — usar el campo `hyperEdges` separado del campo `aristas`.

### 6.3 Requisitos de Quiz

| Criterio              | Mínimo | Recomendado | Proyecto de referencia       |
| --------------------- | ------- | ----------- | ---------------------------- |
| Preguntas totales     | 30      | 50+         | **50** ✅              |
| Cobertura de módulos | 100%    | 100%        | **100%** ✅            |
| Preguntas por módulo | 3       | 4–6        | 4–6 ✅                      |
| Retroalimentación    | Sí     | Sí         | ✅                           |
| Indicador dificultad  | No      | Sí         | ✅ (`facil/medio/dificil`) |

```js
// Estructura de pregunta
{
  id: 1,                          // entero único, secuencial
  pregunta: "...",
  opciones: ["A","B","C","D"],    // exactamente 4
  correcta: 0,                    // índice 0–3
  explicacion: "...",             // ≥ 20 palabras
  nivel: "NombreModulo",          // debe coincidir con cat.nombre
  dificultad: "facil|medio|dificil",  // opcional pero recomendado
}
```

> **Nota v1.2 — Organización:** Las preguntas deben estar ordenadas por sección temática en el array `QUIZZES`, con un comentario de separación antes de cada bloque. Esto facilita la búsqueda y mantenimiento del banco.

---

## 7. Persistencia de Progreso (Obligatorio)

### Schema localStorage

**Clave:** `mx.uan.<app>_progreso`

```js
{
  version: 1,
  temasVisitados: [],         // IDs de temas visitados
  temasCompletados: [],       // visitados ≥ 30 segundos
  quizHistorial: [
    { fecha: "ISO", aciertos: 0, total: 0, tiempoMin: 0 }
  ],
  ultimoTema: null,
  ultimaCategoria: null,
}
```

### Hook `useProgreso` (implementación de referencia)

```js
// src/hooks/useProgreso.js
import { useState, useCallback } from 'react';
const CLAVE = 'mx.uan.<app>_progreso';
const INICIAL = {
  version: 1, temasVisitados: [], temasCompletados: [],
  quizHistorial: [], ultimoTema: null, ultimaCategoria: null
};

export function useProgreso() {
  const [progreso, setProgreso] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || INICIAL; }
    catch { return INICIAL; }
  });
  const guardar = useCallback((nuevo) => {
    localStorage.setItem(CLAVE, JSON.stringify(nuevo));
    setProgreso(nuevo);
  }, []);
  const marcarVisitado = useCallback((temaId, catId) => {
    guardar({
      ...progreso,
      temasVisitados: [...new Set([...progreso.temasVisitados, temaId])],
      ultimoTema: temaId, ultimaCategoria: catId
    });
  }, [progreso, guardar]);
  const guardarQuiz = useCallback((aciertos, total) => {
    guardar({
      ...progreso,
      quizHistorial: [...progreso.quizHistorial,
        { fecha: new Date().toISOString(), aciertos, total, tiempoMin: 0 }]
    });
  }, [progreso, guardar]);
  return { progreso, marcarVisitado, guardarQuiz };
}
```

---

## 8. Compatibilidad y Rendimiento

| Criterio             | Límite                        | Proyecto de referencia |
| -------------------- | ------------------------------ | ---------------------- |
| Android mínimo      | API 26 (Android 8.0)           | API 26 ✅              |
| Tamaño APK debug    | < 25 MB                        | **5.17 MB** ✅   |
| Tamaño APK release  | < 15 MB                        | pendiente              |
| Tiempo carga inicial | < 3 s en dispositivo mid-range | no medido aún         |
| Bundle JS total      | < 2 MB gzip                    | no medido aún         |
| App 100% offline     | **Obligatorio**          | ✅ (KaTeX sin CDN)     |

### Compatibilidad WebView

| Feature            | Estado                                    |
| ------------------ | ----------------------------------------- |
| `localStorage`   | ✅                                        |
| SVG inline         | ✅                                        |
| CSS Grid / Flexbox | ✅                                        |
| Pointer Events     | ✅ (verificado para drag en Android)      |
| Web Workers        | ⚠️ Evitar                               |
| Google Fonts       | ⚠️ Requiere internet — prever fallback |

---

## 9. Pipeline de Construcción

### Opción A — Línea de comandos (recomendado, sin GUI)

```powershell
# Desde J:\Desarrollo_de_APK\Teoria_de_Grafos\

# 1. Build del bundle web
npm run build

# 2. Sincronizar assets con Capacitor
npx cap sync android

# 3. Compilar APK con Gradle (sin abrir Android Studio)
cd android
.\gradlew.bat assembleDebug

# 4. Verificar APK generado
# Salida: android\app\build\outputs\apk\debug\app-debug.apk

# 5. (Opcional) Instalar directamente en dispositivo USB
adb install app\build\outputs\apk\debug\app-debug.apk
```

> **Nota v1.2 — Lección aprendida:** No es necesario abrir la interfaz gráfica de Android Studio para compilar. `gradlew.bat assembleDebug` produce el mismo APK. El segundo build y posteriores son ~5× más rápidos por el caché de Gradle.

### Opción B — Android Studio (alternativa)

```powershell
npm run build
npx cap sync android
npx cap open android
# En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

### Variables de entorno requeridas para el build

```powershell
$env:JAVA_HOME    = "C:\Program Files\Java\jdk-21"
$env:ANDROID_HOME = "C:\Users\Cancino\AppData\Local\Android\Sdk"
$env:Path        += ";$env:ANDROID_HOME\platform-tools"
```

### Checklist de Release

- [ ] `npm run build` sin errores ni advertencias
- [ ] `npx cap sync android` completado
- [ ] `local.properties` apunta a la instalación local del SDK
- [ ] APK probado en dispositivo físico Android
- [ ] Probado en pantalla 5" y 6.5" (portrait y landscape)
- [ ] Sidebar, VistaTema, Simulador y Quiz funcionan
- [ ] Fórmulas KaTeX renderizan correctamente en dispositivo
- [ ] Progreso persiste al cerrar y reabrir la app
- [ ] App funciona sin conexión a internet
- [ ] Grafos SVG interactivos responden a touch/drag

---

## 10. Versionado

**Semántico:** `MAJOR.MINOR.PATCH`

- MAJOR — cambio de estructura de datos o rediseño completo
- MINOR — nuevo módulo de contenido o característica importante
- PATCH — corrección de contenido, bug UI o actualización de dependencias

**Commits (Conventional Commits):**

```
feat: añadir módulo Coloración
fix: corregir fórmula Vizing
content: 15 preguntas nuevas en Algoritmos
build: actualizar Capacitor a v8.3
style: ajustar responsive layout móvil
```

---

## 11. Nomenclatura de Proyectos

| Campo                 | Formato                             | Ejemplo                           |
| --------------------- | ----------------------------------- | --------------------------------- |
| Directorio            | `J:\Desarrollo_de_APK\<Materia>\` | `J:\Desarrollo_de_APK\Calculo\` |
| `appId`             | `mx.uan.<materia>`                | `mx.uan.calculo`                |
| Nombre visible        | `<Materia> UAN`                   | `Cálculo UAN`                  |
| `package.json` name | `uan-<materia>`                   | `uan-calculo`                   |

---

## 13. Arquetipo de Proyectos (v1.3)

> **Definición institucional:** El arquetipo es la estructura de proyecto genérica, probada y validada, a partir de la cual se derivan todos los proyectos APK de la UAN.

### 13.1 Ubicación del arquetipo

```
J:\Desarrollo_de_APK\
├── _Plantilla_APK\                    ← Arquetipo institucional
│   ├── __PROYECTO_ID__\               ← Carpeta plantilla (renombrada por el script)
│   │   ├── src\data\contenido.js       ← DATOS: único archivo a editar
│   │   ├── src\App.jsx                 ← Shell genérico (no editar)
│   │   └── ... (resto de archivos)    ← Infraestructura lista
│   └── nuevo_proyecto.ps1              ← Script de inicialización
└── Codigo_y_artefactos\
    ├── compilar_apk_debug.ps1          ← Parametrizado con -ProjectPath
    └── compilar_apk_release.ps1        ← Parametrizado con -ProjectPath
```

### 13.2 Tokens de personalización

| Token              | Descripción                       | Ejemplo                 |
| ------------------ | ---------------------------------- | ----------------------- |
| `{{MATERIA}}`    | Nombre corto snake_case            | `calculo`             |
| `{{APP_ID}}`     | ID de Capacitor                    | `mx.uan.calculo`      |
| `{{APP_NOMBRE}}` | Nombre visible                     | `Cálculo UAN`        |
| `{{APP_DESC}}`   | Meta description SEO (≤160 chars) | `App educativa de...` |
| `{{AUTOR}}`      | Nombre del docente                 | `Dr. Juan Pérez`     |
| `{{ANIO}}`       | Año de creación                  | `2026`                |

### 13.3 Flujo de trabajo con nuevo_proyecto.ps1

```powershell
# Ejecutar desde cualquier ubicación:
& "J:\Desarrollo_de_APK\_Plantilla_APK\nuevo_proyecto.ps1"

# El script realiza automáticamente:
# 1. Solicita los tokens interactivamente
# 2. Copia la plantilla al nuevo directorio
# 3. Sustituye todos los {{TOKENS}} en los archivos
# 4. Ejecuta npm install
# 5. Ejecuta npx cap add android
```

### 13.4 Responsabilidades del desarrollador con el arquetipo

Con el arquetipo, el desarrollador SOLO necesita:

1. Ejecutar `nuevo_proyecto.ps1`
2. Completar `src/data/contenido.js` (CATEGORIAS, QUIZZES, META, CREDITOS)
3. Reemplazar `public/favicon.svg` con el ícono de la materia
4. (Opcional) Copiar el escudo institucional si es diferente al de referencia

---

## 12. Registro de Proyectos Institucionales

| # | Proyecto | `appId` | Repositorio GitHub | Web App (GitHub Pages) | Estado |
|---|---|---|---|---|---|
| **000** | **Plantilla Arquetipo** | `mx.uan.plantilla` | [`uan-apk-plantilla-arquetipo`](https://github.com/PabloeCancino/uan-apk-plantilla-arquetipo) | — | 🟢 Arquetipo v1.4 activo |
| **001** | **Teoría de Conjuntos** | `mx.uan.teoriadeconjuntos` | [`uan-apk-teoria-de-conjuntos`](https://github.com/PabloeCancino/uan-apk-teoria-de-conjuntos) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-teoria-de-conjuntos/) | 🟢 APK v1.0.0 (4.54 MB) |
| **002** | **Teoría de Grafos** | `mx.uan.teoriadegrafos` | [`uan-apk-teoria-de-grafos`](https://github.com/PabloeCancino/uan-apk-teoria-de-grafos) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-teoria-de-grafos/) | 🟢 APK v1.0.0 (4.52 MB) |
| **003** | **Cálculo Diferencial** | `mx.uan.calculodiferencial` | [`uan-apk-calculo-diferencial`](https://github.com/PabloeCancino/uan-apk-calculo-diferencial) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-calculo-diferencial/) | 🟢 Código & Live Web App |
| **004** | **Trigonometría** | `mx.uan.trigonometria` | [`uan-apk-trigonometria`](https://github.com/PabloeCancino/uan-apk-trigonometria) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-trigonometria/) | 🟢 Código & Live Web App |
| **005** | **Tópicos de Matemáticas** | `mx.uan.topicosdematematicas` | [`uan-apk-topicos-de-matematicas`](https://github.com/PabloeCancino/uan-apk-topicos-de-matematicas) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-topicos-de-matematicas/) | 🟢 APK v0.9.0 (5.68 MB) |
| **006** | **Comportamiento de Funciones** | `mx.uan.comportamientofunciones` | [`uan-apk-comportamiento-funciones`](https://github.com/PabloeCancino/uan-apk-comportamiento-funciones) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-comportamiento-funciones/) | 🟢 Código & Live Web App |
| **007** | **Didáctica de la Geometría** | `mx.uan.didacticadelageometria` | [`uan-apk-didactica-de-la-geometria`](https://github.com/PabloeCancino/uan-apk-didactica-de-la-geometria) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-didactica-de-la-geometria/) | 🟢 Código & Live Web App |
| **008** | **Geometría Analítica Plana** | `mx.uan.geometriaanaliticaplana` | [`uan-apk-geometria-analitica-plana`](https://github.com/PabloeCancino/uan-apk-geometria-analitica-plana) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-geometria-analitica-plana/) | 🟢 Código & Live Web App |
| **009** | **Sistema de Ecuaciones** | `mx.uan.sistemadeecuaciones` | [`uan-apk-sistema-de-ecuaciones`](https://github.com/PabloeCancino/uan-apk-sistema-de-ecuaciones) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-sistema-de-ecuaciones/) | 🟢 Código & Live Web App |
| **010** | **Termodinámica** | `mx.uan.termodinamica` | [`uan-apk-termodinamica`](https://github.com/PabloeCancino/uan-apk-termodinamica) | [🌐 Ver App](https://pabloecancino.github.io/uan-apk-termodinamica/) | 🟢 Código & Live Web App |

---

## 14. Norma de Publicación y Distribución Institucional en GitHub

1. **Estructura de Repositorios Publicos:**
   - Nombre oficial de repositorio: `uan-apk-<nombre-materia-kebab-case>`.
   - Organización/Propietario: GitHub `PabloeCancino`.
   - Archivo `.gitignore`: Exclusión estricta de `node_modules`, `dist`, `.vercel`, `android/app/build` y certificados `.jks`/`.keystore`.
2. **Flujo de Integración Continua (CI/CD) GitHub Pages:**
   - Todo proyecto incluye `.github/workflows/deploy.yml` configurado con `actions/upload-pages-artifact@v3` y `actions/deploy-pages@v4`.
   - Requisito de API REST: La propiedad GitHub Pages del repositorio debe configurarse en `build_type: workflow` mediante `PUT /repos/PabloeCancino/<repo>/pages`.
3. **Distribución de Binarios APK (GitHub Releases):**
   - Los binarios `.apk` de producción/debug se publican mediante GitHub Releases etiquetados (ej. `v1.0.0`, `v0.9.0-beta`).
   - El README del repositorio debe incluir el badge shields.io apuntando a la descarga directa del APK.

## Apéndice A — Prerrequisitos del Sistema (Windows)

| Componente     | Verificación       | Versión mínima | Versión de referencia |
| -------------- | ------------------- | ---------------- | ---------------------- |
| Node.js        | `node -v`         | v18 LTS+         | v18+                   |
| JDK            | `java -version`   | 17 LTS+          | **JDK 21** ✅    |
| Android Studio | (solo instalación) | Ladybug 2024+    | ✅                     |
| adb            | `adb --version`   | cualquiera       | 1.0.41 ✅              |

```powershell
# Variables de entorno — proyecto de referencia (usuario Cancino):
JAVA_HOME    = C:\Program Files\Java\jdk-21
ANDROID_HOME = C:\Users\Cancino\AppData\Local\Android\Sdk
PATH        += %ANDROID_HOME%\platform-tools
PATH        += %ANDROID_HOME%\tools
PATH        += %ANDROID_HOME%\emulator
```

---

## Apéndice B — Resolución de Problemas Frecuentes

| Síntoma                                | Causa                                    | Solución                                             |
| --------------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| APK pantalla en blanco                  | `base` faltante en `vite.config.js`  | Agregar `base: './'`                                |
| Fórmulas sin renderizar                | CSS KaTeX no importado                   | `import 'katex/dist/katex.min.css'` en `main.jsx` |
| Gradle falla — SDK no encontrado       | `local.properties` con ruta incorrecta | Corregir `sdk.dir` al SDK local del usuario         |
| `adb` no reconocido en terminal       | platform-tools no en PATH                | Agregar `%ANDROID_HOME%\platform-tools` al PATH     |
| Gradle falla — JAVA_HOME incorrecto    | Variable apunta a JDK inexistente        | Verificar `java -version` y corregir JAVA_HOME      |
| Touch/drag no funciona en Android       | Uso de `onMouseDown` en vez de Pointer | Usar `onPointerDown/Move/Up` en componentes SVG     |
| localStorage vacío post-reinstalación | Comportamiento normal Android            | Documentar en manual de usuario                       |
| `npx cap sync` sin cambios            | `dist/` desactualizado                 | Ejecutar `npm run build` antes de `cap sync`      |

---

*Elaborada por: Dr. Pablo Eduardo Cancino Marentes. Investigación en Tecnología Educativa PALMAT-UACBI-UAN · Próxima revisión: 2026-10-23*
