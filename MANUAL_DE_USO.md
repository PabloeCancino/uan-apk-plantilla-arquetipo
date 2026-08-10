# Manual de Uso — Arquetipo de Proyectos APK UAN

**NTE-UAN-APK-001 v1.3 · Universidad Autónoma de Nayarit · Tecnología Educativa**

> Este manual describe el proceso completo para crear, personalizar y compilar una nueva aplicación Android educativa utilizando el arquetipo institucional UAN.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Crear un nuevo proyecto](#2-crear-un-nuevo-proyecto)
3. [Personalizar el contenido educativo](#3-personalizar-el-contenido-educativo)
4. [Ver en el navegador](#4-ver-en-el-navegador-desarrollo)
5. [Compilar el APK Debug](#5-compilar-el-apk-debug)
6. [Compilar el APK Release](#6-compilar-el-apk-release-firmado)
7. [Registrar el proyecto en la norma](#7-registrar-el-proyecto-en-la-norma)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)
9. [Referencia de tokens](#9-referencia-de-tokens)

---

## 1. Requisitos previos

| Componente | Verificación | Mínimo requerido |
|---|---|---|
| Node.js | `node -v` | v18 LTS+ |
| JDK | `java -version` | JDK 17+ (recomendado JDK 21) |
| Android Studio | Instalado | Ladybug 2024+ |
| Android SDK | Configurado | API 26+ |

**Rutas portables en este equipo:**

```
J:\Desarrollo_de_APK\jdk21\jdk-21.0.6+7\bin\java.exe   ← JDK 21 (preferido)
J:\Desarrollo_de_APK\jdk17\jdk-17.0.14+7\bin\java.exe  ← JDK 17 (fallback)
```

> [!NOTE]
> Los scripts de compilación detectan el JDK automáticamente. No necesitas configurar variables de entorno manualmente.

---

## 2. Crear un nuevo proyecto

Ejecuta el script interactivo desde PowerShell:

```powershell
& "J:\Desarrollo_de_APK\_Plantilla_APK\nuevo_proyecto.ps1"
```

El script te solicitará los siguientes datos:

| Dato | Descripción | Ejemplo |
|---|---|---|
| **Materia** | Nombre corto, snake_case, sin espacios | `calculo` |
| **App ID** | Identificador Capacitor (se sugiere automáticamente) | `mx.uan.calculo` |
| **Nombre visible** | Nombre que aparece en el dispositivo | `Cálculo UAN` |
| **Descripción** | Texto SEO ≤ 160 caracteres | `App educativa de Cálculo...` |
| **Autor** | Nombre del docente responsable | `Dr. Juan Pérez` |
| **Año** | Año de creación | `2026` |
| **Directorio** | Ruta de destino (se sugiere automáticamente) | `J:\Desarrollo_de_APK\Calculo` |

Después de confirmar, el script realiza automáticamente:

```
✅ Copia la plantilla completa al directorio destino
✅ Sustituye todos los {{TOKENS}} en los archivos de texto
✅ npm install — instala dependencias
✅ npx cap add android — inicializa proyecto Android
```

> [!IMPORTANT]
> El proceso de `npx cap add android` tarda ~3 minutos la primera vez. No cierres la ventana de PowerShell.

---

## 3. Personalizar el contenido educativo

**El único archivo que debes editar es:**

```
<TuProyecto>\src\data\contenido.js
```

### 3.1 META — Metadatos del proyecto

```js
export const META = {
  materia:        "calculo",
  nombreCompleto: "Cálculo UAN",
  version:        "1.0.0",
  autor:          "Dr. Juan Pérez",
  anio:           "2026",
  descripcion:    "App educativa de Cálculo — UAN",
  unidad:         "Unidad Académica de Ciencias Básicas e Ingenierías",
  programa:       "Licenciatura en Matemáticas",
  norma:          "NTE-UAN-APK-001 v1.3",
};
```

---

### 3.2 CATEGORIAS — Módulos educativos

```js
export const CATEGORIAS = [
  {
    id:     "limites",        // snake_case único
    nombre: "Límites",       // ≤ 30 chars — aparece en sidebar y quiz
    icon:   "📐",            // emoji representativo
    color:  "#58a6ff",       // color único para este módulo
    temas:  [ /* ver §3.3 */ ],
  },
];
```

**Paleta de colores del sistema de diseño UAN:**

| Color | Hex | Uso sugerido |
|---|---|---|
| Azul UAN | `#58a6ff` | Módulo principal |
| Verde | `#39d353` | Módulo secundario |
| Morado | `#bc8cff` | Tipos especiales |
| Naranja | `#f0883e` | Procedimientos |
| Amarillo | `#e3b341` | Histórico / notable |
| Rojo | `#ff7b72` | Avanzado |
| Celeste | `#79c0ff` | Aplicaciones |

---

### 3.3 Estructura de un Tema

```js
{
  id:         "regla_cadena",           // snake_case único en toda la app
  titulo:     "Regla de la Cadena",     // ≤ 40 caracteres
  definicion: "Si h(x) = f(g(x)), entonces h'(x) = f'(g(x)) · g'(x). " +
              "Esta regla permite derivar funciones compuestas de forma sistemática...",
              // ≥ 50 palabras, redacción académica
  formula:    "(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)",
              // LaTeX — usa \\ (doble barra) para escapar en JS
              // Omite esta línea si el tema no tiene fórmula
  notas: [
    "Se aplica cuando una función está dentro de otra.",
    "Puede encadenarse para múltiples composiciones.",
    "En notación de Leibniz: dy/dx = (dy/du)(du/dx).",
  ],
  grafo: { /* ver §3.4 — omitir si el tema no tiene visualización */ },
}
```

**Macros LaTeX disponibles:**

| Macro | Resultado |
|---|---|
| `\R` | ℝ (reales) |
| `\N` | ℕ (naturales) |
| `\Z` | ℤ (enteros) |
| `\O` | ∅ (vacío) |
| `\G` | 𝒢 (grafo) |

---

### 3.4 Visualización de Grafos SVG

El campo `grafo` activa la visualización interactiva con drag & drop. Es **opcional**.

#### Grafo simple

```js
grafo: {
  vertices: ["A", "B", "C", "D"],
  aristas:  [[0, 1], [1, 2], [2, 3]],  // pares de índices [desde, hasta]
},
```

#### Grafo con pesos en aristas

```js
grafo: {
  vertices: ["s", "a", "b", "t"],
  aristas:  [[0, 1], [0, 2], [1, 3], [2, 3]],
  pesos:    [4,      2,      5,      3],
},
```

#### Grafo dirigido (con flechas)

```js
grafo: {
  vertices: ["u", "a", "b", "v"],
  aristas:  [[0, 1], [0, 2], [1, 3], [2, 3]],
  dirigido: true,
},
```

#### Posiciones fijas de los vértices

```js
grafo: {
  vertices:   ["r", "a", "b"],
  aristas:    [[0, 1], [0, 2]],
  posiciones: [
    { x: 100, y: 20 },   // vértice 0
    { x: 60,  y: 80 },   // vértice 1
    { x: 140, y: 80 },   // vértice 2
  ],
},
```

#### Vértices y aristas coloreados

```js
grafo: {
  vertices:    ["A", "B", "C", "D", "E"],
  aristas:     [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  vertexColor: { 0: "#f85149", 2: "#3fb950" },     // índice: color
  aristaColor: { "0-1": "#f85149", "2-3": "#3fb950" }, // "i-j": color
  resaltados:  [1, 3],                              // en azul accent
},
```

#### Hiperaristas (hipergrafos)

```js
grafo: {
  vertices:   ["v₁", "v₂", "v₃", "v₄"],
  aristas:    [[0, 3]],
  hyperEdges: [[0, 1, 2], [1, 2, 3]],  // cada hiperarista: array de índices
},
```

#### Grados visibles sobre los vértices

```js
grafo: {
  vertices: ["A", "B", "C", "D"],
  aristas:  [[0, 1], [0, 2], [0, 3], [1, 2]],
  grados:   [3, 2, 2, 1],
},
```

> [!TIP]
> Los grafos son **interactivos** por defecto — el usuario puede arrastrar los vértices con el dedo (touch) o el ratón.

---

### 3.5 QUIZZES — Banco de preguntas

```js
export const QUIZZES = [

  // ── Módulo: Límites ──────────────────────────────────────────────────────
  {
    id:          1,                      // entero único, secuencial
    pregunta:    "¿Cuál es lim(x→0) sen(x)/x?",
    opciones:    ["0", "1", "∞", "No existe"],
    correcta:    1,                      // índice 0–3 de la opción correcta
    explicacion: "El límite fundamental lim(x→0) sen(x)/x = 1 se demuestra " +
                 "geométricamente con el teorema del emparedado.",
                 // ≥ 20 palabras
    nivel:       "Límites",             // EXACTAMENTE igual a cat.nombre (tildes incluidas)
    dificultad:  "facil",               // "facil" | "medio" | "dificil"
  },
];
```

> [!IMPORTANT]
> El campo `nivel` debe coincidir **exactamente** con el `nombre` de la categoría incluyendo tildes y mayúsculas.

**Requisitos NTE-UAN-APK-001 §6.3:**

| Criterio | Mínimo | Recomendado |
|---|---|---|
| Preguntas totales | 30 | ≥ 50 |
| Cobertura de módulos | 100% | 100% |
| Preguntas por módulo | 3 | 4–6 |

---

### 3.6 CREDITOS — Colaboradores

```js
export const CREDITOS = [
  {
    rol:   "Docentes Investigadores",
    icono: "🎓",
    personas: [
      { nombre: "Dr. Juan Pérez",     detalle: "Investigador responsable" },
      { nombre: "Dra. María López",   detalle: "Investigadora colaboradora" },
    ],
  },
  {
    rol:   "Apoyo en el desarrollo de la Investigación",
    icono: "💻",
    personas: [
      { nombre: "Luis Ramírez",  detalle: "Estudiante — Licenciatura en Matemáticas" },
    ],
  },
];
```

---

## 4. Ver en el navegador (desarrollo)

```powershell
cd "J:\Desarrollo_de_APK\Calculo"
npm run dev
```

Abre `http://localhost:5173`. Los cambios en `contenido.js` se reflejan **en tiempo real**.

---

## 5. Compilar el APK Debug

APK para pruebas en dispositivo físico — sin firma digital, no apto para distribución.

```powershell
# Con parámetro directo:
& "J:\Desarrollo_de_APK\Codigo_y_artefactos\compilar_apk_debug.ps1" `
    -ProjectPath "J:\Desarrollo_de_APK\Calculo"

# O interactivo (el script pregunta la ruta):
& "J:\Desarrollo_de_APK\Codigo_y_artefactos\compilar_apk_debug.ps1"
```

El script ejecuta: `npm install` → `npm run build` → `npx cap sync android` → `gradlew assembleDebug`

**APK generado en:**
```
<TuProyecto>\android\app\build\outputs\apk\debug\app-debug.apk
```

> [!NOTE]
> El segundo build y posteriores son **~5× más rápidos** gracias al caché de Gradle.

---

## 6. Compilar el APK Release (firmado)

### Paso 1 — Crear el Keystore (solo una vez por proyecto)

```powershell
& "J:\Desarrollo_de_APK\jdk21\jdk-21.0.6+7\bin\keytool.exe" `
    -genkey -v `
    -keystore "J:\Desarrollo_de_APK\Calculo\calculo_release.jks" `
    -alias calculo `
    -keyalg RSA -keysize 2048 -validity 10000
```

> [!CAUTION]
> **Nunca incluyas el `.jks` en Git.** El `.gitignore` de la plantilla ya lo excluye. Si lo pierdes, no podrás actualizar la app en Google Play.

### Paso 2 — Compilar

```powershell
& "J:\Desarrollo_de_APK\Codigo_y_artefactos\compilar_apk_release.ps1" `
    -ProjectPath "J:\Desarrollo_de_APK\Calculo"
```

El script detecta el `.jks` automáticamente y solicita alias y contraseñas.

**APK firmado en:** `<TuProyecto>\android\app\build\outputs\apk\release\app-release.apk`

### Checklist antes de distribuir

- [ ] Build sin errores ni advertencias
- [ ] Probada en dispositivo físico Android
- [ ] Probada en pantalla 5" y 6.5" (portrait y landscape)
- [ ] Sidebar, VistaTema y Quiz funcionan correctamente
- [ ] Fórmulas KaTeX renderizan en el dispositivo
- [ ] Progreso persiste al cerrar y reabrir la app
- [ ] App funciona **sin conexión a internet**
- [ ] Mínimo 30 preguntas en el banco de quiz

---

## 7. Registrar el proyecto en la norma

Al iniciar un nuevo proyecto, agrégalo al registro en:

`J:\Desarrollo_de_APK\Teoria_de_Grafos\Normas_del_proyecto\NTE-UAN-APK-001.md` — §12

```markdown
| 002 | Cálculo | `mx.uan.calculo` | `J:\Desarrollo_de_APK\Calculo\` | 🟡 En desarrollo |
```

**Iconos de estado:**

| Ícono | Significado |
|---|---|
| 🟡 | En desarrollo |
| 🟠 | En pruebas |
| 🟢 | APK generado y validado |
| 🔵 | Publicado en Google Play |

---

## 8. Preguntas frecuentes

**¿Pantalla en blanco al instalar el APK?**
Verifica que `vite.config.js` tenga `base: './'`. Es el error más frecuente.

**¿Las fórmulas no se renderizan en el dispositivo?**
Revisa que `main.jsx` importe `import 'katex/dist/katex.min.css'` como primera línea.

**¿Gradle falla con "SDK not found"?**
El script actualiza `local.properties` automáticamente. Verifica que Android Studio y el SDK estén instalados.

**¿El nivel del quiz no coincide con el módulo?**
El campo `nivel` debe ser **exactamente igual** al `nombre` de la categoría, incluyendo tildes. Ejemplo: `"Límites"` ≠ `"Limites"`.

**¿Cómo agrego un tema sin grafo?**
Omite el campo `grafo` en la definición del tema. La app mostrará solo texto y fórmula.

**¿Cómo actualizo el APK después de editar el contenido?**
Vuelve a ejecutar `compilar_apk_debug.ps1 -ProjectPath "..."`. El script rebuild completo.

**¿Puedo usar el simulador de algoritmos en mi materia?**
Sí. Modifica el campo `GRAFO_SIM` en `contenido.js` para usar un grafo representativo de tu materia. El simulador corre BFS, DFS, Dijkstra, Bellman-Ford y Kruskal sobre ese grafo.

---

**¿El APK compila sin errores pero falla al iniciar en el dispositivo sin mostrar ningún mensaje?**

**Causa:** `npx cap add android` genera `MainActivity.java` con el paquete por defecto `com.getcapacitor.myapp` en lugar del paquete real de la app. Android no puede encontrar la clase al lanzar la Activity y el proceso termina silenciosamente.

> [!IMPORTANT]
> A partir de `nuevo_proyecto.ps1 v1.4`, este paso se corrige **automáticamente**. Si usas un proyecto creado con una versión anterior, aplica la corrección manual siguiente.

**Diagnóstico:** Abre el archivo:
```
<TuProyecto>\android\app\src\main\java\<ruta>\MainActivity.java
```
La primera línea debe ser exactamente:
```java
package mx.uan.<materia>;
```
Si dice `package com.getcapacitor.myapp;` o cualquier otro valor, el paquete está incorrecto.

**Corrección manual** (PowerShell):
```powershell
$proyecto = "J:\Desarrollo_de_APK\TuProyecto"   # ← ajusta esta ruta
$materia  = "tu_materia"                          # ← snake_case de tu materia
$pkg      = "mx.uan.$materia"
$javaBase = "$proyecto\android\app\src\main\java"
$destDir  = "$javaBase\$($pkg.Replace('.', '\'))"

# Crear directorio correcto
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

# Escribir MainActivity.java con paquete correcto
@"
package $pkg;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
"@ | Set-Content "$destDir\MainActivity.java" -Encoding UTF8

# Eliminar el archivo con paquete incorrecto
Get-ChildItem "$javaBase" -Filter "MainActivity.java" -Recurse |
    Where-Object { $_.FullName -ne "$destDir\MainActivity.java" } |
    Remove-Item -Force
```

Después de corregirlo, vuelve a compilar con el script de release.

---

## 9. Referencia de tokens

| Token | Archivos donde aparece | Descripción |
|---|---|---|
| `{{MATERIA}}` | `capacitor.config.json`, `package.json`, `useProgreso.js`, `contenido.js`, `README.md` | Nombre corto snake_case |
| `{{APP_ID}}` | `capacitor.config.json`, `contenido.js` | ID Capacitor: `mx.uan.<materia>` |
| `{{APP_NOMBRE}}` | `index.html`, `contenido.js`, `README.md` | Nombre visible en el dispositivo |
| `{{APP_DESC}}` | `index.html`, `contenido.js`, `README.md` | Descripción SEO ≤ 160 chars |
| `{{AUTOR}}` | `contenido.js`, `README.md` | Docente responsable (por defecto: Dr. Pablo Eduardo Cancino Marentes) |
| `{{ANIO}}` | `contenido.js`, `README.md` | Año de creación |

---

## 🛠️ Biblioteca de Instrumentos y Componentes Reutilizables

El arquetipo incluye en `src/components/` una suite completa de **30 instrumentos interactivos y visualizadores matemáticos** listos para ser utilizados en cualquier APK:

1. **`Formula.jsx`**: Motor KaTeX (bloque e inline) con macros institucionales para funciones trigonométricas e hiperbólicas (`\sen`, `\tg`, `\cotg`, `\senh`, `\tgh`, `\sech`, `\csch`, `\coth`).
2. **`VennSVG.jsx`**: Visualizador dinámico de Diagramas de Venn para 2 y 3 conjuntos con regiones sombreadas.
3. **`GrafoSVG.jsx`**: Visualizador interactivo de teoría de grafos (nodos, aristas dirigidas/no dirigidas y grado).
4. **`GraficoAsintotas.jsx`**: Graficador SVG con detección y rotura de línea (`M` en lugar de `L`) en asíntotas verticales.
5. **`GraficoDiscontinuidad.jsx`**: Visualizador de discontinuidades evitables, de salto e infinitas.
6. **`GraficoTangente.jsx`**: Trazador de derivada y recta tangente en tiempo real.
7. **`GraficoInflexion.jsx`**: Puntos de inflexión y concavidad ($f''(x)$).
8. **`GraficoLimiteEpsilonDelta.jsx`**: Visualizador formal de límites $\epsilon$-$\delta$.
9. **`GraficoTeoremaValorMedio.jsx`**: Ilustración del Teorema del Valor Medio y Rolle.
10. **`CirculoUnitarioSVG.jsx`**: Círculo trigonométrico interactivo en tiempo real.
11. **`TrianguloSVG.jsx`**: Geometría de triángulos rectángulos y ley de senos/cosenos.
12. **`GraficaTrigSVG.jsx`**: Gráfica de funciones trigonométricas armónicas.
13. **`GraficoPascal.jsx`**: Triángulo de Pascal y desarrollo de binomios.
14. **`GraficoDesigualdadesCuadraticas.jsx` & `GraficoSistemasInecuaciones.jsx`**: Zonas de solución en el plano cartesiano.
15. **`Sidebar.jsx`, `VistaTema.jsx`, `TablaContenedor.jsx`, `Creditos.jsx`, `Simulador.jsx`**: Shell accesible con persistencia de avance y tarjetas de créditos de autoría.

---

## Estructura de archivos del arquetipo

```
E:\Desarrollo_de_APK\
├── _Plantilla_APK\
│   ├── nuevo_proyecto.ps1                   ← Script de inicialización automatizada
│   └── __PROYECTO_ID__\
│       ├── .github\workflows\deploy.yml     ← Flujo CI/CD automático para GitHub Pages en vivo
│       ├── src\
│       │   ├── data\contenido.js            ← ¡ÚNICO ARCHIVO A EDITAR PARA CONTENIDO!
│       │   ├── App.jsx                      ← Shell principal de la aplicación
│       │   ├── ThemeCtx.js                  ← Paleta DARK/LIGHT de alto contraste
│       │   ├── main.jsx                     ← Punto de entrada React
│       │   ├── index.css                    ← Sistema de diseño responsivo
│       │   ├── components\                  ← Suite de 30 instrumentos educativos (KaTeX, SVG, etc.)
│       │   └── hooks\useProgreso.js         ← Persistencia de avance en localStorage
│       ├── public\favicon.svg
│       ├── index.html
│       ├── vite.config.js                   ← base: './' (WebView + GitHub Pages)
│       ├── capacitor.config.json
│       ├── package.json
│       └── README.md
└── Codigo_y_artefactos\
    ├── compilar_apk_debug.ps1               ← Compilación de APK Debug
    └── compilar_apk_release.ps1             ← Compilación de APK Release firmada
```

---

*Desarrollado en la Universidad Autónoma de Nayarit (UAN)*  
*Investigación Docente en Tecnología Educativa*  
*Autor: Dr. Pablo Eduardo Cancino Marentes — Licenciatura en Matemáticas · UABC-I*  
*Norma aplicada: NTE-UAN-APK-001 v1.3*
