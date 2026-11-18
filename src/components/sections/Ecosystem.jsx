import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ENTITIES, SKILL_CLUSTERS, SKILLS } from '../../content/data.js';
import { rng, useInView, useReduced, useWide } from '../../lib/util.js';
import { LayerHead } from '../system/Primitives.jsx';

const EASE = [0.22, 1, 0.36, 1];
const W = 1000, H = 640;

function layout() {
  const R = rng(3);
  const hubs = SKILL_CLUSTERS.map((c, i) => {
    const a = (i / SKILL_CLUSTERS.length) * Math.PI * 2 - Math.PI / 2;
    return { ...c, x: W / 2 + Math.cos(a) * 340, y: H / 2 + 10 + Math.sin(a) * 235 };
  });
  const hubOf = Object.fromEntries(hubs.map((h) => [h.id, h]));
  const nodes = SKILLS.map((s) => {
    const h = hubOf[s.cluster];
    const a = R() * Math.PI * 2;
    return { ...s, x: h.x + Math.cos(a) * 90, y: h.y + Math.sin(a) * 60, hx: h.x, hy: h.y, deg: s.refs.length };
  });
  // light relaxation: spring to hub, repel neighbours, stay in frame
  for (let it = 0; it < 260; it++) {
    for (const n of nodes) {
      n.vx = (n.hx - n.x) * 0.012; n.vy = (n.hy - n.y) * 0.012;
      // pull slightly toward centre so clusters breathe inward
      n.vx += (W / 2 - n.x) * 0.001; n.vy += (H / 2 - n.y) * 0.001;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = (a.x - b.x) * 0.75, dy = (a.y - b.y) * 2.4;
        const d = Math.hypot(dx, dy) || 1;
        const min = 96;
        if (d < min) {
          const f = ((min - d) / d) * 0.25;
          a.vx += dx * f; a.vy += dy * f * 0.6; b.vx -= dx * f; b.vy -= dy * f * 0.6;
        }
      }
      for (const h of hubs) {
        const a = nodes[i];
        // keep the hub dot and its label (drawn above it) clear
        const dx = (a.x + 40 - h.x) * 0.55, dy = (a.y - (h.y - 12)) * 1.5, d = Math.hypot(dx, dy) || 1;
        if (d < 70) { a.vx += (dx / d) * 5; a.vy += (dy / d) * 5; }
      }
    }
    for (const n of nodes) {
      n.x = Math.min(W - 150, Math.max(20, n.x + n.vx));
      n.y = Math.min(H - 20, Math.max(20, n.y + n.vy));
    }
  }
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  // skills are linked when they were used in the same work
  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const shared = nodes[i].refs.filter((r) => nodes[j].refs.includes(r));
      if (shared.length) links.push({ a: nodes[i].id, b: nodes[j].id, shared });
    }
  }
  return { hubs, nodes, byId, links };
}

