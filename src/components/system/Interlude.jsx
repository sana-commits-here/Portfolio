import { useLayoutEffect, useMemo, useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { clamp, lerp, rng, smooth, useReduced } from '../../lib/util.js';

/*
 Interlude — the transition between two layers.
 A fixed population of N primitives morphs from the previous layer's
 visual motif into the next one's, driven purely by scroll. Every
 primitive is a <rect> whose geometry, fill and stroke interpolate, so
 a line can become a point, a point a frame, a frame a node.
*/
const N = 28;
const W = 1000;
const H = 360;

const SHAPES = {
  // hero: precision lines
  lines: (i) => {
    const row = i % 7, col = Math.floor(i / 7);
    return { x: 130 + col * 247, y: 42 + row * 46, w: 226, h: 1, r: 0, f: 0.9, s: 0, e: 0 };
  },
  // about: embedding cloud (3 clusters)
  cloud: (i, R) => {
    const c = [[300, 150], [620, 110], [520, 260]][i % 3];
    const a = R() * Math.PI * 2, d = Math.pow(R(), 0.6) * 70;
    const sz = 3 + R() * 5;
    return { x: c[0] + Math.cos(a) * d * 1.5, y: c[1] + Math.sin(a) * d, w: sz, h: sz, r: sz / 2, f: 1, s: 0, e: 0 };
  },
  // experience: ordered sequence on a time axis
  axis: (i) => {
    const big = i % 7 === 0;
    const sz = big ? 11 : 4;
    return { x: 60 + i * (880 / (N - 1)), y: 180, w: sz, h: sz, r: big ? 0 : sz / 2, f: big ? 0 : 1, s: big ? 1 : 0, e: 0, b: 1 };
  },
  // projects: frames / experiment chambers
  frames: (i) => {
    const col = i % 7, row = Math.floor(i / 7);
    return { x: 92 + col * 136, y: 52 + row * 85, w: 112, h: 64, r: 1, f: 0, s: 1, e: 0 };
  },
  // skills: network
  graph: (i, R) => {
    const a = (i / N) * Math.PI * 2 * 3 + R() * 0.6;
    const d = 40 + (i % 9) * 15 + R() * 30;
    const sz = i % 5 === 0 ? 10 : 4 + R() * 3;
    return { x: 500 + Math.cos(a) * d * 2.6, y: 180 + Math.sin(a) * d * 1.05, w: sz, h: sz, r: sz / 2, f: 1, s: 0, e: 0.45 };
  },
  // research: measurement grid / plot
  plot: (i) => {
    const col = i % 7, row = Math.floor(i / 7);
    return { x: 200 + col * 100, y: 60 + row * 80, w: 3, h: 3, r: 0, f: 1, s: 0, e: 0 };
  },
  // contact: everything reduces to one point
  point: (i) => {
    const sz = i === 0 ? 9 : 2;
    return { x: 500, y: 180, w: sz, h: sz, r: sz / 2, f: i === 0 ? 1 : 0.4, s: 0, e: 0 };
  },
};

function build(name, seed) {
  const R = rng(seed);
  return Array.from({ length: N }, (_, i) => SHAPES[name](i, R));
}

// edge pairs, fixed so graph-like states always look connected the same way
const EDGES = Array.from({ length: N }, (_, i) => [i, (i * 5 + 3) % N]).filter(([a, b]) => a !== b);

export default function Interlude({ from, to, op, result, theme = 'ink', toTheme, id }) {
  const ref = useRef(null);
  const rects = useRef([]);
  const edges = useRef([]);
  const bar = useRef(null);
  const base = useRef(null);
  const pct = useRef(null);
  const reduced = useReduced();
  const A = useMemo(() => build(from, 7), [from]);
  const B = useMemo(() => build(to, 13), [to]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Positions live in a typed array (not data-* attributes), and a frame is
  // skipped entirely when the clamped progress hasn't changed — which is every
  // scroll frame where this interlude is outside its morph window.
  const pos = useRef(new Float32Array(N * 2));
  const last = useRef({ t: -1, mix: -1, eo: -1 });

  const render = (p) => {
    const t = reduced ? 1 : clamp((p - 0.18) / 0.55);
    const mix = toTheme ? +smooth(clamp((p - 0.25) / 0.45)).toFixed(3) : 0;
    const L = last.current;
    if (Math.abs(t - L.t) < 0.0005 && mix === L.mix) return;
    if (toTheme && mix !== L.mix && ref.current) ref.current.style.setProperty('--mix', mix);
    L.mix = mix;
    if (Math.abs(t - L.t) < 0.0005) return;
    L.t = t;
    const P = pos.current;
    for (let i = 0; i < N; i++) {
      const el = rects.current[i];
      if (!el) continue;
      const lt = smooth(clamp((t - (i / N) * 0.35) / 0.65));
      const a = A[i], b = B[i];
      const w = lerp(a.w, b.w, lt), h = lerp(a.h, b.h, lt);
      const x = lerp(a.x, b.x, lt), y = lerp(a.y, b.y, lt);
      P[i * 2] = x; P[i * 2 + 1] = y;
      el.setAttribute('x', (x - w / 2).toFixed(1));
      el.setAttribute('y', (y - h / 2).toFixed(1));
      el.setAttribute('width', w.toFixed(1));
      el.setAttribute('height', h.toFixed(1));
      el.setAttribute('rx', lerp(a.r, b.r, lt).toFixed(1));
      el.setAttribute('fill-opacity', lerp(a.f, b.f, lt).toFixed(2));
      el.setAttribute('stroke-opacity', lerp(a.s, b.s, lt).toFixed(2));
    }
    // edges are only visible in graph-like states; skip them when fully hidden
    const eo = +lerp(A[0].e, B[0].e, smooth(t)).toFixed(2);
    if (eo > 0 || L.eo !== 0) {
      EDGES.forEach(([a, b], k) => {
        const ln = edges.current[k];
        if (!ln) return;
        ln.setAttribute('x1', P[a * 2]); ln.setAttribute('y1', P[a * 2 + 1]);
        ln.setAttribute('x2', P[b * 2]); ln.setAttribute('y2', P[b * 2 + 1]);
        ln.setAttribute('stroke-opacity', eo);
      });
    }
    L.eo = eo;
    if (base.current) base.current.setAttribute('stroke-opacity', lerp(A[0].b || 0, B[0].b || 0, smooth(t)).toFixed(2));
    if (bar.current) bar.current.style.transform = `scaleX(${t.toFixed(3)})`;
    if (pct.current) pct.current.textContent = String(Math.round(t * 100)).padStart(3, '0');
  };

  useMotionValueEvent(scrollYProgress, 'change', render);
  useLayoutEffect(() => { last.current.t = -1; render(scrollYProgress.get()); /* eslint-disable-next-line */ }, [reduced]);

  return (
    <div ref={ref} className={`interlude il-${theme}${toTheme ? ` il-to-${toTheme}` : ''}`} id={id} aria-hidden="true">
      <div className="il-inner wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="il-svg" preserveAspectRatio="xMidYMid meet">
          <line ref={base} className="il-base" x1="60" x2="940" y1="180" y2="180" strokeOpacity="0" />
          <g className="il-edges">
            {EDGES.map((_, k) => <line key={k} ref={(el) => (edges.current[k] = el)} strokeOpacity="0" />)}
          </g>
          {Array.from({ length: N }, (_, i) => (
            <rect key={i} ref={(el) => (rects.current[i] = el)} className={i === 0 ? 'il-key' : ''} />
          ))}
        </svg>
        <div className="il-caption mono">
          <span className="il-op">{op}</span>
          <span className="il-bar"><span ref={bar} /></span>
          <span className="il-res">→ {result}</span>
          <span ref={pct} className="il-pct faint">000</span>
        </div>
      </div>
    </div>
  );
}
