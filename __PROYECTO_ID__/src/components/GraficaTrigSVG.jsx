// GraficaTrigSVG.jsx — Gráfica de funciones trigonométricas (sen, cos, tan)
import { useTheme } from "../hooks/useTheme";

const W = 280;
const H = 140;
const PAD = { top: 10, left: 28, right: 10, bottom: 24 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

// Convierte t (0..2π) → pixel X
const toPx = (t) => PAD.left + (t / (2 * Math.PI)) * INNER_W;
// Convierte v (-1.5..1.5) → pixel Y
const toPy = (v) => PAD.top + ((1.5 - v) / 3) * INNER_H;

const FUNCIONES = {
  sen: { fn: Math.sin, color: "#f78166", label: "sen(θ)", asint: [] },
  cos: { fn: Math.cos, color: "#79c0ff", label: "cos(θ)", asint: [] },
  tan: { fn: Math.tan, color: "#d2a8ff", label: "tan(θ)",
    // Asíntotas en [0, 2π]: π/2 y 3π/2
    asint: [Math.PI / 2, (3 * Math.PI) / 2],
  },
};

const PASOS = 600; // más resolución para la tangente
const CLIP  = 1.45; // valor máximo a graficar (corte limpio antes de la asíntota)
// Umbral angular para detectar discontinuidad: |cos θ| < ASINT_THRESH
const ASINT_THRESH = 0.08;

/**
 * buildPath — construye el path SVG de la función.
 * Para la tangente rompe el trazo (M = move) cuando detecta una discontinuidad,
 * en lugar de dibujar una línea vertical falsa.
 */
function buildPath(fn, isTan) {
  let d = "";
  let pen = false; // si el lápiz está "bajado"

  for (let i = 0; i <= PASOS; i++) {
    const t = (i / PASOS) * 2 * Math.PI;
    const v = fn(t);

    // Detectar zona de asíntota (solo tangente)
    if (isTan && Math.abs(Math.cos(t)) < ASINT_THRESH) {
      pen = false; // levanta el lápiz → rompe el path
      continue;
    }

    // Fuera del rango visible → corta el trazo
    if (Math.abs(v) > CLIP) {
      pen = false;
      continue;
    }

    const px = toPx(t);
    const py = toPy(v);

    if (!pen) {
      d += `M ${px.toFixed(2)} ${py.toFixed(2)}`;
      pen = true;
    } else {
      d += ` L ${px.toFixed(2)} ${py.toFixed(2)}`;
    }
  }
  return d;
}

export function GraficaTrigSVG({ funcion = "sen" }) {
  const { C } = useTheme();
  const f      = FUNCIONES[funcion] || FUNCIONES.sen;
  const isTan  = funcion === "tan";
  const path   = buildPath(f.fn, isTan);

  // Posiciones de asíntotas en píxeles X
  const asintPx = f.asint.map(toPx);

  return (
    <div style={{ width: "100%" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W }}>
        {/* Fondo */}
        <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H}
          fill={C.surface} rx={4} />

        {/* Cuadrícula horizontal */}
        {[-1, -0.5, 0, 0.5, 1].map(v => {
          const y = toPy(v);
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y}
                stroke={C.border} strokeWidth={v === 0 ? 1.2 : 0.5} />
              <text x={PAD.left - 3} y={y + 3} fontSize={7} fill={C.muted} textAnchor="end">{v}</text>
            </g>
          );
        })}

        {/* Marcas y cuadrícula vertical: 0, π/2, π, 3π/2, 2π */}
        {[0, 0.5, 1, 1.5, 2].map(k => {
          const x = toPx(k * Math.PI);
          const labels = ["0", "π/2", "π", "3π/2", "2π"];
          return (
            <g key={k}>
              <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + INNER_H}
                stroke={C.border} strokeWidth={0.5} />
              <text x={x} y={PAD.top + INNER_H + 10} fontSize={7} fill={C.muted} textAnchor="middle">
                {labels[k * 2]}
              </text>
            </g>
          );
        })}

        {/* ── Asíntotas verticales punteadas (solo tangente) ───────────────── */}
        {asintPx.map((x, i) => (
          <line key={i}
            x1={x} y1={PAD.top}
            x2={x} y2={PAD.top + INNER_H}
            stroke="#f0883e"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            opacity={0.75}
          />
        ))}

        {/* Curva de la función */}
        <path d={path} fill="none" stroke={f.color} strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round" />

        {/* Etiqueta función */}
        <text x={PAD.left + 4} y={PAD.top + 12} fontSize={9} fill={f.color} fontWeight={700}>
          y = {f.label}
        </text>

        {/* Leyenda de asíntota (solo tangente) */}
        {isTan && (
          <text x={W - PAD.right - 2} y={PAD.top + 12} fontSize={7}
            fill="#f0883e" textAnchor="end" opacity={0.85}>
            — asíntota
          </text>
        )}
      </svg>
    </div>
  );
}
