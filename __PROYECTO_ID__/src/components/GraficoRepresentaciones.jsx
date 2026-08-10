import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { InlineFormula } from "./Formula";

export function GraficoRepresentaciones() {
  const { C } = useContext(ThemeCtx);
  const [tab, setTab] = useState("lineal"); // "lineal" o "cuadratica"

  const cardStyle = {
    background: `${C.border}22`,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
  };

  const btnStyle = (active) => ({
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${C.accent}`,
    background: active ? C.accent : "transparent",
    color: active ? C.bg : C.accent,
    fontWeight: "bold",
    fontSize: 11,
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s ease"
  });

  return (
    <div style={{
      width: "100%",
      maxWidth: 580,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
      {/* Título */}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
        Cinco Representaciones de Funciones
      </div>

      {/* Selectores de Tab */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setTab("lineal")} style={btnStyle(tab === "lineal")}>
          Función lineal: f(x) = 2x - 1
        </button>
        <button onClick={() => setTab("cuadratica")} style={btnStyle(tab === "cuadratica")}>
          Función cuadrática: f(x) = x²
        </button>
      </div>

      {tab === "lineal" ? (
        /* ==================== TAB LINEAL ==================== */
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 1. VERBAL */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase" }}>
              1. Verbal
            </div>
            <div style={{ fontSize: 11, color: C.text, textAlign: "center", lineHeight: 1.4 }}>
              "A cada número de entrada del conjunto de partida se le asigna su doble disminuido en una unidad."
            </div>
          </div>

          {/* 2. ALGEBRAICA */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase" }}>
              2. Algebraica
            </div>
            <div style={{ fontSize: 11, color: C.text, textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
              <div><InlineFormula latex="f(x) = 2x - 1" /></div>
              <div style={{ fontSize: 10, color: C.muted }}>con dominio restringido:</div>
              <div><InlineFormula latex="x \in \{1, 2, 3\}" /></div>
            </div>
          </div>

          {/* 3. TABULAR */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase" }}>
              3. Tabular
            </div>
            <table style={{ borderCollapse: "collapse", fontSize: 11, width: "100%", maxWidth: 100, textAlign: "center" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${C.border}` }}>
                  <th style={{ padding: 2, color: C.muted }}><InlineFormula latex="x" /></th>
                  <th style={{ padding: 2, color: C.muted }}><InlineFormula latex="f(x)" /></th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}66` }}>
                  <td style={{ padding: 3, fontWeight: "bold" }}>1</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>1</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}66` }}>
                  <td style={{ padding: 3, fontWeight: "bold" }}>2</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>3</td>
                </tr>
                <tr>
                  <td style={{ padding: 3, fontWeight: "bold" }}>3</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. GRÁFICA */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              4. Gráfica
            </div>
            <svg viewBox="0 0 120 120" width="160px" height="160px" style={{ display: "block" }}>
              {/* Ejes */}
              <line x1="15" y1="105" x2="115" y2="105" stroke={C.muted} strokeWidth="1" />
              <line x1="20" y1="10" x2="20" y2="110" stroke={C.muted} strokeWidth="1" />

              {/* Ticks X */}
              {[1, 2, 3].map(val => (
                <g key={val}>
                  <line x1={20 + val * 25} y1="102" x2={20 + val * 25} y2="108" stroke={C.muted} strokeWidth="0.8" />
                  <text x={20 + val * 25} y="117" fill={C.muted} fontSize="8" textAnchor="middle">{val}</text>
                </g>
              ))}

              {/* Ticks Y */}
              {[1, 2, 3, 4, 5].map(val => (
                <g key={val}>
                  <line x1="17" y1={105 - val * 16} x2="23" y2={105 - val * 16} stroke={C.muted} strokeWidth="0.8" />
                  <text x="11" y={105 - val * 16 + 3} fill={C.muted} fontSize="7" textAnchor="end">{val}</text>
                </g>
              ))}

              {/* Línea discontinua que une los puntos */}
              <line x1={20 + 1 * 25} y1={105 - 1 * 16} x2={20 + 3 * 25} y2={105 - 5 * 16} stroke={C.accent} strokeWidth="1" strokeDasharray="3 3" />

              {/* Puntos de coordenadas (1,1), (2,3), (3,5) */}
              <circle cx={20 + 1 * 25} cy={105 - 1 * 16} r="3" fill={C.orange} />
              <circle cx={20 + 2 * 25} cy={105 - 3 * 16} r="3" fill={C.orange} />
              <circle cx={20 + 3 * 25} cy={105 - 5 * 16} r="3" fill={C.orange} />

              {/* Etiquetas de los puntos */}
              <text x={20 + 1 * 25 + 4} y={105 - 1 * 16 + 3} fill={C.text} fontSize="7">(1,1)</text>
              <text x={20 + 2 * 25 + 4} y={105 - 3 * 16 + 3} fill={C.text} fontSize="7">(2,3)</text>
              <text x={20 + 3 * 25 + 4} y={105 - 5 * 16 + 3} fill={C.text} fontSize="7">(3,5)</text>
            </svg>
          </div>

          {/* 5. SAGITAL */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              5. Sagital
            </div>
            <svg viewBox="0 0 130 110" width="160px" height="135px" style={{ display: "block" }}>
              {/* Óvalo Dominio A */}
              <ellipse cx="28" cy="55" rx="16" ry="40" fill="none" stroke={C.muted} strokeWidth="1" />
              <text x="28" y="10" fill={C.text} fontSize="8" fontWeight="bold" textAnchor="middle">Dom(f)</text>

              {/* Óvalo Codominio B */}
              <ellipse cx="102" cy="55" rx="16" ry="45" fill="none" stroke={C.muted} strokeWidth="1" />
              <text x="102" y="7" fill={C.text} fontSize="8" fontWeight="bold" textAnchor="middle">Cod(f)</text>

              {/* Elementos Dominio A */}
              <text x="28" y="33" fill={C.text} fontSize="9" textAnchor="middle">1</text>
              <text x="28" y="58" fill={C.text} fontSize="9" textAnchor="middle">2</text>
              <text x="28" y="83" fill={C.text} fontSize="9" textAnchor="middle">3</text>

              {/* Elementos Codominio B */}
              <text x="102" y="27" fill={C.text} fontSize="9" textAnchor="middle">1</text>
              <text x="102" y="47" fill={C.text} fontSize="9" textAnchor="middle">3</text>
              <text x="102" y="67" fill={C.text} fontSize="9" textAnchor="middle">5</text>
              <text x="102" y="87" fill={C.text} fontSize="9" textAnchor="middle" style={{ color: C.muted, opacity: 0.5 }}>7</text>

              {/* Flechas directas de mapeo */}
              <defs>
                <marker id="sag-arrow-lin" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 2 L 7 5 L 0 8 z" fill={C.orange} />
                </marker>
              </defs>

              {/* Flecha 1 -> 1 */}
              <path d="M 38 30 C 58 27, 72 26, 92 25" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-lin)" />
              {/* Flecha 2 -> 3 */}
              <path d="M 38 55 C 58 52, 72 50, 92 45" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-lin)" />
              {/* Flecha 3 -> 5 */}
              <path d="M 38 80 C 58 77, 72 73, 92 65" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-lin)" />
            </svg>
          </div>
        </div>
      ) : (
        /* ==================== TAB CUADRÁTICA ==================== */
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 1. VERBAL */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase" }}>
              1. Verbal
            </div>
            <div style={{ fontSize: 11, color: C.text, textAlign: "center", lineHeight: 1.4 }}>
              "A cada número de entrada del conjunto de partida se le asigna su cuadrado (multiplicar el número por sí mismo)."
            </div>
          </div>

          {/* 2. ALGEBRAICA */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase" }}>
              2. Algebraica
            </div>
            <div style={{ fontSize: 11, color: C.text, textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
              <div><InlineFormula latex="f(x) = x^2" /></div>
              <div style={{ fontSize: 10, color: C.muted }}>con dominio restringido:</div>
              <div><InlineFormula latex="x \in \{-2, -1, 0, 1, 2\}" /></div>
            </div>
          </div>

          {/* 3. TABULAR */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase" }}>
              3. Tabular
            </div>
            <table style={{ borderCollapse: "collapse", fontSize: 11, width: "100%", maxWidth: 120, textAlign: "center" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${C.border}` }}>
                  <th style={{ padding: 2, color: C.muted }}><InlineFormula latex="x" /></th>
                  <th style={{ padding: 2, color: C.muted }}><InlineFormula latex="f(x)" /></th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}66` }}>
                  <td style={{ padding: 3, fontWeight: "bold" }}>-2</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>4</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}66` }}>
                  <td style={{ padding: 3, fontWeight: "bold" }}>-1</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>1</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}66` }}>
                  <td style={{ padding: 3, fontWeight: "bold" }}>0</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>0</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}66` }}>
                  <td style={{ padding: 3, fontWeight: "bold" }}>1</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>1</td>
                </tr>
                <tr>
                  <td style={{ padding: 3, fontWeight: "bold" }}>2</td>
                  <td style={{ padding: 3, color: C.orange, fontWeight: "bold" }}>4</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. GRÁFICA */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              4. Gráfica
            </div>
            <svg viewBox="0 0 120 120" width="160px" height="160px" style={{ display: "block" }}>
              {/* Ejes */}
              <line x1="15" y1="95" x2="105" y2="95" stroke={C.muted} strokeWidth="1" />
              <line x1="60" y1="10" x2="60" y2="105" stroke={C.muted} strokeWidth="1" />

              {/* Ticks X */}
              {[-2, -1, 1, 2].map(val => (
                <g key={val}>
                  <line x1={60 + val * 18} y1="92" x2={60 + val * 18} y2="98" stroke={C.muted} strokeWidth="0.8" />
                  <text x={60 + val * 18} y="107" fill={C.muted} fontSize="8" textAnchor="middle">{val}</text>
                </g>
              ))}

              {/* Ticks Y */}
              {[1, 2, 3, 4].map(val => (
                <g key={val}>
                  <line x1="57" y1={95 - val * 18} x2="63" y2={95 - val * 18} stroke={C.muted} strokeWidth="0.8" />
                  <text x="52" y={95 - val * 18 + 3} fill={C.muted} fontSize="7" textAnchor="end">{val}</text>
                </g>
              ))}

              {/* Curva parábola discontinua */}
              <path d="M 24 23 Q 60 167 96 23" fill="none" stroke={C.accent} strokeWidth="1.2" strokeDasharray="3 3" />

              {/* Puntos (x, y) */}
              <circle cx="24" cy="23" r="3" fill={C.orange} />
              <circle cx="42" cy="77" r="3" fill={C.orange} />
              <circle cx="60" cy="95" r="3" fill={C.orange} />
              <circle cx="78" cy="77" r="3" fill={C.orange} />
              <circle cx="96" cy="23" r="3" fill={C.orange} />

              {/* Etiquetas */}
              <text x="20" y="19" fill={C.text} fontSize="7" textAnchor="end">(-2,4)</text>
              <text x="38" y="73" fill={C.text} fontSize="7" textAnchor="end">(-1,1)</text>
              <text x="60" y="89" fill={C.text} fontSize="7" textAnchor="middle">(0,0)</text>
              <text x="82" y="73" fill={C.text} fontSize="7" textAnchor="start">(1,1)</text>
              <text x="100" y="19" fill={C.text} fontSize="7" textAnchor="start">(2,4)</text>
            </svg>
          </div>

          {/* 5. SAGITAL */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.accent, textTransform: "uppercase", marginBottom: 4 }}>
              5. Sagital (Mapeo Varios a Uno)
            </div>
            <svg viewBox="0 0 130 110" width="160px" height="135px" style={{ display: "block" }}>
              {/* Óvalo Dominio A */}
              <ellipse cx="28" cy="55" rx="16" ry="46" fill="none" stroke={C.muted} strokeWidth="1" />
              <text x="28" y="6" fill={C.text} fontSize="8" fontWeight="bold" textAnchor="middle">Dom(f)</text>

              {/* Óvalo Codominio B */}
              <ellipse cx="102" cy="55" rx="16" ry="42" fill="none" stroke={C.muted} strokeWidth="1" />
              <text x="102" y="9" fill={C.text} fontSize="8" fontWeight="bold" textAnchor="middle">Cod(f)</text>

              {/* Elementos Dominio A */}
              <text x="28" y="23" fill={C.text} fontSize="9" textAnchor="middle">-2</text>
              <text x="28" y="41" fill={C.text} fontSize="9" textAnchor="middle">-1</text>
              <text x="28" y="59" fill={C.text} fontSize="9" textAnchor="middle">0</text>
              <text x="28" y="77" fill={C.text} fontSize="9" textAnchor="middle">1</text>
              <text x="28" y="95" fill={C.text} fontSize="9" textAnchor="middle">2</text>

              {/* Elementos Codominio B */}
              <text x="102" y="33" fill={C.text} fontSize="9" textAnchor="middle">0</text>
              <text x="102" y="53" fill={C.text} fontSize="9" textAnchor="middle">1</text>
              <text x="102" y="73" fill={C.text} fontSize="9" textAnchor="middle">4</text>
              <text x="102" y="93" fill={C.text} fontSize="9" textAnchor="middle" style={{ color: C.muted, opacity: 0.5 }}>9</text>

              {/* Flechas directas de mapeo */}
              <defs>
                <marker id="sag-arrow-quad" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 2 L 7 5 L 0 8 z" fill={C.orange} />
                </marker>
              </defs>

              {/* -2 -> 4 */}
              <path d="M 38 20 C 58 24, 72 38, 92 68" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-quad)" />
              {/* -1 -> 1 */}
              <path d="M 38 38 C 58 40, 72 44, 92 48" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-quad)" />
              {/* 0 -> 0 */}
              <path d="M 38 56 C 58 52, 72 40, 92 30" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-quad)" />
              {/* 1 -> 1 */}
              <path d="M 38 74 C 58 70, 72 60, 92 50" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-quad)" />
              {/* 2 -> 4 */}
              <path d="M 38 92 C 58 88, 72 80, 92 72" fill="none" stroke={C.orange} strokeWidth="1.2" markerEnd="url(#sag-arrow-quad)" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
