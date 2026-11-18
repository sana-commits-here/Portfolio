import { useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { EXPERIENCE, IDENTITY, PROJECTS, PUBLICATIONS } from '../../content/data.js';
import { useClock, useFinePointer, useReduced } from '../../lib/util.js';
import { Scramble, SplitText } from '../system/Primitives.jsx';
import VizCanvas from '../viz/VizCanvas.jsx';
import { makeField } from '../viz/field.js';

const EASE = [0.22, 1, 0.36, 1];
const FOCUS_CYCLE = ['Computer Vision', 'Generative AI', 'Agentic AI & RAG', 'Edge AI', 'Robotics', 'Research'];

// Ticking pieces live in their own tiny components so the clock (every
// second) and the focus rotation (every 2.6s) never re-render the hero.
function Clock() {
  const clock = useClock(IDENTITY.timezone);
  return <span><span className="sr-only">Local time in Bangalore: </span>{clock} IST</span>;
}

function FocusCycle({ run }) {
  const [fi, setFi] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setFi((i) => (i + 1) % FOCUS_CYCLE.length), 2600);
    return () => clearInterval(id);
  }, [run]);
  return <Scramble text={FOCUS_CYCLE[fi]} trigger={run} duration={520} />;
}

export default function Hero({ ready }) {
  const ref = useRef(null);
  const reduced = useReduced();
  const fine = useFinePointer();

  // cursor depth: name layers drift against each other
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const nearX = useTransform(sx, (v) => v * -14), nearY = useTransform(sy, (v) => v * -8);
  const farX = useTransform(sx, (v) => v * 22), farY = useTransform(sy, (v) => v * 12);
  const annX = useTransform(sx, (v) => v * 6);

  // scroll: the identity compresses and hands over to the next layer
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (!fine || reduced) return;
    // only track the pointer while the hero is actually on screen
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(ref.current);
    const move = (e) => {
      if (!visible) return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('pointermove', move); };
  }, [fine, reduced, mx, my]);

  const show = ready;
  const d = (n) => ({ duration: 0.9, ease: EASE, delay: n });

  return (
    <section id="top" ref={ref} className="hero" data-live aria-labelledby="hero-name">
      {/* the lattice starts once the curtain opens: no drawing behind the cover */}
      {ready && <VizCanvas make={makeField} className="hero-field" pointerTarget={ref} />}
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-inner wrap">
        <m.div className="hero-top mono" initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={d(0.5)}>
          <div className="hero-top-l">
            <span className="sig">L00</span>
            <span>Forward pass</span>
            <span className="faint">input: identity</span>
          </div>
          <div className="hero-top-r">
            <span><span className="pulse" aria-hidden="true" /> Online</span>
            <span className="faint">BLR</span>
            <Clock />
          </div>
        </m.div>

        <m.div className="hero-name-wrap" style={reduced ? undefined : { scale: nameScale, y: nameY }}>
          <h1 id="hero-name" className="hero-name">
            <m.span className="hn-1" style={reduced ? undefined : { x: nearX, y: nearY }}>
              <SplitText text={IDENTITY.first} play={show} stagger={0.06} delay={0.05} />
            </m.span>
            <m.span className="hn-2" style={reduced ? undefined : { x: farX, y: farY }}>
              <SplitText text={IDENTITY.last} play={show} stagger={0.045} delay={0.25} />
            </m.span>
            <span className="sr-only"> — {IDENTITY.role}</span>
          </h1>

          {/* technical annotations pinned to the name */}
          <m.div className="hero-ann" aria-hidden="true" style={reduced ? undefined : { x: annX }} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={d(0.9)}>
            <span className="ann ann-a mono-s"><i /> fig.00 — input vector</span>
            <span className="ann ann-b mono-s"><i /> dim: perception × language × agency</span>
            <span className="ann ann-c mono-s">↳ resolved {new Date().getFullYear()}</span>
          </m.div>
        </m.div>

        <m.div className="hero-read" style={reduced ? undefined : { opacity: fade }}>
          <m.dl className="hero-spec" initial={{ opacity: 0, y: 16 }} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }} transition={d(0.75)}>
            <div>
              <dt className="mono faint">Role</dt>
              <dd>{IDENTITY.role}</dd>
            </div>
            <div>
              <dt className="mono faint">Currently</dt>
              <dd>{IDENTITY.currentRole}<span className="dim"> · {IDENTITY.currentOrg}</span></dd>
            </div>
            <div className="hero-focus">
              <dt className="mono faint">Attending to</dt>
              <dd className="sig"><FocusCycle run={show} /></dd>
            </div>
          </m.dl>
          <m.p className="hero-statement" initial={{ opacity: 0, y: 16 }} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }} transition={d(0.9)}>
            {IDENTITY.statement}
          </m.p>
          <m.div className="hero-foot mono" initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={d(1.1)}>
            <a href="#about" className="hero-scroll" data-cursor="link">
              <span className="hero-scroll-line" aria-hidden="true"><span /></span>
              Scroll to propagate
            </a>
            <span className="faint hero-count">{PROJECTS.length} experiments · {PUBLICATIONS.length} publications · {EXPERIENCE.length} roles</span>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
