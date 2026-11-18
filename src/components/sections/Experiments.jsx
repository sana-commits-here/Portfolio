import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CHANNELS, PROJECTS } from '../../content/data.js';
import { mailto, useReduced } from '../../lib/util.js';
import { CountUp, LayerHead, SplitText } from '../system/Primitives.jsx';
import VizCanvas from '../viz/VizCanvas.jsx';

const EASE = [0.22, 1, 0.36, 1];

function Chamber({ p, viz }) {
  const [mode, setMode] = useState('sim');
  const host = useRef(null);
  const reduced = useReduced();
  useEffect(() => setMode('sim'), [p.id]);
  const cursor = { route: 'Inspect', robot: 'Lead', xai: 'Perturb', vision: 'Intrude' }[p.viz];
  return (
    <div className="ch" ref={host}>
      <div className="ch-hud ch-hud-t mono-s">
        <span><span className="sig">EXP_{p.index}</span> · {p.vizLabel}</span>
        {p.capture && (
          <span className="ch-modes" role="group" aria-label="Visual mode">
            <button className={mode === 'sim' ? 'on' : ''} aria-pressed={mode === 'sim'} onClick={() => setMode('sim')} data-cursor="link">Simulation</button>
            <button className={mode === 'cap' ? 'on' : ''} aria-pressed={mode === 'cap'} onClick={() => setMode('cap')} data-cursor="link">Field capture</button>
          </span>
        )}
      </div>
      <div className="ch-stage" data-cursor={mode === 'sim' ? 'drag' : 'view'} data-cursor-label={mode === 'sim' ? cursor : 'Capture'}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'sim' ? (
            <m.div
              key={`sim-${p.id}`}
              className="ch-layer"
              initial={reduced ? false : { clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={reduced ? undefined : { clipPath: 'inset(0 100% 0 0)' }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              {viz ? (
                <VizCanvas make={viz[p.viz]} className="ch-canvas" label={`Interactive schematic for ${p.name}: ${p.vizLabel}`} />
              ) : (
                <div className="ch-canvas" aria-hidden="true" />
              )}
            </m.div>
          ) : (
            <m.figure
              key={`cap-${p.id}`}
              className="ch-layer ch-capture"
              initial={reduced ? false : { clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={reduced ? undefined : { clipPath: 'inset(0 100% 0 0)' }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <img src={p.capture.src} alt={p.capture.alt} width={p.capture.w} height={p.capture.h} loading="lazy" decoding="async" />
              <figcaption className="mono-s">{p.capture.alt}</figcaption>
            </m.figure>
          )}
        </AnimatePresence>
        <span className="ch-corner tl" aria-hidden="true" /><span className="ch-corner tr" aria-hidden="true" />
        <span className="ch-corner bl" aria-hidden="true" /><span className="ch-corner br" aria-hidden="true" />
      </div>
      <div className="ch-hud ch-hud-b mono-s faint">
        <span>{p.domain}</span>
        <span>{mode === 'sim' ? 'interactive schematic · not live data' : 'field capture'}</span>
      </div>
    </div>
  );
}

export default function Experiments() {
  const [ai, setAi] = useState(0);
  // The project visuals are a separate chunk, fetched when this layer is
  // within ~1.5 screens — they never block the first paint.
  const [viz, setViz] = useState(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('../viz/draw.js').then((m) => setViz(m.VIZ));
    }, { rootMargin: '150% 0px' });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  const tabs = useRef([]);
  const p = PROJECTS[ai];
  const reduced = useReduced();

  // deep links like #experiment-amr select the right experiment
  useEffect(() => {
    const sync = () => {
      const m = location.hash.match(/^#experiment-(.+)$/);
      if (!m) return;
      const i = PROJECTS.findIndex((x) => x.id === m[1]);
      if (i >= 0) setAi(i);
    };
    sync();
    const click = (e) => {
      const a = e.target.closest?.('a[href^="#experiment-"]');
      if (a) setTimeout(sync, 0);
    };
    window.addEventListener('hashchange', sync);
    document.addEventListener('click', click);
    return () => { window.removeEventListener('hashchange', sync); document.removeEventListener('click', click); };
  }, []);

  const onKey = (e) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (ai + dir + PROJECTS.length) % PROJECTS.length;
    setAi(n); tabs.current[n]?.focus();
  };

  return (
    <section id="projects" ref={sectionRef} className="layer experiments" aria-labelledby="proj-title">
      {PROJECTS.map((x) => <span key={x.id} id={`experiment-${x.id}`} className="anchor" aria-hidden="true" />)}
      <div className="wrap">
        <LayerHead
          id="proj-title"
          n="03"
          label="Projects"
          op="attention"
          title="Experiments"
          italic="under observation."
          lede="Four systems, each with its own instrument. Each one is an interactive schematic of what the system does. Move your cursor through it."
        />

        <div className="xp-tabs" role="tablist" aria-label="Experiments" onKeyDown={onKey}>
          {PROJECTS.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => (tabs.current[i] = el)}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === ai}
              aria-controls="xp-panel"
              tabIndex={i === ai ? 0 : -1}
              className={`xp-tab${i === ai ? ' on' : ''}`}
              onClick={() => setAi(i)}
              data-cursor="project"
              data-cursor-label={`Load ${x.index}`}
            >
              <span className="mono xp-tab-i">{x.index}</span>
              <span className="xp-tab-n">{x.name}</span>
              <span className="mono-s faint xp-tab-d">{x.domain} · {x.year}</span>
              {i === ai && <m.span layoutId="xp-tab-bar" className="xp-tab-bar" transition={{ duration: reduced ? 0 : 0.5, ease: EASE }} />}
            </button>
          ))}
        </div>

        <div id="xp-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="xp-panel">
          <Chamber p={p} viz={viz} />

          <div className="xp-info">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
              >
                <p className="mono xp-ctx"><span className="sig">{p.index}</span> <span className="faint">/ {PROJECTS.length.toString().padStart(2, '0')}</span> · {p.context} · {p.year}</p>
                <h3 className="xp-title serif">
                  <SplitText text={p.name} play stagger={0.025} />
                  <span className="xp-sub"><SplitText text={p.title} play stagger={0.012} delay={0.12} /></span>
                </h3>

                <dl className="xp-story">
                  {[['Problem', p.challenge], ['My role', p.role], ['Approach', p.solution]].map(([k, v], i) => (
                    <m.div key={k} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}>
                      <dt className="mono faint">{k}</dt>
                      <dd>{v}</dd>
                    </m.div>
                  ))}
                </dl>

                <ul className="xp-results" aria-label="Reported results">
                  {p.results.map((r, i) => (
                    <m.li key={r.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: EASE }}>
                      <span className="serif xp-r-v"><CountUp value={r.value} /></span>
                      <span className="mono-s faint">{r.label}</span>
                    </m.li>
                  ))}
                </ul>

                <ul className="xp-stack" aria-label="Technologies">
                  {p.stack.map((s, i) => (
                    <m.li key={s} className="tag" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.035, duration: 0.4, ease: EASE }}>{s}</m.li>
                  ))}
                </ul>

                <div className="xp-actions">
                  <a className="btn" href={mailto({ subject: `About ${p.name} — ${p.title}` }, CHANNELS.email)} data-cursor="link">
                    Discuss this build <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                  <a className="btn" href={CHANNELS.github} target="_blank" rel="noopener noreferrer" data-cursor="link">
                    GitHub <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
