import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoTangente() {
  const { C } = useContext(ThemeCtx);
  const [a, setA] = useState(1); // Slider for tangent point x = a, from -2 to 2

  // Mathematical function f(x) = x^2. Derivative f'(x) = 2x.
  const f = (x) => x * x;
  const df = (x) => 2 * x;

  // Coordinate mapping: width 360, height 360.
  // mathematically: x range [-3, 3], y range [-1, 5]. Center (180, 240).
  const scaleX = 60;
  const scaleY = 50;
  const cx = 180;
  const cy = 250;

  const toSvgX = (x) => cx + x * scaleX;
  const toSvgY = (y) => cy - y * scaleY;

  // Generate path for y = x^2
  const generateParabolaPath = () => {
    let path = "";
    for (let xm = -2.2; xm <= 2.2; xm += 0.05) {
      const ym = f(xm);
      const sx = toSvgX(xm);
      const sy = toSvgY(ym);
      if (path === "") path += `M ${sx} ${sy}`;
      else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  // Generate path for tangent line at x = a
  // Tangent line equation: y = df(a) * (x - a) + f(a)
  const generateTangentPath = () => {
    const m = df(a);
    const x1 = a - 1.5;
    const y1 = m * (x1 - a) + f(a);
    const x2 = a + 1.5;
    const y2 = m * (x2 - a) + f(a);

    return `M ${toSvgX(x1)} ${toSvgY(y1)} L ${toSvgX(x2)} ${toSvgY(y2)}`;
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
        🎯 Interpretación Geométrica: Recta Tangente y la Derivada
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Desplaza el slider para mover el punto \\(P(a, a^2)\\) y observar la pendiente de la recta tangente (\\(f'(a) = 2a\\))"}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[-3, -2, -1, 1, 2, 3].map((g) => (
            <g key={g}>
              <line x1={toSvgX(g)} y1="0" x2={toSvgX(g)} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
              <line x1="0" y1={toSvgY(g)} x2="360" y2={toSvgY(g)} stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
            </g>
          ))}
          {/* Axes */}
          <line x1="0" y1={toSvgY(0)} x2="360" y2={toSvgY(0)} stroke={C.text} strokeWidth="1.5" />
          <line x1={toSvgX(0)} y1="0" x2={toSvgX(0)} y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x="350" y={toSvgY(0) + 12} fill={C.text} fontSize="9">x</text>
          <text x={toSvgX(0) - 12} y="15" fill={C.text} fontSize="9">y</text>

          {/* Parabola Curve */}
          <path d={generateParabolaPath()} fill="none" stroke={C.green} strokeWidth="2.5" />

          {/* Tangent Line */}
          <path d={generateTangentPath()} fill="none" stroke={C.orange} strokeWidth="2" />

          {/* Point P(a, f(a)) */}
          <circle cx={toSvgX(a)} cy={toSvgY(f(a))} r="5" fill={C.accent} stroke={C.bg} strokeWidth="1.5" />

          {/* Dashed lines to axes */}
          <line x1={toSvgX(a)} y1={toSvgY(0)} x2={toSvgX(a)} y2={toSvgY(f(a))} stroke={C.muted} strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1={toSvgX(0)} y1={toSvgY(f(a))} x2={toSvgX(a)} y2={toSvgY(f(a))} stroke={C.muted} strokeWidth="0.75" strokeDasharray="3 3" />
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Punto de tangencia (a):</span>
              <span style={{ color: C.accent }}>a = {a.toFixed(1)}</span>
            </div>
            <input type="range" min="-2.0" max="2.0" step="0.1" value={a} onChange={(e) => setA(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>a = -2.0</span>
              <span>a = 2.0</span>
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
              📌 <span style={{ fontWeight: "bold" }}>Coordenadas y Pendiente:</span>
            </div>
            <div style={{ color: C.muted, marginTop: 4 }}>
              {"• Punto: \\(P("}{a.toFixed(1)}{", "}{f(a).toFixed(2)}{")\\)"}<br />
              {"• Pendiente (\\(m\\)): \\(f'(a) = 2("}{a.toFixed(1)}{") = "}{df(a).toFixed(1)}{"\\)"}<br />
              • Ecuación de la tangente:<br />
              <span style={{ fontFamily: "monospace", color: C.orange, fontSize: 12 }}>
                y - {f(a).toFixed(2)} = {df(a).toFixed(1)}(x - {a.toFixed(1)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
