import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";

export function GraficoConjuntos() {
  const { C } = useContext(ThemeCtx);

  return (
    <div style={{
      width: "100%",
      maxWidth: 540,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
    }}>
      <svg viewBox="0 0 600 480" width="100%" height="100%" style={{ display: "block" }}>
        {/* Definición de la flecha del eje */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill={C.text} />
          </marker>
        </defs>

        {/* 1. Conjunto C (Números Complejos) */}
        <circle cx="240" cy="200" r="195" stroke={C.orange} strokeWidth="2" fill={`${C.orange}04`} />
        <text x="240" y="25" fill={C.orange} fontSize="13" fontWeight="bold" textAnchor="middle">
          ℂ Complejos
        </text>

        {/* 1.1 Subconjunto de Imaginarios (dentro de C, fuera de R) */}
        <circle cx="120" cy="130" r="45" stroke={C.orange} strokeWidth="1.5" strokeDasharray="3 3" fill={`${C.orange}0d`} />
        <text x="120" y="134" fill={C.orange} fontSize="11" fontWeight="bold" textAnchor="middle">
          ⅈ imaginarios
        </text>

        {/* 2. Conjunto R (Números Reales) */}
        <circle cx="280" cy="220" r="140" stroke={C.accent} strokeWidth="2" fill={`${C.accent}06`} />
        <text x="280" y="102" fill={C.accent} fontSize="13" fontWeight="bold" textAnchor="middle">
          ℝ Reales
        </text>

        {/* 2.1 Subconjunto de Irracionales (dentro de R, fuera de Q) */}
        <circle cx="350" cy="175" r="45" stroke={C.accent} strokeWidth="1.5" strokeDasharray="3 3" fill={`${C.accent}0d`} />
        <text x="350" y="179" fill={C.accent} fontSize="11" fontWeight="bold" textAnchor="middle">
          𝕀 Irracionales
        </text>

        {/* 3. Conjunto Q (Racionales) */}
        <circle cx="235" cy="245" r="80" stroke={C.yellow} strokeWidth="2" fill={`${C.yellow}0a`} />
        <text x="235" y="182" fill={C.yellow} fontSize="10" fontWeight="bold" textAnchor="middle">
          ℚ Racionales
        </text>

        {/* 4. Conjunto Z (Enteros) */}
        <circle cx="235" cy="252" r="60" stroke={C.green} strokeWidth="2" fill={`${C.green}0a`} />
        <text x="235" y="210" fill={C.green} fontSize="10" fontWeight="bold" textAnchor="middle">
          ℤ Enteros
        </text>

        {/* 5. Conjunto N (Naturales) */}
        <circle cx="235" cy="260" r="40" stroke={C.purple} strokeWidth="2" fill={`${C.purple}0a`} />
        <text x="235" y="264" fill={C.purple} fontSize="10" fontWeight="bold" textAnchor="middle">
          ℕ Naturales
        </text>

        {/* Relación de contención de conjuntos */}
        <g transform="translate(515, 205)" fill={C.text} fontSize="11" textAnchor="middle">
          <text x="0" y="0" fontSize="13" fontWeight="bold" fill={C.accent}>Relación lineal:</text>
          <text x="0" y="24" fontSize="12" fontWeight="600">ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ</text>
          <text x="0" y="52" fontSize="13" fontWeight="bold" fill={C.accent}>Particiones:</text>
          <text x="0" y="74" fontWeight="600">ℝ = ℚ ∪ 𝕀</text>
          <text x="0" y="94" fill={C.muted} fontSize="10">(Reales = Racionales ∪ Irracionales)</text>
          <text x="0" y="118" fontWeight="600">ℂ = ℝ ∪ 𝕚</text>
          <text x="0" y="138" fill={C.muted} fontSize="10">(Complejos = Reales ∪ Imaginarios)</text>
        </g>

        {/* Eje de la Recta Numérica (y = 410) */}
        <line x1="50" y1="410" x2="540" y2="410" stroke={C.text} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="555" y="414" fill={C.text} fontSize="13" fontWeight="bold">ℝ</text>

        {/* Ticks en la recta (de -4 a 4, espaciado de 50px, origen x=300) */}
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((val) => {
          const x = 300 + val * 50;
          return (
            <g key={val}>
              <line x1={x} y1="405" x2={x} y2="415" stroke={C.border} strokeWidth="1" />
              {val === 0 && (
                <text x={x} y="430" fill={C.green} fontSize="10" textAnchor="middle">0</text>
              )}
            </g>
          );
        })}

        {/* Punto -pi (-3.14) -> x = 300 - 157 = 143 */}
        <circle cx="143" cy="410" r="4" fill={C.accent} />
        <text x="143" y="430" fill={C.accent} fontSize="10" fontWeight="bold" textAnchor="middle">-π</text>

        {/* Punto sqrt(2) (1.41) -> x = 300 + 70.5 = 370.5 */}
        <circle cx="370.5" cy="410" r="4" fill={C.accent} />
        <text x="370.5" y="395" fill={C.accent} fontSize="10" fontWeight="bold" textAnchor="middle">√2</text>

        {/* Etiquetas inferiores categorizadas de la recta */}
        <text x="143" y="460" fill={C.accent} fontSize="10" fontWeight="bold" textAnchor="middle">Irracionales</text>
        <text x="300" y="460" fill={C.green} fontSize="10" fontWeight="bold" textAnchor="middle">Enteros</text>
        <text x="450" y="460" fill={C.yellow} fontSize="10" fontWeight="bold" textAnchor="middle">Racionales no enteros</text>
      </svg>
    </div>
  );
}
