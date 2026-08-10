import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoTraslaciones() {
  const { C } = useContext(ThemeCtx);
  const [h, setH] = useState(0); // Horizontal translation
  const [v, setV] = useState(0); // Vertical translation

  // Generate SVG path for y = (x - h)^2 + v
  // Mathematical coordinate systems mapping:
  // SVG size is 360x360. Center (180, 180) is (0,0) mathematically.
  // Scale factor is 30 pixels per unit.
  const plotParabola = () => {
    let path = "";
    for (let x_math = -6; x_math <= 6; x_math += 0.1) {
      const y_math = Math.pow(x_math - h, 2) + v;
      // Convert to SVG coordinates
      const svg_x = 180 + x_math * 30;
      const svg_y = 180 - y_math * 30; // Invert y since SVG y goes down

      // Limit values to avoid drawing outside the SVG box
      if (svg_y >= 0 && svg_y <= 360) {
        if (path === "") {
          path += `M ${svg_x} ${svg_y}`;
        } else {
          path += ` L ${svg_x} ${svg_y}`;
        }
      }
    }
    return path;
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 540,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      textAlign: "center"
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
        {"🔄 Traslaciones de Funciones: \\(f(x) = (x - h)^2 + v\\)"}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Modifica los parámetros \\(h\\) (horizontal) y \\(v\\) (vertical) para ver el desplazamiento"}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((grid) => (
            <g key={grid}>
              <line x1="0" y1={180 + grid * 30} x2="360" y2={180 + grid * 30} stroke={C.border} strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1={180 + grid * 30} y1="0" x2={180 + grid * 30} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="2 2" />
            </g>
          ))}
          {/* Axes */}
          <line x1="0" y1="180" x2="360" y2="180" stroke={C.text} strokeWidth="1.5" />
          <line x1="180" y1="0" x2="180" y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Reference function f(x) = x^2 (dashed grey) */}
          <path d={(() => {
            let path = "";
            for (let xm = -6; xm <= 6; xm += 0.1) {
              const ym = Math.pow(xm, 2);
              const sx = 180 + xm * 30;
              const sy = 180 - ym * 30;
              if (sy >= 0 && sy <= 360) {
                if (path === "") path += `M ${sx} ${sy}`;
                else path += ` L ${sx} ${sy}`;
              }
            }
            return path;
          })()} fill="none" stroke={C.muted} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

          {/* Shifted function path */}
          <path d={plotParabola()} fill="none" stroke={C.accent} strokeWidth="2.5" />

          {/* Vertex point */}
          <circle cx={180 + h * 30} cy={180 - v * 30} r="5" fill={C.orange} stroke={C.bg} strokeWidth="1.5" />
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Desplazamiento Horizontal (h):</span>
              <span style={{ color: C.accent }}>{h > 0 ? `+${h}` : h}</span>
            </div>
            <input type="range" min="-3" max="3" step="1" value={h} onChange={(e) => setH(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>← Izquierda (h &lt; 0)</span>
              <span>Derecha (h &gt; 0) →</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Desplazamiento Vertical (v):</span>
              <span style={{ color: C.accent }}>{v > 0 ? `+${v}` : v}</span>
            </div>
            <input type="range" min="-3" max="3" step="1" value={v} onChange={(e) => setV(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>↓ Abajo (v &lt; 0)</span>
              <span>Arriba (v &gt; 0) ↑</span>
            </div>
          </div>

          <div style={{
            background: C.surface2,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 11,
            color: C.muted,
            lineHeight: 1.4
          }}>
            <span style={{ fontWeight: "bold", color: C.text }}>Fórmula actual:</span><br />
            <span style={{ fontSize: 12, color: C.orange, fontFamily: "monospace" }}>
              y = (x {h >= 0 ? `- ${h}` : `+ ${-h}`})^2 {v >= 0 ? `+ ${v}` : `- ${-v}`}
            </span>
          </div>

          <button onClick={() => { setH(0); setV(0); }} style={{ padding: "6px 12px", border: `1px solid ${C.border}`, background: C.surface2, color: C.text, borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
            Restablecer (0,0)
          </button>
        </div>
      </div>
    </div>
  );
}
