// NTE-UAN-APK-001 — VennSVG: diagramas de Venn interactivos
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";

// ── Operaciones disponibles ────────────────────────────────────────────────────
export const VENN_OPS = [
  { tipo: "union", label: "A ∪ B", desc: "Unión" },
  { tipo: "interseccion", label: "A ∩ B", desc: "Intersección" },
  { tipo: "complemento", label: "Aᶜ", desc: "Complemento de A" },
  { tipo: "diferencia", label: "A \\ B", desc: "Diferencia A \\ B" },
  { tipo: "diferencia_ba", label: "B \\ A", desc: "Diferencia B \\ A" },
  { tipo: "simetrica", label: "A △ B", desc: "Diferencia simétrica" },
  { tipo: "contencion", label: "A ⊆ B", desc: "Contencion (A ⊆ B)" },
  { tipo: "disjuntos", label: "A∩B=∅", desc: "Conjuntos disjuntos" },
  { tipo: "triple", label: "A,B,C", desc: "Tres conjuntos (P.I.E.)" },
  { tipo: "igualdad", label: "A = B", desc: "Igualdad (A = B)" },
  { tipo: "demorgan", label: "(A∪B)ᶜ", desc: "De Morgan: (A∪B)ᶜ = Aᶜ∩Bᶜ" },
];

