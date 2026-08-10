import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { InlineFormula } from "./Formula";

export function GraficoDesigualdadesCuadraticas() {
  const { C } = useContext(ThemeCtx);

  // Escala de 35 píxeles por unidad (1:1 aspect ratio)
  const SCALE = 35;
  const origin = { x: 200, y: 160 };

  // Generar puntos para la curva de la parábola: y = x^2 - 5x + 6
  const points = [];
  for (let x = -0.5; x <= 5.5; x += 0.05) {
    const px = origin.x + x * SCALE;
    const py = origin.y - (x * x - 5 * x + 6) * SCALE;
    points.push(`${px},${py}`);
  }
  const pathD = `M ${points.join(" L ")}`;

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
        Análisis de Signos de <InlineFormula latex="f(x) = x^2 - 5x + 6" />
      </div>

      <svg viewBox="0 0 450 250" width="100%" height="100%" style={{ display: "block" }}>
        {/* Definición de la flecha de los ejes */}
        <defs>
          <marker id="axis-arrow-des" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill={C.muted} />
          </marker>
        </defs>

        {/* Cuadrícula de fondo */}
        {[-1, 0, 1, 2, 3, 4, 5].map(val => (
          <line key={val} x1={origin.x + val * SCALE} y1="220" x2={origin.x + val * SCALE} y2="20" stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
        ))}
        {[-2, -1, 0, 1, 2, 3, 4].map(val => (
          <line key={val} x1="140" y1={origin.y - val * SCALE} x2="420" y2={origin.y - val * SCALE} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
        ))}

        {/* Ejes cartesianos */}
        <line x1="130" y1={origin.y} x2="435" y2={origin.y} stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-des)" />
        <line x1={origin.x} y1="225" x2={origin.x} y2="15" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-des)" />

        {/* Etiquetas de ejes */}
        <text x="440" y={origin.y + 4} fill={C.muted} fontSize="10" fontWeight="bold">x</text>
        <text x={origin.x - 4} y="10" fill={C.muted} fontSize="10" fontWeight="bold" textAnchor="end">y</text>

        {/* Ticks X */}
        {[1, 2, 3, 4].map(val => (
          <g key={val}>
            <line x1={origin.x + val * SCALE} y1={origin.y - 3} x2={origin.x + val * SCALE} y2={origin.y + 3} stroke={C.muted} strokeWidth="1" />
            <text x={origin.x + val * SCALE} y={origin.y + 14} fill={C.muted} fontSize="9" textAnchor="middle">{val}</text>
          </g>
        ))}

        {/* Ticks Y */}
        {[-1, 1, 2, 3].map(val => (
          <g key={val}>
            <line x1={origin.x - 3} y1={origin.y - val * SCALE} x2={origin.x + 3} y2={origin.y - val * SCALE} stroke={C.muted} strokeWidth="1" />
            <text x={origin.x - 7} y={origin.y - val * SCALE + 3} fill={C.muted} fontSize="9" textAnchor="end">{val}</text>
          </g>
        ))}

        {/* Región f(x) < 0 (Sombreado rojo entre x=2 y x=3) */}
        <path
          d={`M ${origin.x + 2 * SCALE},${origin.y} L ${origin.x + 2.1 * SCALE},${origin.y - (2.1*2.1 - 5*2.1 + 6)*SCALE} 
              L ${origin.x + 2.2 * SCALE},${origin.y - (2.2*2.2 - 5*2.2 + 6)*SCALE}
              L ${origin.x + 2.3 * SCALE},${origin.y - (2.3*2.3 - 5*2.3 + 6)*SCALE}
              L ${origin.x + 2.4 * SCALE},${origin.y - (2.4*2.4 - 5*2.4 + 6)*SCALE}
              L ${origin.x + 2.5 * SCALE},${origin.y - (2.5*2.5 - 5*2.5 + 6)*SCALE}
              L ${origin.x + 2.6 * SCALE},${origin.y - (2.6*2.6 - 5*2.6 + 6)*SCALE}
              L ${origin.x + 2.7 * SCALE},${origin.y - (2.7*2.7 - 5*2.7 + 6)*SCALE}
              L ${origin.x + 2.8 * SCALE},${origin.y - (2.8*2.8 - 5*2.8 + 6)*SCALE}
              L ${origin.x + 2.9 * SCALE},${origin.y - (2.9*2.9 - 5*2.9 + 6)*SCALE}
              L ${origin.x + 3.0 * SCALE},${origin.y} Z`}
          fill={`${C.orange}20`}
        />

        {/* Curva de la función */}
        <path d={pathD} fill="none" stroke={C.text} strokeWidth="1.5" />

        {/* Intervalos de signos coloreados en la curva */}
        {/* Curva para x < 2: f(x) > 0 (Verde) */}
        <path
          d={`M ${origin.x - 0.5 * SCALE},${origin.y - ((-0.5)*(-0.5) - 5*(-0.5) + 6)*SCALE} 
              L ${origin.x + 0.0 * SCALE},${origin.y - (6)*SCALE} 
              L ${origin.x + 0.5 * SCALE},${origin.y - (3.75)*SCALE} 
              L ${origin.x + 1.0 * SCALE},${origin.y - (2)*SCALE} 
              L ${origin.x + 1.5 * SCALE},${origin.y - (0.75)*SCALE} 
              L ${origin.x + 2.0 * SCALE},${origin.y}`}
          fill="none"
          stroke={C.green}
          strokeWidth="3"
        />

        {/* Curva para 2 < x < 3: f(x) < 0 (Naranja) */}
        <path
          d={`M ${origin.x + 2.0 * SCALE},${origin.y} 
              L ${origin.x + 2.2 * SCALE},${origin.y - (2.2*2.2 - 5*2.2 + 6)*SCALE} 
              L ${origin.x + 2.5 * SCALE},${origin.y - (2.5*2.5 - 5*2.5 + 6)*SCALE} 
              L ${origin.x + 2.8 * SCALE},${origin.y - (2.8*2.8 - 5*2.8 + 6)*SCALE} 
              L ${origin.x + 3.0 * SCALE},${origin.y}`}
          fill="none"
          stroke={C.orange}
          strokeWidth="3"
        />

        {/* Curva para x > 3: f(x) > 0 (Verde) */}
        <path
          d={`M ${origin.x + 3.0 * SCALE},${origin.y} 
              L ${origin.x + 3.5 * SCALE},${origin.y - (3.5*3.5 - 5*3.5 + 6)*SCALE} 
              L ${origin.x + 4.0 * SCALE},${origin.y - (2)*SCALE} 
              L ${origin.x + 4.5 * SCALE},${origin.y - (3.75)*SCALE} 
              L ${origin.x + 5.0 * SCALE},${origin.y - (6)*SCALE} 
              L ${origin.x + 5.5 * SCALE},${origin.y - (5.5*5.5 - 5*5.5 + 6)*SCALE}`}
          fill="none"
          stroke={C.green}
          strokeWidth="3"
        />

        {/* Puntos críticos (raíces) */}
        <circle cx={origin.x + 2 * SCALE} cy={origin.y} r="4" fill={C.orange} stroke={C.bg} strokeWidth="1" />
        <circle cx={origin.x + 3 * SCALE} cy={origin.y} r="4" fill={C.orange} stroke={C.bg} strokeWidth="1" />

        {/* Etiquetas de signos */}
        <text x={origin.x + 1 * SCALE} y={origin.y - 20} fill={C.green} fontSize="10" fontWeight="bold" textAnchor="middle">
          f(x) &gt; 0
        </text>
        <text x={origin.x + 2.5 * SCALE} y={origin.y + 20} fill={C.orange} fontSize="10" fontWeight="bold" textAnchor="middle">
          f(x) &lt; 0
        </text>
        <text x={origin.x + 4 * SCALE} y={origin.y - 20} fill={C.green} fontSize="10" fontWeight="bold" textAnchor="middle">
          f(x) &gt; 0
        </text>

        {/* Leyenda del eje de intervalos en la recta real */}
        <g transform="translate(10, 235)">
          <rect x="0" y="0" width="10" height="10" fill={C.green} rx="2" />
          <text x="15" y="9" fill={C.text} fontSize="9">f(x) ≥ 0: (-∞, 2] ∪ [3, +∞)</text>

          <rect x="190" y="0" width="10" height="10" fill={C.orange} rx="2" />
          <text x="205" y="9" fill={C.text} fontSize="9">f(x) &lt; 0: (2, 3)</text>
        </g>
      </svg>
    </div>
  );
}
