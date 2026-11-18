import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Deterministic PRNG so generated layouts are stable between renders.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mediaStore(query) {
  return {
    subscribe(cb) {
      if (typeof window === 'undefined') return () => {};
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    get() {
      return typeof window !== 'undefined' && window.matchMedia(query).matches;
    },
  };
}

const reduced = mediaStore('(prefers-reduced-motion: reduce)');
const fine = mediaStore('(hover: hover) and (pointer: fine)');
const wide = mediaStore('(min-width: 900px)');

export const useReduced = () => useSyncExternalStore(reduced.subscribe, reduced.get, () => false);
export const useFinePointer = () => useSyncExternalStore(fine.subscribe, fine.get, () => false);
export const useWide = () => useSyncExternalStore(wide.subscribe, wide.get, () => true);

// True while the element is within (or near) the viewport.
export function useInView(ref, rootMargin = '0px', once = false) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

// Which layer (section) currently owns the middle of the viewport.
export function useActiveLayer(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -54% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

// Page scroll progress 0–1, written straight onto the elements that show it
// ([data-progress="x" | "y"]) as a transform. Nothing re-renders, no CSS
// variable on <html> (which would restyle the whole document every frame),
// and the page height is cached instead of read on every scroll.
export function useScrollProgress() {
  useEffect(() => {
    let raf = 0, max = 1, last = -1;
    let els = [];
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      els = [...document.querySelectorAll('[data-progress]')];
      onScroll();
    };
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      for (const el of els) el.style.transform = el.dataset.progress === 'y' ? `scaleY(${p})` : `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}

// Toggles .is-live on [data-live] regions while they are near the viewport, so
// their infinite CSS animations (pulses, flowing dashes, scan lines) pause
// when nobody can see them.
export function useLiveRegions() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)),
      { rootMargin: '100px' }
    );
    document.querySelectorAll('[data-live]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// In-page jump that stays exact with content-visibility: sections are briefly
// rendered for real (so every height is known) while the scroll runs, then
// handed back to the browser, which remembers their measured size.
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const root = document.documentElement;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('cv-off');
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', finish);
    if (Math.abs(el.getBoundingClientRect().top) > 4) el.scrollIntoView({ behavior: 'auto' });
    root.classList.remove('cv-off');
  };
  window.addEventListener('scrollend', finish);
  setTimeout(finish, smooth ? 1600 : 100); // fallback where scrollend is unsupported
  history.replaceState(null, '', id === 'top' ? '#' : `#${id}`);
  // move focus for keyboard / screen reader users without re-scrolling
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

// Route every same-page #link (evidence links, research refs…) through scrollToId.
export function useHashLinks() {
  useEffect(() => {
    const click = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
}

export function useClock(timeZone, every = 1000) {
  const fmt = useRef(
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  );
  const [now, setNow] = useState(() => fmt.current.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.current.format(new Date())), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}

// Read design tokens once so canvas drawings match the CSS palette.
export function token(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function mailto({ subject = '', body = '' } = {}, email) {
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (body) q.set('body', body);
  const qs = q.toString().replace(/\+/g, '%20');
  return `mailto:${email}${qs ? `?${qs}` : ''}`;
}
