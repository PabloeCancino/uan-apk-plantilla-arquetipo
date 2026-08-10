<#
.SYNOPSIS
  Script de inicialización de nuevos proyectos APK — UAN
  NTE-UAN-APK-001 v1.3 — Universidad Autónoma de Nayarit

.DESCRIPTION
  Copia la plantilla _Plantilla_APK\__PROYECTO_ID__\ a un nuevo directorio,
  sustituye los tokens de personalización en todos los archivos de texto,
  instala dependencias npm y ejecuta npx cap add android.

.USO
  J:\Desarrollo_de_APK\_Plantilla_APK\nuevo_proyecto.ps1

.EJEMPLO
  .\nuevo_proyecto.ps1
#>

# ── Rutas base ────────────────────────────────────────────────────────────────
$BaseDir = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path $BaseDir)) { $BaseDir = "E:\Desarrollo_de_APK" }
$PlantillaDir = Join-Path $PSScriptRoot "__PROYECTO_ID__"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Nuevo Proyecto APK — UAN  (NTE-UAN-APK-001 v1.3)   ║" -ForegroundColor Cyan
Write-Host "║   Universidad Autónoma de Nayarit                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Solicitar datos del proyecto ──────────────────────────────────────────────
function Pedir($prompt, $default = "") {
    $msg = if ($default) { "$prompt [$default]" } else { $prompt }
    $val = Read-Host $msg
    if (-not $val -and $default) { return $default }
    return $val
}

function ValidarAppId($id) {
    return $id -match '^mx\.uan\.[a-z][a-z0-9_]{1,20}$'
}

Write-Host "─── Datos del proyecto ─────────────────────────────────" -ForegroundColor Yellow
Write-Host ""

# Nombre de la materia (snake_case)
do {
    $MATERIA = (Pedir "Materia (snake_case, ej: calculo, algebra_lineal)").ToLower().Trim()
} while ($MATERIA -notmatch '^[a-z][a-z0-9_]{1,30}$')

# AppId
$AppIdSugerido = "mx.uan.$MATERIA"
do {
    $APP_ID = Pedir "App ID (Capacitor)" $AppIdSugerido
    if (-not (ValidarAppId $APP_ID)) {
        Write-Host "  [ERROR] Formato inválido. Debe ser mx.uan.<materia>" -ForegroundColor Red
    }
} while (-not (ValidarAppId $APP_ID))

# Nombre visible
$NombreSugerido = (Get-Culture).TextInfo.ToTitleCase($MATERIA.Replace("_", " ")) + " UAN"
$APP_NOMBRE = Pedir "Nombre visible en el dispositivo" $NombreSugerido

# Descripción SEO
$APP_DESC = Pedir "Descripción (≤160 chars para SEO)" "Aplicación educativa de $APP_NOMBRE — Universidad Autónoma de Nayarit"
if ($APP_DESC.Length -gt 160) { $APP_DESC = $APP_DESC.Substring(0, 157) + "..." }

# Autor
$AUTOR = Pedir "Nombre del docente responsable" "Dr. Pablo Eduardo Cancino Marentes"

# Año
$ANIO = Pedir "Año de creación" (Get-Date -Format "yyyy")

# Directorio destino
$DirSugerido = Join-Path $BaseDir (Get-Culture).TextInfo.ToTitleCase($MATERIA.Replace("_", "_"))
$DestDir = Pedir "Directorio del proyecto" $DirSugerido

Write-Host ""
Write-Host "─── Resumen ────────────────────────────────────────────" -ForegroundColor Yellow
Write-Host "  Materia      : $MATERIA"
Write-Host "  App ID       : $APP_ID"
Write-Host "  Nombre       : $APP_NOMBRE"
Write-Host "  Autor        : $AUTOR"
Write-Host "  Año          : $ANIO"
Write-Host "  Directorio   : $DestDir"
Write-Host ""

$conf = Read-Host "¿Confirmar creación? (S/n)"
if ($conf -and $conf -notmatch '^[Ss]?$') {
    Write-Host "Operación cancelada." -ForegroundColor Red
    exit 0
}

# ── Verificar que la plantilla existe ─────────────────────────────────────────
if (-not (Test-Path $PlantillaDir)) {
    Write-Error "No se encontró la plantilla en: $PlantillaDir"
    exit 1
}

