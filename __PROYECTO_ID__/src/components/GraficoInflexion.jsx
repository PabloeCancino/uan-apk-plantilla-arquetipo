import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoInflexion() {
  const { C } = useContext(ThemeCtx);
  const [xVal, setXVal] = useState(-1); // Position along the curve x, from -2 to 2

  // Function: f(x) = x^3 - 3x.
  // First derivative: f'(x) = 3x^2 - 3.
  // Second derivative: f''(x) = 6x.
  const f = (x) => Math.pow(x, 3) - 3 * x;
  const fDoublePrime = (x) => 6 * x;

  // Coordinate mapping: width 360, height 360.
  // Mathematically: x range [-2.5, 2.5], y range [-3, 3]. Center (180, 180).
  const scaleX = 70;
  const scaleY = 55;
  const cx = 180;
  const cy = 180;

  const toSvgX = (x) => cx + x * scaleX;
  const toSvgY = (y) => cy - y * scaleY;

  // Generate path for y = x^3 - 3x
  const generatePath = () => {
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

  const f2p = fDoublePrime(xVal);
  let concavidad = "inflexion";
  let colorConc = C.purple;

  if (Math.abs(xVal) < 0.05) {
    concavidad = "inflexion";
    colorConc = C.purple;
  } else if (f2p < 0) {
    concavidad = "abajo";
    colorConc = C.orange;
  } else {
    concavidad = "arriba";
    colorConc = C.green;
  }

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
        {"🔄 Concavidad y Punto de Inflexión: \\(f(x) = x^3 - 3x\\)"}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Desplaza el punto para ver el cambio de concavidad y cómo \\(f''(x)\\) se hace cero en el punto de inflexión \\((0,0)\\)"}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[-2, -1, 1, 2].map((g) => (
            <g key={g}>
              <line x1={toSvgX(g)} y1="0" x2={toSvgX(g)} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
              <line x1="0" y1={toSvgY(g)} x2="360" y2={toSvgY(g)} stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
            </g>
          ))}
          {/* Axes */}
          <line x1="0" y1={toSvgY(0)} x2="360" y2={toSvgY(0)} stroke={C.text} strokeWidth="1.5" />
          <line x1={toSvgX(0)} y1="0" x2={toSvgX(0)} y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Curve */}
          <path d={generatePath()} fill="none" stroke={C.green} strokeWidth="2.5" />

          {/* Highlight Point of Inflection at (0,0) */}
          <circle cx={toSvgX(0)} cy={toSvgY(0)} r="7" fill="none" stroke={C.purple} strokeWidth="2" strokeDasharray="2 2" />
          <text x={toSvgX(0) + 10} y={toSvgY(0) + 15} fill={C.purple} fontSize="9" fontWeight="bold">Inflexión (0,0)</text>

          {/* Active Point */}
          <circle cx={toSvgX(xVal)} cy={toSvgY(f(xVal))} r="5" fill={colorConc} stroke={C.bg} strokeWidth="1.5" />

          {/* Concavity shade highlighting on the active interval */}
          {concavidad === "abajo" && (
            <path d={`M ${toSvgX(-2)} ${toSvgY(f(-2))} L ${toSvgX(0)} ${toSvgY(f(0))}`} fill="none" stroke={C.orange} strokeWidth="4" opacity="0.3" />
          )}
          {concavidad === "arriba" && (
            <path d={`M ${toSvgX(0)} ${toSvgY(f(0))} L ${toSvgX(2)} ${toSvgY(f(2))}`} fill="none" stroke={C.green} strokeWidth="4" opacity="0.3" />
          )}
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Posición x:</span>
              <span style={{ color: colorConc, fontWeight: "bold" }}>x = {xVal.toFixed(1)}</span>
            </div>
            <input type="range" min="-1.8" max="1.8" step="0.1" value={xVal} onChange={(e) => setXVal(Number(e.target.value))} style={{ width: "100%", accentColor: colorConc }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>x = -1.8</span>
              <span>x = 1.8</span>
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
              🔍 <span style={{ fontWeight: "bold" }}>Estado de la Curva:</span>
            </div>
            <div style={{ color: C.muted, marginTop: 4 }}>
              {"• Segunda derivada: \\(f''("}{xVal.toFixed(1)}{") = "}{f2p.toFixed(1)}{"\\)"}<br />
              • Concavidad: {" "}
              {concavidad === "abajo" && (
                <span style={{ color: C.orange, fontWeight: "bold" }}>{"Cóncava hacia abajo (\\(f'' < 0\\))"}</span>
              )}
              {concavidad === "arriba" && (
                <span style={{ color: C.green, fontWeight: "bold" }}>{"Cóncava hacia arriba (\\(f'' > 0\\))"}</span>
              )}
              {concavidad === "inflexion" && (
                <span style={{ color: C.purple, fontWeight: "bold" }}>{"Punto de Inflexión (\\(f'' = 0\\))"}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
