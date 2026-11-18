import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { LAYERS } from '../../content/data.js';
import { scrollToId, useActiveLayer } from '../../lib/util.js';

const EASE = [0.22, 1, 0.36, 1];

function go(e, id) {
  e.preventDefault();
  scrollToId(id);
}

/* Left signal spine — the line that carries the signal through every layer. */
export function Spine() {
  const ids = useMemo(() => LAYERS.map((l) => l.id), []);
  const active = useActiveLayer(ids);
  const ai = ids.indexOf(active);
  return (
    <nav className={`spine${active === 'research' ? ' on-lab' : ''}`} aria-label="Layer index">
      <div className="spine-track" aria-hidden="true"><div className="spine-fill" data-progress="y" /></div>
      <ol>
        {LAYERS.map((l, i) => (
          <li key={l.id} className={i === ai ? 'on' : i < ai ? 'past' : ''}>
            <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} data-cursor="link" aria-current={i === ai ? 'true' : undefined}>
              <span className="spine-n mono-s">{l.n}</span>
              <span className="spine-tip mono-s">{l.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* Floating dock — the primary navigation on every screen size. */
export function Dock() {
  const ids = useMemo(() => LAYERS.map((l) => l.id), []);
  const active = useActiveLayer(ids);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const cur = LAYERS.find((l) => l.id === active) || LAYERS[0];

  useEffect(() => {
    const on = () => setVisible(window.scrollY > window.innerHeight * 0.35);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const items = LAYERS.slice(1);
  return (
    <div className={`dock${visible || open ? ' dock-in' : ''}${open ? ' dock-open' : ''}`} onMouseLeave={() => setOpen(false)}>
      <AnimatePresence>
        {open && (
          <m.nav
            id="dock-menu"
            className="dock-menu"
            aria-label="Sections"
            initial={{ opacity: 0, y: 12, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
            exit={{ opacity: 0, y: 8, clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <ol>
              {items.map((l, i) => (
                <m.li
                  key={l.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.08, duration: 0.4, ease: EASE }}
                >
                  <a
                    href={`#${l.id}`}
                    className={l.id === active ? 'on' : ''}
                    aria-current={l.id === active ? 'true' : undefined}
                    onClick={(e) => { go(e, l.id); setOpen(false); }}
                    data-cursor="link"
                  >
                    <span className="mono sig">{l.n}</span>
                    <span className="dock-name">{l.label}</span>
                    <span className="mono-s faint">{l.op}</span>
                  </a>
                </m.li>
              ))}
            </ol>
          </m.nav>
        )}
      </AnimatePresence>

      <div className="dock-bar">
        <a href="#top" className="dock-mark" onClick={(e) => go(e, 'top')} aria-label="Back to top" data-cursor="link">
          <span className="serif">S</span><span className="serif italic">b</span>
        </a>
        <button
          className="dock-cur"
          aria-expanded={open}
          aria-controls="dock-menu"
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(true)}
          data-cursor="view"
          data-cursor-label="Index"
        >
          <span className="mono sig dock-n">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span key={cur.n} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.4, ease: EASE }}>
                {cur.n}
              </m.span>
            </AnimatePresence>
          </span>
          <span className="mono dock-slash faint">/</span>
          <span className="mono dock-label">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span key={cur.label} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                {cur.label}
              </m.span>
            </AnimatePresence>
          </span>
          <span className="dock-meter" aria-hidden="true"><span data-progress="x" /></span>
        </button>
        <a href="#contact" className="dock-cta mono" onClick={(e) => go(e, 'contact')} data-cursor="link" aria-label="Contact">
          <span className="pulse" aria-hidden="true" /> <span className="dock-cta-t">Channel</span>
        </a>
      </div>
    </div>
  );
}
