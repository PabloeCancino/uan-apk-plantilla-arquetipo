import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";

export default function GraficoCinematica() {
  const { C } = useContext(ThemeCtx);
  const [t, setT] = useState(1); // Time slider from 0 to 4.5 s

  // Kinematic functions
  const s = (time) => Math.pow(time, 3) - 6 * Math.pow(time, 2) + 9 * time - 4;
  const v = (time) => 3 * Math.pow(time, 2) - 12 * time + 9;
  const a = (time) => 6 * time - 12;

  // Mapping coordinates: width 360, height 180 for each plot.
  // mathematically: t range [0, 4.5], y range [-6, 6] for s, [-6, 12] for v.
  const toSvgX = (time) => 40 + time * 65; // time 0->4.5 maps to x 40->332.5

  // Plot 1: Position s(t)
  const sToSvgY = (y) => 90 - y * 12; // y range [-6, 6] maps to y 162->18

  // Plot 2: Velocity v(t)
  const vToSvgY = (y) => 120 - y * 8; // y range [-6, 12] maps to y 168->24

  const generateSPath = () => {
    let path = "";
    for (let time = 0; time <= 4.5; time += 0.05) {
      const sx = toSvgX(time);
      const sy = sToSvgY(s(time));
      if (path === "") path += `M ${sx} ${sy}`;
      else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  const generateVPath = () => {
    let path = "";
    for (let time = 0; time <= 4.5; time += 0.05) {
      const sx = toSvgX(time);
      const sy = vToSvgY(v(time));
      if (path === "") path += `M ${sx} ${sy}`;
      else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  // Convert position s(t) to track x coordinate (center is 180, scale by 25)
  // s(t) ranges between -4 and 0, so let's shift it to show movement.
  const particleX = 180 + (s(t) + 2) * 45; // maps s(t) to track coordinates

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
        {"🏃 Cinemática: Posición y Velocidad (\\(v(t) = s'(t)\\))"}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
        {"Desplaza el tiempo \\(t\\) para ver la correspondencia entre la posición, la velocidad instantánea y el movimiento real de la partícula"}
      </div>

      {/* Particle track simulation */}
      <div style={{
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 16,
        position: "relative"
      }}>
        <div style={{ fontSize: 10, fontWeight: "bold", color: C.text, textAlign: "left", marginBottom: 6 }}>
          Simulación de movimiento rectilíneo:
        </div>
        <svg viewBox="0 0 360 40" width="100%" height="40" style={{ display: "block" }}>
          {/* Track line */}
          <line x1="20" y1="20" x2="340" y2="20" stroke={C.border} strokeWidth="4" strokeLinecap="round" />

          {/* Origin mark */}
          <line x1="180" y1="12" x2="180" y2="28" stroke={C.muted} strokeWidth="1.5" />
          <text x="180" y="10" fill={C.muted} fontSize="8" textAnchor="middle">Origen s=0</text>

          {/* Particle */}
          <circle cx={particleX} cy="20" r="8" fill={v(t) >= 0.1 ? C.green : v(t) <= -0.1 ? C.red : C.yellow} stroke={C.bg} strokeWidth="2" style={{ transition: "cx 0.1s" }} />

          {/* Direction arrow */}
          {Math.abs(v(t)) > 0.1 && (
            <path
              d={v(t) > 0 ? "M 10 0 L 20 5 L 10 10 Z" : "M 10 0 L 0 5 L 10 10 Z"}
              transform={`translate(${particleX + (v(t) > 0 ? 12 : -32)}, 15)`}
              fill={v(t) > 0 ? C.green : C.red}
            />
          )}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", justifyContent: "center" }}>
        {/* Plots */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 240 }}>
          {/* Plot 1: s(t) */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 4, left: 8, fontSize: 9, fontWeight: "bold", color: C.green }}>Posición s(t)</div>
            <svg viewBox="0 0 360 140" width="100%" height="110" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
              {/* Axes */}
              <line x1="40" y1="90" x2="350" y2="90" stroke={C.text} strokeWidth="1" />
              <line x1="40" y1="10" x2="40" y2="130" stroke={C.text} strokeWidth="1" />
              {/* Curve s(t) */}
              <path d={generateSPath()} fill="none" stroke={C.green} strokeWidth="2" />
              {/* Vertical line indicator */}
              <line x1={toSvgX(t)} y1="10" x2={toSvgX(t)} y2="130" stroke={C.muted} strokeWidth="0.75" strokeDasharray="2 2" />
              <circle cx={toSvgX(t)} cy={sToSvgY(s(t))} r="4" fill={C.green} />
            </svg>
          </div>

          {/* Plot 2: v(t) */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 4, left: 8, fontSize: 9, fontWeight: "bold", color: C.orange }}>Velocidad v(t) = s'(t)</div>
            <svg viewBox="0 0 360 140" width="100%" height="110" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, display: "block" }}>
              {/* Axes */}
              <line x1="40" y1="120" x2="350" y2="120" stroke={C.text} strokeWidth="1" />
              <line x1="40" y1="10" x2="40" y2="130" stroke={C.text} strokeWidth="1" />
              {/* Curve v(t) */}
              <path d={generateVPath()} fill="none" stroke={C.orange} strokeWidth="2" />
              {/* Vertical line indicator */}
              <line x1={toSvgX(t)} y1="10" x2={toSvgX(t)} y2="130" stroke={C.muted} strokeWidth="0.75" strokeDasharray="2 2" />
              <circle cx={toSvgX(t)} cy={vToSvgY(v(t))} r="4" fill={C.orange} />
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 180, textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: "bold", color: C.text, display: "flex", justifyContent: "space-between" }}>
              <span>Tiempo (t):</span>
              <span style={{ color: C.accent }}>t = {t.toFixed(2)} s</span>
            </div>
            <input type="range" min="0.0" max="4.5" step="0.05" value={t} onChange={(e) => setT(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
              <span>t = 0.0</span>
              <span>t = 4.5</span>
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
            <div style={{ fontWeight: "bold", color: C.muted }}>Valores instantáneos:</div>
            <div style={{ color: C.muted, marginTop: 4 }}>
              • Posición: <span style={{ color: C.green, fontWeight: "bold" }}>s({t.toFixed(1)}) = {s(t).toFixed(2)} m</span><br />
              • Velocidad: <span style={{ color: C.orange, fontWeight: "bold" }}>v({t.toFixed(1)}) = {v(t).toFixed(2)} m/s</span><br />
              • Aceleración: <span style={{ color: C.purple, fontWeight: "bold" }}>a({t.toFixed(1)}) = {a(t).toFixed(2)} m/s²</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: C.accent, fontWeight: "bold" }}>
              {t < 1 && "Acelerando hacia la derecha (+)"}
              {Math.abs(t - 1) < 0.1 && "Punto de retorno (v=0)"}
              {t > 1 && t < 3 && "Retornando hacia la izquierda (-)"}
              {Math.abs(t - 3) < 0.1 && "Punto de retorno (v=0)"}
              {t > 3 && "Acelerando hacia la derecha (+)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
