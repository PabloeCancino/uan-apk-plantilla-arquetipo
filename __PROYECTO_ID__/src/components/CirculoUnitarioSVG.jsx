// CirculoUnitarioSVG.jsx — Círculo unitario interactivo
// El usuario arrastra el ángulo y ve sen/cos en tiempo real
import { useState, useRef, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";

const R = 110; // radio del círculo en px
const CX = 130; // centro x del SVG
const CY = 130; // centro y del SVG
const SIZE = 260;

function anguloACoord(deg) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY - R * Math.sin(rad),
  };
}

const ANGULOS_NOTABLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

export function CirculoUnitarioSVG({ catColor = "#7ee787" }) {
  const { C } = useTheme();
  const [angulo, setAngulo] = useState(45);
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const calcAngulo = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    const sx = (clientX - rect.left) * (SIZE / rect.width);
    const sy = (clientY - rect.top) * (SIZE / rect.height);
    const dx = sx - CX;
    const dy = -(sy - CY);
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return Math.round(deg);
  }, []);

  const onMouseDown = useCallback((e) => { dragging.current = true; setAngulo(calcAngulo(e.clientX, e.clientY)); }, [calcAngulo]);
  const onMouseMove = useCallback((e) => { if (dragging.current) setAngulo(calcAngulo(e.clientX, e.clientY)); }, [calcAngulo]);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);
  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    const t = e.touches[0];
    setAngulo(calcAngulo(t.clientX, t.clientY));
  }, [calcAngulo]);

  const { x: px, y: py } = anguloACoord(angulo);
  const senV = Math.sin((angulo * Math.PI) / 180);
  const cosV = Math.cos((angulo * Math.PI) / 180);
  const tanV = Math.abs(cosV) < 0.01 ? Infinity : senV / cosV;
  const fmt = (v) => (Math.abs(v) === Infinity ? "∞" : v.toFixed(3));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
      {/* Título y ángulo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: catColor, fontSize: 13, fontWeight: 700 }}>θ =</span>
        <span style={{ color: C.text, fontSize: 20, fontWeight: 700, minWidth: 46, textAlign: "right" }}>{angulo}°</span>
        <span style={{ color: C.muted, fontSize: 11 }}>({((angulo * Math.PI) / 180).toFixed(3)} rad)</span>
      </div>

      {/* SVG interactivo */}
      <svg
        ref={svgRef}
        width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ maxWidth: "var(--circulo-size)", cursor: "crosshair", userSelect: "none", touchAction: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={(e) => { dragging.current = true; onTouchMove(e); }}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        {/* Ejes */}
        <line x1={CX - R - 15} y1={CY} x2={CX + R + 15} y2={CY} stroke={C.border} strokeWidth={1} />
        <line x1={CX} y1={CY - R - 15} x2={CX} y2={CY + R + 15} stroke={C.border} strokeWidth={1} />

        {/* Círculo unitario */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.border} strokeWidth={1.5} strokeDasharray="3 3" />

        {/* Ángulos notables */}
        {ANGULOS_NOTABLES.map(a => {
          const { x, y } = anguloACoord(a);
          return <circle key={a} cx={x} cy={y} r={2.5} fill={C.border} />;
        })}

        {/* Línea al punto (hipotenusa) */}
        <line x1={CX} y1={CY} x2={px} y2={py} stroke={catColor} strokeWidth={2} />

        {/* Proyección sen (vertical) */}
        <line x1={px} y1={py} x2={px} y2={CY} stroke="#f78166" strokeWidth={1.5} strokeDasharray="4 2" />

        {/* Proyección cos (horizontal) */}
        <line x1={CX} y1={CY} x2={px} y2={CY} stroke="#79c0ff" strokeWidth={1.5} strokeDasharray="4 2" />

        {/* Arco del ángulo */}
        {angulo > 0 && angulo < 360 && (() => {
          const r2 = 28;
          const rad = (angulo * Math.PI) / 180;
          const ax = CX + r2 * Math.cos(rad);
          const ay = CY - r2 * Math.sin(rad);
          const flag = angulo > 180 ? 1 : 0;
          return (
            <path
              d={`M ${CX + r2} ${CY} A ${r2} ${r2} 0 ${flag} 0 ${ax} ${ay}`}
              fill="none" stroke={catColor} strokeWidth={1.5} opacity={0.7}
            />
          );
        })()}

        {/* Etiquetas de ejes */}
        <text x={CX + R + 18} y={CY + 4} fontSize={10} fill={C.muted}>cos</text>
        <text x={CX + 4} y={CY - R - 8} fontSize={10} fill={C.muted}>sen</text>

        {/* Punto arrastrable */}
        <circle cx={px} cy={py} r={8} fill={catColor} opacity={0.2} />
        <circle cx={px} cy={py} r={5} fill={catColor} />

        {/* Centro */}
        <circle cx={CX} cy={CY} r={3} fill={C.muted} />

        {/* Etiqueta θ */}
        {angulo > 10 && angulo < 350 && (
          <text
            x={CX + 34 * Math.cos((angulo / 2) * Math.PI / 180)}
            y={CY - 34 * Math.sin((angulo / 2) * Math.PI / 180) + 4}
            fontSize={9} fill={catColor} textAnchor="middle"
          >θ</text>
        )}
      </svg>

      {/* Valores numéricos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, width: "100%", maxWidth: 280 }}>
        {[
          { label: "sen θ", value: fmt(senV), color: "#f78166" },
          { label: "cos θ", value: fmt(cosV), color: "#79c0ff" },
          { label: "tan θ", value: fmt(tanV), color: "#d2a8ff" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: C.surface, border: `1px solid ${color}44`,
            borderRadius: 8, padding: "8px 6px", textAlign: "center",
          }}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Selector de ángulos notables */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: 300 }}>
        {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330, 360].map(a => (
          <button key={a} onClick={() => setAngulo(a)}
            style={{
              padding: "3px 7px", borderRadius: 6, border: `1px solid ${angulo === a ? catColor : C.border}`,
              background: angulo === a ? `${catColor}22` : "transparent",
              color: angulo === a ? catColor : C.muted, fontSize: 10, cursor: "pointer",
            }}>
            {a}°
          </button>
        ))}
      </div>
    </div>
  );
}
