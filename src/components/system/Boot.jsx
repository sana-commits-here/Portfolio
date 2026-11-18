import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { Scramble } from './Primitives.jsx';

const CURTAIN = [0.76, 0, 0.24, 1];
const EASE = [0.22, 1, 0.36, 1];
const LOG = ['loading weights', 'calibrating perception', 'mounting experiments', 'resolving identity'];

/*
 Logo curtain — plays on every visit and every refresh.
 1. the SB mark draws inside its corner brackets while the system "boots"
 2. a signal line cuts across the seam
 3. the two halves of the curtain part, revealing the hero
 Any key, click or scroll skips straight to the reveal.
 Reduced motion: the mark shows briefly, then the curtain fades.
*/
export default function Boot({ onReveal, onDone, reduced }) {
  const [phase, setPhase] = useState('intro'); // intro → seam → open
  const [log, setLog] = useState(0);
  const revealed = useRef(false);

  const open = () => {
    if (revealed.current) return;
    revealed.current = true;
    setPhase('open');
    onReveal();
  };

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const t = reduced
      ? [setTimeout(open, 650)]
      : [
          ...LOG.map((_, i) => setTimeout(() => setLog(i + 1), 200 + i * 220)),
          setTimeout(() => setPhase('seam'), 1200),
          setTimeout(open, 1450),
        ];
    const skip = () => open();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchmove', skip, { passive: true });
    return () => {
      t.forEach(clearTimeout);
      root.style.overflow = prev;
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === 'open') document.documentElement.style.overflow = '';
  }, [phase]);

  const opening = phase === 'open';
  const done = () => opening && onDone();

  return (
    <div className="curtain" role="status" aria-live="polite" aria-label="Loading Sana Badagan's portfolio">
      {reduced ? (
        <m.div className="curtain-panel curtain-full" animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.35 }} onAnimationComplete={done} />
      ) : (
        <>
          <m.div className="curtain-panel curtain-top" animate={{ y: opening ? '-100%' : '0%' }} transition={{ duration: 0.9, ease: CURTAIN }} onAnimationComplete={done} />
          <m.div className="curtain-panel curtain-bot" animate={{ y: opening ? '100%' : '0%' }} transition={{ duration: 0.9, ease: CURTAIN }} />
          <m.span
            className="curtain-seam"
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: phase === 'intro' ? 0 : 1, opacity: opening ? 0 : 1 }}
            transition={{ scaleX: { duration: 0.35, ease: EASE }, opacity: { duration: 0.25, delay: 0.15 } }}
          />
        </>
      )}

      <m.div
        className="curtain-content"
        animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.96 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="logo">
          <span className="logo-frame" aria-hidden="true">
            {['tl', 'tr', 'bl', 'br'].map((c) => (
              <m.i
                key={c}
                className={`logo-c ${c}`}
                initial={reduced ? false : { opacity: 0, x: c.includes('l') ? 18 : -18, y: c.includes('t') ? 18 : -18 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              />
            ))}
          </span>
          <span className="logo-mark serif" aria-hidden="true">
            <span className="logo-mask">
              <m.span initial={reduced ? false : { y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}>S</m.span>
            </span>
            <span className="logo-mask">
              <m.span className="italic logo-b" initial={reduced ? false : { y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, ease: EASE, delay: 0.32 }}>b</m.span>
            </span>
          </span>
        </div>

        <p className="logo-word mono">
          <Scramble text="Sana Badagan" duration={reduced ? 0 : 650} />
        </p>
        <p className="logo-sub mono-s faint">AI / ML Engineer · forward pass</p>

        {!reduced && (
          <div className="curtain-progress" aria-hidden="true">
            <m.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.1 }} />
          </div>
        )}
      </m.div>

      {!reduced && (
        <m.div className="curtain-log mono-s" animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.2 }} aria-hidden="true">
          {LOG.slice(0, log).map((l, i) => (
            <div key={l}>
              <span className="faint">{String(i).padStart(2, '0')}</span> {l}
              <span className="sig"> {i === LOG.length - 1 ? 'match' : 'ok'}</span>
            </div>
          ))}
        </m.div>
      )}
      <m.p className="curtain-skip mono-s faint" animate={{ opacity: opening ? 0 : 1 }} aria-hidden="true">
        Press any key to skip
      </m.p>
    </div>
  );
}
