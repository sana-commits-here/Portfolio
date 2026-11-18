import { useRef, useState } from 'react';
import { AnimatePresence, m, useScroll, useSpring } from 'framer-motion';
import { CHRONOLOGY, ENTITIES, EXPERIENCE } from '../../content/data.js';
import { useReduced } from '../../lib/util.js';
import { CountUp, LayerHead, Reveal } from '../system/Primitives.jsx';

const EASE = [0.22, 1, 0.36, 1];
const KIND = { role: 'Role', experiment: 'Experiment', publication: 'Paper' };

function Mission({ e, i, open, toggle }) {
  const panel = `mission-${e.id}`;
  return (
    <article className={`mission${open ? ' open' : ''}`} aria-labelledby={`${panel}-h`}>
      <span className="mission-node" aria-hidden="true"><span /></span>
      <Reveal>
        <div className="mission-meta mono">
          <span className="sig">M{String(EXPERIENCE.length - i).padStart(2, '0')}</span>
          <span>{e.type}</span>
          <span className="faint">{e.period}</span>
          {e.location && <span className="faint mission-loc">{e.location}</span>}
        </div>
        <h3 id={`${panel}-h`} className="mission-org serif">{e.org}</h3>
        <p className="mission-role">{e.role}</p>
        <p className="mission-sum dim">{e.summary}</p>
        <div className="mission-stats">
          {e.stats.map((s) => (
            <div key={s.label}>
              <span className="serif mission-num"><CountUp value={s.value} /></span>
              <span className="mono-s faint">{s.label}</span>
            </div>
          ))}
        </div>
        <button className="mission-toggle mono" onClick={toggle} aria-expanded={open} aria-controls={panel} data-cursor="view" data-cursor-label={open ? 'Collapse' : 'Expand'}>
          <span className="mt-icon" aria-hidden="true" />
          {open ? 'Collapse log' : 'Expand mission log'}
        </button>
      </Reveal>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panel}
            className="mission-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ol className="mission-hl">
              {e.highlights.map((h, k) => (
                <m.li key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.06, duration: 0.5, ease: EASE }}>
                  <span className="mono faint">{String(k + 1).padStart(2, '0')}</span>
                  <p>{h}</p>
                </m.li>
              ))}
            </ol>
            <div className="mission-stack">
              <span className="mono faint">Stack</span>
              <ul>{e.stack.map((s) => <li key={s} className="tag">{s}</li>)}</ul>
            </div>
            {e.signal && (
              <figure className="mission-signal">
                <span className="mono faint">Peer signal</span>
                <blockquote className="serif italic">“{e.signal.quote}”</blockquote>
                <figcaption className="mono-s"><span>{e.signal.name}</span> <span className="faint">— {e.signal.role}</span></figcaption>
              </figure>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function Trajectory() {
  const [open, setOpen] = useState({ [EXPERIENCE[0].id]: true });
  const track = useRef(null);
  const reduced = useReduced();
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 70%', 'end 60%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="experience" className="layer trajectory" aria-labelledby="exp-title">
      <div className="wrap">
        <LayerHead
          id="exp-title"
          n="02"
          label="Experience"
          op="layers"
          title="Trajectory,"
          italic="layer by layer."
          lede="Each role added depth: automating NLP data pipelines for a Helsinki team (remote), leading real-time inference and edge vision at Amakh in Hyderabad, and now an AI, frontend &amp; automation role at Codetrappers."
        />

        <div className="tj-grid">
          <aside className="tj-chrono" aria-label="Chronology">
            <p className="mono faint tj-chrono-h">Chronology · signal history</p>
            <ol>
              {CHRONOLOGY.map((y) => (
                <li key={y.year} className="tj-year">
                  <span className="serif tj-y">{y.year}</span>
                  <ul>
                    {y.items.map((it) => (
                      <li key={it.ref} className={`tj-item tj-${it.kind}`}>
                        <a href={ENTITIES[it.ref].anchor} data-cursor="link">
                          <span className="mono-s faint">{KIND[it.kind]}</span>
                          <span>{ENTITIES[it.ref].label.split(' — ')[0].replace(/^\d\d /, '')}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </aside>

          <div className="tj-track" ref={track}>
            <div className="tj-line" aria-hidden="true">
              <m.span style={reduced ? { scaleY: 1 } : { scaleY: grow }} />
            </div>
            {EXPERIENCE.map((e, i) => (
              <Mission key={e.id} e={e} i={i} open={!!open[e.id]} toggle={() => setOpen((o) => ({ ...o, [e.id]: !o[e.id] }))} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
