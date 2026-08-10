// ThemeCtx.js — Paletas de color y contexto de tema
// NTE-UAN-APK-001 v1.3 — No modificar este archivo
import { createContext } from "react";

export const DARK = {
  bg:         "#010409",
  surface:    "#0d1117",
  surface2:   "#161b22",
  border:     "#21262d",
  accent:     "#58a6ff",
  accentSoft: "#58a6ff18",
  green:      "#3fb950",
  greenSoft:  "#238636",
  orange:     "#f0883e",
  red:        "#f85149",
  text:       "#e6edf3",
  muted:      "#8b949e",
  purple:     "#bc8cff",
  yellow:     "#e3b341",
  teal:       "#39d353",
  nombre:     "oscuro",
};

export const ThemeCtx = createContext({ C: DARK, toggleTema: () => {} });
