# } — Proyecto APK UAN

> **NTE-UAN-APK-001 v1.3** · Universidad Autónoma de Nayarit · Tecnología Educativa

## Descripción

{{APP_DESC}}

## Stack tecnológico

| Capa               | Herramienta | Versión |
| ------------------ | ----------- | -------- |
| UI Framework       | React       | 19.x     |
| Empaquetado web    | Vite        | 8.x      |
| Empaquetado nativo | Capacitor   | 8.x      |
| Matemáticas       | KaTeX       | 0.16.x   |
| JDK                | Java        | 21       |

## Inicio rápido

```powershell
# 1. Instalar dependencias (si no se hizo con nuevo_proyecto.ps1)
npm install

# 2. Ver en el navegador
npm run dev

# 3. Compilar APK (debug)
J:\Desarrollo_de_APK\Codigo_y_artefactos\compilar_apk_debug.ps1 -ProjectPath (Get-Location)
```

## Personalización

**El único archivo que debes editar es:**

```
src/data/contenido.js
```

Este archivo contiene:

- `META` — metadatos del proyecto
- `CATEGORIAS` — módulos educativos y sus temas (definición + fórmula + grafo SVG)
- `QUIZZES` — banco de preguntas de evaluación (mínimo 30)
- `CREDITOS` — colaboradores del proyecto
- `GRAFO_SIM` — grafo de ejemplo para el simulador de algoritmos

### Convención de formato para el campo `definicion`

El campo `definicion` es una cadena de texto que soporta saltos de línea mediante secuencias de escape:

| Secuencia | Resultado visual                       |
| --------- | -------------------------------------- |
| `\n\n`  | Salto de párrafo (línea en blanco)   |
| `\n - ` | Elemento de lista con viñeta (guión) |

**Ejemplo:**

```js
definicion: "Párrafo introductorio.\n\nLista de elementos:\n - Primer elemento.\n - Segundo elemento.\n\nCierre del tema.",
```

> Esto es posible porque `index.css` aplica `white-space: pre-line` a `.tema-definicion`.

## Estructura de directorios

```
src/
├── components/Formula.jsx    ← KaTeX block + inline (no editar)
├── hooks/useProgreso.js      ← localStorage (no editar)
├── data/contenido.js         ← ¡ÚNICO ARCHIVO A EDITAR!
├── App.jsx                   ← Shell completo (no editar)
├── ThemeCtx.js               ← Paleta de colores (no editar)
├── main.jsx                  ← Punto de entrada (no editar)
└── index.css                 ← Estilos base (no editar)
```

## Compilación APK Release (firmada)

```powershell
# Crear keystore primero (una sola vez):
& "E:\Desarrollo_de_APK\jdk21\jdk-21.0.6+7\bin\keytool.exe" `
    -genkey -v -keystore {{MATERIA}}_release.jks `
    -alias {{MATERIA}} -keyalg RSA -keysize 2048 -validity 10000

# Compilar release:
E:\Desarrollo_de_APK\Codigo_y_artefactos\compilar_apk_release.ps1 -ProjectPath (Get-Location)
```

## 📄 Licencia y Créditos

Desarrollado por el **Dr. Pablo Eduardo Cancino Marentes** (Investigación Docente en Tecnología Educativa).  
Programa Académico de Licenciatura en Matemáticas.  
Unidad Académica de Ciencias Básicas e Ingenierías.  
**Universidad Autónoma de Nayarit** (UAN) · {{ANIO}}.  
Todos los derechos reservados.

---

*Generado con la Plantilla APK UAN · NTE-UAN-APK-001 v1.3*