# ── Verificar que el destino no exista ya ─────────────────────────────────────
if (Test-Path $DestDir) {
    Write-Error "El directorio ya existe: $DestDir`nElige otro nombre o elimínalo primero."
    exit 1
}

# ── Copiar plantilla ──────────────────────────────────────────────────────────
Write-Host "`n=> Copiando plantilla..." -ForegroundColor Yellow
Copy-Item -Path $PlantillaDir -Destination $DestDir -Recurse -Force
Write-Host "  [OK] Plantilla copiada en: $DestDir" -ForegroundColor DarkGray

# También copiar el escudo UAN desde el proyecto de referencia
$escudoSrc = "J:\Desarrollo_de_APK\Teoria_de_Grafos\src\ESCUDO-UAN-Azul.png"
if (Test-Path $escudoSrc) {
    Copy-Item $escudoSrc (Join-Path $DestDir "src\ESCUDO-UAN-Azul.png") -Force
    Write-Host "  [OK] Escudo UAN copiado" -ForegroundColor DarkGray
}

# ── Sustituir tokens en archivos de texto ─────────────────────────────────────
Write-Host "`n=> Aplicando tokens de personalización..." -ForegroundColor Yellow

$tokens = @{
    "{{MATERIA}}"      = $MATERIA
    "{{APP_ID}}"       = $APP_ID
    "{{APP_NOMBRE}}"   = $APP_NOMBRE
    "{{APP_DESC}}"     = $APP_DESC
    "{{PACKAGE_NAME}}" = "uan-$MATERIA"
    "{{AUTOR}}"        = $AUTOR
    "{{ANIO}}"         = $ANIO
}

$extensiones = @("*.js", "*.jsx", "*.json", "*.html", "*.md", "*.ps1", "*.css")
$archivos = Get-ChildItem -Path $DestDir -Recurse -Include $extensiones -File |
Where-Object { $_.FullName -notmatch "node_modules|\.git" }

foreach ($archivo in $archivos) {
    $contenido = Get-Content $archivo.FullName -Raw -Encoding UTF8
    $modificado = $false
    foreach ($token in $tokens.Keys) {
        if ($contenido -match [regex]::Escape($token)) {
            $contenido = $contenido.Replace($token, $tokens[$token])
            $modificado = $true
        }
    }
    if ($modificado) {
        Set-Content -Path $archivo.FullName -Value $contenido -Encoding UTF8 -NoNewline
        Write-Host "  [TOKEN] $($archivo.Name)" -ForegroundColor DarkGray
    }
}

# ── Absorber PATH del sistema ─────────────────────────────────────────────────
try {
    $machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
    $userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    $env:PATH = "$userPath;$machinePath;$env:PATH"
}
catch {}

# Detectar Node/npm
$nodeLocations = @(
    "C:\Program Files\nodejs",
    (Join-Path $env:APPDATA "npm")
)
foreach ($loc in $nodeLocations) {
    if ($loc -and (Test-Path $loc) -and ($env:PATH -notlike "*$loc*")) {
        $env:PATH = "$loc;$env:PATH"
    }
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Warning "npm no encontrado en PATH. Instala Node.js primero."
    Write-Host "`n[ADVERTENCIA] Ejecuta manualmente en $DestDir :" -ForegroundColor Yellow
    Write-Host "  npm install" -ForegroundColor White
    Write-Host "  npx cap add android" -ForegroundColor White
    exit 0
}

# ── npm install ───────────────────────────────────────────────────────────────
Write-Host "`n=> Instalando dependencias npm..." -ForegroundColor Yellow
Set-Location $DestDir
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "Error en npm install"; exit $LASTEXITCODE }

# ── npx cap add android ───────────────────────────────────────────────────────
Write-Host "`n=> Inicializando proyecto Android con Capacitor..." -ForegroundColor Yellow
npx cap add android
if ($LASTEXITCODE -ne 0) {
    Write-Warning "npx cap add android falló — ejecutarlo manualmente si es necesario."
}

# ── Corregir MainActivity.java ────────────────────────────────────────────────
# Capacitor genera MainActivity.java con package com.getcapacitor.myapp por defecto.
# Debe coincidir con el applicationId/namespace del build.gradle, que Capacitor
# deriva del appId en capacitor.config.json (mx.uan.<MATERIA>).
Write-Host "`n=> Verificando paquete de MainActivity.java..." -ForegroundColor Yellow

