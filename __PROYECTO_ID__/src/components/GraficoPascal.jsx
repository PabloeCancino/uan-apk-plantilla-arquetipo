import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { InlineFormula } from "./Formula";

export function GraficoPascal() {
  const { C } = useContext(ThemeCtx);

  const rows = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1]
  ];

  // Helper to compute node position
  const getPos = (n, k) => {
    const cx = 185 + (k - n / 2) * 44;
    const cy = 30 + n * 42;
    return { cx, cy };
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 500,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
    }}>
      {/* Definición del Triángulo de Pascal */}
      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 16 }}>
        <strong>Definición (Triángulo de Pascal):</strong> Los coeficientes binomiales <InlineFormula latex="\binom{n}{k}" /> se leen en el triángulo de Pascal; cada número es la suma de los dos que tiene directamente encima.
      </div>

      <svg viewBox="0 0 450 260" width="100%" height="100%" style={{ display: "block" }}>
        {/* Dibujar las líneas conectoras entre padres e hijos */}
        <g stroke={`${C.border}`} strokeWidth="1" strokeDasharray="3 3">
          {rows.map((row, n) => {
            if (n === rows.length - 1) return null; // La última fila no tiene hijos en el dibujo
            return row.map((_, k) => {
              const parent = getPos(n, k);
              const childLeft = getPos(n + 1, k);
              const childRight = getPos(n + 1, k + 1);
              return (
                <g key={`${n}-${k}`}>
                  <line x1={parent.cx} y1={parent.cy} x2={childLeft.cx} y2={childLeft.cy} />
                  <line x1={parent.cx} y1={parent.cy} x2={childRight.cx} y2={childRight.cy} />
                </g>
              );
            });
          })}
        </g>

        {/* Dibujar los nodos con los números */}
        {rows.map((row, n) =>
          row.map((val, k) => {
            const { cx, cy } = getPos(n, k);
            return (
              <g key={`${n}-${k}`}>
                {/* Fondo sólido circular para tapar las líneas tras el texto */}
                <circle cx={cx} cy={cy} r="14" fill={C.surface} stroke={C.border} strokeWidth="0.5" />
                <text
                  x={cx}
                  y={cy + 4}
                  fill={val === 1 ? C.muted : C.accent}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {val}
                </text>
              </g>
            );
          })
        )}

        {/* Dibujar los binomios correspondientes a la derecha */}
        {rows.map((_, n) => {
          const { cy } = getPos(n, 0);
          return (
            <g key={n}>
              {/* Línea punteada que conecta la fila con su binomio */}
              <line x1="320" y1={cy} x2="350" y2={cy} stroke={`${C.border}88`} strokeWidth="0.8" strokeDasharray="2 2" />
              <text
                x="360"
                y={cy + 4}
                fill={C.orange}
                fontSize="11"
                fontWeight="600"
                fontFamily="monospace"
                textAnchor="start"
              >
                (a + b)
                <tspan baselineShift="super" fontSize="8" fill={C.orange}>
                  {n}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
