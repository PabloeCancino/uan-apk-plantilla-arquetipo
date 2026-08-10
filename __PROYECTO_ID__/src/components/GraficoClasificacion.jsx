import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { InlineFormula } from "./Formula";

export function GraficoClasificacion({ onlyExpLog = false, onlyTrig = false, onlyHyperbolic = false }) {
  const { C } = useContext(ThemeCtx);

  // Estados del Graficador
  const [family, setFamily] = useState(
    onlyHyperbolic ? "hiperbolica" : (onlyTrig ? "trigonometrica" : (onlyExpLog ? "exponencial" : "lineal"))
  );
  const [trigFunc, setTrigFunc] = useState("seno"); // "seno", "coseno", "tangente", "cotangente", "secante", "cosecante"
  const [hyperFunc, setHyperFunc] = useState("senh"); // "senh", "cosh", "tgh", "coth", "sech", "csch"

  // Parámetros de control
  const [paramM, setParamM] = useState(1);       // Pendiente m (Lineal)
  const [paramB, setParamB] = useState(0);       // Intersección b (Lineal/Cuadrática)
  const [paramA, setParamA] = useState(1);       // Coeficiente a (Cuadrática)
  const [paramC, setParamC] = useState(0);       // Constante c (Cuadrática)
  const [paramH, setParamH] = useState(0);       // Asíntota h (Racional)
  const [paramK, setParamK] = useState(0);       // Desplazamiento k (Racional)
  const [paramN, setParamN] = useState(3);       // Exponente n (Potencial)

  // Nuevos Parámetros
  const [paramBase, setParamBase] = useState(2); // Base exponencial (Exponencial)
  const [paramLogH, setParamLogH] = useState(0); // Asíntota log (Logarítmica)
  const [paramAmp, setParamAmp] = useState(2);   // Amplitud A (Trigonométrica/Hiperbólica)
  const [paramFreq, setParamFreq] = useState(1); // Frecuencia w (Trigonométrica/Hiperbólica)

  // Configuración del plano
  const width = 280;
  const height = 280;
  const origin = { x: 140, y: 140 };
  const scale = 22; // Píxeles por unidad matemática

  const toPx = (x, y) => ({
    x: origin.x + x * scale,
    y: origin.y - y * scale
  });

  // Generador de rutas SVG
  const getPathData = () => {
    if (family === "lineal") {
      const p1 = toPx(-6, paramM * -6 + paramB);
      const p2 = toPx(6, paramM * 6 + paramB);
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    }

    if (family === "cuadratica") {
      let points = [];
      for (let x = -6.2; x <= 6.2; x += 0.1) {
        const y = paramA * x * x + paramB * x + paramC;
        points.push(toPx(x, y));
      }
      return points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    }

    if (family === "potencial") {
      let points = [];
      for (let x = -6.2; x <= 6.2; x += 0.05) {
        const y = Math.pow(x, paramN);
        points.push(toPx(x, y));
      }
      return points.map((p, idx) => {
        if (isNaN(p.y) || !isFinite(p.y)) return "";
        return `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      }).join(" ");
    }

    if (family === "exponencial") {
      let points = [];
      for (let x = -6.2; x <= 6.2; x += 0.05) {
        const y = Math.pow(paramBase, x);
        points.push(toPx(x, y));
      }
      return points.map((p, idx) => {
        if (isNaN(p.y) || !isFinite(p.y)) return "";
        return `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      }).join(" ");
    }

    if (family === "logaritmica") {
      let points = [];
      for (let x = paramLogH + 0.05; x <= 6.2; x += 0.05) {
        const y = Math.log(x - paramLogH) / Math.log(2); // base 2 log
        points.push(toPx(x, y));
      }
      return points.map((p, idx) => {
        if (isNaN(p.y) || !isFinite(p.y)) return "";
        return `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      }).join(" ");
    }

    if (family === "trigonometrica") {
      let pathData = "";
      let lastY = null;
      let startNewSegment = true;

      for (let x = -6.2; x <= 6.2; x += 0.02) {
        let y = 0;
        if (trigFunc === "seno") {
          y = paramAmp * Math.sin(paramFreq * x);
        } else if (trigFunc === "coseno") {
          y = paramAmp * Math.cos(paramFreq * x);
        } else if (trigFunc === "tangente") {
          y = paramAmp * Math.tan(paramFreq * x);
        } else if (trigFunc === "cotangente") {
          y = paramAmp / Math.tan(paramFreq * x);
        } else if (trigFunc === "secante") {
          y = paramAmp / Math.cos(paramFreq * x);
        } else if (trigFunc === "cosecante") {
          y = paramAmp / Math.sin(paramFreq * x);
        }

        if (isNaN(y) || !isFinite(y) || Math.abs(y) > 15) {
          startNewSegment = true;
          continue;
        }

        const p = toPx(x, y);

        if (startNewSegment || lastY === null || Math.abs(y - lastY) > 8) {
          pathData += ` M ${p.x} ${p.y}`;
          startNewSegment = false;
        } else {
          pathData += ` L ${p.x} ${p.y}`;
        }
        lastY = y;
      }
      return pathData;
    }

    if (family === "hiperbolica") {
      let pathData = "";
      let lastY = null;
      let startNewSegment = true;

      for (let x = -6.2; x <= 6.2; x += 0.02) {
        let y = 0;
        const u = paramFreq * x;
        if (hyperFunc === "senh") {
          y = paramAmp * Math.sinh(u);
        } else if (hyperFunc === "cosh") {
          y = paramAmp * Math.cosh(u);
        } else if (hyperFunc === "tgh") {
          y = paramAmp * Math.tanh(u);
        } else if (hyperFunc === "coth") {
          y = paramAmp / Math.tanh(u);
        } else if (hyperFunc === "sech") {
          y = paramAmp / Math.cosh(u);
        } else if (hyperFunc === "csch") {
          y = paramAmp / Math.sinh(u);
        }

        if (isNaN(y) || !isFinite(y) || Math.abs(y) > 15) {
          startNewSegment = true;
          continue;
        }

        const p = toPx(x, y);

        if (startNewSegment || lastY === null || Math.abs(y - lastY) > 8) {
          pathData += ` M ${p.x} ${p.y}`;
          startNewSegment = false;
        } else {
          pathData += ` L ${p.x} ${p.y}`;
        }
        lastY = y;
      }
      return pathData;
    }

    if (family === "racional") {
      let branchLeft = [];
      for (let x = -6.2; x <= paramH - 0.15; x += 0.05) {
        const y = 1 / (x - paramH) + paramK;
        branchLeft.push(toPx(x, y));
      }
      const pathLeft = branchLeft.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

      let branchRight = [];
      for (let x = paramH + 0.15; x <= 6.2; x += 0.05) {
        const y = 1 / (x - paramH) + paramK;
        branchRight.push(toPx(x, y));
      }
      const pathRight = branchRight.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

      return { pathLeft, pathRight };
    }

    return "";
  };

  const pathResult = getPathData();

  // Helper para generar etiquetas LaTeX de la función actual
  const getTrigFormulaLaTeX = () => {
    const ampStr = paramAmp === 1 ? "" : paramAmp === -1 ? "-" : paramAmp;
    const freqStr = paramFreq === 1 ? "" : paramFreq;
    if (trigFunc === "seno") return `f(x) = ${ampStr}\\sen(${freqStr}x)`;
    if (trigFunc === "coseno") return `f(x) = ${ampStr}\\cos(${freqStr}x)`;
    if (trigFunc === "tangente") return `f(x) = ${ampStr}\\tg(${freqStr}x)`;
    if (trigFunc === "cotangente") return `f(x) = ${ampStr}\\cotg(${freqStr}x)`;
    if (trigFunc === "secante") return `f(x) = ${ampStr}\\sec(${freqStr}x)`;
    if (trigFunc === "cosecante") return `f(x) = ${ampStr}\\csc(${freqStr}x)`;
    return "";
  };

  const getHyperFormulaLaTeX = () => {
    const ampStr = paramAmp === 1 ? "" : paramAmp === -1 ? "-" : paramAmp;
    const freqStr = paramFreq === 1 ? "" : paramFreq;
    if (hyperFunc === "senh") return `f(x) = ${ampStr}\\senh(${freqStr}x)`;
    if (hyperFunc === "cosh") return `f(x) = ${ampStr}\\cosh(${freqStr}x)`;
    if (hyperFunc === "tgh") return `f(x) = ${ampStr}\\tgh(${freqStr}x)`;
    if (hyperFunc === "coth") return `f(x) = ${ampStr}\\coth(${freqStr}x)`;
    if (hyperFunc === "sech") return `f(x) = ${ampStr}\\sech(${freqStr}x)`;
    if (hyperFunc === "csch") return `f(x) = ${ampStr}\\csch(${freqStr}x)`;
    return "";
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 500,
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
        Graficador Interactivo de Familias
      </div>

      {/* Selectores de Familia */}
      {!onlyTrig && !onlyHyperbolic && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { key: "lineal", label: "Lineal" },
            { key: "cuadratica", label: "Cuadrática" },
            { key: "racional", label: "Racional" },
            { key: "potencial", label: "Potencial" },
            { key: "exponencial", label: "Exponencial" },
            { key: "logaritmica", label: "Logarítmica" },
            { key: "trigonometrica", label: "Trigonométrica" }
          ].filter(item => !onlyExpLog || item.key === "exponencial" || item.key === "logaritmica").map(item => (
            <button
              key={item.key}
              onClick={() => setFamily(item.key)}
              style={{
                flex: "1 1 100px",
                padding: "6px 8px",
                borderRadius: 6,
                border: `1px solid ${family === item.key ? C.accent : C.border}`,
                background: family === item.key ? C.accent : "transparent",
                color: family === item.key ? C.bg : C.text,
                fontSize: 10,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-selector para Funciones Trigonométricas */}
      {family === "trigonometrica" && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          padding: 8,
          background: `${C.border}11`,
          borderRadius: 8,
          border: `1px solid ${C.border}`
        }}>
          {[
            { key: "seno", label: "Seno" },
            { key: "coseno", label: "Coseno" },
            { key: "tangente", label: "Tangente" },
            { key: "cotangente", label: "Cotangente" },
            { key: "secante", label: "Secante" },
            { key: "cosecante", label: "Cosecante" }
          ].map(trig => (
            <button
              key={trig.key}
              onClick={() => setTrigFunc(trig.key)}
              style={{
                flex: "1 1 60px",
                padding: "4px 6px",
                borderRadius: 4,
                border: "none",
                background: trigFunc === trig.key ? C.accent : "transparent",
                color: trigFunc === trig.key ? C.bg : C.text,
                fontSize: 9,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {trig.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-selector para Funciones Hiperbólicas */}
      {family === "hiperbolica" && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          padding: 8,
          background: `${C.border}11`,
          borderRadius: 8,
          border: `1px solid ${C.border}`
        }}>
          {[
            { key: "senh", label: "Senh" },
            { key: "cosh", label: "Cosh" },
            { key: "tgh", label: "Tgh" },
            { key: "coth", label: "Coth" },
            { key: "sech", label: "Sech" },
            { key: "csch", label: "Csch" }
          ].map(hyp => (
            <button
              key={hyp.key}
              onClick={() => setHyperFunc(hyp.key)}
              style={{
                flex: "1 1 60px",
                padding: "4px 6px",
                borderRadius: 4,
                border: "none",
                background: hyperFunc === hyp.key ? C.accent : "transparent",
                color: hyperFunc === hyp.key ? C.bg : C.text,
                fontSize: 9,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {hyp.label}
            </button>
          ))}
        </div>
      )}

      {/* Contenedor Flex: Gráfico + Sliders */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* SVG del Gráfico */}
        <div style={{ position: "relative", width: width, height: height, background: `${C.border}11`, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <svg width={width} height={height} style={{ display: "block" }}>
            {/* Cuadrícula */}
            {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(val => (
              <line key={val} x1={origin.x + val * scale} y1="0" x2={origin.x + val * scale} y2={height} stroke={C.border} strokeWidth="0.5" strokeDasharray="2 2" />
            ))}
            {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(val => (
              <line key={val} x1="0" y1={origin.y - val * scale} x2={width} y2={origin.y - val * scale} stroke={C.border} strokeWidth="0.5" strokeDasharray="2 2" />
            ))}

            {/* Ejes X e Y */}
            <line x1="0" y1={origin.y} x2={width} y2={origin.y} stroke={C.muted} strokeWidth="1.2" />
            <line x1={origin.x} y1="0" x2={origin.x} y2={height} stroke={C.muted} strokeWidth="1.2" />

            {/* Ticks y etiquetas sencillas */}
            <text x={width - 12} y={origin.y - 4} fill={C.muted} fontSize="8" fontWeight="bold">x</text>
            <text x={origin.x + 4} y="12" fill={C.muted} fontSize="8" fontWeight="bold">y</text>

            {/* Curva o Recta de la función */}
            {family === "racional" && (
              <>
                {/* Asintota vertical h */}
                <line
                  x1={origin.x + paramH * scale}
                  y1="0"
                  x2={origin.x + paramH * scale}
                  y2={height}
                  stroke={C.orange}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Asintota horizontal k */}
                <line
                  x1="0"
                  y1={origin.y - paramK * scale}
                  x2={width}
                  y2={origin.y - paramK * scale}
                  stroke={C.orange}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Ramas */}
                <path d={pathResult.pathLeft} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />
                <path d={pathResult.pathRight} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {family === "logaritmica" && (
              <>
                {/* Asintota vertical en x = paramLogH */}
                <line
                  x1={origin.x + paramLogH * scale}
                  y1="0"
                  x2={origin.x + paramLogH * scale}
                  y2={height}
                  stroke={C.orange}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <path d={pathResult} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {family !== "racional" && family !== "logaritmica" && (
              <path d={pathResult} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Sliders de Parámetros */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Ecuación actual en LaTeX */}
          <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, textAlign: "center", background: `${C.border}22`, padding: "6px", borderRadius: 8 }}>
            {family === "lineal" && <InlineFormula latex={`f(x) = ${paramM === 0 ? "" : paramM === 1 ? "x" : paramM === -1 ? "-x" : paramM + "x"}${paramB >= 0 ? (paramM === 0 ? paramB : " + " + paramB) : " - " + Math.abs(paramB)}`} />}
            {family === "cuadratica" && <InlineFormula latex={`f(x) = ${paramA === 1 ? "" : paramA === -1 ? "-" : paramA}x^2 ${paramB === 0 ? "" : (paramB > 0 ? " + " + paramB : " - " + Math.abs(paramB)) + "x"}${paramC === 0 ? "" : (paramC > 0 ? " + " + paramC : " - " + Math.abs(paramC))}`} />}
            {family === "racional" && <InlineFormula latex={`f(x) = \\frac{1}{x ${paramH === 0 ? "" : (paramH > 0 ? " - " + paramH : " + " + Math.abs(paramH))}} ${paramK === 0 ? "" : (paramK > 0 ? " + " + paramK : " - " + Math.abs(paramK))}`} />}
            {family === "potencial" && <InlineFormula latex={`f(x) = x^{${paramN}}`} />}
            {family === "exponencial" && <InlineFormula latex={`f(x) = ${paramBase}^x`} />}
            {family === "logaritmica" && <InlineFormula latex={`f(x) = \\log_{2}(x ${paramLogH === 0 ? "" : (paramLogH > 0 ? " - " + paramLogH : " + " + Math.abs(paramLogH))})`} />}
            {family === "trigonometrica" && <InlineFormula latex={getTrigFormulaLaTeX()} />}
            {family === "hiperbolica" && <InlineFormula latex={getHyperFormulaLaTeX()} />}
          </div>

          {/* Sliders Dinámicos según la familia */}
          {family === "lineal" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Pendiente (m): <b>{paramM}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramM} onChange={(e) => setParamM(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Intersección (b): <b>{paramB}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramB} onChange={(e) => setParamB(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
            </>
          )}

          {family === "cuadratica" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Concavidad (a): <b>{paramA}</b></span>
                </div>
                <input type="range" min="-3" max="3" step="0.2" value={paramA} onChange={(e) => setParamA(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Desplazamiento (b): <b>{paramB}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramB} onChange={(e) => setParamB(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Intersección (c): <b>{paramC}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramC} onChange={(e) => setParamC(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
            </>
          )}

          {family === "racional" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Desplazamiento horizontal (h): <b>{paramH}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramH} onChange={(e) => setParamH(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Desplazamiento vertical (k): <b>{paramK}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramK} onChange={(e) => setParamK(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
            </>
          )}

          {family === "potencial" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                <span>Exponente (n): <b>{paramN}</b></span>
              </div>
              <input type="range" min="1" max="5" step="1" value={paramN} onChange={(e) => setParamN(parseInt(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            </div>
          )}

          {family === "exponencial" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                <span>Base (a): <b>{paramBase}</b></span>
              </div>
              <input type="range" min="0.5" max="4" step="0.1" value={paramBase} onChange={(e) => setParamBase(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            </div>
          )}

          {family === "logaritmica" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                <span>Asíntota vertical (h): <b>{paramLogH}</b></span>
              </div>
              <input type="range" min="-4" max="4" step="0.5" value={paramLogH} onChange={(e) => setParamLogH(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            </div>
          )}

          {(family === "trigonometrica" || family === "hiperbolica") && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Amplitud (A): <b>{paramAmp}</b></span>
                </div>
                <input type="range" min="-4" max="4" step="0.5" value={paramAmp} onChange={(e) => setParamAmp(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                  <span>Frecuencia (w): <b>{paramFreq}</b></span>
                </div>
                <input type="range" min="0.5" max="3" step="0.25" value={paramFreq} onChange={(e) => setParamFreq(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
