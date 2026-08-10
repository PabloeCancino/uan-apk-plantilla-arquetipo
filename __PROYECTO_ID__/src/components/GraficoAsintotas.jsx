import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoAsintotas() {
  const { C } = useContext(ThemeCtx);
  const [a, setA] = useState(1); // Position of the vertical asymptote: f(x) = 1 / (x - a)

  // Math dimensions:
  // Width 360, Height 360. Center is (180, 180).
  // Scale factor: 30 pixels per unit.
  // Center is (0,0) mathematically.
  const scale = 30;
  const cx = 180;
  const cy = 180;

  const generatePath = () => {
    let path = "";
    let lastY = null;
    let isFirst = true;

    for (let x_math = -6; x_math <= 6; x_math += 0.05) {
      // Avoid division by zero exactly
      if (Math.abs(x_math - a) < 0.001) {
        lastY = null;
        isFirst = true;
        continue;
      }

      const y_math = 1 / (x_math - a);

      if (isNaN(y_math) || !isFinite(y_math)) {
        lastY = null;
        isFirst = true;
        continue;
      }

      // Rule check: if vertical jump is too large (greater than 8 units), break the path!
      if (lastY !== null && Math.abs(y_math - lastY) > 8) {
        lastY = y_math;
        isFirst = true; // Force M (Move) on the next point
        continue;
      }

      const svg_x = cx + x_math * scale;
      const svg_y = cy - y_math * scale;

      // Limit drawing boundaries to prevent huge lines rendering out of scope
      if (svg_y >= -100 && svg_y <= 460) {
        if (isFirst) {
          path += ` M ${svg_x} ${svg_y}`;
          isFirst = false;
        } else {
          path += ` L ${svg_x} ${svg_y}`;
        }
        lastY = y_math;
      } else {
        lastY = null;
        isFirst = true;
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
        {"📈 Asíntotas en Funciones Racionales: \\(f(x) = \\frac{1}{x - a}\\)"}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Modifica el valor de \\(a\\) para trasladar la asíntota vertical verticalmente"}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((grid) => (
            <g key={grid}>
              <line x1="0" y1={cy + grid * scale} x2="360" y2={cy + grid * scale} stroke={C.border} strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1={cx + grid * scale} y1="0" x2={cx + grid * scale} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="2 2" />
            </g>
          ))}
          {/* Axes */}
          <line x1="0" y1={cy} x2="360" y2={cy} stroke={C.text} strokeWidth="1.5" />
          <line x1={cx} y1="0" x2={cx} y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Curve path (validated, discontinuous) */}
          <path d={generatePath()} fill="none" stroke={C.green} strokeWidth="2.5" />

          {/* Horizontal Asymptote: y = 0 (dashed grey) */}
          <line x1="0" y1={cy} x2="360" y2={cy} stroke={C.muted} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />

          {/* CRITICAL RULE: Vertical Asymptote: x = a (dashed orange) */}
          <line x1={cx + a * scale} y1="0" x2={cx + a * scale} y2="360" stroke={C.orange} strokeWidth="2" strokeDasharray="5 4" />
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Asíntota Vertical (x = a):</span>
              <span style={{ color: C.orange }}>a = {a}</span>
            </div>
            <input type="range" min="-3" max="3" step="1" value={a} onChange={(e) => setA(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>x = -3</span>
              <span>x = 3</span>
            </div>
          </div>

          <div style={{
            background: C.surface2,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 11,
            color: C.text,
            lineHeight: 1.5
          }}>
            <div>
              💡 <span style={{ fontWeight: "bold" }}>Análisis de Límites:</span>
            </div>
            <div style={{ color: C.muted, marginTop: 4 }}>
              {"• \\(\\lim_{x \\to a^-} f(x) = -\\infty\\)"}<br />
              {"• \\(\\lim_{x \\to a^+} f(x) = +\\infty\\)"}<br />
              {"• \\(\\lim_{x \\to \\pm\\infty} f(x) = 0\\) (Asín. Horiz: \\(y=0\\))"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
