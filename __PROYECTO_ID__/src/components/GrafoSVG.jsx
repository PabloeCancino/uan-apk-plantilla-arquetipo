// NTE-UAN-APK-001 — GrafoSVG: visualizador interactivo de grafos y hiperaristas
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";


// ── Utilidades de layout ───────────────────────────────────────────────────────
function circleLayout(n, cx, cy, r) {
  return Array.from({ length: n }, (_, i) => ({
    x: cx + r * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
    y: cy + r * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
  }));
}

function HiperAristaSVG({ indices, pos, color }) {
  if (!indices || indices.length < 2) return null;
  const cx = indices.reduce((s, i) => s + pos[i].x, 0) / indices.length;
  const cy = indices.reduce((s, i) => s + pos[i].y, 0) / indices.length;
  const pts = indices.map(i => {
    const dx = pos[i].x - cx, dy = pos[i].y - cy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return `${pos[i].x + dx / len * 10},${pos[i].y + dy / len * 10}`;
  }).join(" ");
  return (
    <polygon points={pts} fill={`${color}22`} stroke={color} strokeWidth={1.5} strokeDasharray="4 2" />
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export function GrafoSVG({ vertices = [], aristas = [], hyperEdges = [], posiciones: posProp,
  resaltados = [], aristaResaltada = [], aristaColor = {}, vertexColor = {},
  grados = null, pesos = null, size = 200, dirigido = false, interactivo = true }) {
  const { C } = useTheme();
  const n = vertices.length;
  const cx = size / 2, cy = size / 2;
  const r = Math.min(size * 0.35, size / 2 - 20);

  const [pos, setPos] = useState(() => posProp || circleLayout(n, cx, cy, r));
  const dragging = useRef(null);

  useEffect(() => {
    setPos(posProp || circleLayout(n, cx, cy, r));
  }, [posProp, n, cx, cy, r]);

  const getAristaColor = (a, b) => {
    const key = `${a}-${b}`, keyR = `${b}-${a}`;
    if (aristaColor[key]) return aristaColor[key];
    if (aristaColor[keyR]) return aristaColor[keyR];
    const hl = aristaResaltada.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    return hl ? C.orange : C.border;
  };

  const onPointerDown = (i, e) => {
    if (!interactivo) return;
    e.target.setPointerCapture(e.pointerId);
    dragging.current = i;
  };
  const onPointerMove = (e) => {
    if (dragging.current === null || !interactivo) return;
    const svg = e.currentTarget.closest("svg");
    const rect = svg.getBoundingClientRect();
    setPos(prev => {
      const nue = [...prev];
      nue[dragging.current] = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      return nue;
    });
  };
  const onPointerUp = () => { dragging.current = null; };

  return (
    <svg width={size} height={size}
      style={{ display: "block", margin: "0 auto", overflow: "visible", touchAction: interactivo ? "none" : "auto" }}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp} onPointerLeave={onPointerUp}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.text} />
        </marker>
      </defs>

      {hyperEdges.map((he, i) => (
        <HiperAristaSVG key={`he-${i}`} indices={he} pos={pos} color={C.purple} />
      ))}

      {aristas.map(([a, b], i) => {
        if (a >= pos.length || b >= pos.length) return null;
        const col = getAristaColor(a, b);
        const thick = col !== C.border;
        const mx = (pos[a].x + pos[b].x) / 2, my = (pos[a].y + pos[b].y) / 2;
        // Para aristas dirigidas, acortar el extremo final para que la flecha
        // quede visible en el borde del nodo destino (r=15) y no oculta debajo
        let x2 = pos[b].x, y2 = pos[b].y;
        if (dirigido) {
          const dx = pos[b].x - pos[a].x;
          const dy = pos[b].y - pos[a].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = 15 + 7; // radio nodo + espacio punta de flecha
          x2 = pos[b].x - (dx / dist) * offset;
          y2 = pos[b].y - (dy / dist) * offset;
        }
        return (
          <g key={i}>
            <line x1={pos[a].x} y1={pos[a].y} x2={x2} y2={y2}
              stroke={col} strokeWidth={thick ? 2.5 : 1.5} strokeLinecap="round"
              markerEnd={dirigido ? "url(#arrow)" : undefined} />
            {pesos && pesos[i] !== undefined && (
              <text x={mx} y={my - 5} textAnchor="middle" fontSize={10} fill={C.yellow} fontFamily="monospace">{pesos[i]}</text>
            )}
          </g>
        );
      })}

      {pos.slice(0, n).map((p, i) => {
        const hl = resaltados.includes(i);
        const vCol = vertexColor[i] || (hl ? C.accent : C.surface);
        const tCol = hl ? C.bg : C.text;
        return (
          <g key={i} onPointerDown={(e) => onPointerDown(i, e)} style={{ cursor: interactivo ? "grab" : "default" }}>
            <circle cx={p.x} cy={p.y} r={15} fill={vCol} stroke={hl ? C.accent : C.border} strokeWidth={1.5} />
            <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
              style={{ pointerEvents: "none" }} fontSize={10} fontFamily="monospace"
              fill={tCol} fontWeight={hl ? "bold" : "normal"}>{vertices[i]}</text>
            {grados && grados[i] !== undefined && (
              <text x={p.x + 17} y={p.y - 11} fontSize={9} fill={C.orange}
                fontFamily="monospace" style={{ pointerEvents: "none" }}>{grados[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
