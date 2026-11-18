import { clamp, lerp, rng } from '../../lib/util.js';
import { bracket, label, palette, rgba } from './common.js';

/* ─── 01 TRIPIFY — prompt → retrieval → route ───────────────────── */
export const makeRoute = () => {
  const P = palette();
  const R = rng(42);
  const pois = Array.from({ length: 10 }, (_, i) => ({ x: 0.14 + R() * 0.72, y: 0.3 + R() * 0.55, d: i < 4 ? 0 : i < 7 ? 1 : 2 }));
  // greedy order per day so routes look plausible (short hops)
  const order = [];
  [0, 1, 2].forEach((d) => {
    const left = pois.map((p, i) => ({ ...p, i })).filter((p) => p.d === d);
    let cur = order.length ? pois[order[order.length - 1]] : { x: 0.1, y: 0.9 };
    while (left.length) {
      left.sort((a, b) => Math.hypot(a.x - cur.x, a.y - cur.y) - Math.hypot(b.x - cur.x, b.y - cur.y));
      const n = left.shift(); order.push(n.i); cur = n;
    }
  });
  const prompt = '3 days · Goa · relaxed · beaches, seafood, historical forts';
  const dayColor = [P.paper, P.steel, P.signal];
  return (ctx, w, h, t, ptr) => {
    ctx.clearRect(0, 0, w, h);
    const cyc = t % 11;
    // terrain contours
    ctx.lineWidth = 1;
    for (let k = 0; k < 9; k++) {
      ctx.strokeStyle = rgba(P.paper, 0.05 + (k % 3 === 0 ? 0.03 : 0));
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const y = h * (0.28 + k * 0.08) + Math.sin(x * 0.011 + k * 1.3) * 14 + Math.cos(x * 0.004 + k) * 18;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // prompt line
    const typed = Math.floor(clamp(cyc / 2.2) * prompt.length);
    ctx.font = `11px ${P.mono}`;
    ctx.fillStyle = P.signal; ctx.fillText('>', 18, 28);
    ctx.fillStyle = rgba(P.paper, 0.9); ctx.fillText(prompt.slice(0, typed) + (cyc < 2.4 && (t * 2) % 2 < 1 ? '▍' : ''), 32, 28);
    const stage = cyc < 2.4 ? 'parsing request' : cyc < 4 ? 'retrieving POIs · OpenTripMap' : cyc < 8 ? 'synthesising itinerary · llama3.2 (local)' : 'itinerary ready · 0 unverified POIs';
    ctx.fillStyle = rgba(P.paper, 0.45); ctx.fillText(stage, 32, 46);

    // retrieval: POIs appear
    const shown = clamp((cyc - 2.4) / 1.6);
    const routeP = clamp((cyc - 4) / 4);
    let hover = -1;
    pois.forEach((p, i) => {
      const a = clamp(shown * pois.length - i);
      if (a <= 0) return;
      const x = p.x * w, y = p.y * h;
      if (ptr.active && Math.hypot(ptr.x * w - x, ptr.y * h - y) < 18) hover = i;
      ctx.strokeStyle = rgba(P.paper, 0.25 * a);
      ctx.beginPath(); ctx.arc(x, y, 9 + (1 - a) * 18, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = rgba(P.paper, a); ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
    });
    // route
    if (routeP > 0) {
      const segs = order.length - 1;
      const upto = routeP * segs;
      ctx.lineWidth = 1.5;
      for (let s = 0; s < segs; s++) {
        const k = clamp(upto - s);
        if (k <= 0) break;
        const a = pois[order[s]], b = pois[order[s + 1]];
        ctx.strokeStyle = dayColor[b.d];
        ctx.setLineDash(a.d === b.d ? [] : [3, 4]);
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(lerp(a.x, b.x, k) * w, lerp(a.y, b.y, k) * h);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    // day legend
    ['DAY 1', 'DAY 2', 'DAY 3'].forEach((d, i) => {
      ctx.fillStyle = dayColor[i]; ctx.fillRect(18 + i * 64, h - 22, 10, 2);
      ctx.fillStyle = rgba(P.paper, 0.5); ctx.font = `10px ${P.mono}`; ctx.fillText(d, 32 + i * 64, h - 18);
    });
    if (hover >= 0) {
      const p = pois[hover];
      label(ctx, P, `POI ${String(hover + 1).padStart(2, '0')} · day ${p.d + 1} · verified`, p.x * w + 12, p.y * h - 10, P.ink, P.paper);
    }
  };
};

/* ─── 02 AMR — human-following robot. Your cursor is the human. ── */
export const makeRobot = () => {
  const P = palette();
  const R = rng(7);
  const obstacles = Array.from({ length: 4 }, () => ({ x: 0.2 + R() * 0.6, y: 0.2 + R() * 0.6, r: 0.035 + R() * 0.03 }));
  const bot = { x: 0.3, y: 0.7, a: -0.6, vl: 0, vr: 0 };
  const trail = [];
  let target = { x: 0.6, y: 0.4 };
  return (ctx, w, h, t, ptr, dt) => {
    ctx.clearRect(0, 0, w, h);
    const S = Math.min(w, h);
    // floor grid
    ctx.strokeStyle = rgba(P.paper, 0.05); ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    const goal = ptr.active ? { x: ptr.x, y: ptr.y } : { x: 0.5 + Math.sin(t * 0.35) * 0.32, y: 0.5 + Math.sin(t * 0.52 + 1) * 0.28 };
    target.x = lerp(target.x, goal.x, 0.2); target.y = lerp(target.y, goal.y, 0.2);

    // controller: steer to target, hold follow distance, repel from obstacles
    let dx = (target.x - bot.x) * w, dy = (target.y - bot.y) * h;
    const dist = Math.hypot(dx, dy);
    let fx = dx / (dist || 1), fy = dy / (dist || 1);
    let near = false;
    obstacles.forEach((o) => {
      const ox = (bot.x - o.x) * w, oy = (bot.y - o.y) * h;
      const od = Math.hypot(ox, oy) - o.r * S;
      if (od < 60) { const k = (1 - od / 60) * 2.2; fx += (ox / (od + o.r * S)) * k; fy += (oy / (od + o.r * S)) * k; near = near || od < 40; }
    });
    const desired = Math.atan2(fy, fx);
    let da = desired - bot.a; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const follow = 0.11 * S;
    const speed = clamp((dist - follow) / (S * 0.25), 0, 1) * 0.9;
    const turn = clamp(da * 1.6, -1, 1);
    bot.vl = lerp(bot.vl, clamp(speed - turn * 0.5, -1, 1), 0.15);
    bot.vr = lerp(bot.vr, clamp(speed + turn * 0.5, -1, 1), 0.15);
    const v = (bot.vl + bot.vr) / 2, om = (bot.vr - bot.vl) * 2.4;
    bot.a += om * dt;
    bot.x = clamp(bot.x + (Math.cos(bot.a) * v * 120 * dt) / w, 0.04, 0.96);
    bot.y = clamp(bot.y + (Math.sin(bot.a) * v * 120 * dt) / h, 0.06, 0.94);
    if (dt > 0) { trail.push([bot.x, bot.y]); if (trail.length > 180) trail.shift(); }

    // obstacles
    obstacles.forEach((o, i) => {
      ctx.strokeStyle = rgba(P.paper, 0.35); ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.arc(o.x * w, o.y * h, o.r * S, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = rgba(P.paper, 0.06); ctx.fill();
      ctx.font = `9px ${P.mono}`; ctx.fillStyle = rgba(P.paper, 0.4); ctx.fillText(`OBS_${i}`, o.x * w + o.r * S + 4, o.y * h);
    });
    // trail
    ctx.strokeStyle = rgba(P.steel, 0.5); ctx.lineWidth = 1;
    ctx.beginPath(); trail.forEach(([x, y], i) => (i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h))); ctx.stroke();

    const bx = bot.x * w, by = bot.y * h;
    // field of view (camera)
    const fov = 0.55, range = S * 0.42;
    const rel = Math.atan2(target.y * h - by, target.x * w - bx) - bot.a;
    const relN = Math.atan2(Math.sin(rel), Math.cos(rel));
    const seen = Math.abs(relN) < fov && dist < range;
    ctx.fillStyle = rgba(P.signal, seen ? 0.1 : 0.04);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.arc(bx, by, range, bot.a - fov, bot.a + fov); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.signal, 0.35); ctx.stroke();

    // robot body
    ctx.save(); ctx.translate(bx, by); ctx.rotate(bot.a);
    ctx.strokeStyle = P.paper; ctx.lineWidth = 1.4; ctx.strokeRect(-14, -11, 28, 22);
    ctx.fillStyle = P.paper; [[-10, -14], [6, -14], [-10, 11], [6, 11]].forEach(([x, y]) => ctx.fillRect(x, y, 7, 3));
    ctx.fillStyle = P.signal; ctx.fillRect(12, -3, 4, 6);
    ctx.restore();

    // target (human) + detection box
    const tx = target.x * w, ty = target.y * h;
    ctx.fillStyle = rgba(P.paper, 0.9); ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fill();
    if (seen) {
      bracket(ctx, tx - 18, ty - 24, 36, 48, 8, P.signal, 1.4);
      label(ctx, P, `person ${(0.88 + Math.sin(t * 3) * 0.04).toFixed(2)}`, tx + 20, ty - 16, P.ink, P.signal);
    }
    // telemetry
    ctx.font = `10px ${P.mono}`; ctx.fillStyle = rgba(P.paper, 0.55);
    const lines = [
      `PWM  L ${bot.vl.toFixed(2)}  R ${bot.vr.toFixed(2)}`,
      `range ${(dist / S * 3).toFixed(2)} u   ${seen ? 'TRACKING' : 'SEARCHING'}`,
      near ? 'AVOIDANCE  interrupt' : 'AVOIDANCE  clear',
    ];
    lines.forEach((l, i) => ctx.fillText(l, 16, h - 50 + i * 15));
    if (near) { ctx.fillStyle = P.signal; ctx.fillRect(8, h - 30 - 7, 3, 9); }
  };
};

/* ─── 03 DOCUWISE — SHAP-style attribution (schematic) ──────────── */
export const makeXai = () => {
  const P = palette();
  const feats = ['feat_01', 'feat_02', 'feat_03', 'feat_04', 'feat_05', 'feat_06'];
  const base = [0.18, -0.09, 0.12, 0.07, -0.05, 0.04];
  const sens = [0.16, 0.12, -0.1, 0.08, 0.1, -0.06];
  let cur = base.slice();
  return (ctx, w, h, t, ptr) => {
    ctx.clearRect(0, 0, w, h);
    const u = ptr.active ? ptr.x * 2 - 1 : Math.sin(t * 0.6) * 0.8;
    cur = cur.map((c, i) => lerp(c, base[i] + sens[i] * u, 0.08));
    const e0 = 0.42;
    const left = Math.max(84, w * 0.2), right = w - 30;
    const scale = (v) => left + v * (right - left);
    const top = 56, rowH = Math.min(34, (h - top - 70) / (feats.length + 1));
    ctx.font = `10px ${P.mono}`;
    // axis
    ctx.strokeStyle = rgba(P.paper, 0.12); ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach((v) => {
      ctx.beginPath(); ctx.moveTo(scale(v), top - 12); ctx.lineTo(scale(v), top + rowH * (feats.length + 1)); ctx.stroke();
      ctx.fillStyle = rgba(P.paper, 0.35); ctx.fillText(v.toFixed(2), scale(v) - 10, top + rowH * (feats.length + 1) + 14);
    });
    ctx.fillStyle = rgba(P.paper, 0.5); ctx.fillText('E[f(x)]', 16, top + 2);
    ctx.fillStyle = rgba(P.paper, 0.8); ctx.fillRect(scale(e0) - 0.5, top - 10, 1, 16);
    let acc = e0;
    cur.forEach((v, i) => {
      const y = top + rowH * (i + 1);
      const a = acc, b = clamp(acc + v);
      const pos = v >= 0;
      ctx.fillStyle = pos ? P.signal : P.steel;
      const x0 = scale(Math.min(a, b)), x1 = scale(Math.max(a, b));
      ctx.fillRect(x0, y - 8, Math.max(1, x1 - x0), 14);
      // arrow tip
      ctx.beginPath();
      if (pos) { ctx.moveTo(x1, y - 8); ctx.lineTo(x1 + 6, y - 1); ctx.lineTo(x1, y + 6); }
      else { ctx.moveTo(x0, y - 8); ctx.lineTo(x0 - 6, y - 1); ctx.lineTo(x0, y + 6); }
      ctx.fill();
      ctx.fillStyle = rgba(P.paper, 0.65); ctx.fillText(feats[i], 16, y + 3);
      ctx.fillStyle = rgba(P.paper, 0.5); ctx.fillText(`${pos ? '+' : '−'}${Math.abs(v).toFixed(3)}`, pos ? x1 + 10 : x0 - 52, y + 3);
      acc = b;
    });
    const fy = top + rowH * (feats.length + 1) + 34;
    ctx.fillStyle = rgba(P.paper, 0.5); ctx.fillText('f(x)', 16, fy);
    ctx.fillStyle = P.paper; ctx.fillRect(scale(acc) - 1, fy - 12, 2, 16);
    label(ctx, P, `p = ${acc.toFixed(3)}  ${acc > 0.5 ? '→ on track' : '→ roadmap: 90 days'}`, scale(acc) + 8, fy, acc > 0.5 ? P.ink : P.paper, acc > 0.5 ? P.paper : 'rgba(255,90,31,0.25)');
    ctx.fillStyle = rgba(P.paper, 0.4); ctx.fillText('SHAP · local explanation · schematic', 16, 24);
    ctx.fillText(ptr.active ? 'perturbing input ↔' : 'move across to perturb input', 16, 38);
  };
};

/* ─── 04 VANGUARD — night-vision detection. Cursor = intruder. ──── */
export const makeVision = () => {
  const P = palette();
  const R = rng(99);
  const cls = ['wildlife', 'wildlife', 'wildlife', 'vehicle'];
  const objs = cls.map((c, i) => ({ c, id: i + 1, x: (i + 0.3 + R() * 0.4) / cls.length, y: 0.4 + R() * 0.45, vx: (R() - 0.5) * 0.05, ph: R() * 6, trail: [] }));
  let alertT = -10;
  let wasIn = false;
  return (ctx, w, h, t, ptr, dt) => {
    ctx.clearRect(0, 0, w, h);
    // scanlines + horizon
    ctx.fillStyle = rgba(P.steel, 0.025);
    for (let y = (t * 30) % 4; y < h; y += 4) ctx.fillRect(0, y, w, 1);
    ctx.strokeStyle = rgba(P.paper, 0.08); ctx.beginPath(); ctx.moveTo(0, h * 0.3); ctx.lineTo(w, h * 0.3); ctx.stroke();
    // vegetation silhouettes
    ctx.fillStyle = rgba(P.paper, 0.05);
    for (let x = 0; x < w; x += 6) { const hh = 18 + Math.sin(x * 0.07) * 10 + Math.sin(x * 0.013) * 22; ctx.fillRect(x, h * 0.3 - hh * 0.3, 4, hh * 0.3); }

    objs.forEach((o) => {
      o.x += o.vx * dt; if (o.x < -0.05 || o.x > 1.05) o.vx *= -1;
      const bob = Math.sin(t * 1.3 + o.ph) * 0.01;
      const ox = o.x * w, oy = (o.y + bob) * h;
      const bw = o.c === 'vehicle' ? 70 : 42, bh = o.c === 'vehicle' ? 36 : 30;
      if (dt > 0 && Math.round(t * 20) % 3 === 0) { o.trail.push([ox, oy]); if (o.trail.length > 24) o.trail.shift(); }
      // thermal blob
      const g = ctx.createRadialGradient(ox, oy, 2, ox, oy, bw * 0.6);
      g.addColorStop(0, rgba(P.paper, 0.55)); g.addColorStop(1, rgba(P.paper, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(ox, oy, bw * 0.45, bh * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = rgba(P.steel, 0.35); ctx.beginPath(); o.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      bracket(ctx, ox - bw / 2, oy - bh / 2, bw, bh, 7, rgba(P.steel, 0.9), 1);
      label(ctx, P, `#${o.id} ${o.c} ${(0.8 + Math.sin(t * 2 + o.ph) * 0.06).toFixed(2)}`, ox - bw / 2 - 1, oy - bh / 2 - 4, rgba(P.paper, 0.75));
    });

    const inside = ptr.active && ptr.y > 0.25;
    if (inside && !wasIn && t - alertT > 4) alertT = t;
    wasIn = inside;
    if (inside) {
      const x = ptr.x * w, y = ptr.y * h;
      const pulse = 1 + Math.sin(t * 8) * 0.04;
      bracket(ctx, x - 26 * pulse, y - 40 * pulse, 52 * pulse, 80 * pulse, 10, P.signal, 1.6);
      label(ctx, P, `INTRUDER · person ${(0.93 + Math.sin(t * 5) * 0.02).toFixed(2)}`, x - 27, y - 46, P.ink, P.signal);
      ctx.strokeStyle = rgba(P.signal, 0.25);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    // HUD
    ctx.font = `10px ${P.mono}`; ctx.fillStyle = rgba(P.paper, 0.55);
    ctx.fillText(`CAM_01 · LIVE STREAM · FP16`, 16, 22);
    ctx.fillText(`objects ${objs.length + (inside ? 1 : 0)}   threat ${inside ? 'HIGH' : 'none'}`, 16, 37);
    if (t - alertT < 3.2) {
      const a = 1 - clamp((t - alertT - 2.4) / 0.8);
      ctx.fillStyle = rgba(P.signal, a);
      ctx.fillRect(w - 214, 12, 200, 34);
      ctx.fillStyle = rgba(P.ink, a);
      ctx.fillText('ALERT DISPATCHED → webhook', w - 206, 26);
      ctx.fillText('frame logged · SQLite', w - 206, 39);
    }
  };
};

export const VIZ = { route: makeRoute, robot: makeRobot, xai: makeXai, vision: makeVision };
