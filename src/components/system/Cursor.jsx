import { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReduced } from '../../lib/util.js';

/*
 Precision cursor. Elements opt into states with data-cursor:
   link     → small arrow (direction indicator)
   view     → "VIEW" label, expanded ring
   project  → project indicator with data-cursor-label
   drag     → "MOVE" (interactive canvases)
*/
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReduced();
  const dot = useRef(null);
  const ring = useRef(null);
  const [state, setState] = useState({ kind: 'default', label: '' });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add('has-cursor');
    // Pointer events only record the target; one rAF loop writes transforms
    // and goes to sleep once the ring has caught up (no idle frames).
    let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0, shown = false;
    const k = reduced ? 1 : 0.2;
    const loop = () => {
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const move = (e) => {
      tx = e.clientX; ty = e.clientY; wake();
      if (!shown) { shown = true; setHidden(false); }
    };
    let curKind = 'default', curLabel = '';
    const set = (kind, label) => {
      if (kind === curKind && label === curLabel) return; // no re-render if nothing changed
      curKind = kind; curLabel = label;
      setState({ kind, label });
    };
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor], a, button, [role="button"], input, textarea, label');
      if (!el) return set('default', '');
      const kind = el.dataset?.cursor || (el.matches('input, textarea') ? 'text' : 'link');
      set(kind, el.dataset?.cursorLabel || '');
    };
    const leave = () => { shown = false; setHidden(true); };
    const down = () => document.documentElement.classList.add('cursor-down');
    const up = () => document.documentElement.classList.remove('cursor-down');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [fine, reduced]);

  if (!fine) return null;
  const label = state.kind === 'view' ? state.label || 'View' : state.kind === 'project' ? state.label || 'Open' : state.kind === 'drag' ? state.label || 'Move' : '';
  return (
    <div className={`cur cur-${state.kind}${hidden ? ' cur-hidden' : ''}`} aria-hidden="true">
      <div ref={ring} className="cur-ring">
        <span className="cur-box">
          <i /><i /><i /><i />
          {label ? <span className="cur-label">{label}</span> : null}
          {state.kind === 'link' ? <span className="cur-arrow">↗</span> : null}
        </span>
      </div>
      <div ref={dot} className="cur-dot" />
    </div>
  );
}
