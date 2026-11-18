import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ENTITIES, EXPERIENCE, FOCUS, FOCUS_TOOLS, IDENTITY, PROJECTS, PUBLICATIONS, SKILLS } from '../../content/data.js';

const SKILL_LABEL = Object.fromEntries(SKILLS.map((s) => [s.id, s.label]));

// Quadratic curve from a focus point to a tool, bowed sideways; alternate
// links bow in opposite directions so a fan of links reads as a spray.
function curve(a, b, i) {
  const x1 = a.x * 100, y1 = a.y * 70, x2 = b.x * 100, y2 = b.y * 70;
  const dx = x2 - x1, dy = y2 - y1;
  const bow = (i % 2 ? -1 : 1) * 0.28;
  const cx = (x1 + x2) / 2 - dy * bow, cy = (y1 + y2) / 2 + dx * bow;
  return `M${x1.toFixed(2)},${y1.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`;
}
import { CountUp, LayerHead, Reveal } from '../system/Primitives.jsx';

const EASE = [0.22, 1, 0.36, 1];

const PRINCIPLES = [
  ['Perception at the edge', 'Quantised vision models running on constrained hardware — Raspberry Pi, RTX laptops, real robots.'],
  ['Grounded language systems', 'Local LLMs paired with retrieval and verified data so outputs stay factual.'],
  ['Explainable by default', 'Model decisions that come with their reasons — SHAP, LIME, and actionable next steps.'],
];

export default function Profile() {
  const [active, setActive] = useState('cv');
  const focus = FOCUS.find((f) => f.id === active);
  const tools = FOCUS_TOOLS.filter((t) => t.focus.includes(active));

  return (
    <section id="about" className="layer profile" data-live aria-labelledby="about-title">
      <div className="wrap">
        <LayerHead
          id="about-title"
          n="01"
          label="About"
          op="embed"
          title="An engineer,"
          italic="encoded."
          lede={IDENTITY.about}
        />

        <div className="pf-grid">
          {/* spec sheet */}
          <div className="pf-spec">
            <Reveal className="pf-card">
              <div className="pf-id">
                <figure className="pf-portrait">
                  <img src={IDENTITY.portrait} alt={`Illustrated portrait of ${IDENTITY.name}`} width="120" height="120" loading="lazy" decoding="async" />
                  <figcaption className="mono-s faint">subj · SB—01</figcaption>
                </figure>
                <div>
                  <p className="mono faint">Profile</p>
                  <p className="pf-name serif">{IDENTITY.name}</p>
                  <p className="dim">{IDENTITY.role}</p>
                </div>
              </div>
              <dl className="pf-dl">
                <div><dt className="mono faint">Base</dt><dd>{IDENTITY.location}</dd></div>
                <div><dt className="mono faint">Current</dt><dd>{IDENTITY.currentRole} — {IDENTITY.currentOrg}</dd></div>
                <div><dt className="mono faint">Active since</dt><dd>2023</dd></div>
                <div><dt className="mono faint">Status</dt><dd><span className="pulse" aria-hidden="true" /> Open to conversations</dd></div>
              </dl>
              <div className="pf-counts">
                <div><span className="serif pf-num"><CountUp value={String(EXPERIENCE.length)} /></span><span className="mono-s faint">Roles</span></div>
                <div><span className="serif pf-num"><CountUp value={String(PROJECTS.length)} /></span><span className="mono-s faint">Experiments</span></div>
                <div><span className="serif pf-num"><CountUp value={String(PUBLICATIONS.length)} /></span><span className="mono-s faint">Papers</span></div>
                <div><span className="serif pf-num"><CountUp value="50+" /></span><span className="mono-s faint">Pipelines shipped</span></div>
              </div>
            </Reveal>

            <ol className="pf-principles">
              {PRINCIPLES.map(([h, p], i) => (
                <Reveal as="li" key={h} delay={0.08 * i}>
                  <span className="mono sig">0{i + 1}</span>
                  <div>
                    <h3>{h}</h3>
                    <p className="dim">{p}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* embedding space */}
          <Reveal className="pf-embed" delay={0.1}>
            <div className="pf-embed-head mono">
              <span>Focus space</span>
              <span className="faint">select a point →</span>
            </div>
            <div className="pf-plot">
              <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true" className="pf-plot-svg">
                {[10, 20, 30, 40, 50, 60].map((y) => <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} />)}
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => <line key={`v${x}`} y1="0" y2="70" x1={x} x2={x} />)}
                {tools.map((t, i) => (
                  <path key={`${active}-${t.skill}`} className="pf-link" d={curve(focus, t, i)} />
                ))}
              </svg>
              {FOCUS_TOOLS.map((t) => (
                <span
                  key={t.skill}
                  className={`pf-tool${t.focus.includes(active) ? ' on' : ''}${t.left ? ' pf-left' : ''}`}
                  style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}
                  aria-hidden="true"
                >
                  <i />
                  <span className="mono-s">{SKILL_LABEL[t.skill]}</span>
                </span>
              ))}
              {FOCUS.map((f) => (
                <button
                  key={f.id}
                  className={`pf-pt${f.id === active ? ' on' : ''}${f.x >= 0.8 ? ' pf-left' : ''}`}
                  style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
                  onClick={() => setActive(f.id)}
                  onMouseEnter={() => setActive(f.id)}
                  onFocus={() => setActive(f.id)}
                  aria-pressed={f.id === active}
                  data-cursor="view"
                  data-cursor-label="Inspect"
                >
                  <span className="pf-pt-dot" aria-hidden="true" />
                  <span className="pf-pt-l mono">{f.label}</span>
                </button>
              ))}
              <span className="pf-axis pf-axis-x mono-s faint" aria-hidden="true">z₁ · perception → language</span>
              <span className="pf-axis pf-axis-y mono-s faint" aria-hidden="true">z₂ · model → physical world</span>
            </div>
            <div className="pf-evidence" aria-live="polite">
              <AnimatePresence mode="wait">
                <m.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>
                  <p className="mono"><span className="sig">{focus.label}</span> <span className="faint">· evidence ({focus.evidence.length})</span></p>
                  <ul>
                    {focus.evidence.map((ref) => {
                      const e = ENTITIES[ref];
                      return (
                        <li key={ref}>
                          <a href={e.anchor} className="pf-ev" data-cursor="link">
                            <span className="mono-s faint">{e.kind}</span>
                            <span>{e.label}</span>
                            <span aria-hidden="true" className="faint">↘</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mono pf-tools-h faint">Tools ({tools.length})</p>
                  <ul className="pf-tools">
                    {tools.map((t) => <li key={t.skill} className="tag">{SKILL_LABEL[t.skill]}</li>)}
                  </ul>
                </m.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
