import { useContext, useState } from "react";
import { ThemeCtx } from "../ThemeCtx";
import { GraficoConjuntos } from "./GraficoConjuntos";
import GraficoRectaReal from "./GraficoRectaReal";

export function GraficoSistemaNumerico() {
  const { C } = useContext(ThemeCtx);
  const [activeTab, setActiveTab] = useState("conjuntos"); // "conjuntos" o "recta"

  return (
    <div style={{
      width: "100%",
      maxWidth: 580,
      margin: "24px auto 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setActiveTab("conjuntos")}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${C.accent}`,
            background: activeTab === "conjuntos" ? C.accent : "transparent",
            color: activeTab === "conjuntos" ? C.bg : C.accent,
            fontWeight: "bold",
            fontSize: 11,
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s ease"
          }}
        >
          Diagrama de Venn (Conjuntos)
        </button>
        <button
          onClick={() => setActiveTab("recta")}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${C.accent}`,
            background: activeTab === "recta" ? C.accent : "transparent",
            color: activeTab === "recta" ? C.bg : C.accent,
            fontWeight: "bold",
            fontSize: 11,
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s ease"
          }}
        >
          Recta Numérica
        </button>
      </div>

      <div style={{ width: "100%" }}>
        {activeTab === "conjuntos" ? <GraficoConjuntos /> : <GraficoRectaReal />}
      </div>
    </div>
  );
}
