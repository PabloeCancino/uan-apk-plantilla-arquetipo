import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoLimiteEpsilonDelta() {
  const { C } = useContext(ThemeCtx);
  const [epsilon, setEpsilon] = useState(0.6); // Range from 0.2 to 1.2

  // Function: f(x) = x + 1. Let's study limit at a = 2, L = 3.
  const a = 2;
  const L = 3;

  // Since f(x) = x + 1, |f(x) - L| = |x + 1 - 3| = |x - 2| < epsilon.
  // This means delta = epsilon.
  const delta = epsilon;

  // Coordinate mapping: width 360, height 360.
  // Center is (180, 180). Mathematically (0,0) is at (60, 300) to show first quadrant.
  // Let's place mathematical (0,0) at (80, 280).
  // Scale factor: 50 pixels per unit.
  const scale = 50;
  const originX = 80;
  const originY = 280;

  const toSvgX = (x) => originX + x * scale;
  const toSvgY = (y) => originY - y * scale;

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
        {"🔍 Definición Formal del Límite: \\(\\varepsilon\\) y \\(\\delta\\)"}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Ajusta \\(\\varepsilon\\) para ver cómo se restringe el entorno de \\(\\delta\\) tal que 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon"}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((g) => (
            <g key={g}>
              <line x1="0" y1={originY - g * scale} x2="360" y2={originY - g * scale} stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
              <line x1={originX + g * scale} y1="0" x2={originX + g * scale} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
            </g>
          ))}

          {/* Axes */}
          <line x1="0" y1={originY} x2="360" y2={originY} stroke={C.text} strokeWidth="1.5" />
          <line x1={originX} y1="0" x2={originX} y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x="350" y={originY + 15} fill={C.text} fontSize="10">x</text>
          <text x={originX - 15} y="15" fill={C.text} fontSize="10">y</text>

          {/* Epsilon band (y-axis range L - eps to L + eps) */}
          <rect x={originX} y={toSvgY(L + epsilon)} width={360 - originX} height={epsilon * 2 * scale} fill={`${C.orange}1a`} />
          <line x1={originX} y1={toSvgY(L + epsilon)} x2="360" y2={toSvgY(L + epsilon)} stroke={C.orange} strokeWidth="1" strokeDasharray="3 3" />
          <line x1={originX} y1={toSvgY(L - epsilon)} x2="360" y2={toSvgY(L - epsilon)} stroke={C.orange} strokeWidth="1" strokeDasharray="3 3" />

          {/* Delta band (x-axis range a - delta to a + delta) */}
          <rect x={toSvgX(a - delta)} y="0" width={delta * 2 * scale} height={originY} fill={`${C.accent}12`} />
          <line x1={toSvgX(a - delta)} y1="0" x2={toSvgX(a - delta)} y2={originY} stroke={C.accent} strokeWidth="1" strokeDasharray="3 3" />
          <line x1={toSvgX(a + delta)} y1="0" x2={toSvgX(a + delta)} y2={originY} stroke={C.accent} strokeWidth="1" strokeDasharray="3 3" />

          {/* Function curve: f(x) = x + 1 */}
          <line x1={toSvgX(0)} y1={toSvgY(1)} x2={toSvgX(5)} y2={toSvgY(6)} stroke={C.green} strokeWidth="2.5" />

          {/* Target point (a, L) */}
          <line x1={toSvgX(a)} y1="0" x2={toSvgX(a)} y2={toSvgY(L)} stroke={C.muted} strokeWidth="1" strokeDasharray="2 2" />
          <line x1="0" y1={toSvgY(L)} x2={toSvgX(a)} y2={toSvgY(L)} stroke={C.muted} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx={toSvgX(a)} cy={toSvgY(L)} r="5" fill={C.purple} />

          {/* Entornos markers labels */}
          <text x={toSvgX(a)} y={originY + 14} fill={C.text} fontSize="9" textAnchor="middle" fontWeight="bold">a=2</text>
          <text x={originX - 14} y={toSvgY(L) + 4} fill={C.text} fontSize="9" textAnchor="end" fontWeight="bold">L=3</text>
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>{"Margen de error (\\(\\varepsilon\\)):"}</span>
              <span style={{ color: C.orange }}>{"\\(\\varepsilon\\) = "}{epsilon.toFixed(2)}</span>
            </div>
            <input type="range" min="0.2" max="1.2" step="0.1" value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>Estricto (0.2)</span>
              <span>Amplio (1.2)</span>
            </div>
          </div>

          <div style={{
            background: C.surface2,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 11,
            color: C.text,
            lineHeight: 1.4
          }}>
            <div style={{ fontWeight: "bold", color: C.accent }}>Entorno de tolerancia:</div>
            <div style={{ color: C.muted, marginTop: 4 }}>
              {"Para \\(\\varepsilon = "}{epsilon.toFixed(2)}{"\\), elegimos \\(\\delta = "}{delta.toFixed(2)}{"\\)."}<br />
              {"Si \\(x \\in ("}{(a - delta).toFixed(2)}{", "}{(a + delta).toFixed(2)}{")\\), entonces:"}<br />
              {"\\(f(x) \\in ("}{(L - epsilon).toFixed(2)}{", "}{(L + epsilon).toFixed(2)}{")\\)."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