export default function Ecosystem() {
  const G = useMemo(layout, []);
  const [sel, setSel] = useState('python');
  const [hub, setHub] = useState(null);
  const ref = useRef(null);
  const seen = useInView(ref, '0px 0px -20% 0px', true);
  const reduced = useReduced();
  const wide = useWide();

  const node = G.byId[sel];
  const neighbours = useMemo(() => {
    const s = new Set();
    G.links.forEach((l) => { if (l.a === sel) s.add(l.b); if (l.b === sel) s.add(l.a); });
    return s;
  }, [G, sel]);
  const isLit = (n) => (hub ? n.cluster === hub : n.id === sel || neighbours.has(n.id));
  const cluster = SKILL_CLUSTERS.find((c) => c.id === node.cluster);

  const panel = (
    <div className="eco-panel" aria-live="polite">
      <AnimatePresence mode="wait">
        <m.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
          <p className="mono faint">Node · {cluster.label}</p>
          <p className="eco-p-name serif">{node.label}</p>
          <div className="eco-p-block">
            <p className="mono faint">Activates ({node.refs.length || '—'})</p>
            {node.refs.length ? (
              <ul>
                {node.refs.map((r) => (
                  <li key={r}>
                    <a href={ENTITIES[r].anchor} className="pf-ev" data-cursor="link">
                      <span className="mono-s faint">{ENTITIES[r].kind}</span>
                      <span>{ENTITIES[r].label}</span>
                      <span aria-hidden="true" className="faint">↘</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dim eco-p-note">Part of the everyday toolkit across projects.</p>
            )}
          </div>
          {neighbours.size > 0 && (
            <div className="eco-p-block">
              <p className="mono faint">Co-activated with</p>
              <ul className="eco-p-tags">
                {[...neighbours].map((id) => (
                  <li key={id}><button className="tag" onClick={() => setSel(id)} data-cursor="link">{G.byId[id].label}</button></li>
                ))}
              </ul>
            </div>
          )}
        </m.div>
      </AnimatePresence>
    </div>
  );

  return (
    <section id="skills" className="layer ecosystem" data-live aria-labelledby="skills-title" ref={ref}>
      <div className="wrap">
        <LayerHead
          id="skills-title"
          n="04"
          label="Skills"
          op="graph"
          title="A skill"
          italic="ecosystem."
          lede="Each skill links to the roles, experiments and papers where it was used. Hover or tap a node to see what it connects to."
        />

        <div className="eco-grid">
          {wide ? (
            <div className="eco-map" onMouseLeave={() => setHub(null)}>
              <svg viewBox={`0 0 ${W} ${H}`} className="eco-svg" role="group" aria-label="Skill network">
                <g className="eco-hublinks" aria-hidden="true">
                  {G.nodes.map((n) => (
                    <m.line
                      key={`h-${n.id}`}
                      x1={n.hx} y1={n.hy} x2={n.x} y2={n.y}
                      className={isLit(n) ? 'lit' : ''}
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: seen || reduced ? 1 : 0 }}
                      transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                    />
                  ))}
                </g>
                <g className="eco-links" aria-hidden="true">
                  {G.links.filter((l) => !hub && (l.a === sel || l.b === sel)).map((l) => {
                    const a = G.byId[l.a], b = G.byId[l.b];
                    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 40;
                    return <path key={`${l.a}-${l.b}`} d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} />;
                  })}
                </g>
                {G.hubs.map((h) => (
                  <g key={h.id} className={`eco-hub${hub === h.id || node.cluster === h.id ? ' on' : ''}`}>
                    <circle cx={h.x} cy={h.y} r="5" />
                    <circle cx={h.x} cy={h.y} r="16" className="eco-hub-ring" />
                    <text x={h.x} y={h.y - 24} textAnchor="middle" className="eco-hub-l" onMouseEnter={() => setHub(h.id)}>{h.label.toUpperCase()}</text>
                  </g>
                ))}
                {G.nodes.map((n, i) => (
                  <m.g
                    key={n.id}
                    className={`eco-node${n.id === sel ? ' sel' : ''}${isLit(n) ? ' lit' : ''}`}
                    initial={reduced ? false : { x: n.hx - n.x, y: n.hy - n.y, opacity: 0 }}
                    animate={seen || reduced ? { x: 0, y: 0, opacity: 1 } : { x: n.hx - n.x, y: n.hy - n.y, opacity: 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.02 }}
                  >
                    <g
                      role="button"
                      tabIndex={0}
                      aria-pressed={n.id === sel}
                      aria-label={`${n.label}: used in ${n.refs.length} items`}
                      onMouseEnter={() => { setHub(null); setSel(n.id); }}
                      onFocus={() => setSel(n.id)}
                      onClick={() => setSel(n.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(n.id))}
                      data-cursor="view"
                      data-cursor-label="Trace"
                    >
                      <rect x={n.x - 6} y={n.y - 6} width="12" height="12" className="eco-hit" />
                      <rect x={n.x - (3 + n.deg)} y={n.y - (3 + n.deg)} width={(3 + n.deg) * 2} height={(3 + n.deg) * 2} className="eco-dot" />
                      <text x={n.x + 12 + n.deg} y={n.y + 4} className="eco-l">{n.label}</text>
                    </g>
                  </m.g>
                ))}
              </svg>
              <p className="eco-legend mono-s faint" aria-hidden="true">■ size = number of works using it · ◯ cluster hub · curves = used in the same work</p>
            </div>
          ) : (
            <div className="eco-list">
              {SKILL_CLUSTERS.map((c) => (
                <div key={c.id} className="eco-cluster">
                  <p className="mono faint">{c.label}</p>
                  <ul>
                    {SKILLS.filter((s) => s.cluster === c.id).map((s) => (
                      <li key={s.id}>
                        <button
                          className={`tag${s.id === sel ? ' tag-on' : ''}${neighbours.has(s.id) ? ' tag-lit' : ''}`}
                          aria-pressed={s.id === sel}
                          onClick={() => setSel(s.id)}
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {panel}
        </div>
      </div>
    </section>
  );
}
