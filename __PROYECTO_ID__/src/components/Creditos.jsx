// NTE-UAN-APK-001 — Créditos institucionales — Trigonometría
import { useTheme } from "../hooks/useTheme";
import { CREDITOS, META } from "../data/contenido.js";
import escudoUAN from "../ESCUDO-UAN-Azul.png";

export function Creditos() {
  const { C } = useTheme();
  const COLORES = [C.accent, C.green, C.orange, "#a371f7"];
  const tarjetas = CREDITOS.map((g, i) => ({ ...g, color: COLORES[i % COLORES.length] }));

  return (
    <div className="fade-slide-in contenido-vista" style={{ maxWidth: 680 }}>
      {/* Encabezado institucional */}
      <div style={{ textAlign: "center", marginBottom: "var(--sp-lg)", padding: "var(--sp-lg) var(--sp-md)", background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`, border: `1px solid ${C.border}`, borderRadius: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
          <img src={escudoUAN} alt="Escudo Universidad Autónoma de Nayarit"
            style={{ width: "clamp(80px, 18vw, 120px)", height: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }} />
        </div>
        <div style={{ fontSize: "var(--fs-xs)", color: C.accent, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          Universidad Autónoma de Nayarit
        </div>
        <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: 700, color: C.text, margin: "0 0 6px", letterSpacing: -0.5 }}>
          {META.nombreCompleto}
        </h2>
        <div style={{ fontSize: "var(--fs-sm)", color: C.muted, lineHeight: 1.6 }}>
          {META.unidad}<br />
          {META.programa} · Academia de Matemáticas
        </div>
        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, margin: "var(--sp-md) auto 0", borderRadius: 2 }} />
      </div>

      {/* Tarjetas de créditos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-sm)" }}>
        {tarjetas.map((grupo, gi) => (
          <div key={gi} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "var(--sp-xs) var(--sp-md)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, background: `${grupo.color}0d` }}>
              <span style={{ fontSize: "var(--fs-md)" }}>{grupo.icono}</span>
              <span style={{ fontSize: "var(--fs-xs)", fontWeight: 700, color: grupo.color, textTransform: "uppercase", letterSpacing: 1.5 }}>{grupo.rol}</span>
            </div>
            {grupo.personas.map((p, pi) => (
              <div key={pi} style={{ padding: "var(--sp-sm) var(--sp-md)", borderBottom: pi < grupo.personas.length - 1 ? `1px solid ${C.border}44` : "none", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${grupo.color}44, ${grupo.color}11)`, border: `1px solid ${grupo.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: grupo.color }}>
                  {p.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: C.text }}>{p.nombre}</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: C.muted, marginTop: 2 }}>{p.detalle}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pie institucional */}
      <div style={{ textAlign: "center", marginTop: "var(--sp-lg)", padding: "var(--sp-md)", border: `1px solid ${C.border}44`, borderRadius: 12 }}>
        <div style={{ fontSize: "var(--fs-xs)", color: C.muted, lineHeight: 2 }}>
          <span style={{ color: C.accent, fontWeight: 600 }}>Tepic, Nayarit</span>{" — Junio de 2026"}<br />
          Versión {META.version} · {META.norma}<br />
          <span style={{ fontSize: "var(--fs-xs)", opacity: 0.5 }}>Recurso educativo de uso académico · UAN © 2026</span>
        </div>
      </div>
    </div>
  );
}
