import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";

export function GraficoProporciones() {
  const { C } = useContext(ThemeCtx);

  // Generar puntos para la proporción directa: y = 2x
  const directPoints = [];
  for (let x = 0; x <= 5; x += 0.1) {
    const px = 60 + x * 35; // 60 a 235
    const py = 220 - (2 * x) * 16; // 220 a 60
    directPoints.push(`${px},${py}`);
  }
  const directPathD = `M ${directPoints.join(" L ")}`;

  // Generar puntos para la proporción inversa: y = 6/x
  const inversePoints = [];
  for (let x = 0.6; x <= 6; x += 0.1) {
    const px = 360 + x * 30; // 360 a 540
    const py = 220 - (6 / x) * 26; // 220 a 64
    inversePoints.push(`${px},${py}`);
  }
  const inversePathD = `M ${inversePoints.join(" L ")}`;

  return (
    <div style={{
      width: "100%",
      maxWidth: 580,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
    }}>
      <svg viewBox="0 0 580 270" width="100%" height="100%" style={{ display: "block" }}>
        {/* Definición de la flecha de los ejes */}
        <defs>
          <marker id="axis-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill={C.muted} />
          </marker>
        </defs>

        {/* ════════════════ GRÁFICA 1: PROPORCIÓN DIRECTA ════════════════ */}
        <g>
          {/* Título */}
          <text x="140" y="25" fill={C.text} fontSize="11" fontWeight="bold" textAnchor="middle">
            Proporción Directa: y = 2x
          </text>

          {/* Cuadrícula de fondo */}
          {[1, 2, 3, 4, 5].map(val => (
            <line key={val} x1={60 + val * 35} y1="220" x2={60 + val * 35} y2="60" stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          {[2, 4, 6, 8, 10].map(val => (
            <line key={val} x1="60" y1={220 - (val) * 16} x2="235" y2={220 - (val) * 16} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}

          {/* Ejes */}
          <line x1="60" y1="220" x2="250" y2="220" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow)" />
          <line x1="60" y1="220" x2="60" y2="45" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow)" />

          {/* Etiquetas Ejes */}
          <text x="255" y="224" fill={C.muted} fontSize="10" fontWeight="bold">x</text>
          <text x="56" y="38" fill={C.muted} fontSize="10" fontWeight="bold">y</text>

          {/* Ticks X */}
          {[1, 2, 3, 4, 5].map(val => (
            <g key={val}>
              <line x1={60 + val * 35} y1="220" x2={60 + val * 35} y2="224" stroke={C.muted} strokeWidth="1" />
              <text x={60 + val * 35} y="235" fill={C.muted} fontSize="9" textAnchor="middle">{val}</text>
            </g>
          ))}

          {/* Ticks Y */}
          {[2, 4, 6, 8, 10].map(val => (
            <g key={val}>
              <line x1="56" y1={220 - val * 16} x2="60" y2={220 - val * 16} stroke={C.muted} strokeWidth="1" />
              <text x="50" y={220 - val * 16 + 3} fill={C.muted} fontSize="9" textAnchor="end">{val}</text>
            </g>
          ))}

          {/* Línea de la función */}
          <path d={directPathD} fill="none" stroke={C.accent} strokeWidth="2.5" />

          {/* Puntos destacados */}
          <circle cx={60 + 2 * 35} cy={220 - 4 * 16} r="3.5" fill={C.accent} />
          <circle cx={60 + 4 * 35} cy={220 - 8 * 16} r="3.5" fill={C.accent} />
          <text x={60 + 2 * 35 + 5} y={220 - 4 * 16 - 5} fill={C.text} fontSize="8" fontWeight="600">(2, 4)</text>
          <text x={60 + 4 * 35 - 5} y={220 - 8 * 16 - 8} fill={C.text} fontSize="8" fontWeight="600">(4, 8)</text>
        </g>

        {/* ════════════════ GRÁFICA 2: PROPORCIÓN INVERSA ════════════════ */}
        <g>
          {/* Título */}
          <text x="440" y="25" fill={C.text} fontSize="11" fontWeight="bold" textAnchor="middle">
            Proporción Inversa: y = 6/x
          </text>

          {/* Cuadrícula de fondo */}
          {[1, 2, 3, 4, 5, 6].map(val => (
            <line key={val} x1={360 + val * 30} y1="220" x2={360 + val * 30} y2="60" stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          {[1, 2, 3, 4, 5, 6].map(val => (
            <line key={val} x1="360" y1={220 - val * 26} x2="540" y2={220 - val * 26} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}

          {/* Ejes */}
          <line x1="360" y1="220" x2="555" y2="220" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow)" />
          <line x1="360" y1="220" x2="360" y2="45" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow)" />

          {/* Etiquetas Ejes */}
          <text x="560" y="224" fill={C.muted} fontSize="10" fontWeight="bold">x</text>
          <text x="356" y="38" fill={C.muted} fontSize="10" fontWeight="bold">y</text>

          {/* Ticks X */}
          {[1, 2, 3, 4, 5, 6].map(val => (
            <g key={val}>
              <line x1={360 + val * 30} y1="220" x2={360 + val * 30} y2="224" stroke={C.muted} strokeWidth="1" />
              <text x={360 + val * 30} y="235" fill={C.muted} fontSize="9" textAnchor="middle">{val}</text>
            </g>
          ))}

          {/* Ticks Y */}
          {[1, 2, 3, 4, 5, 6].map(val => (
            <g key={val}>
              <line x1="356" y1={220 - val * 26} x2="360" y2={220 - val * 26} stroke={C.muted} strokeWidth="1" />
              <text x="350" y={220 - val * 26 + 3} fill={C.muted} fontSize="9" textAnchor="end">{val}</text>
            </g>
          ))}

          {/* Curva de la función */}
          <path d={inversePathD} fill="none" stroke={C.orange} strokeWidth="2.5" />

          {/* Puntos destacados */}
          <circle cx={360 + 2 * 30} cy={220 - 3 * 26} r="3.5" fill={C.orange} />
          <circle cx={360 + 3 * 30} cy={220 - 2 * 26} r="3.5" fill={C.orange} />
          <text x={360 + 2 * 30 + 5} y={220 - 3 * 26 - 5} fill={C.text} fontSize="8" fontWeight="600">(2, 3)</text>
          <text x={360 + 3 * 30 + 5} y={220 - 2 * 26 - 5} fill={C.text} fontSize="8" fontWeight="600">(3, 2)</text>
        </g>
      </svg>
    </div>
  );
}
