import { useState, useEffect, useRef, useCallback, useContext, createContext } from "react";
import { Formula } from "./components/Formula";
import { useProgreso } from "./hooks/useProgreso";
import { CATEGORIAS, QUIZZES, META, CREDITOS, GRAFO_SIM } from "./data/contenido.js";
import escudoUAN from "./ESCUDO-UAN-Azul.png";
import { DARK, ThemeCtx } from "./ThemeCtx";

// ── PALETA MODO CLARO ─────────────────────────────────────────────────────────
const LIGHT = {
  bg: "#ffffff", surface: "#f6f8fa", surface2: "#eaeef2",
  border: "#d0d7de", accent: "#0969da", accentSoft: "#0969da15",
  green: "#1a7f37", greenSoft: "#dafbe1", orange: "#bc4c00",
  red: "#cf222e", text: "#1f2328", muted: "#656d76",
  purple: "#8250df", yellow: "#9a6700", teal: "#0f6e31",
  nombre: "claro",
};

// ── CONTEXTO DE TAMAÑO DE FUENTE ──────────────────────────────────────────────
const FONT_SCALES = [1, 1.2, 1.4];
const FontSizeCtx = createContext({ scaleIdx: 0, aumentar: () => { }, reducir: () => { } });
const useFontSize = () => useContext(FontSizeCtx);

function FontSizeProvider({ children }) {
  const [scaleIdx, setScaleIdx] = useState(() => {
    try { return Number(localStorage.getItem("uan_font_scale")) || 0; } catch { return 0; }
  });
  const aumentar = () => setScaleIdx(i => Math.min(i + 1, FONT_SCALES.length - 1));
  const reducir  = () => setScaleIdx(i => Math.max(i - 1, 0));
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", FONT_SCALES[scaleIdx]);
    try { localStorage.setItem("uan_font_scale", scaleIdx); } catch { }
  }, [scaleIdx]);
  return (
    <FontSizeCtx.Provider value={{ scaleIdx, aumentar, reducir }}>
      {children}
    </FontSizeCtx.Provider>
  );
}

// ── CONTEXTO DE TEMA ───────────────────────────────────────────────────────────
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }) {
  const [modo, setModo] = useState(() => {
    try { return localStorage.getItem("uan_tema") || "oscuro"; } catch { return "oscuro"; }
  });
  const C = modo === "claro" ? LIGHT : DARK;
  const toggleTema = () => setModo(m => {
    const nuevo = m === "oscuro" ? "claro" : "oscuro";
    try { localStorage.setItem("uan_tema", nuevo); } catch { }
    return nuevo;
  });
  // Sincronizar fondo del <body> con el tema
  useEffect(() => {
    document.body.style.background = C.bg;
    document.body.style.color = C.text;
  }, [C.bg, C.text]);
  return (
    <ThemeCtx.Provider value={{ C, toggleTema }}>
      {children}
    </ThemeCtx.Provider>
  );
}

// ── UTILIDADES DE GRAFO SVG ────────────────────────────────────────────────────
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

