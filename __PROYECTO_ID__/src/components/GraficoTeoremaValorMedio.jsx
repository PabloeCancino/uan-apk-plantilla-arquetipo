import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoTeoremaValorMedio() {
  const { C } = useContext(ThemeCtx);
  const [c, setC] = useState(2); // Position c on the interval [1, 5]

  // Function f(x) = -0.25x^2 + 1.5x + 1
  const f = (x) => -0.25 * x * x + 1.5 * x + 1;
  const df = (x) => -0.5 * x + 1.5;

  const a = 1;
  const b = 5;

  // Secant slope: m_sec = (f(b) - f(a)) / (b - a)
  const m_sec = (f(b) - f(a)) / (b - a); // should be 0 because f(1) = 2.25 and f(5) = 2.25

  // Coordinate mapping: width 360, height 360.
  // mathematically: x range [0, 6], y range [0, 5]. Center (origin) at (40, 300)
  const scaleX = 50;
  const scaleY = 50;
  const originX = 40;
  const originY = 300;

  const toSvgX = (x) => originX + x * scaleX;
  const toSvgY = (y) => originY - y * scaleY;

  // Generate path for f(x)
  const generateCurvePath = () => {
    let path = "";
    for (let xm = 0.5; xm <= 5.5; xm += 0.05) {
      const ym = f(xm);
      const sx = toSvgX(xm);
      const sy = toSvgY(ym);
      if (path === "") path += `M ${sx} ${sy}`;
      else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  // Generate path for tangent line at x = c
  const generateTangentPath = () => {
    const m_tang = df(c);
    const x1 = c - 1.2;
    const y1 = m_tang * (x1 - c) + f(c);
    const x2 = c + 1.2;
    const y2 = m_tang * (x2 - c) + f(c);

    return `M ${toSvgX(x1)} ${toSvgY(y1)} L ${toSvgX(x2)} ${toSvgY(y2)}`;
  };

  const isParallel = Math.abs(df(c) - m_sec) < 0.05; // c is close to 3

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
        📐 Teorema del Valor Medio (TVM) en Acción
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Mueve la posición de \\(c\\) hasta encontrar el valor donde la recta tangente (naranja) es exactamente paralela a la secante (azul)"}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((g) => (
            <g key={g}>
              <line x1="0" y1={originY - g * scaleY} x2="360" y2={originY - g * scaleY} stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
              <line x1={originX + g * scaleX} y1="0" x2={originX + g * scaleX} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
            </g>
          ))}
          {/* Axes */}
          <line x1="0" y1={originY} x2="360" y2={originY} stroke={C.text} strokeWidth="1.5" />
          <line x1={originX} y1="0" x2={originX} y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Curve */}
          <path d={generateCurvePath()} fill="none" stroke={C.green} strokeWidth="2.5" />

          {/* Secant line connecting (a, f(a)) and (b, f(b)) */}
          <line x1={toSvgX(a)} y1={toSvgY(f(a))} x2={toSvgX(b)} y2={toSvgY(f(b))} stroke={C.accent} strokeWidth="2" />
          {/* Endpoints A and B */}
          <circle cx={toSvgX(a)} cy={toSvgY(f(a))} r="4" fill={C.accent} />
          <circle cx={toSvgX(b)} cy={toSvgY(f(b))} r="4" fill={C.accent} />

          <text x={toSvgX(a) - 10} y={toSvgY(f(a)) + 12} fill={C.accent} fontSize="9" fontWeight="bold">A</text>
          <text x={toSvgX(b) + 8} y={toSvgY(f(b)) + 12} fill={C.accent} fontSize="9" fontWeight="bold">B</text>

          {/* Tangent line at c */}
          <path d={generateTangentPath()} fill="none" stroke={isParallel ? C.yellow : C.orange} strokeWidth={isParallel ? "3" : "2"} style={{ transition: "stroke 0.2s" }} />

          {/* Point C(c, f(c)) */}
          <circle cx={toSvgX(c)} cy={toSvgY(f(c))} r="5" fill={isParallel ? C.yellow : C.orange} stroke={C.bg} strokeWidth="1.5" />
          <line x1={toSvgX(c)} y1={originY} x2={toSvgX(c)} y2={toSvgY(f(c))} stroke={isParallel ? C.yellow : C.muted} strokeWidth="0.75" strokeDasharray="3 3" />
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Posición c:</span>
              <span style={{ color: isParallel ? C.yellow : C.orange, fontWeight: "bold" }}>c = {c.toFixed(2)}</span>
            </div>
            <input type="range" min="1.1" max="4.9" step="0.1" value={c} onChange={(e) => setC(Number(e.target.value))} style={{ width: "100%", accentColor: isParallel ? C.yellow : C.orange }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>c = 1.1</span>
              <span>c = 4.9</span>
            </div>
          </div>

          <div style={{
            background: C.surface2,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${isParallel ? C.yellow : C.border}`,
            fontSize: 11,
            color: C.text,
            lineHeight: 1.5,
            transition: "all 0.2s"
          }}>
            {isParallel ? (
              <div>
                🎉 <strong style={{ color: C.yellow }}>¡Paralelas encontradas!</strong><br />
                {"En \\(c = 3.00\\), la pendiente de la tangente es \\(f'(3) = 0\\), que es igual a la pendiente de la secante. El teorema se cumple."}
              </div>
            ) : (
              <div>
                • Pendiente secante: <span style={{ color: C.accent, fontWeight: "bold" }}>{m_sec.toFixed(2)}</span><br />
                • Pendiente tangente: <span style={{ color: C.orange, fontWeight: "bold" }}>{df(c).toFixed(2)}</span>
                <div style={{ color: C.muted, marginTop: 4, fontStyle: "italic" }}>
                  Sugerencia: Mueve el deslizador a c = 3.0
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
