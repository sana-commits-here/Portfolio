import { m } from 'framer-motion';
import { EDUCATION, ENTITIES, PUBLICATIONS } from '../../content/data.js';
import { useReduced } from '../../lib/util.js';
import { LayerHead, Reveal } from '../system/Primitives.jsx';

const EASE = [0.22, 1, 0.36, 1];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

// The original five research threads, each with its guiding question and
// the work that backs it.
const THREADS = [
  { t: 'Edge-quantised perception', q: 'How small can a detector get before it stops seeing?', refs: ['icammae', 'amr', 'vanguard'] },
  { t: 'Human-following robotics', q: 'Closing the loop between detection and motion on a 4WD platform.', refs: ['icammae', 'amr'] },
  { t: 'Conversational AI in healthcare', q: 'Parsing patient intent for preliminary inquiry triage.', refs: ['medibuddy'] },
  { t: 'Explainable decision systems', q: 'Turning model odds into reasons and a 90-day plan.', refs: ['docuwise'] },
  { t: 'Local, grounded language models', q: 'Retrieval over verified geodata with zero cloud tokens.', refs: ['tripify'] },
];

const SHORT = { medibuddy: 'Medibuddy 2024' };
const shortName = (ref) => SHORT[ref] || ENTITIES[ref].label.split(' — ')[0].replace(/^\d\d /, '').split(' · ').pop();

function Figure({ steps, n }) {
  const reduced = useReduced();
  return (
    <figure className="fig">
      <figcaption className="fig-head mono-s">Fig. {n} · pipeline</figcaption>
      <ol className="fig-flow">
        {steps.map((s, i) => (
          <m.li
            key={s}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.12 * i }}
          >
            <span className="fig-box">{s}</span>
            {i < steps.length - 1 && (
              <m.span
                className="fig-arrow"
                aria-hidden="true"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.12 * i + 0.25 }}
              />
            )}
          </m.li>
        ))}
      </ol>
    </figure>
  );
}

export default function Laboratory() {
  return (
    <section id="research" className="layer lab" aria-labelledby="research-title">
      <div className="lab-paper" aria-hidden="true" />
      <div className="wrap">
        <LayerHead
          id="research-title"
          n="05"
          label="Research"
          op="laboratory"
          title="The"
          italic="laboratory."
          lede="Published research in robotics and conversational AI, and the research threads that connect it to the rest of the work."
        />

        {/* 05.1 — publications */}
        <div className="lab-part">
          <header className="lab-part-h">
            <span className="mono lab-n">05.1</span>
            <h3 className="lab-part-t">Publications</h3>
            <span className="mono-s lab-muted">
              {PUBLICATIONS.length} papers · plus 4+ co-authored during the StageZero internship
            </span>
          </header>

          <div className="lab-pubs">
            {PUBLICATIONS.map((p, i) => (
              <article key={p.id} className="specimen" aria-labelledby={`pub-${p.id}`}>
                <div className="sp-side">
                  <p className="sp-plate serif">{ROMAN[i]}</p>
                  <p className="mono-s">{p.year}</p>
                  <p className="mono-s lab-muted">{p.kind}</p>
                </div>
                <div className="sp-main">
                  <Reveal>
                    <h4 id={`pub-${p.id}`} className="sp-title serif">{p.title}</h4>
                    <p className="sp-venue">{p.venue}</p>
                    <p className="sp-role mono-s">{p.role}</p>
                    <p className="sp-abs">{p.abstract}</p>
                  </Reveal>
                  <Figure steps={p.figure} n={i + 1} />
                  <div className="sp-foot mono-s">
                    <span className="lab-muted">{p.topics.join(' · ')}</span>
                    <span className="sp-links">
                      {p.link ? (
                        <a className="ulink" href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="link">Read paper ↗</a>
                      ) : (
                        <span className="lab-muted">Paper link pending</span>
                      )}
                      {p.related && (
                        <a className="ulink" href={ENTITIES[p.related].anchor} data-cursor="link">Related experiment ↘</a>
                      )}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 05.2 — research threads */}
        <div className="lab-part">
          <header className="lab-part-h">
            <span className="mono lab-n">05.2</span>
            <h3 className="lab-part-t">Research threads</h3>
          </header>
          <ol className="lab-threads">
            {THREADS.map((th, i) => (
              <Reveal as="li" key={th.t} delay={i * 0.05}>
                <span className="mono-s lab-n">T{i + 1}</span>
                <div className="lab-t">
                  <h4>{th.t}</h4>
                  <p className="lab-q serif italic">{th.q}</p>
                </div>
                <p className="lab-thread-refs mono-s">
                  {th.refs.map((r, k) => (
                    <span key={r}>
                      {k > 0 && <span className="lab-muted"> · </span>}
                      <a className="ulink" href={ENTITIES[r].anchor} data-cursor="link">{shortName(r)}</a>
                    </span>
                  ))}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>

        {EDUCATION.length > 0 && (
          <div className="lab-part">
            <header className="lab-part-h">
              <span className="mono lab-n">05.3</span>
              <h3 className="lab-part-t">Education</h3>
            </header>
            <ol className="edu-flow">
              {EDUCATION.map((e, i) => (
                <Reveal as="li" key={i} delay={i * 0.08}>
                  <span className="mono-s lab-n">{e.stage}</span>
                  <p className="serif edu-deg">{e.degree}</p>
                  <p>{e.institution}</p>
                  <p className="mono-s lab-muted">{e.period}</p>
                  {e.note && <p className="lab-muted">{e.note}</p>}
                </Reveal>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
