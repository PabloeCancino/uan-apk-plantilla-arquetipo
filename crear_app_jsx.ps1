# Script auxiliar: construye App.jsx parametrico a partir del proyecto de referencia
$refFile  = "J:\Desarrollo_de_APK\Teoria_de_Grafos\src\App.jsx"
$destFile = "J:\Desarrollo_de_APK\_Plantilla_APK\__PROYECTO_ID__\src\App.jsx"

$lines = Get-Content $refFile -Encoding UTF8

$out   = [System.Collections.Generic.List[string]]::new()
$skip  = $false

# Marcadores de bloques a eliminar (datos hardcoded)
$startMarkers = @(
    "^const CATEGORIAS = \[",
    "^const QUIZZES = \[",
    "^const GRAFO_SIM = \{"
)
$endMarkers = @(
    "^const TODOS_TEMAS",
    "^// .* ALGORITMOS PARA SIMULACION",
    "^function simBFS"
)

# Linea de import de escudo (se reemplaza)
$escudoImport = $false

foreach ($line in $lines) {
    # Detectar inicio de bloque a saltar
    foreach ($m in $startMarkers) {
        if ($line -match $m) { $skip = $true; break }
    }

    # Detectar fin de bloque — incluir esta linea
    if ($skip) {
        foreach ($e in $endMarkers) {
            if ($line -match $e) { $skip = $false; break }
        }
    }

    if (-not $skip) {
        # Reemplazar import de escudo por version con contenido.js
        if ($line -match "^import escudoUAN from") {
            if (-not $escudoImport) {
                $out.Add('import { CATEGORIAS, QUIZZES, META, CREDITOS, GRAFO_SIM } from "./data/contenido.js";')
                $out.Add('import escudoUAN from "./ESCUDO-UAN-Azul.png";')
                $escudoImport = $true
            }
        } else {
            $out.Add($line)
        }
    }
}

$result = $out -join "`n"

# Patch: Creditos usa CREDITOS de contenido.js
$creditosOld = @'
  const tarjetas = [
    {
      rol: "Docentes Investigadores",
      icono: "🎓",
      color: C.accent,
      personas: [
        { nombre: "Dra. Oyuki Hayde Hermosillo Reyes", detalle: "Investigadora responsable" },
        { nombre: "Dr. Pablo Eduardo Cancino Marentes", detalle: "Investigador colaborador" },
      ],
    },
    {
      rol: "Apoyo en el desarrollo de la Investigación",
      icono: "💻",
      color: C.green,
      personas: [
        { nombre: "Liliana Gómez Dennis", detalle: "Estudiante — Licenciatura en Matemáticas" },
      ],
    },
  ];
'@

$creditosNew = @'
  const tarjetas = (CREDITOS || []).map(g => ({
    ...g,
    color: g.rol.toLowerCase().includes("docente") ? C.accent : C.green,
  }));
'@

$result = $result.Replace($creditosOld, $creditosNew)

# Patch: Creditos — titulo y subtitulo usan META
$result = $result -replace 'Teoría de Grafos</h2>', '{{META.nombreCompleto}}</h2>' 
$result = $result -replace '{/\* PROYECTO \*/}', ''

# Patch: titulo en h2 del componente Creditos
$result = $result -replace '>\s*Teoría de Grafos\s*</h2>', ">{META.nombreCompleto}</h2>"

# Patch: Sidebar titulo
$result = $result -replace 'Grafos <span style=\{.*?\}>Apk-UAN</span>', '{META.materia} <span style={{ color: C.accent }}>APK-UAN</span>'
$result = $result -replace 'Teoría de Gráfos<br />Licenciatura en Matemáticas', '{META.nombreCompleto}<br />{META.programa}'

# Patch: primer tema y categoria por defecto — usar primer valor de CATEGORIAS
$result = $result -replace 'progreso\.ultimaCategoria \|\| "fundamentos"', 'progreso.ultimaCategoria || CATEGORIAS[0]?.id'
$result = $result -replace 'progreso\.ultimoTema \|\| "definicion"',       'progreso.ultimoTema || CATEGORIAS[0]?.temas[0]?.id'

Set-Content -Path $destFile -Value $result -Encoding UTF8
$size = (Get-Item $destFile).Length
Write-Host "App.jsx creado correctamente: $size bytes" -ForegroundColor Green
