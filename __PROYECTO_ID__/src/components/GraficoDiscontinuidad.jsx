import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { renderTextWithMath } from "./Formula";

export default function GraficoDiscontinuidad() {
  const { C } = useContext(ThemeCtx);
  const [tipo, setTipo] = useState("evitable"); // evitable, salto, esencial

  // Mapping math coordinates: width 360, height 360.
  // Mathematically: x range [-4, 4], y range [-4, 4]. Center at (180, 180).
  const scale = 36;
  const cx = 180;
  const cy = 180;

  const toSvgX = (x) => cx + x * scale;
  const toSvgY = (y) => cy - y * scale;

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
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
        ⚡ Clasificación de Discontinuidades en Funciones
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {["evitable", "salto", "esencial"].map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: `1px solid ${tipo === t ? C.accent : C.border}`,
              background: tipo === t ? C.accentSoft : "transparent",
              color: tipo === t ? C.accent : C.muted,
              fontSize: 11,
              fontWeight: "bold",
              cursor: "pointer",
              textTransform: "capitalize"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {/* SVG Plotter */}
        <svg viewBox="0 0 360 360" width="240" height="240" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
          {/* Grid lines */}
          {[-4, -3, -2, -1, 1, 2, 3, 4].map((grid) => (
            <g key={grid}>
              <line x1="0" y1={cy + grid * scale} x2="360" y2={cy + grid * scale} stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
              <line x1={cx + grid * scale} y1="0" x2={cx + grid * scale} y2="360" stroke={C.border} strokeWidth="0.5" strokeDasharray="1 3" />
            </g>
          ))}
          {/* Axes */}
          <line x1="0" y1={cy} x2="360" y2={cy} stroke={C.text} strokeWidth="1.5" />
          <line x1={cx} y1="0" x2={cx} y2="360" stroke={C.text} strokeWidth="1.5" />

          {/* Render charts dynamically based on state */}
          {tipo === "evitable" && (
            <g>
              {/* Line y = 0.5x + 1 with hole at x=2, y=2 */}
              <line x1={toSvgX(-4)} y1={toSvgY(-1)} x2={toSvgX(1.9)} y2={toSvgY(1.95)} stroke={C.green} strokeWidth="2.5" />
              <line x1={toSvgX(2.1)} y1={toSvgY(2.05)} x2={toSvgX(4)} y2={toSvgY(3)} stroke={C.green} strokeWidth="2.5" />

              {/* Hole (removable discontinuity) */}
              <circle cx={toSvgX(2)} cy={toSvgY(2)} r="5" fill={C.bg} stroke={C.red} strokeWidth="2" />
              {/* Separated point, e.g. f(2) = 0.5 */}
              <circle cx={toSvgX(2)} cy={toSvgY(0.5)} r="4" fill={C.green} />

              <text x={toSvgX(2.2)} y={toSvgY(2.2)} fill={C.red} fontSize="10" fontWeight="bold">Agujero</text>
            </g>
          )}

          {tipo === "salto" && (
            <g>
              {/* Piecewise: y = x (for x < 1) and y = x - 2 (for x >= 1) */}
              {/* x < 1: y = x */}
              <line x1={toSvgX(-4)} y1={toSvgY(-4)} x2={toSvgX(0.95)} y2={toSvgY(0.95)} stroke={C.green} strokeWidth="2.5" />
              <circle cx={toSvgX(1)} cy={toSvgY(1)} r="4.5" fill={C.bg} stroke={C.green} strokeWidth="2" />

              {/* x >= 1: y = -1 */}
              <line x1={toSvgX(1)} y1={toSvgY(-1)} x2={toSvgX(4)} y2={toSvgY(-1)} stroke={C.green} strokeWidth="2.5" />
              <circle cx={toSvgX(1)} cy={toSvgY(-1)} r="4.5" fill={C.green} />

              {/* Vertical Jump indicator */}
              <line x1={toSvgX(1)} y1={toSvgY(1)} x2={toSvgX(1)} y2={toSvgY(-1)} stroke={C.red} strokeWidth="1" strokeDasharray="3 3" />
              <text x={toSvgX(1.3)} y={toSvgY(0)} fill={C.red} fontSize="10" fontWeight="bold">Salto</text>
            </g>
          )}

          {tipo === "esencial" && (
            <g>
              {/* Infinite discontinuity: f(x) = 1/(x-1)^2 */}
              {/* Asymptote x = 1 (dashed orange) */}
              <line x1={toSvgX(1)} y1="0" x2={toSvgX(1)} y2="360" stroke={C.orange} strokeWidth="1.5" strokeDasharray="5 3" />

              {/* Curve left part */}
              <path d={(() => {
                let path = "";
                let first = true;
                for (let xm = -4; xm < 0.8; xm += 0.05) {
                  const ym = 1 / Math.pow(xm - 1, 2);
                  const sx = toSvgX(xm);
                  const sy = toSvgY(ym);
                  if (sy >= 0 && sy <= 360) {
                    if (first) { path += `M ${sx} ${sy}`; first = false; }
                    else path += ` L ${sx} ${sy}`;
                  }
                }
                return path;
              })()} fill="none" stroke={C.green} strokeWidth="2.5" />

              {/* Curve right part */}
              <path d={(() => {
                let path = "";
                let first = true;
                for (let xm = 1.2; xm <= 4; xm += 0.05) {
                  const ym = 1 / Math.pow(xm - 1, 2);
                  const sx = toSvgX(xm);
                  const sy = toSvgY(ym);
                  if (sy >= 0 && sy <= 360) {
                    if (first) { path += `M ${sx} ${sy}`; first = false; }
                    else path += ` L ${sx} ${sy}`;
                  }
                }
                return path;
              })()} fill="none" stroke={C.green} strokeWidth="2.5" />

              <text x={toSvgX(1.2)} y={toSvgY(3)} fill={C.orange} fontSize="9" fontWeight="bold">Asíntota vertical</text>
            </g>
          )}
        </svg>

        {/* Info panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div style={{
            background: C.surface2,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 11,
            color: C.text,
            lineHeight: 1.5
          }}>
            {tipo === "evitable" && (
              <div>
                <strong style={{ color: C.accent }}>Discontinuidad Evitable:</strong><br />
                <span style={{ color: C.muted }}>
                  {renderTextWithMath("El límite \\(\\lim_{x \\to 2} f(x) = 2\\) existe, pero la función está definida en otro punto \\(f(2) = 0.5\\) o no está definida. Se puede \"reparar\" redefiniendo \\(f(2) = 2\\).")}
                </span>
              </div>
            )}
            {tipo === "salto" && (
              <div>
                <strong style={{ color: C.accent }}>Discontinuidad de Salto:</strong><br />
                <span style={{ color: C.muted }}>
                  {renderTextWithMath("Los límites laterales son finitos pero distintos:")}<br />
                  {"• "}{renderTextWithMath("\\(\\lim_{x \\to 1^-} f(x) = 1\\)")}<br />
                  {"• "}{renderTextWithMath("\\(\\lim_{x \\to 1^+} f(x) = -1\\)")}<br />
                  {renderTextWithMath("El límite bilateral no existe.")}
                </span>
              </div>
            )}
            {tipo === "esencial" && (
              <div>
                <strong style={{ color: C.accent }}>Discontinuidad Esencial (Infinita):</strong><br />
                <span style={{ color: C.muted }}>
                  {renderTextWithMath("Al menos uno de los límites laterales tiende al infinito (\\(\\pm\\infty\\)):")}<br />
                  {"• "}{renderTextWithMath("\\(\\lim_{x \\to 1} f(x) = +\\infty\\).")}<br />
                  {renderTextWithMath("Se caracteriza por la presencia de una asíntota vertical.")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
