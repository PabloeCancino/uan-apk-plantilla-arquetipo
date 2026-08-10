// TrianguloSVG.jsx — Triángulo 30-60-90 con medidas exactas
// Hipotenusa = 2 | Cateto opuesto = 1 | Cateto adyacente = √3
import { useTheme } from "../hooks/useTheme";

// ── Geometría fija del triángulo 30-60-90 ────────────────────────────────────
// El triángulo se dibuja con:
//   A = vértice del ángulo θ = 30° (izquierda)
//   B = vértice del ángulo recto 90° (derecha abajo)
//   C = vértice del ángulo 60° (derecha arriba)
//
// Proporciones reales: hip=2, op=1, ad=√3
// Escalado SVG: ad_px=156, op_px=90  (factor = 156/√3 ≈ 90.07)

const SCALE = 90;          // px por unidad (ajustable)
const AD_PX = Math.round(Math.sqrt(3) * SCALE);  // √3 × 90 ≈ 156 px
const OP_PX = 1 * SCALE;                          // 1   × 90 = 90 px

const A = { x: 20, y: 160 };              // ángulo 30° (izquierda)
const B = { x: 20 + AD_PX, y: 160 };             // ángulo recto (derecha abajo)
const Cv = { x: 20 + AD_PX, y: 160 - OP_PX };    // ángulo 60° (derecha arriba)

const SVG_W = B.x + 70;
const SVG_H = 160 + 36;

// Centro de cada lado para colocar etiquetas
const midOp = { x: B.x, y: (B.y + Cv.y) / 2 };
const midAd = { x: (A.x + B.x) / 2, y: A.y };
const midHip = { x: (A.x + Cv.x) / 2, y: (A.y + Cv.y) / 2 };

// Ángulo de la hipotenusa para rotar la etiqueta
const DEG_HIP = -Math.atan2(A.y - Cv.y, Cv.x - A.x) * (180 / Math.PI); // ≈ -30°

export function TrianguloSVG({ catColor = "#58a6ff" }) {
  const { C } = useTheme();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ maxWidth: SVG_W }}>

        {/* Relleno del triángulo */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${Cv.x},${Cv.y}`}
          fill={`${catColor}12`}
          stroke={catColor}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* ── Cuadrado de ángulo recto en B ───────────────────────────────── */}
        <rect
          x={B.x - 13} y={B.y - 13}
          width={13} height={13}
          fill="none" stroke={C.muted} strokeWidth={1.5}
        />

        {/* ── Etiqueta ángulo θ = 30° ─────────────────────────────────────── */}
        <text x={A.x + 24} y={A.y - 6} fontSize={11} fill={catColor} fontWeight={700}>
          θ = 30°
        </text>

        {/* ── Etiqueta ángulo 60° — dentro del vértice superior derecho ──── */}
        <text x={Cv.x - 20} y={Cv.y + 22} fontSize={10} fill={C.muted}>60°</text>

        {/* ── Lado OPUESTO (vertical, derecha) ────────────────────────────── */}
        <text
          x={midOp.x + 6}
          y={midOp.y - 4}
          fontSize={10} fill="#f78166" fontWeight={600}
        >opuesto</text>
        <text
          x={midOp.x + 6}
          y={midOp.y + 9}
          fontSize={12} fill="#f78166" fontWeight={700} fontFamily="monospace"
        >= 1</text>

        {/* ── Lado ADYACENTE (horizontal, abajo) ──────────────────────────── */}
        <text
          x={midAd.x - 20}
          y={midAd.y + 17}
          fontSize={10} fill="#79c0ff" fontWeight={600}
        >adyacente</text>
        <text
          x={midAd.x - 4}
          y={midAd.y + 30}
          fontSize={12} fill="#79c0ff" fontWeight={700} fontFamily="monospace"
        >= √3</text>

        {/* ── HIPOTENUSA (diagonal) ─────────────────────────────────────────── */}
        <text
          x={midHip.x - 18}
          y={midHip.y - 8}
          fontSize={12} fill={catColor} fontWeight={700} fontFamily="monospace"
          transform={`rotate(${DEG_HIP}, ${midHip.x - 18}, ${midHip.y - 8})`}
        >hip = 2</text>

      </svg>

      {/* ── Tabla de razones trigonométricas exactas ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, width: "100%", maxWidth: 270 }}>
        {[
          { label: "sen 30° = op/hip", exact: "1/2", value: "0.5000", color: "#f78166" },
          { label: "cos 30° = ad/hip", exact: "√3/2", value: "0.8660", color: "#79c0ff" },
          { label: "tan 30° = op/ad", exact: "1/√3", value: "0.5774", color: "#d2a8ff" },
        ].map(({ label, exact, value, color }) => (
          <div key={label} style={{
            background: C.surface, border: `1px solid ${color}44`,
            borderRadius: 8, padding: "7px 5px", textAlign: "center",
          }}>
            <div style={{ fontSize: 8, color: C.muted, marginBottom: 2, lineHeight: 1.4 }}>{label}</div>
            <div style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "monospace" }}>{exact}</div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginTop: 1 }}>≈ {value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
