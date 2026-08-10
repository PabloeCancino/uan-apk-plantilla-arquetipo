// NTE-UAN-APK-001 — Simulador: demostraciones paso a paso
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import { DEMOSTRACIONES } from "../data/contenido.js";

export function Simulador() {
  const { C } = useTheme();
  const [catFiltro, setCatFiltro] = useState("Todos");
  const [demIdx, setDemIdx] = useState(0);
  const [pasoActual, setPasoActual] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const itvRef = useRef(null);

  const cats = ["Todos", "Lógica Matemática", "Teoría de Conjuntos", "Métodos de Demostración"];
  const demsFilt = catFiltro === "Todos"
    ? DEMOSTRACIONES
    : DEMOSTRACIONES.filter(d => d.categoria === catFiltro);
  const dem = demsFilt[demIdx] || demsFilt[0];

  const iniciar = useCallback(() => {
    clearInterval(itvRef.current); setPasoActual(0); setCorriendo(true);
  }, []);

  useEffect(() => {
    if (!corriendo || !dem) return;
    itvRef.current = setInterval(() => {
      setPasoActual(p => {
        if (p >= dem.pasos.length - 1) { setCorriendo(false); return p; }
        return p + 1;
      });
    }, 1200);
    return () => clearInterval(itvRef.current);
  }, [corriendo, dem]);

  const selDem = (idx) => { setDemIdx(idx); setPasoActual(0); setCorriendo(false); clearInterval(itvRef.current); };

  return (
    <div className="simulador-outer" style={{ maxWidth: 820 }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>🧮 Simulador de Demostraciones</h2>
      <p style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>Visualiza cada paso lógico de las demostraciones fundamentales del curso.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => { setCatFiltro(c); selDem(0); }}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${catFiltro === c ? C.accent : C.border}`, background: catFiltro === c ? C.accentSoft : "transparent", color: catFiltro === c ? C.accent : C.muted, fontSize: 11, cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {demsFilt.map((d, i) => (
          <button key={d.id} onClick={() => selDem(i)}
            style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${demIdx === i ? C.green : C.border}`, background: demIdx === i ? `${C.green}18` : "transparent", color: demIdx === i ? C.green : C.muted, fontSize: 11, cursor: "pointer", textAlign: "left" }}>
            {d.titulo}
          </button>
        ))}
      </div>
      <div className="simulador-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, overflowY: "auto", maxHeight: 380 }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.2 }}>{dem?.categoria}</div>
          {dem?.pasos.map((p, i) => (
            <div key={i} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 8, background: i === pasoActual ? C.accentSoft : i < pasoActual ? `${C.green}11` : "transparent", border: `1px solid ${i === pasoActual ? C.accent : "transparent"}`, opacity: i > pasoActual ? 0.35 : 1, transition: "all .4s" }}>
              <div style={{ fontSize: 10, color: i === pasoActual ? C.accent : C.muted, fontWeight: 600, marginBottom: 3 }}>Paso {p.n} — {p.justificacion}</div>
              <div style={{ fontSize: 12, color: C.text, fontFamily: "monospace" }}>{p.enunciado}</div>
            </div>
          ))}
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.5 }}>{dem?.titulo}</div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Paso actual</div>
            <div style={{ fontSize: 12, color: C.accent, fontFamily: "monospace" }}>{dem?.pasos[pasoActual]?.enunciado || "—"}</div>
            <div style={{ fontSize: 10, color: C.green, marginTop: 4 }}>{dem?.pasos[pasoActual]?.justificacion}</div>
          </div>
          <div style={{ width: "100%", height: 5, background: C.border, borderRadius: 3 }}>
            <div style={{ width: `${((pasoActual + 1) / (dem?.pasos.length || 1)) * 100}%`, height: "100%", background: C.accent, borderRadius: 3, transition: "width .5s" }} />
          </div>
          <div style={{ fontSize: 10, color: C.muted, textAlign: "center" }}>{pasoActual + 1} / {dem?.pasos.length} pasos</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setPasoActual(p => Math.max(p - 1, 0)); setCorriendo(false); clearInterval(itvRef.current); }} disabled={pasoActual === 0}
              style={{ flex: 1, padding: "8px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: pasoActual === 0 ? C.border : C.muted, cursor: pasoActual === 0 ? "default" : "pointer" }}>◀ Anterior</button>
            <button onClick={corriendo ? () => { setCorriendo(false); clearInterval(itvRef.current); } : iniciar}
              style={{ flex: 1, padding: "8px", borderRadius: 8, background: C.accent, border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
              {corriendo ? "⏸ Pausar" : "▶ Auto"}
            </button>
            <button onClick={() => { setPasoActual(p => Math.min(p + 1, (dem?.pasos.length || 1) - 1)); setCorriendo(false); clearInterval(itvRef.current); }} disabled={pasoActual === (dem?.pasos.length || 1) - 1}
              style={{ flex: 1, padding: "8px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: pasoActual === (dem?.pasos.length || 1) - 1 ? C.border : C.muted, cursor: pasoActual === (dem?.pasos.length || 1) - 1 ? "default" : "pointer" }}>Siguiente ▶</button>
          </div>
          <button onClick={() => selDem(demIdx)}
            style={{ padding: "6px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, cursor: "pointer" }}>
            ↺ Reiniciar demostración
          </button>
        </div>
      </div>
    </div>
  );
}
