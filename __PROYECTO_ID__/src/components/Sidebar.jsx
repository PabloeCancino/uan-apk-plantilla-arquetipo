// NTE-UAN-APK-001 — Sidebar: navegación lateral por categorías y temas
import { useTheme } from "../hooks/useTheme";
import { CATEGORIAS, META } from "../data/contenido.js";

export function Sidebar({ catActiva, setCatActiva, temaActivo, setTemaActivo,
  busqueda, setBusqueda, progreso, abierto, onCerrar }) {
  const { C } = useTheme();
  return (
    <div className={`sidebar-panel${abierto ? " abierto" : ""}`}
      style={{ width: 260, minWidth: 260, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 14px 10px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: -0.5 }}>
          {META.nombreCompleto} <span style={{ color: C.accent }}>APK-UAN</span>
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
          {META.nombreCompleto} · {META.programa}<br />Universidad Autónoma de Nayarit
        </div>
      </div>
      <div style={{ padding: "10px 14px 8px" }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍 Buscar tema..."
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 12, boxSizing: "border-box" }} />
      </div>
      <div style={{ overflowY: "auto", flex: 1, paddingBottom: 20 }}>
        {CATEGORIAS.map(cat => {
          const temasFilt = busqueda
            ? cat.temas.filter(t => t.titulo.toLowerCase().includes(busqueda.toLowerCase()) || t.definicion.toLowerCase().includes(busqueda.toLowerCase()))
            : cat.temas;
          if (busqueda && temasFilt.length === 0) return null;
          const visitadosDeCat = cat.temas.filter(t => progreso.temasVisitados.includes(t.id)).length;
          return (
            <div key={cat.id}>
              <button onClick={() => setCatActiva(catActiva === cat.id ? null : cat.id)}
                style={{ width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>{cat.icon}</span>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 600, flex: 1, textAlign: "left" }}>{cat.nombre}</span>
                <span style={{ fontSize: 9, color: C.muted, marginLeft: "auto" }}>{visitadosDeCat}/{cat.temas.length}</span>
                <span style={{ color: C.muted, fontSize: 10 }}>{catActiva === cat.id ? "▼" : "▶"}</span>
              </button>
              {(catActiva === cat.id || busqueda) && temasFilt.map(t => {
                const visitado = progreso.temasVisitados.includes(t.id);
                return (
                  <button key={t.id} onClick={() => { setTemaActivo(t.id, cat.id); onCerrar && onCerrar(); }}
                    style={{ width: "100%", padding: "6px 14px 6px 30px", background: temaActivo === t.id ? `${cat.color}22` : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", borderLeft: temaActivo === t.id ? `2px solid ${cat.color}` : "2px solid transparent" }}>
                    <span style={{ fontSize: 11, color: temaActivo === t.id ? cat.color : C.muted, flex: 1, textAlign: "left" }}>{t.titulo}</span>
                    {visitado && <span style={{ fontSize: 10, color: C.green, marginLeft: "auto" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
