import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { InlineFormula } from "./Formula";

export function GraficoSistemasInecuaciones() {
  const { C } = useContext(ThemeCtx);

  // Escala uniforme de 32 píxeles por unidad para conservar la geometría real
  const SCALE = 32;
  const origin = { x: 180, y: 180 };

  // Vértices del polígono de solución (Triángulo)
  // (0,0), (4,0), (0,4)
  const v00 = { x: origin.x, y: origin.y };
  const v40 = { x: origin.x + 4 * SCALE, y: origin.y };
  const v04 = { x: origin.x, y: origin.y - 4 * SCALE };

  return (
    <div style={{
      width: "100%",
      maxWidth: 500,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 12 }}>
        Polígono de Solución y Optimización: <InlineFormula latex="x \geq 0,\ y \geq 0,\ x+y \leq 4" />
      </div>

      <svg viewBox="0 0 450 250" width="100%" height="100%" style={{ display: "block" }}>
        {/* Definición de la flecha de los ejes */}
        <defs>
          <marker id="axis-arrow-sys" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill={C.muted} />
          </marker>
        </defs>

        {/* Cuadrícula de fondo */}
        {[-2, -1, 0, 1, 2, 3, 4, 5, 6].map(val => (
          <line key={val} x1={origin.x + val * SCALE} y1="210" x2={origin.x + val * SCALE} y2="20" stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
        ))}
        {[-1, 0, 1, 2, 3, 4, 5].map(val => (
          <line key={val} x1="100" y1={origin.y - val * SCALE} x2="400" y2={origin.y - val * SCALE} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
        ))}

        {/* Ejes cartesianos */}
        <line x1="90" y1={origin.y} x2="415" y2={origin.y} stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-sys)" />
        <line x1={origin.x} y1="215" x2={origin.x} y2="15" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-sys)" />

        {/* Etiquetas de ejes */}
        <text x="420" y={origin.y + 4} fill={C.muted} fontSize="10" fontWeight="bold">x</text>
        <text x={origin.x - 4} y="10" fill={C.muted} fontSize="10" fontWeight="bold" textAnchor="end">y</text>

        {/* Ticks X */}
        {[-1, 1, 2, 3, 4, 5].map(val => (
          <g key={val}>
            <line x1={origin.x + val * SCALE} y1={origin.y - 3} x2={origin.x + val * SCALE} y2={origin.y + 3} stroke={C.muted} strokeWidth="1" />
            <text x={origin.x + val * SCALE} y={origin.y + 14} fill={C.muted} fontSize="9" textAnchor="middle">{val}</text>
          </g>
        ))}

        {/* Ticks Y */}
        {[-1, 1, 2, 3, 4].map(val => (
          <g key={val}>
            <line x1={origin.x - 3} y1={origin.y - val * SCALE} x2={origin.x + 3} y2={origin.y - val * SCALE} stroke={C.muted} strokeWidth="1" />
            <text x={origin.x - 7} y={origin.y - val * SCALE + 3} fill={C.muted} fontSize="9" textAnchor="end">{val}</text>
          </g>
        ))}

        {/* Región de solución (Triángulo sombreado en verde) */}
        <polygon
          points={`${v00.x},${v00.y} ${v40.x},${v40.y} ${v04.x},${v04.y}`}
          fill={`${C.accent}22`}
          stroke={C.accent}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Recta límite x + y = 4 (y = -x + 4) (Naranja) */}
        <line
          x1={origin.x - 0.5 * SCALE}
          y1={origin.y - 4.5 * SCALE}
          x2={origin.x + 4.8 * SCALE}
          y2={origin.y + 0.8 * SCALE}
          stroke={C.orange}
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />

        {/* Etiquetas de las inecuaciones del sistema */}
        <text x={origin.x + 2.8 * SCALE} y={origin.y - 1.8 * SCALE} fill={C.orange} fontSize="9" fontWeight="bold" transform={`rotate(-45, ${origin.x + 2.8 * SCALE}, ${origin.y - 1.8 * SCALE})`}>
          x + y = 4
        </text>

        {/* Marcadores de los vértices (0,0) y (0,4) */}
        <circle cx={v00.x} cy={v00.y} r="4" fill={C.accent} stroke={C.bg} strokeWidth="1" />
        <circle cx={v04.x} cy={v04.y} r="4" fill={C.accent} stroke={C.bg} strokeWidth="1" />

        {/* Marcador del Vértice Óptimo (4,0) - Destacado con doble anillo naranja/rojo */}
        <circle cx={v40.x} cy={v40.y} r="7" fill="none" stroke={C.orange} strokeWidth="1.5" />
        <circle cx={v40.x} cy={v40.y} r="4.5" fill={C.orange} stroke={C.bg} strokeWidth="1" />

        {/* Etiquetas de coordenadas y evaluaciones z = 3x + 2y en los vértices */}
        <text x={v00.x - 6} y={v00.y + 12} fill={C.text} fontSize="9" fontWeight="bold" textAnchor="end">(0,0) → z = 0</text>
        <text x={v04.x - 6} y={v04.y} fill={C.text} fontSize="9" fontWeight="bold" textAnchor="end">(0,4) → z = 8</text>
        
        {/* Vértice óptimo destacado */}
        <text x={v40.x + 8} y={v40.y + 12} fill={C.orange} fontSize="9" fontWeight="bold" textAnchor="start">
          (4,0) → z = 12 (ÓPTIMO MÁXIMO)
        </text>

        {/* Texto interno del polígono */}
        <text x={origin.x + 1.2 * SCALE} y={origin.y - 1.2 * SCALE} fill={C.accent} fontSize="10" fontWeight="bold" textAnchor="middle">
          Región Factible
        </text>
        <text x={origin.x + 1.2 * SCALE} y={origin.y - 0.7 * SCALE} fill={C.accent} fontSize="9" textAnchor="middle">
          (Solución)
        </text>

        {/* Leyenda de Optimización */}
        <g transform="translate(10, 235)">
          <rect x="0" y="0" width="10" height="10" fill={C.orange} rx="2" />
          <text x="15" y="9" fill={C.text} fontSize="9">Función objetivo a maximizar: z = 3x + 2y</text>
        </g>
      </svg>
    </div>
  );
}
