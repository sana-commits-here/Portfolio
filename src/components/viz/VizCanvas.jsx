import { useEffect, useRef } from 'react';
import { useReduced } from '../../lib/util.js';

/*
 Shared canvas host for every live visual on the site.
 - DPR-aware, resizes with its box
 - runs requestAnimationFrame only while on screen
 - pointer in normalised coords (null when outside)
 - reduced motion: renders a single representative frame
 `make(ctx)` returns a draw(ctx, w, h, t, pointer, dt) function so each
 visual can keep private state in a closure.
*/
export default function VizCanvas({ make, className = '', label, still = 2.4, pointerTarget, ...rest }) {
  const ref = useRef(null);
  const reduced = useReduced();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const draw = make();
    let w = 0, h = 0, raf = 0, visible = false, last = 0, t = 0;
    const pointer = { x: 0.5, y: 0.5, active: false, down: false };

    // Render resolution: capped at 1.5x on capable desktops, 1x on touch or
    // low-core devices. These visuals are thin lines and dots; 2x+ buys
    // nothing visible but quadruples the pixels to fill every frame.
    const strong = window.matchMedia('(pointer: fine)').matches && (navigator.hardwareConcurrency || 4) > 4;
    const DPR = Math.min(window.devicePixelRatio || 1, strong ? 1.5 : 1);
    let rect = null; // cached; invalidated on scroll/resize instead of measured per pointer event
    const size = () => {
      const r = canvas.getBoundingClientRect();
      rect = r;
      const dpr = DPR;
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced || !visible) draw(ctx, w, h, still, pointer, 0);
    };
    const frame = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now; t += dt;
      draw(ctx, w, h, t, pointer, dt);
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !reduced) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    }, { rootMargin: '80px' });
    io.observe(canvas);

    const host = pointerTarget?.current || canvas;
    const dirty = () => { rect = null; };
    window.addEventListener('scroll', dirty, { passive: true });
    const move = (e) => {
      const r = rect || (rect = canvas.getBoundingClientRect());
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
      pointer.active = e.pointerType === 'mouse' || e.pointerType === 'pen' || pointer.down;
      if (reduced) draw(ctx, w, h, still, pointer, 0);
    };
    const leave = () => { pointer.active = false; pointer.down = false; };
    const down = (e) => { pointer.down = true; move(e); pointer.active = true; };
    const up = () => { pointer.down = false; };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    size();
    return () => {
      stop(); ro.disconnect(); io.disconnect();
      window.removeEventListener('scroll', dirty);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [make, reduced, still, pointerTarget]);

  return <canvas ref={ref} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'} {...rest} />;
}
