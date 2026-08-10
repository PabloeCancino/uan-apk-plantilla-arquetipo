import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";

export function GraficoEcuaciones() {
  const { C } = useContext(ThemeCtx);

  // Escala uniforme de 25 píxeles por unidad para conservar la pendiente real (aspect ratio 1:1)
  const SCALE = 25;

  // Origen de la gráfica lineal
  const linOrigin = { x: 100, y: 150 };

  // Puntos para la ecuación lineal: y = 2x - 3
  const linPoints = [];
  for (let x = -0.5; x <= 3.5; x += 0.1) {
    const px = linOrigin.x + x * SCALE;
    const py = linOrigin.y - (2 * x - 3) * SCALE;
    linPoints.push(`${px},${py}`);
  }
  const linPathD = `M ${linPoints.join(" L ")}`;

  // Origen de la gráfica cuadrática
  const quadOrigin = { x: 380, y: 170 };

  // Puntos para la parábola cuadrática: y = x^2 - 5x + 6
  const quadPoints = [];
  for (let x = 0.5; x <= 4.5; x += 0.1) {
    const px = quadOrigin.x + x * SCALE;
    const py = quadOrigin.y - (x * x - 5 * x + 6) * SCALE;
    quadPoints.push(`${px},${py}`);
  }
  const quadPathD = `M ${quadPoints.join(" L ")}`;

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
      <svg viewBox="0 0 580 260" width="100%" height="100%" style={{ display: "block" }}>
        {/* Definición de la flecha de los ejes */}
        <defs>
          <marker id="axis-arrow-eq" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill={C.muted} />
          </marker>
        </defs>

        {/* ════════════════ GRÁFICA 1: ECUACIÓN LINEAL ════════════════ */}
        <g>
          {/* Título */}
          <text x="140" y="25" fill={C.text} fontSize="11" fontWeight="bold" textAnchor="middle">
            Ecuación Lineal: 2x - 3 = 0
          </text>

          {/* Cuadrícula de fondo (cuadrados perfectos de 25x25 px) */}
          {[-1, 0, 1, 2, 3].map(val => (
            <line key={val} x1={linOrigin.x + val * SCALE} y1="230" x2={linOrigin.x + val * SCALE} y2="55" stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          {[-3, -2, -1, 0, 1, 2, 3].map(val => (
            <line key={val} x1="55" y1={linOrigin.y - val * SCALE} x2="195" y2={linOrigin.y - val * SCALE} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}

          {/* Ejes */}
          <line x1="50" y1={linOrigin.y} x2="210" y2={linOrigin.y} stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-eq)" />
          <line x1={linOrigin.x} y1="235" x2={linOrigin.x} y2="45" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-eq)" />

          {/* Etiquetas Ejes */}
          <text x="215" y={linOrigin.y + 4} fill={C.muted} fontSize="10" fontWeight="bold">x</text>
          <text x={linOrigin.x - 4} y="38" fill={C.muted} fontSize="10" fontWeight="bold" textAnchor="end">y</text>

          {/* Ticks X */}
          {[-1, 1, 2, 3].map(val => (
            <g key={val}>
              <line x1={linOrigin.x + val * SCALE} y1={linOrigin.y - 3} x2={linOrigin.x + val * SCALE} y2={linOrigin.y + 3} stroke={C.muted} strokeWidth="1" />
              <text x={linOrigin.x + val * SCALE} y={linOrigin.y + 15} fill={C.muted} fontSize="9" textAnchor="middle">{val}</text>
            </g>
          ))}

          {/* Ticks Y */}
          {[-3, -2, -1, 1, 2, 3].map(val => (
            <g key={val}>
              <line x1={linOrigin.x - 3} y1={linOrigin.y - val * SCALE} x2={linOrigin.x + 3} y2={linOrigin.y - val * SCALE} stroke={C.muted} strokeWidth="1" />
              <text x={linOrigin.x - 7} y={linOrigin.y - val * SCALE + 3} fill={C.muted} fontSize="9" textAnchor="end">{val}</text>
            </g>
          ))}

          {/* Línea de la función */}
          <path d={linPathD} fill="none" stroke={C.accent} strokeWidth="2.5" />

          {/* Raíz (Intersección con X) */}
          <circle cx={linOrigin.x + 1.5 * SCALE} cy={linOrigin.y} r="4.5" fill={C.accent} stroke={C.bg} strokeWidth="15" strokeOpacity="0.2" />
          <circle cx={linOrigin.x + 1.5 * SCALE} cy={linOrigin.y} r="3" fill={C.accent} stroke={C.bg} strokeWidth="1" />
          <text x={linOrigin.x + 1.5 * SCALE} y={linOrigin.y - 8} fill={C.text} fontSize="9" fontWeight="bold" textAnchor="middle">
            x = 1.5
          </text>
        </g>

        {/* ════════════════ GRÁFICA 2: ECUACIÓN CUADRÁTICA ════════════════ */}
        <g>
          {/* Título */}
          <text x="445" y="25" fill={C.text} fontSize="11" fontWeight="bold" textAnchor="middle">
            Ecuación Cuadrática: x² - 5x + 6 = 0
          </text>

          {/* Cuadrícula de fondo (cuadrados perfectos de 25x25 px) */}
          {[-1, 0, 1, 2, 3, 4, 5].map(val => (
            <line key={val} x1={quadOrigin.x + val * SCALE} y1="230" x2={quadOrigin.x + val * SCALE} y2="55" stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          {[-2, -1, 0, 1, 2, 3, 4, 5].map(val => (
            <line key={val} x1="335" y1={quadOrigin.y - val * SCALE} x2="520" y2={quadOrigin.y - val * SCALE} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
          ))}

          {/* Ejes */}
          <line x1="330" y1={quadOrigin.y} x2="535" y2={quadOrigin.y} stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-eq)" />
          <line x1={quadOrigin.x} y1="235" x2={quadOrigin.x} y2="45" stroke={C.muted} strokeWidth="1.2" markerEnd="url(#axis-arrow-eq)" />

          {/* Etiquetas Ejes */}
          <text x="540" y={quadOrigin.y + 4} fill={C.muted} fontSize="10" fontWeight="bold">x</text>
          <text x={quadOrigin.x - 4} y="38" fill={C.muted} fontSize="10" fontWeight="bold" textAnchor="end">y</text>

          {/* Ticks X */}
          {[-1, 1, 2, 3, 4, 5].map(val => (
            <g key={val}>
              <line x1={quadOrigin.x + val * SCALE} y1={quadOrigin.y - 3} x2={quadOrigin.x + val * SCALE} y2={quadOrigin.y + 3} stroke={C.muted} strokeWidth="1" />
              <text x={quadOrigin.x + val * SCALE} y={quadOrigin.y + 15} fill={C.muted} fontSize="9" textAnchor="middle">{val}</text>
            </g>
          ))}

          {/* Ticks Y */}
          {[-2, -1, 1, 2, 3, 4].map(val => (
            <g key={val}>
              <line x1={quadOrigin.x - 3} y1={quadOrigin.y - val * SCALE} x2={quadOrigin.x + 3} y2={quadOrigin.y - val * SCALE} stroke={C.muted} strokeWidth="1" />
              <text x={quadOrigin.x - 7} y={quadOrigin.y - val * SCALE + 3} fill={C.muted} fontSize="9" textAnchor="end">{val}</text>
            </g>
          ))}

          {/* Curva de la parábola */}
          <path d={quadPathD} fill="none" stroke={C.orange} strokeWidth="2.5" />

          {/* Raíces (Intersecciones con X) */}
          <circle cx={quadOrigin.x + 2 * SCALE} cy={quadOrigin.y} r="4.5" fill={C.orange} stroke={C.bg} strokeWidth="15" strokeOpacity="0.2" />
          <circle cx={quadOrigin.x + 2 * SCALE} cy={quadOrigin.y} r="3" fill={C.orange} stroke={C.bg} strokeWidth="1" />
          
          <circle cx={quadOrigin.x + 3 * SCALE} cy={quadOrigin.y} r="4.5" fill={C.orange} stroke={C.bg} strokeWidth="15" strokeOpacity="0.2" />
          <circle cx={quadOrigin.x + 3 * SCALE} cy={quadOrigin.y} r="3" fill={C.orange} stroke={C.bg} strokeWidth="1" />
          
          <text x={quadOrigin.x + 2 * SCALE} y={quadOrigin.y - 8} fill={C.text} fontSize="9" fontWeight="bold" textAnchor="middle">
            x = 2
          </text>
          <text x={quadOrigin.x + 3 * SCALE} y={quadOrigin.y - 8} fill={C.text} fontSize="9" fontWeight="bold" textAnchor="middle">
            x = 3
          </text>
        </g>
      </svg>
    </div>
  );
}
