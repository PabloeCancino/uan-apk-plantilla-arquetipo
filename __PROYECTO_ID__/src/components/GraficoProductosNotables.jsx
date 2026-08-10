import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { InlineFormula } from "./Formula";

export function GraficoProductosNotables() {
  const { C } = useContext(ThemeCtx);

  return (
    <div style={{
      width: "100%",
      maxWidth: 580,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
      {/* Título de la sección */}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
        Demostraciones Geométricas de Productos Notables
      </div>

      {/* TEOREMA 2.1 */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, marginBottom: 12 }}>
          Demostración geométrica de <InlineFormula latex="(a + b)^2 = a^2 + 2ab + b^2" />
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <svg viewBox="0 0 300 240" width="220px" height="176px" style={{ display: "block" }}>
            <defs>
              <marker id="geom-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill={C.text} />
              </marker>
            </defs>

            {/* Cuadrado a^2 (Azul) */}
            <rect x="70" y="70" width="120" height="120" stroke={C.text} strokeWidth="1.5" fill={`${C.accent}15`} />
            <text x="130" y="135" fill={C.accent} fontSize="14" fontWeight="bold" textAnchor="middle">
              a<tspan baselineShift="super" fontSize="9">2</tspan>
            </text>

            {/* Rectángulo ab (Naranja inferior-derecha) */}
            <rect x="190" y="70" width="60" height="120" stroke={C.text} strokeWidth="1.5" fill={`${C.orange}15`} />
            <text x="220" y="135" fill={C.orange} fontSize="14" fontWeight="bold" textAnchor="middle">ab</text>

            {/* Rectángulo ab (Naranja superior-izquierda) */}
            <rect x="70" y="10" width="120" height="60" stroke={C.text} strokeWidth="1.5" fill={`${C.orange}15`} />
            <text x="130" y="45" fill={C.orange} fontSize="14" fontWeight="bold" textAnchor="middle">ab</text>

            {/* Cuadrado b^2 (Verde superior-derecha) */}
            <rect x="190" y="10" width="60" height="60" stroke={C.text} strokeWidth="1.5" fill={`${C.green}15`} />
            <text x="220" y="45" fill={C.green} fontSize="14" fontWeight="bold" textAnchor="middle">
              b<tspan baselineShift="super" fontSize="9">2</tspan>
            </text>

            {/* Flechas de cota de Altura (izquierda) */}
            {/* Altura a */}
            <line x1="45" y1="70" x2="45" y2="190" stroke={C.text} strokeWidth="1" markerStart="url(#geom-arrow)" markerEnd="url(#geom-arrow)" />
            <text x="35" y="135" fill={C.text} fontSize="12" fontStyle="italic" textAnchor="middle">a</text>
            {/* Altura b */}
            <line x1="45" y1="10" x2="45" y2="70" stroke={C.text} strokeWidth="1" markerStart="url(#geom-arrow)" markerEnd="url(#geom-arrow)" />
            <text x="35" y="45" fill={C.text} fontSize="12" fontStyle="italic" textAnchor="middle">b</text>

            {/* Flechas de cota de Ancho (abajo) */}
            {/* Ancho a */}
            <line x1="70" y1="205" x2="190" y2="205" stroke={C.text} strokeWidth="1" markerStart="url(#geom-arrow)" markerEnd="url(#geom-arrow)" />
            <text x="130" y="222" fill={C.text} fontSize="12" fontStyle="italic" textAnchor="middle">a</text>
            {/* Ancho b */}
            <line x1="190" y1="205" x2="250" y2="205" stroke={C.text} strokeWidth="1" markerStart="url(#geom-arrow)" markerEnd="url(#geom-arrow)" />
            <text x="220" y="222" fill={C.text} fontSize="12" fontStyle="italic" textAnchor="middle">b</text>
          </svg>
        </div>

        <div style={{ fontSize: 12, lineHeight: 1.6, color: C.muted }}>
          El cuadrado de lado <InlineFormula latex="(a + b)" /> se descompone en cuatro regiones. Área total = <InlineFormula latex="(a + b)^2 = a^2 + ab + ab + b^2 = a^2 + 2ab + b^2" />. <InlineFormula latex="\square" />
        </div>
      </div>

      <div style={{ height: 1, background: `${C.border}66` }} />

      {/* TEOREMA 2.2 */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, marginBottom: 8 }}>
          Demostración geométrica de <InlineFormula latex="a^2 - b^2 = (a + b)(a - b)" />
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.6, color: C.muted }}>
          Recortando un cuadrado de lado <InlineFormula latex="b" /> de la esquina de un cuadrado de lado <InlineFormula latex="a" /> y reagrupando las piezas restantes se forma un rectángulo de lados <InlineFormula latex="(a + b)" /> y <InlineFormula latex="(a - b)" />, cuya área es <InlineFormula latex="a^2 - b^2" />. <InlineFormula latex="\square" />
        </div>
      </div>
    </div>
  );
}
