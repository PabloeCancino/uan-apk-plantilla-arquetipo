// NTE-UAN-APK-001 — TablaContenedor: tablas de datos con coloreado automático
import { useTheme } from "../hooks/useTheme";

export function TablaContenedor({ tabla, catColor }) {
  const { C } = useTheme();
  if (!tabla || !tabla.encabezados || !tabla.filas) return null;

  const colorAuto = tabla.colorAuto !== false;
  const resaltadas = tabla.resaltadas || [];

  const cellColor = (val) => {
    if (!colorAuto) return C.text;
    const v = String(val).trim().toUpperCase();
    if (v === "V" || v === "T" || v === "1" || v === "TRUE") return C.green;
    if (v === "F" || v === "FALSE" || v === "0") return C.red;
    return C.text;
  };

  const cellBg = (val) => {
    if (!colorAuto) return "transparent";
    const v = String(val).trim().toUpperCase();
    if (v === "V" || v === "T" || v === "1" || v === "TRUE") return `${C.green}18`;
    if (v === "F" || v === "FALSE" || v === "0") return `${C.red}15`;
    return "transparent";
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {tabla.titulo && (
        <div style={{
          fontSize: 11, color: catColor, fontWeight: 700, letterSpacing: 1.2,
          textTransform: "uppercase", marginBottom: 8, textAlign: "center",
        }}>
          {tabla.titulo}
        </div>
      )}
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontFamily: "'IBM Plex Mono','Courier New',monospace", fontSize: 12,
      }}>
        <thead>
          <tr>
            {tabla.encabezados.map((h, i) => (
              <th key={i} style={{
                padding: "7px 12px", textAlign: "center",
                background: `${catColor}22`, color: catColor,
                fontWeight: 700, border: `1px solid ${C.border}`,
                letterSpacing: 0.5, whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((fila, ri) => {
            const highlight = resaltadas.includes(ri);
            return (
              <tr key={ri} style={{
                background: highlight ? `${catColor}12` : "transparent",
                borderLeft: highlight ? `3px solid ${catColor}` : "3px solid transparent",
                transition: "background .15s",
              }}>
                {fila.map((celda, ci) => (
                  <td key={ci} style={{
                    padding: "6px 12px", textAlign: "center",
                    border: `1px solid ${C.border}`,
                    color: cellColor(celda),
                    background: cellBg(celda),
                  }}>
                    {celda}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
