import katex from "katex";
import "katex/dist/katex.min.css";
import { useContext } from "react";
import { ThemeCtx } from "../ThemeCtx";

// Macros LaTeX compartidos por todos los componentes
const MACROS = {
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\Q": "\\mathbb{Q}",
  "\\C": "\\mathbb{C}",
  "\\I": "\\mathbb{I}",
  "\\i": "\\mathbb{i}",
  "\\O": "\\emptyset",
  "\\G": "\\mathcal{G}",
  "\\sen": "\\operatorname{sen}",
  "\\tg": "\\operatorname{tg}",
  "\\cotg": "\\operatorname{cotg}",
  "\\senh": "\\operatorname{senh}",
  "\\tgh": "\\operatorname{tgh}",
  "\\sech": "\\operatorname{sech}",
  "\\csch": "\\operatorname{csch}",
  "\\coth": "\\operatorname{coth}",
};

/**
 * Formula — Renderiza LaTeX en bloque (display math).
 * @param {string} latex  - Cadena LaTeX a renderizar
 * @param {string} color  - Color del borde izquierdo (por defecto azul UAN)
 */
export function Formula({ latex, color = "#58a6ff" }) {
  const { C } = useContext(ThemeCtx);
  if (!latex) return null;
  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      errorColor: "#f85149",
      macros: MACROS,
    });
  } catch {
    html = `<span style="color:#f85149;font-family:monospace">${latex}</span>`;
  }
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        background: C.surface2,
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: "14px 18px",
        overflowX: "auto",
        color: C.text,
        fontSize: 14,
        marginTop: 12,
        lineHeight: 1.6,
      }}
    />
  );
}

/**
 * InlineFormula — Renderiza LaTeX inline dentro de texto.
 * @param {string} latex - Cadena LaTeX a renderizar
 */
export function InlineFormula({ latex }) {
  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode: false,
      throwOnError: false,
      errorColor: "#f85149",
      macros: MACROS,
    });
  } catch {
    html = `<span style="color:#f85149;font-family:monospace">${latex}</span>`;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
