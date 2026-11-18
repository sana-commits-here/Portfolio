import { token } from '../../lib/util.js';

/* Palette pulled from CSS tokens once per visual. */
export function palette() {
  return {
    ink: token('--ink-0', '#0b0b0a'),
    paper: token('--paper', '#ece8e1'),
    muted: token('--muted', '#a29e96'),
    signal: token('--signal', '#ff5a1f'),
    steel: token('--steel', '#93a4b2'),
    mono: token('--f-mono', 'monospace'),
  };
}
export const rgba = (hex, a) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export function bracket(ctx, x, y, w, h, len, color, lw = 1.2) {
  ctx.strokeStyle = color; ctx.lineWidth = lw;
  ctx.beginPath();
  const l = Math.min(len, w / 3, h / 3);
  ctx.moveTo(x, y + l); ctx.lineTo(x, y); ctx.lineTo(x + l, y);
  ctx.moveTo(x + w - l, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + l);
  ctx.moveTo(x + w, y + h - l); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - l, y + h);
  ctx.moveTo(x + l, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - l);
  ctx.stroke();
}

export function label(ctx, P, text, x, y, color, bg) {
  ctx.font = `500 10px ${P.mono}`;
  const tw = ctx.measureText(text).width;
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(x, y - 11, tw + 8, 14); }
  ctx.fillStyle = color; ctx.fillText(text, x + 4, y);
  return tw + 8;
}

