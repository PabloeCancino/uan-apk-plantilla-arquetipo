import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoRectaReal() {
  const { C } = useContext(ThemeCtx);
  const [puntoActivo, setPuntoActivo] = useState(null);

  const puntos = [
    { label: "-5/2", val: -2.5, x: 300 - 2.5 * 80, desc: "Número racional (decimal exacto: -2.5)" },
    { label: "√2", val: 1.414, x: 300 + 1.414 * 80, desc: "Número irracional algebraico (1.4142...)" },
    { label: "e", val: 2.718, x: 300 + 2.718 * 80, desc: "Número irracional trascendente (2.7182...)" },
    { label: "π", val: 3.1416, x: 300 + 3.1416 * 80, desc: "Número irracional trascendente (3.1415...)" },
  ];

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
        📍 Puntos notables en la Recta Numérica Real (ℝ)
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 18 }}>
        Toca un punto para ver su clasificación y detalles
      </div>

      <svg viewBox="0 0 600 160" width="100%" height="100%" style={{ display: "block" }}>
        {/* Definición de la flecha del eje */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill={C.text} />
          </marker>
        </defs>

        {/* Eje de la Recta Real */}
        <line x1="30" y1="80" x2="570" y2="80" stroke={C.text} strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
        <text x="580" y="85" fill={C.text} fontSize="14" fontWeight="bold">ℝ</text>

        {/* Ticks y etiquetas de enteros */}
        {[-3, -2, -1, 0, 1, 2, 3].map((val) => {
          const x = 300 + val * 80;
          return (
            <g key={val}>
              <line x1={x} y1="72" x2={x} y2="88" stroke={C.border} strokeWidth="1.5" />
              <text x={x} y="110" fill={C.muted} fontSize="11" textAnchor="middle" fontWeight={val === 0 ? "bold" : "normal"}>
                {val}
              </text>
            </g>
          );
        })}

        {/* Puntos notables interactivos */}
        {puntos.map((pt, i) => (
          <g key={i} cursor="pointer" onClick={() => setPuntoActivo(pt)}>
            {/* Línea indicadora vertical */}
            <line x1={pt.x} y1="80" x2={pt.x} y2="45" stroke={puntoActivo?.label === pt.label ? C.accent : C.border} strokeWidth="1" strokeDasharray="2 2" />
            {/* Círculo indicador */}
            <circle cx={pt.x} cy="80" r={puntoActivo?.label === pt.label ? "7" : "5"} fill={puntoActivo?.label === pt.label ? C.accent : C.green} stroke={C.bg} strokeWidth="1.5" style={{ transition: "all 0.2s" }} />
            {/* Etiqueta superior */}
            <text x={pt.x} y="35" fill={puntoActivo?.label === pt.label ? C.accent : C.text} fontSize="12" fontWeight="bold" textAnchor="middle" style={{ transition: "all 0.2s" }}>
              {pt.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Caja de información detallada */}
      <div style={{
        marginTop: 15,
        minHeight: 50,
        padding: "10px 14px",
        background: C.surface2,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        fontSize: 12,
        color: C.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s"
      }}>
        {puntoActivo ? (
          <div>
            <strong style={{ color: C.accent }}>{puntoActivo.label} = {puntoActivo.val}</strong>: {puntoActivo.desc}
          </div>
        ) : (
          <span style={{ color: C.muted, fontStyle: "italic" }}>Toca cualquiera de los puntos verdes en la recta para inspeccionarlo</span>
        )}
      </div>
    </div>
  );
}
