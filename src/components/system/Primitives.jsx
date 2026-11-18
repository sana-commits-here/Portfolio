import { useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useInView, useReduced } from '../../lib/util.js';

const EASE = [0.22, 1, 0.36, 1];

/* Character-level mask reveal. Words never break mid-word. */
export function SplitText({ text, as: Tag = 'span', className = '', delay = 0, stagger = 0.018, once = true, play }) {
  const ref = useRef(null);
  const seen = useInView(ref, '0px 0px -12% 0px', once);
  const reduced = useReduced();
  const show = play ?? seen;
  let i = 0;
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((w, wi) => (
        <span className="split-word" aria-hidden="true" key={wi}>
          {[...w].map((c) => {
            const d = delay + i++ * stagger;
            return (
              <m.span
                key={i}
                className="split-char"
                initial={reduced ? false : { y: '140%', rotate: 4 }}
                animate={show || reduced ? { y: '0%', rotate: 0 } : { y: '140%', rotate: 4 }}
                transition={{ duration: 0.9, ease: EASE, delay: d }}
              >
                {c}
              </m.span>
            );
          })}
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/* Resolves text through random glyphs — used for system metadata. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-=+*';
export function Scramble({ text, className = '', duration = 700, trigger = true }) {
  const [out, setOut] = useState(text);
  const reduced = useReduced();
  useEffect(() => {
    if (reduced || !trigger) { setOut(text); return; }
    let raf; const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const n = Math.floor(p * text.length);
      let s = text.slice(0, n);
      for (let k = n; k < text.length; k++) s += text[k] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, trigger, reduced]);
  return <span className={className}><span className="sr-only">{text}</span><span aria-hidden="true">{out}</span></span>;
}

/* Number that counts up the first time it is seen. Non-numeric values pass through. */
export function CountUp({ value, className = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, '0px', true);
  const reduced = useReduced();
  const m = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = useState(m && !reduced ? `${m[1]}0${m[3]}` : value);
  useEffect(() => {
    if (!m || reduced || !seen) { if (!m || reduced) setShown(value); return; }
    const target = parseFloat(m[2]);
    const decimals = (m[2].split('.')[1] || '').length;
    let raf; const start = performance.now(); const dur = 1300;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setShown(`${m[1]}${(target * e).toFixed(decimals)}${m[3]}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, value, reduced]);
  return <span ref={ref} className={className}><span className="sr-only">{String(value)}</span><span aria-hidden="true">{shown}</span></span>;
}

/* Magnetic wrapper — pulls its child slightly toward the pointer. */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = useReduced();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const active = fine && !reduced;
  const box = useRef(null);
  const enter = () => { if (active) box.current = ref.current.getBoundingClientRect(); };
  const move = (e) => {
    if (!active) return;
    const r = box.current || (box.current = ref.current.getBoundingClientRect());
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); box.current = null; };
  return (
    <m.span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', x: sx, y: sy }}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </m.span>
  );
}

/* Masked block reveal used for paragraphs / panels. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const reduced = useReduced();
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y, clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export function LayerHead({ n, op, label, title, italic, lede, id }) {
  return (
    <header className="lh">
      <div className="lh-meta mono">
        <span className="sig">L{n}</span>
        <span className="rule" aria-hidden="true" />
        <span>{label}</span>
        <span className="faint">· op: {op}()</span>
      </div>
      <h2 className="lh-title" id={id}>
        <SplitText text={title} />
        {italic ? <> <em><SplitText text={italic} delay={0.15} /></em></> : null}
      </h2>
      {lede ? <Reveal className="lh-lede" delay={0.2}><p>{lede}</p></Reveal> : null}
    </header>
  );
}
