// NTE-UAN-APK-001 — VistaTema: renderiza el contenido educativo de un tema
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { CATEGORIAS } from "../data/contenido.js";
import { Formula } from "./Formula";
import { TablaContenedor } from "./TablaContenedor";
import { CirculoUnitarioSVG } from "./CirculoUnitarioSVG";
import { TrianguloSVG } from "./TrianguloSVG";
import { GraficaTrigSVG } from "./GraficaTrigSVG";

export function VistaTema({ tema }) {
  const { C } = useTheme();
  const cat = CATEGORIAS.find(c => c.id === tema.categoria);

  const hasTabla = !!tema.tabla;
  const hasCirculo = tema.visual === "circulo";
  const hasTriang = tema.visual === "triangulo";
  const hasGrafica = tema.visual === "grafica";
  const hasVisual = hasTabla || hasCirculo || hasTriang || hasGrafica;

  return (
    <div key={tema.id} className="fade-slide-in contenido-vista">
      {/* Chip de categoría */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span className="tema-categoria-chip" style={{
          padding: "2px 10px", borderRadius: 20,
          background: `${cat.color}22`, color: cat.color,
          fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5,
        }}>
          {cat.icon} {cat.nombre}
        </span>
      </div>

      <h2 className="tema-titulo" style={{ color: C.text, fontWeight: 700, margin: "8px 0 16px", letterSpacing: -0.5 }}>
        {tema.titulo}
      </h2>

      {/* Grid definición + visual */}
      <div className="vista-tema-grid" style={{ marginBottom: "var(--sp-md)" }}>
        <div>
          <div className="tema-definicion" style={{ color: C.muted, marginTop: 0 }}>
            {tema.definicion.split("\n\n").map((bloque, bi) => (
              <p key={bi} style={{ margin: bi === 0 ? "0 0 10px" : "10px 0", whiteSpace: "pre-line" }}>
                {bloque}
              </p>
            ))}
          </div>
          <Formula latex={tema.formula} color={cat.color} />
        </div>
        {hasVisual && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "var(--sp-sm)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflowX: "auto",
          }}>
            {hasCirculo && <CirculoUnitarioSVG catColor={cat.color} />}
            {hasTriang && <TrianguloSVG catColor={cat.color} />}
            {hasGrafica && <GraficaTrigSVG funcion={tema.graficaFn || "sen"} catColor={cat.color} />}
            {hasTabla && <TablaContenedor tabla={tema.tabla} catColor={cat.color} />}
          </div>
        )}
      </div>

      {/* Notas */}
      {tema.notas && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "var(--sp-sm) var(--sp-md)" }}>
          <div className="tema-nota-label" style={{ color: C.muted, marginBottom: "var(--sp-xs)", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Observaciones clave
          </div>
          {tema.notas.map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: cat.color, fontSize: "var(--fs-md)", marginTop: 1, minWidth: 16 }}>›</span>
              <span className="tema-nota-texto" style={{ color: C.muted }}>{n}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
