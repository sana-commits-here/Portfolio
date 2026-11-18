import { lerp } from '../../lib/util.js';
import { palette, rgba } from './common.js';

/* ─── HERO FIELD — lattice that bends around the cursor ───────────
 Optimised: the undisturbed lattice is rendered once into an offscreen
 canvas and blitted each frame. Only the dots inside the lens radius
 (~5% of them) are computed and drawn individually, using globalAlpha
 instead of building an rgba() string per dot. */
export const makeField = () => {
  const P = palette();
  let px = 0.5, py = 0.5;
  let cache = null, cw = 0, ch = 0, cdpr = 0;
  const BASE = 0.2;
  const buildCache = (ctx, w, h, gap) => {
    const dpr = ctx.getTransform().a || 1;
    cache = document.createElement('canvas');
    cache.width = Math.ceil(w * dpr); cache.height = Math.ceil(h * dpr);
    const c = cache.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = rgba(P.paper, BASE);
    for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) c.fillRect(x - 0.5, y - 0.5, 1, 1);
    cw = w; ch = h; cdpr = dpr;
  };
  return (ctx, w, h, t, ptr) => {
    const gap = w < 700 ? 26 : 28;
    const dpr = ctx.getTransform().a || 1;
    if (!cache || cw !== w || ch !== h || cdpr !== dpr) buildCache(ctx, w, h, gap);
    const tx = ptr.active ? ptr.x : 0.5 + Math.sin(t * 0.21) * 0.28;
    const ty = ptr.active ? ptr.y : 0.45 + Math.cos(t * 0.17) * 0.22;
    px = lerp(px, tx, 0.08); py = lerp(py, ty, 0.08);
    const cx = px * w, cy = py * h;
    const R = Math.min(260, Math.max(w, h) * 0.22);

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(cache, 0, 0, w, h);
    // punch out the lens area, then redraw its dots displaced
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R + gap, 0, Math.PI * 2); ctx.clip();
    ctx.clearRect(cx - R - gap, cy - R - gap, (R + gap) * 2, (R + gap) * 2);
    ctx.fillStyle = P.paper;
    const nodes = [];
    const x0 = Math.max(gap / 2, Math.floor((cx - R - gap) / gap) * gap + gap / 2);
    const y0 = Math.max(gap / 2, Math.floor((cy - R - gap) / gap) * gap + gap / 2);
    for (let y = y0; y < Math.min(h, cy + R + gap); y += gap) {
      for (let x = x0; x < Math.min(w, cx + R + gap); x += gap) {
        const dx = x - cx, dy = y - cy;
        const d = Math.hypot(dx, dy);
        let ox = x, oy = y, a = BASE, sz = 1;
        if (d < R) {
          const k = (1 - d / R) * (1 - d / R);
          ox += (dx / (d || 1)) * k * 22;
          oy += (dy / (d || 1)) * k * 22;
          a = BASE + k * 0.55; sz = 1 + k * 1.2;
          const gi = Math.round(x / gap) * 31 + Math.round(y / gap) * 17;
          if (k > 0.25 && gi % 11 === 0 && nodes.length < 6) nodes.push([ox, oy, k]);
        }
        ctx.globalAlpha = a;
        ctx.fillRect(ox - sz / 2, oy - sz / 2, sz, sz);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    // data points — connect to the probe
    ctx.lineWidth = 1;
    nodes.forEach(([x, y, k]) => {
      ctx.strokeStyle = rgba(P.signal, 0.15 + k * 0.4);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = P.signal; ctx.fillRect(x - 2, y - 2, 4, 4);
    });
    // crosshair
    ctx.strokeStyle = rgba(P.paper, 0.08);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.strokeStyle = rgba(P.paper, 0.6);
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.font = `10px ${P.mono}`; ctx.fillStyle = rgba(P.paper, 0.55);
    ctx.fillText(`x ${px.toFixed(3)}  y ${py.toFixed(3)}`, cx + 22, cy - 10);
  };
};