function GrafoSVG({ vertices = [], aristas = [], hyperEdges = [], posiciones: posProp, resaltados = [],
  aristaResaltada = [], aristaColor = {}, vertexColor = {}, grados = null,
  pesos = null, size = 200, dirigido = false, interactivo = true }) {
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
    const key = `${a}-${b}`;
    const keyR = `${b}-${a}`;
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos(prev => {
      const nue = [...prev];
      nue[dragging.current] = { x, y };
      return nue;
    });
  };

  const onPointerUp = () => { dragging.current = null; };

  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto", overflow: "visible", touchAction: interactivo ? "none" : "auto" }}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.muted} />
        </marker>
      </defs>

      {hyperEdges.map((he, i) => (
        <HiperAristaSVG key={`he-${i}`} indices={he} pos={pos} color={C.purple} />
      ))}

      {aristas.map(([a, b], i) => {
        if (a >= pos.length || b >= pos.length) return null;
        const col = getAristaColor(a, b);
        const thick = col !== C.border;
        const mx = (pos[a].x + pos[b].x) / 2;
        const my = (pos[a].y + pos[b].y) / 2;
        return (
          <g key={i}>
            <line x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
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
            <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: "none" }}
              fontSize={10} fontFamily="monospace" fill={tCol} fontWeight={hl ? "bold" : "normal"}>{vertices[i]}</text>
            {grados && grados[i] !== undefined && (
              <text x={p.x + 17} y={p.y - 11} fontSize={9} fill={C.orange} fontFamily="monospace" style={{ pointerEvents: "none" }}>{grados[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── DATOS: TODOS LOS TEMAS ────────────────────────────────────────────────────
const TODOS_TEMAS = CATEGORIAS.flatMap(c => c.temas.map(t => ({ ...t, categoria: c.id, catNombre: c.nombre, catColor: c.color })));

// ── SECCION DE QUIZZES ─────────────────────────────────────────────────────────
function simBFS(g, inicio) {
  const vis = new Array(g.n).fill(false), cola = [inicio], orden = [], pad = new Array(g.n).fill(-1);
  vis[inicio] = true;
  while (cola.length) {
    const u = cola.shift(); orden.push(u);
    for (const v of g.adj[u]) if (!vis[v]) { vis[v] = true; pad[v] = u; cola.push(v); }
  }
  return orden.map((v, i) => ({
    paso: i + 1, vertice: v,
    descripcion: pad[v] === -1 ? `Origen: vértice ${v}` : `Visitar ${v} (nivel ${i}, desde ${pad[v]})`,
    visitados: orden.slice(0, i + 1),
    aristasST: orden.slice(1, i + 1).map((w, j) => [pad[w], w]).filter(([a]) => a !== -1),
  }));
}

function simDijkstra(g, inicio) {
  const dist = new Array(g.n).fill(Infinity), prev = new Array(g.n).fill(-1), vis = new Array(g.n).fill(false);
  dist[inicio] = 0; const snaps = [];
  for (let iter = 0; iter < g.n; iter++) {
    let u = -1;
    for (let i = 0; i < g.n; i++) if (!vis[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    vis[u] = true;
    for (const [v, w] of g.wadj[u]) if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; }
    snaps.push({
      paso: iter + 1, vertice: u,
      descripcion: `Procesar ${u}: dist[${u}]=${dist[u]}`,
      distancias: [...dist], visitados: [...vis.map((_, i) => vis[i] ? i : -1).filter(x => x !== -1)],
      aristasST: prev.map((p, i) => [p, i]).filter(([p]) => p !== -1),
    });
  }
  return snaps;
}

function simDFS(g, inicio) {
  const vis = new Array(g.n).fill(false), orden = [], pad = new Array(g.n).fill(-1);
  const snaps = [];
  function dfs(u, p) {
    vis[u] = true; pad[u] = p; orden.push(u);
    snaps.push({
      paso: snaps.length + 1, vertice: u,
      descripcion: p === -1 ? `Origen: vértice ${u}` : `Visitar ${u} (desde ${p})`,
      visitados: [...orden],
      aristasST: orden.map(w => [pad[w], w]).filter(([a]) => a !== -1),
    });
    for (const v of g.adj[u]) {
      if (!vis[v]) dfs(v, u);
    }
    snaps.push({
      paso: snaps.length + 1, vertice: u,
      descripcion: `Retroceder desde ${u}`,
      visitados: [...orden],
      aristasST: orden.map(w => [pad[w], w]).filter(([a]) => a !== -1),
    });
  }
  dfs(inicio, -1);
  return snaps;
}

function simBellmanFord(g, inicio) {
  const dist = new Array(g.n).fill(Infinity), prev = new Array(g.n).fill(-1);
  dist[inicio] = 0;
  const snaps = [{
    paso: 1, vertice: inicio, descripcion: `Inicializar distancias, dist[${inicio}]=0`,
    distancias: [...dist], visitados: [inicio], aristasST: []
  }];
  let paso = 2;
  for (let iter = 1; iter < g.n; iter++) {
    let cambiado = false;
    for (let u = 0; u < g.n; u++) {
      if (dist[u] === Infinity) continue;
      for (const [v, w] of g.wadj[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w; prev[v] = u; cambiado = true;
          snaps.push({
            paso: paso++, vertice: v,
            descripcion: `Iter ${iter}: Relajar ${u}→${v} (dist=${dist[v]})`,
            distancias: [...dist],
            visitados: [...new Set([...snaps[snaps.length - 1].visitados, u, v])],
            aristasST: prev.map((p, i) => [p, i]).filter(([p]) => p !== -1),
            aristaResaltada: [[u, v]]
          });
        }
      }
    }
    if (!cambiado) break;
  }
  return snaps;
}

function simKruskal(g) {
  const edges = [];
  for (let u = 0; u < g.n; u++) {
    for (const [v, w] of g.wadj[u]) if (u < v) edges.push([u, v, w]);
  }
  edges.sort((a, b) => a[2] - b[2]);

  const parent = new Array(g.n).fill(0).map((_, i) => i);
  const find = (i) => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const union = (i, j) => {
    const rI = find(i), rJ = find(j);
    if (rI !== rJ) { parent[rI] = rJ; return true; }
    return false;
  };

  const snaps = [], mstEdges = [];
  let paso = 1;
  for (const [u, v, w] of edges) {
    const formaCiclo = find(u) === find(v);
    snaps.push({
      paso: paso++, vertice: -1,
      descripcion: `Evaluar arista ${u}-${v} (peso ${w}). ${formaCiclo ? 'Forma ciclo ❌' : 'Aceptada ✅'}`,
      aristasST: [...mstEdges], visitados: [...new Set(mstEdges.flat())],
      aristaResaltada: [[u, v]], distancias: []
    });
    if (!formaCiclo) {
      union(u, v); mstEdges.push([u, v]);
      snaps.push({
        paso: paso++, vertice: -1, descripcion: `Arista ${u}-${v} añadida al MST`,
        aristasST: [...mstEdges], visitados: [...new Set(mstEdges.flat())], distancias: []
      });
    }
  }
  return snaps;
}

// ── COMPONENTE: SIDEBAR ───────────────────────────────────────────────────────
function Sidebar({ catActiva, setCatActiva, temaActivo, setTemaActivo, busqueda, setBusqueda, progreso, abierto, onCerrar }) {
  const { C } = useTheme();
  return (
    <div className={`sidebar-panel${abierto ? " abierto" : ""}`} style={{ width: 260, minWidth: 260, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 14px 10px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: -0.5 }}>{META.materia} <span style={{ color: C.accent }}>APK-UAN</span></div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Teoría de Gráfos<br />Licenciatura en Matemáticas<br />Universidad Autónoma de Nayarit</div>
      </div>
      <div style={{ padding: "10px 14px 8px" }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍 Buscar tema..."
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.text, fontSize: 12, boxSizing: "border-box" }} />
      </div>
      <div style={{ overflowY: "auto", flex: 1, paddingBottom: 20 }}>
        {CATEGORIAS.map(cat => {
          const temasFilt = busqueda ? cat.temas.filter(t => t.titulo.toLowerCase().includes(busqueda.toLowerCase()) || t.definicion.toLowerCase().includes(busqueda.toLowerCase())) : cat.temas;
          if (busqueda && temasFilt.length === 0) return null;
          const visitadosDeCat = cat.temas.filter(t => progreso.temasVisitados.includes(t.id)).length;
          return (
            <div key={cat.id}>
              <button onClick={() => setCatActiva(catActiva === cat.id ? null : cat.id)}
                style={{ width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>{cat.icon}</span>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 600, flex: 1, textAlign: "left" }}>{cat.nombre}</span>
                <span style={{ fontSize: 9, color: C.muted, marginLeft: "auto" }}>{visitadosDeCat}/{cat.temas.length}</span>
                <span style={{ color: C.muted, fontSize: 10 }}>{catActiva === cat.id ? "▼" : "▶"}</span>
              </button>
              {(catActiva === cat.id || busqueda) && temasFilt.map(t => {
                const visitado = progreso.temasVisitados.includes(t.id);
                return (
                  <button key={t.id} onClick={() => { setTemaActivo(t.id, cat.id); onCerrar && onCerrar(); }}
                    style={{ width: "100%", padding: "6px 14px 6px 30px", background: temaActivo === t.id ? `${cat.color}22` : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", borderLeft: temaActivo === t.id ? `2px solid ${cat.color}` : "2px solid transparent" }}>
                    <span style={{ fontSize: 11, color: temaActivo === t.id ? cat.color : C.muted }}>{t.titulo}</span>
                    {visitado && <span style={{ fontSize: 10, color: C.green, marginLeft: "auto" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── COMPONENTE: VISTA DE TEMA ─────────────────────────────────────────────────
function GrafoContenedor({ g, catColor, dirigido }) {
  const refDiv = useRef(null);
  const [size, setSize] = useState(180);

  useEffect(() => {
    if (!refDiv.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setSize(Math.min(w, 280));
    });
    ro.observe(refDiv.current);
    return () => ro.disconnect();
  }, []);

  if (!g.vertices) return null;
  return (
    <div ref={refDiv} style={{ width: "100%" }}>
      <GrafoSVG
        vertices={g.vertices} aristas={g.aristas || []} hyperEdges={g.hyperEdges || []}
        posiciones={g.posiciones} resaltados={g.resaltados || []}
        aristaResaltada={g.aristaResaltada || []} aristaColor={g.aristaColor || {}}
        vertexColor={g.vertexColor || {}} grados={g.grados} pesos={g.pesos}
        dirigido={dirigido} size={size} />
    </div>
  );
}

function VistaTema({ tema }) {
  const { C } = useTheme();
  const cat = CATEGORIAS.find(c => c.id === tema.categoria);
  const g = tema.grafo || {};
  return (
    <div key={tema.id} className="fade-slide-in contenido-vista">
      {/* Chip de categoría */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span className="tema-categoria-chip" style={{
          padding: "2px 10px", borderRadius: 20,
          background: `${cat.color}22`, color: cat.color,
          fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5
        }}>
          {cat.icon} {cat.nombre}
        </span>
      </div>

      {/* Título */}
      <h2 className="tema-titulo" style={{ color: C.text, fontWeight: 700, margin: "8px 0 16px", letterSpacing: -0.5 }}>
        {tema.titulo}
      </h2>

      {/* Grid: definición + grafo */}
      <div className="vista-tema-grid" style={{ marginBottom: "var(--sp-md)" }}>
        <div>
          <p className="tema-definicion" style={{ color: C.muted, marginTop: 0 }}>
            {tema.definicion}
          </p>
          <Formula latex={tema.formula} color={cat.color} />
        </div>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "var(--sp-sm)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <GrafoContenedor g={g} catColor={cat.color} dirigido={g.dirigido} />
        </div>
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

// ── COMPONENTE: SIMULADOR ─────────────────────────────────────────────────────
function Simulador() {
  const { C } = useTheme();
  const [alg, setAlg] = useState("bfs");
  const [inicio, setInicio] = useState(0);
  const [pasoActual, setPasoActual] = useState(-1);
  const [pasos, setPasos] = useState([]);
  const [corriendo, setCorriendo] = useState(false);
  const itvRef = useRef(null);

  const iniciar = useCallback(() => {
    clearInterval(itvRef.current);
    let ps = [];
    if (alg === "bfs") ps = simBFS(GRAFO_SIM, inicio);
    else if (alg === "dfs") ps = simDFS(GRAFO_SIM, inicio);
    else if (alg === "dijkstra") ps = simDijkstra(GRAFO_SIM, inicio);
    else if (alg === "bellman") ps = simBellmanFord(GRAFO_SIM, inicio);
    else if (alg === "kruskal") ps = simKruskal(GRAFO_SIM);
    setPasos(ps); setPasoActual(0); setCorriendo(true);
  }, [alg, inicio]);

  useEffect(() => {
    if (!corriendo || pasos.length === 0) return;
    itvRef.current = setInterval(() => {
      setPasoActual(p => { if (p >= pasos.length - 1) { setCorriendo(false); return p; } return p + 1; });
    }, 900);
    return () => clearInterval(itvRef.current);
  }, [corriendo, pasos]);

  const paso = pasos[pasoActual];
  const vCol = {};
  if (paso) { paso.visitados.forEach((v, i) => { vCol[v] = i === paso.visitados.length - 1 ? C.accent : `${C.green}99`; }); }
  const aColor = {};
  if (paso && paso.aristasST) {
    paso.aristasST.forEach(([u, v]) => { aColor[`${u}-${v}`] = C.green; aColor[`${v}-${u}`] = C.green; });
  }

  return (
    <div style={{ maxWidth: 820, padding: "28px 32px" }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>⚙️ Simulador de Algoritmos</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["bfs", "BFS — Anchura"], ["dfs", "DFS — Profundidad"], ["dijkstra", "Dijkstra"], ["bellman", "Bellman-Ford"], ["kruskal", "Kruskal — MST"]].map(([k, v]) => (
          <button key={k} onClick={() => { setAlg(k); setPasoActual(-1); setCorriendo(false); }}
            style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${alg === k ? C.accent : C.border}`, background: alg === k ? C.accentSoft : "transparent", color: alg === k ? C.accent : C.muted, fontSize: 12, cursor: "pointer" }}>
            {v}
          </button>
        ))}
      </div>
      <div className="vista-tema-grid">
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <GrafoSVG vertices={GRAFO_SIM.vertices} aristas={GRAFO_SIM.aristas} pesos={["dijkstra", "bellman", "kruskal"].includes(alg) ? GRAFO_SIM.pesos : null}
            vertexColor={vCol} aristaResaltada={paso ? paso.aristaResaltada || paso.aristasST || [] : []} aristaColor={aColor} size={220} />
          <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
            <label style={{ color: C.muted, fontSize: 11 }}>Inicio:</label>
            <select value={inicio} onChange={e => setInicio(+e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}>
              {GRAFO_SIM.vertices.map((v, i) => <option key={i} value={i}>{v}</option>)}
            </select>
            <button onClick={iniciar} style={{ padding: "6px 14px", borderRadius: 8, background: corriendo ? C.greenSoft : C.green, border: "none", color: "#fff", fontSize: 11, cursor: "pointer" }}>
              {corriendo ? "⏸" : "▶"} {corriendo ? "Corriendo..." : "Iniciar"}
            </button>
            <button onClick={() => { setPasoActual(-1); setCorriendo(false); }} style={{ padding: "6px 10px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, cursor: "pointer" }}>↺</button>
          </div>
          {paso && paso.distancias && (
            <div style={{ marginTop: 12, fontFamily: "monospace", fontSize: 10, color: C.orange, textAlign: "center" }}>
              dist: [{paso.distancias.map(d => d === Infinity ? "∞" : d).join(", ")}]
            </div>
          )}
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, overflowY: "auto", maxHeight: 320 }}>
          {pasos.length === 0 && <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 40 }}>Presione ▶ Iniciar</div>}
          {pasos.map((p, i) => (
            <div key={i} style={{ padding: "8px 12px", marginBottom: 5, borderRadius: 8, background: i === pasoActual ? C.accentSoft : i < pasoActual ? `${C.green}11` : "transparent", border: `1px solid ${i === pasoActual ? C.accent : "transparent"}`, transition: "all .3s" }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: i === pasoActual ? C.accent : C.muted }}>
                Paso {p.paso}: {p.descripcion}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTE: QUIZ ──────────────────────────────────────────────────────────
function Quiz({ guardarQuiz }) {
  const { C } = useTheme();
  const [fase, setFase] = useState("inicio");
  const [qIdx, setQIdx] = useState(0);
  const [resp, setResp] = useState({});
  const [sel, setSel] = useState(null);
  const [exp, setExp] = useState(false);

  // Inicializar preguntas síncronamente
  const [quizzesAleatorios, setQuizzesAleatorios] = useState(() => {
    return [...QUIZZES].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  const q = quizzesAleatorios[qIdx];
  const aciertos = quizzesAleatorios.filter((qz, i) => resp[i] === qz.correcta).length;

  if (fase === "inicio") return (
    <div className="fade-slide-in" style={{ maxWidth: 820, padding: "28px 32px" }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>🎯 Evaluación</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Se seleccionarán 10 preguntas aleatorias de todos los temas.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 28 }}>
        {["Fundamentos", "Conectividad", "Planares", "Algoritmos"].map(n => (
          <div key={n} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted }}>{QUIZZES.filter(q => q.nivel === n).length} preguntas disp.</div>
            <div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginTop: 4 }}>{n}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setFase("quiz")} style={{ padding: "12px 32px", borderRadius: 10, background: C.accent, border: "none", color: C.bg, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
        Comenzar evaluación
      </button>
    </div>
  );

  if (fase === "resultado") return (
    <div className="fade-slide-in" style={{ maxWidth: 820, padding: "28px 32px" }}>
      <h2 style={{ color: C.text, marginBottom: 16 }}>Resultado: {aciertos}/{quizzesAleatorios.length}</h2>
      <div style={{ width: "100%", height: 8, background: C.border, borderRadius: 4, marginBottom: 24 }}>
        <div style={{ width: `${(aciertos / quizzesAleatorios.length) * 100}%`, height: "100%", background: aciertos >= quizzesAleatorios.length * 0.7 ? C.green : C.orange, borderRadius: 4, transition: "width 1s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {quizzesAleatorios.map((quiz, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${resp[i] === quiz.correcta ? C.greenSoft : C.border}` }}>
            <span style={{ color: resp[i] === quiz.correcta ? C.green : C.red, fontSize: 16, minWidth: 20 }}>{resp[i] === quiz.correcta ? "✓" : "✗"}</span>
            <div>
              <div style={{ color: C.text, fontSize: 12, marginBottom: 4 }}>{quiz.pregunta}</div>
              {resp[i] !== quiz.correcta && <div style={{ color: C.muted, fontSize: 11 }}>Correcto: {quiz.opciones[quiz.correcta]}</div>}
            </div>
            <span style={{ marginLeft: "auto", fontSize: 10, color: C.muted, padding: "2px 8px", borderRadius: 10, background: `${C.border}44` }}>{quiz.nivel}</span>
          </div>
        ))}
      </div>
      <button onClick={() => {
        setFase("inicio");
        setQIdx(0);
        setResp({});
        setSel(null);
        setExp(false);
        setQuizzesAleatorios([...QUIZZES].sort(() => 0.5 - Math.random()).slice(0, 10));
      }}
        style={{ padding: "10px 28px", borderRadius: 10, border: `1px solid ${C.accent}`, background: "transparent", color: C.accent, fontSize: 13, cursor: "pointer" }}>
        Repetir evaluación
      </button>
    </div>
  );

  return (
    <div className="fade-slide-in" style={{ maxWidth: 640, padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: C.muted, fontSize: 12 }}>Pregunta {qIdx + 1} de {quizzesAleatorios.length}</span>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: `${C.orange}22`, color: C.orange }}>{q.nivel}</span>
      </div>
      <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: 20 }}>
        <div style={{ width: `${((qIdx + 1) / quizzesAleatorios.length) * 100}%`, height: "100%", background: C.accent, borderRadius: 2, transition: "width .4s" }} />
      </div>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.75, marginBottom: 20, fontWeight: 500 }}>{q.pregunta}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {q.opciones.map((op, i) => {
          const esCor = i === q.correcta, esSel = sel === i, show = exp;
          return (
            <button key={i} onClick={() => !show && setSel(i)}
              style={{
                padding: "12px 16px", borderRadius: 10, border: "1px solid", textAlign: "left",
                borderColor: show && esCor ? C.green : show && esSel && !esCor ? C.red : esSel ? C.accent : C.border,
                background: show && esCor ? `${C.green}22` : show && esSel && !esCor ? `${C.red}22` : esSel ? C.accentSoft : "transparent",
                color: C.text, fontSize: 13, cursor: show ? "default" : "pointer", transition: "all .2s"
              }}>
              <span style={{ fontFamily: "monospace", color: C.muted, marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>{op}
            </button>
          );
        })}
      </div>
      {sel !== null && !exp && <button onClick={() => setExp(true)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer", marginRight: 10 }}>Ver explicación</button>}
      {exp && <div style={{ padding: "12px 16px", borderRadius: 10, background: `${C.yellow}11`, border: `1px solid ${C.yellow}33`, color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}><strong style={{ color: C.yellow }}>Explicación: </strong>{q.explicacion}</div>}
      <button onClick={() => {
        setResp({ ...resp, [qIdx]: sel });
        if (qIdx < quizzesAleatorios.length - 1) {
          setQIdx(qIdx + 1); setSel(null); setExp(false);
        } else {
          guardarQuiz(aciertos + (sel === q.correcta ? 1 : 0), quizzesAleatorios.length);
          setFase("resultado");
        }
      }}
        disabled={sel === null}
        style={{ width: "100%", padding: "12px", borderRadius: 10, background: sel !== null ? C.accent : C.border, border: "none", color: sel !== null ? C.bg : C.muted, fontSize: 14, fontWeight: "bold", cursor: sel !== null ? "pointer" : "default", marginTop: 6 }}>
        {qIdx < quizzesAleatorios.length - 1 ? "Siguiente →" : "Ver resultado"}
      </button>
    </div>
  );
}

// ── COMPONENTE: CRÉDITOS ────────────────────────────────────────────────────────
function Creditos() {
  const { C } = useTheme();
  const tarjetas = [
    {
      rol: "Docentes Investigadores",
      icono: "🎓",
      color: C.accent,
      personas: [
        { nombre: "Dra. Oyuki Hayde Hermosillo Reyes", detalle: "Investigadora responsable" },
        { nombre: "Dr. Pablo Eduardo Cancino Marentes", detalle: "Investigador colaborador" },
      ],
    },
    {
      rol: "Apoyo en el desarrollo de la Investigación",
      icono: "💻",
      color: C.green,
      personas: [
        { nombre: "Liliana Gómez Dennis", detalle: "Estudiante — Licenciatura en Matemáticas" },
      ],
    },
  ];

  return (
    <div className="fade-slide-in contenido-vista" style={{ maxWidth: 680 }}>

      {/* Logo institucional */}
      <div style={{
        textAlign: "center", marginBottom: "var(--sp-lg)",
        padding: "var(--sp-lg) var(--sp-md)",
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
        border: `1px solid ${C.border}`, borderRadius: 20,
        position: "relative", overflow: "hidden",
      }}>
        {/* Resplandor decorativo */}
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 200, height: 200, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
          <img
            src={escudoUAN}
            alt="Escudo Universidad Autónoma de Nayarit"
            style={{ width: "clamp(80px, 18vw, 120px)", height: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }}
          />
        </div>
        <div style={{
          fontSize: "var(--fs-xs)", color: C.accent, fontWeight: 700,
          letterSpacing: 3, textTransform: "uppercase", marginBottom: 8,
        }}>
          Universidad Autónoma de Nayarit
        </div>
        <h2 style={{
          fontSize: "var(--fs-lg)", fontWeight: 700, color: C.text,
          margin: "0 0 6px", letterSpacing: -0.5,
        }}>
          Teoría de Grafos
        </h2>
        <div style={{ fontSize: "var(--fs-sm)", color: C.muted, lineHeight: 1.6 }}>
          Unidad Académica de Ciencias Básicas e Ingenierías<br />
          Programa Académico de Licenciatura en Matemáticas
        </div>

        {/* Separador decorativo */}
        <div style={{
          width: 60, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          margin: "var(--sp-md) auto 0",
          borderRadius: 2,
        }} />
      </div>

      {/* Tarjetas de colaboradores */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-sm)" }}>
        {tarjetas.map((grupo, gi) => (
          <div key={gi} style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}>
            {/* Encabezado del grupo */}
            <div style={{
              padding: "var(--sp-xs) var(--sp-md)",
              borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 10,
              background: `${grupo.color}0d`,
            }}>
              <span style={{ fontSize: "var(--fs-md)" }}>{grupo.icono}</span>
              <span style={{
                fontSize: "var(--fs-xs)", fontWeight: 700, color: grupo.color,
                textTransform: "uppercase", letterSpacing: 1.5,
              }}>
                {grupo.rol}
              </span>
            </div>

            {/* Personas */}
            {grupo.personas.map((p, pi) => (
              <div key={pi} style={{
                padding: "var(--sp-sm) var(--sp-md)",
                borderBottom: pi < grupo.personas.length - 1 ? `1px solid ${C.border}44` : "none",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                {/* Avatar generado */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${grupo.color}44, ${grupo.color}11)`,
                  border: `1px solid ${grupo.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, color: grupo.color,
                }}>
                  {p.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: C.text }}>
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: "var(--fs-xs)", color: C.muted, marginTop: 2 }}>
                    {p.detalle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pie de créditos */}
      <div style={{
        textAlign: "center", marginTop: "var(--sp-lg)",
        padding: "var(--sp-md)",
        border: `1px solid ${C.border}44`,
        borderRadius: 12,
      }}>
        <div style={{ fontSize: "var(--fs-xs)", color: C.muted, lineHeight: 2 }}>
          <span style={{ color: C.accent, fontWeight: 600 }}>Tepic, Nayarit</span>
          {" — Mayo de 2026"}<br />
          Versión 1.0 · NTE-UAN-APK-001<br />
          <span style={{ fontSize: "var(--fs-xs)", opacity: 0.5 }}>
            Recurso educativo de uso académico · UAN © 2026
          </span>
        </div>
      </div>

    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <FontSizeProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </FontSizeProvider>
  );
}

function AppInner() {
  const { C, toggleTema } = useTheme();
  const { scaleIdx, aumentar, reducir } = useFontSize();
  const { progreso, marcarVisitado, guardarQuiz } = useProgreso();

  const [catActiva, setCatActiva] = useState(progreso.ultimaCategoria || CATEGORIAS[0]?.id);
  const [temaActivo, setTemaActivo] = useState(progreso.ultimoTema || CATEGORIAS[0]?.temas[0]?.id);
  const [vista, setVista] = useState("teoria"); // teoria | sim | quiz | creditos
  const [busqueda, setBusqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const tema = TODOS_TEMAS.find(t => t.id === temaActivo);

  const handleSetTema = (id, catId) => {
    setTemaActivo(id);
    setVista("teoria");
    marcarVisitado(id, catId);
    setSidebarAbierto(false);
  };

  useEffect(() => {
    if (tema) marcarVisitado(tema.id, tema.categoria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BtnTema = () => (
    <button
      onClick={toggleTema}
      title="Cambiar tema"
      style={{
        background: "transparent",
        border: `1px solid ${C.border}`,
        borderRadius: 8, color: C.muted,
        fontSize: 16, width: 36, height: 36,
        cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "color .2s, border-color .2s",
      }}>
      {C.nombre === "oscuro" ? '\u{1F319}' : '\u2600\uFE0F'}
    </button>
  );

  const BtnFuente = () => (
    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
      <button onClick={reducir} disabled={scaleIdx === 0} title="Reducir letra"
        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
          color: scaleIdx === 0 ? C.border : C.muted, fontSize: 12, fontWeight: 700,
          width: 32, height: 36, cursor: scaleIdx === 0 ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        A-
      </button>
      <button onClick={aumentar} disabled={scaleIdx === FONT_SCALES.length - 1} title="Aumentar letra"
        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
          color: scaleIdx === FONT_SCALES.length - 1 ? C.border : C.muted, fontSize: 14, fontWeight: 700,
          width: 32, height: 36, cursor: scaleIdx === FONT_SCALES.length - 1 ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        A+
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'IBM Plex Sans','Helvetica Neue',sans-serif", color: C.text, position: "relative", transition: "background .3s, color .3s" }}>
      <div className="sidebar-overlay" onClick={() => setSidebarAbierto(false)}
        style={{ display: "none", position: "fixed", inset: 0, background: "#00000077", zIndex: 199, opacity: sidebarAbierto ? 1 : 0, pointerEvents: sidebarAbierto ? "auto" : "none", transition: "opacity 0.28s" }} />
      <Sidebar catActiva={catActiva} setCatActiva={setCatActiva} temaActivo={temaActivo} setTemaActivo={handleSetTema} busqueda={busqueda} setBusqueda={setBusqueda} progreso={progreso} abierto={sidebarAbierto} onCerrar={() => setSidebarAbierto(false)} />
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* -- Topbar escritorio -- */}
        <div className="topbar-desktop" style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {[["teoria", '\u{1F393} Teor\u00EDa'], ["sim", '\u2728 Simulador'], ["quiz", '\u270D\uFE0F Evaluaci\u00F3n'], ["creditos", '\u00A9\uFE0F Cr\u00E9ditos']].map(([k, v]) => (
            <button key={k} onClick={() => setVista(k)}
              style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${vista === k ? C.accent : C.border}`, background: vista === k ? C.accentSoft : "transparent", color: vista === k ? C.accent : C.muted, fontSize: 12, cursor: "pointer", flex: 1, minWidth: 90 }}>
              {v}
            </button>
          ))}
          <BtnFuente />
          <BtnTema />
        </div>
        {/* -- Topbar m�vil con hamburguesa -- */}
        <div className="topbar-mobile" style={{ display: "none", background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 14px", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSidebarAbierto(v => !v)}
            style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 18, width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {sidebarAbierto ? '\u2715' : '\u2630'}
          </button>
          <span style={{ color: C.text, fontSize: 13, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {tema ? tema.titulo : "Grafos UAN"}
          </span>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {[["teoria", '\u{1F393}'], ["sim", '\u2728'], ["quiz", '\u270D\uFE0F'], ["creditos", '\u00A9\uFE0F']].map(([k, icon]) => (
              <button key={k} onClick={() => setVista(k)}
                style={{ padding: "5px 8px", borderRadius: 8, border: `1px solid ${vista === k ? C.accent : C.border}`, background: vista === k ? C.accentSoft : "transparent", color: vista === k ? C.accent : C.muted, fontSize: 14, cursor: "pointer" }}>
                {icon}
              </button>
            ))}
            <BtnFuente />
            <BtnTema />
          </div>
        </div>
        {/* Contenido principal */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {vista === "teoria" && tema && <VistaTema tema={tema} />}
          {vista === "teoria" && !tema && (
            <div style={{ padding: "40px 32px" }}>
              <h2 style={{ color: C.text, marginBottom: 8 }}>Bienvenido</h2>
              <p style={{ color: C.muted }}>Toca ? para seleccionar un tema.</p>
            </div>
          )}
          {vista === "sim" && <Simulador />}
          {vista === "quiz" && <Quiz guardarQuiz={guardarQuiz} />}
          {vista === "creditos" && <Creditos />}
        </div>
      </div>
    </div>
  );
}