$ExpectedPackage = "mx.uan.$MATERIA"
$AppIdPath       = $ExpectedPackage.Replace(".", [System.IO.Path]::DirectorySeparatorChar)
$JavaBaseDir     = Join-Path $DestDir "android\app\src\main\java"
$ExpectedDir     = Join-Path $JavaBaseDir $AppIdPath
$ExpectedFile    = Join-Path $ExpectedDir "MainActivity.java"

$ActualFile = Get-ChildItem -Path $JavaBaseDir -Filter "MainActivity.java" -Recurse -ErrorAction SilentlyContinue |
              Select-Object -First 1

if ($ActualFile) {
    $rawContent      = Get-Content $ActualFile.FullName -Raw -Encoding UTF8
    $pkgMatch        = [regex]::Match($rawContent, 'package\s+([\w.]+)\s*;')
    $currentPackage  = if ($pkgMatch.Success) { $pkgMatch.Groups[1].Value } else { "" }

    $packageOk  = ($currentPackage -eq $ExpectedPackage)
    $locationOk = ($ActualFile.FullName -eq $ExpectedFile)

    if ($packageOk -and $locationOk) {
        Write-Host "  [OK] Paquete correcto: $ExpectedPackage" -ForegroundColor DarkGray
    } else {
        if (-not $packageOk) {
            Write-Host "  [FIX] Paquete: '$currentPackage'  →  '$ExpectedPackage'" -ForegroundColor DarkYellow
        }
        if (-not $locationOk) {
            Write-Host "  [FIX] Ubicacion: '$($ActualFile.DirectoryName)'" -ForegroundColor DarkYellow
            Write-Host "         →  '$ExpectedDir'" -ForegroundColor DarkYellow
        }

        # Crear directorio correcto y escribir archivo con paquete correcto
        if (-not (Test-Path $ExpectedDir)) {
            New-Item -ItemType Directory -Path $ExpectedDir -Force | Out-Null
        }
        $corrected = "package $ExpectedPackage;`n`nimport com.getcapacitor.BridgeActivity;`n`npublic class MainActivity extends BridgeActivity {}`n"
        Set-Content -Path $ExpectedFile -Value $corrected -Encoding UTF8 -NoNewline

        # Eliminar archivo y directorio viejo si quedó vacío
        if ($ActualFile.FullName -ne $ExpectedFile) {
            Remove-Item $ActualFile.FullName -Force
            $oldDir = $ActualFile.DirectoryName
            while ($oldDir -ne $JavaBaseDir -and (Test-Path $oldDir) -and
                   (Get-ChildItem $oldDir -Recurse -File).Count -eq 0) {
                Remove-Item $oldDir -Recurse -Force
                $oldDir = Split-Path $oldDir -Parent
            }
        }

        Write-Host "  [OK] MainActivity.java corregido" -ForegroundColor Green
    }
} else {
    Write-Host "  [WARN] MainActivity.java no encontrado. Corrígelo manualmente si el APK no inicia." -ForegroundColor DarkYellow
    Write-Host "         Debe estar en: $ExpectedFile" -ForegroundColor DarkYellow
    Write-Host "         Con 'package $ExpectedPackage;' como primera línea." -ForegroundColor DarkYellow
}

# ── Mensaje final ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Proyecto creado exitosamente                        ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Directorio : $DestDir" -ForegroundColor White
Write-Host ""
Write-Host "  Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Edita src\data\contenido.js con tus CATEGORIAS y QUIZZES" -ForegroundColor White
Write-Host "  2. Sustituye public\favicon.svg con el ícono de tu materia" -ForegroundColor White
Write-Host "  3. Ejecuta: npm run dev   (para ver en el navegador)" -ForegroundColor White
Write-Host "  4. Ejecuta el script de compilación debug para generar el APK:" -ForegroundColor White
Write-Host "     J:\Desarrollo_de_APK\Codigo_y_artefactos\compilar_apk_debug.ps1 -ProjectPath ""$DestDir""" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Norma aplicada: NTE-UAN-APK-001 v1.3" -ForegroundColor DarkGray
Write-Host ""