// ── Diagrama SVG base ──────────────────────────────────────────────────────────
export function VennSVG({ tipo = "union", catColor, W = 260, H = 160, labelA = "A", labelB = "B" }) {
  const { C } = useTheme();
  const shade = `${catColor || "#39d353"}55`;
  const cA = { x: 100, y: H / 2, r: 58 };
  const cB = { x: 160, y: H / 2, r: 58 };
  const colorA = "#58a6ff", colorB = "#f78166";
  const u = tipo;

  const ops = {
    union: <>
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill={shade} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill={shade} />
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke={colorB} strokeWidth={2.2} />
    </>,
    interseccion: <>
      <defs><clipPath id={`cp-${u}`}><circle cx={cA.x} cy={cA.y} r={cA.r} /></clipPath></defs>
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill={shade} clipPath={`url(#cp-${u})`} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke={colorB} strokeWidth={2.2} />
    </>,
    complemento: <>
      <defs><mask id={`mk-${u}`}>
        <rect x={0} y={0} width={W} height={H} fill="white" />
        <circle cx={cA.x} cy={cA.y} r={cA.r} fill="black" />
      </mask></defs>
      <rect x={3} y={3} width={W - 6} height={H - 6} fill={shade} mask={`url(#mk-${u})`} rx={4} />
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <text x={cA.x} y={cA.y + 5} textAnchor="middle" fontSize={14} fontFamily="monospace" fontWeight="bold" fill={colorA}>A</text>
      <text x={W - 24} y={20} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight="bold" fill={colorB}>Aᶜ</text>
    </>,
    diferencia: <>
      <defs><mask id={`mk-${u}`}>
        <circle cx={cA.x} cy={cA.y} r={cA.r} fill="white" />
        <circle cx={cB.x} cy={cB.y} r={cB.r} fill="black" />
      </mask></defs>
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill={shade} mask={`url(#mk-${u})`} />
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke={colorB} strokeWidth={2.2} />
    </>,
    simetrica: <>
      <defs>
        <mask id={`mk-a-${u}`}><circle cx={cA.x} cy={cA.y} r={cA.r} fill="white" /><circle cx={cB.x} cy={cB.y} r={cB.r} fill="black" /></mask>
        <mask id={`mk-b-${u}`}><circle cx={cB.x} cy={cB.y} r={cB.r} fill="white" /><circle cx={cA.x} cy={cA.y} r={cA.r} fill="black" /></mask>
      </defs>
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill={shade} mask={`url(#mk-a-${u})`} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill={shade} mask={`url(#mk-b-${u})`} />
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke={colorB} strokeWidth={2.2} />
    </>,
    diferencia_ba: <>
      <defs><mask id={`mk-${u}`}>
        <circle cx={cB.x} cy={cB.y} r={cB.r} fill="white" />
        <circle cx={cA.x} cy={cA.y} r={cA.r} fill="black" />
      </mask></defs>
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill={shade} mask={`url(#mk-${u})`} />
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke={colorB} strokeWidth={2.2} />
    </>,
    disjuntos: <>
      <circle cx={70} cy={H / 2} r={52} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={190} cy={H / 2} r={52} fill="none" stroke={colorB} strokeWidth={2.2} />
      <text x={70} y={H / 2 + 5} textAnchor="middle" fontSize={14} fontFamily="monospace" fontWeight="bold" fill={colorA}>{labelA}</text>
      <text x={190} y={H / 2 + 5} textAnchor="middle" fontSize={14} fontFamily="monospace" fontWeight="bold" fill={colorB}>{labelB}</text>
    </>,
    contencion: <>
      <circle cx={W / 2} cy={H / 2} r={62} fill="none" stroke={colorB} strokeWidth={2.2} />
      <circle cx={W / 2 - 10} cy={H / 2} r={20} fill={shade} stroke={colorA} strokeWidth={2.2} />
      <text x={W / 2 - 10} y={H / 2 + 5} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill={colorA}>{labelA}</text>
      <text x={W / 2 + 44} y={22} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill={colorB}>{labelB}</text>
    </>,
    triple: <>
      <circle cx={92} cy={60} r={40} fill={shade} stroke={colorA} strokeWidth={2.2} />
      <circle cx={168} cy={60} r={40} fill={shade} stroke={colorB} strokeWidth={2.2} />
      <circle cx={130} cy={108} r={40} fill={shade} stroke="#a371f7" strokeWidth={2.2} />
      <text x={60} y={36} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill={colorA}>A</text>
      <text x={200} y={36} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill={colorB}>B</text>
      <text x={130} y={154} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill="#a371f7">C</text>
    </>,
    igualdad: <>
      <circle cx={W / 2} cy={H / 2} r={60} fill={shade} />
      <circle cx={W / 2} cy={H / 2} r={60} fill="none" stroke={colorA} strokeWidth={3} />
      <circle cx={W / 2} cy={H / 2} r={60} fill="none" stroke={colorB} strokeWidth={2.5} strokeDasharray="7 7" />
      <text x={W / 2 - 30} y={H / 2 - 64} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill={colorA}>A</text>
      <text x={W / 2 + 30} y={H / 2 + 76} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight="bold" fill={colorB}>B</text>
      <text x={W / 2} y={H / 2 + 5} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={C.muted} opacity={0.8}>A = B</text>
    </>,
    demorgan: <>
      <defs><mask id={`mk-${u}`}>
        <rect x={0} y={0} width={W} height={H} fill="white" />
        <circle cx={cA.x} cy={cA.y} r={cA.r} fill="black" />
        <circle cx={cB.x} cy={cB.y} r={cB.r} fill="black" />
      </mask></defs>
      <rect x={3} y={3} width={W - 6} height={H - 6} fill={shade} mask={`url(#mk-${u})`} rx={4} />
      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke={colorA} strokeWidth={2.2} />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke={colorB} strokeWidth={2.2} />
      <text x={cA.x - 22} y={cA.y + 5} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight="bold" fill={colorA}>A</text>
      <text x={cB.x + 22} y={cB.y + 5} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight="bold" fill={colorB}>B</text>
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>(A∪B)ᶜ = Aᶜ∩Bᶜ</text>
    </>,
  };

  const showDefaultLabels = !["disjuntos", "contencion", "triple", "igualdad", "complemento", "demorgan"].includes(tipo);
  return (
    <svg width={W} height={H} overflow="hidden" style={{ display: "block", margin: "0 auto" }}>
      <rect x={2} y={2} width={W - 4} height={H - 4} fill="none" stroke={C.border} strokeWidth={1.5} rx={6} />
      <text x={W - 8} y={16} textAnchor="end" fontSize={10} fill={C.muted} fontFamily="monospace">U</text>
      {ops[tipo] || ops["union"]}
      {showDefaultLabels && <>
        <text x={cA.x - 22} y={cA.y + 5} textAnchor="middle" fontSize={14} fontFamily="monospace" fontWeight="bold" fill={colorA}>{labelA}</text>
        <text x={cB.x + 22} y={cB.y + 5} textAnchor="middle" fontSize={14} fontFamily="monospace" fontWeight="bold" fill={colorB}>{labelB}</text>
      </>}
    </svg>
  );
}

// ── Venn Interactivo con selector ──────────────────────────────────────────────
export function VennInteractivo({ catColor }) {
  const { C } = useTheme();
  const [activo, setActivo] = useState("union");
  const op = VENN_OPS.find(o => o.tipo === activo);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
        {VENN_OPS.map(o => (
          <button key={o.tipo} onClick={() => setActivo(o.tipo)} style={{
            padding: "4px 10px", borderRadius: 6, fontSize: 10, fontFamily: "monospace",
            border: `1px solid ${activo === o.tipo ? catColor : C.border}`,
            background: activo === o.tipo ? `${catColor}22` : "transparent",
            color: activo === o.tipo ? catColor : C.muted, cursor: "pointer",
          }}>{o.label}</button>
        ))}
      </div>
      <VennSVG tipo={activo} catColor={catColor} />
      <div style={{ fontSize: 11, color: C.muted }}>{op?.desc}</div>
    </div>
  );
}
