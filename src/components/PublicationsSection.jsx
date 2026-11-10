import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { PUBLICATIONS } from "@/content/portfolio";

/*
 * Dark editorial list. Each row: number · title + venue · year · toggle.
 *  - Rules draw in and titles slide up out of a mask as rows enter.
 *  - Desktop: hovering a row opens it (with a short intent delay so rows
 *    don't flicker while the pointer travels), others dim, a soft glow
 *    follows the cursor.
 *  - Phone: tap a row to open/close it.
 */

const EASE = [0.22, 1, 0.36, 1];
const BRAND = "linear-gradient(90deg, #B600A8, #7621B0, #BE4C00)";
const pad = (n) => String(n + 1).padStart(2, "0");
const hasLink = (p) => p.link && p.link !== "https://doi.org/";

function Row({ pub, index, open, dimmed, onHover, onToggle, reduced }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => onHover(index)}
      animate={{ opacity: dimmed ? 0.35 : 1 }}
      transition={{ duration: 0.35 }}
      className="group relative"
    >
      {/* rule that draws in from the left; turns brand-coloured when open */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-[#D7E2EA]/15 origin-left"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: EASE, delay: index * 0.12 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ background: BRAND }}
        animate={{ scaleX: open ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      {/* cursor glow (desktop hover only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(182,0,168,0.10), transparent 60%)",
        }}
      />

      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={open}
        aria-controls={`pub-panel-${index}`}
        className="relative w-full text-left grid grid-cols-[auto_1fr_auto] md:grid-cols-[4rem_1fr_6rem_auto] items-start gap-x-4 md:gap-x-6 py-6 md:py-9"
      >
        <span className="font-mono text-xs md:text-sm text-[#D7E2EA]/40 pt-1.5 md:pt-3">{pad(index)}</span>

        <span className="min-w-0">
          {/* title slides up out of a mask */}
          <span className="block overflow-hidden">
            <motion.span
              className={`block font-semibold leading-[1.1] tracking-tight transition-colors duration-300 ${
                open ? "text-[#D7E2EA]" : "text-[#D7E2EA]/85"
              }`}
              style={{ fontSize: "clamp(1.25rem, 3vw, 2.4rem)" }}
              initial={reduced ? false : { y: "105%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 + index * 0.12 }}
            >
              {pub.title}
            </motion.span>
          </span>
          <motion.span
            className="block mt-2 text-xs md:text-sm text-[#D7E2EA]/50 line-clamp-2 md:line-clamp-1"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 + index * 0.12 }}
          >
            <span className="md:hidden">{pub.year} · </span>
            {pub.conference}
          </motion.span>
        </span>

        <span className="hidden md:block font-mono text-sm text-[#D7E2EA]/60 pt-3 text-right">{pub.year}</span>

        <motion.span
          className={`mt-0.5 md:mt-1.5 w-9 h-9 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-colors duration-300 ${
            open
              ? "border-transparent text-white"
              : "border-[#D7E2EA]/25 text-[#D7E2EA]/70 md:group-hover:border-[#D7E2EA]/60"
          }`}
          style={open ? { background: BRAND } : undefined}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`pub-panel-${index}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
            className="relative overflow-hidden"
          >
            <motion.div
              initial={reduced ? false : { y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
              className="pb-8 md:pb-10 md:grid md:grid-cols-[4rem_1fr_6rem_auto] md:gap-x-6"
            >
              <span className="hidden md:block" />
              <div className="md:pr-8">
                <p className="text-[#D7E2EA]/75 text-sm md:text-base leading-relaxed font-light max-w-3xl">
                  {pub.abstract}
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {pub.topics.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EASE, delay: 0.15 + i * 0.04 }}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-white/[0.04] text-[#D7E2EA]/70 border border-[#D7E2EA]/10"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7 text-xs">
                  <span className="uppercase tracking-widest text-[#D7E2EA]/45">
                    {pub.badge} · <span className="text-[#D7E2EA]/75">{pub.role}</span>
                  </span>
                  {hasLink(pub) ? (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 uppercase tracking-widest text-[#D7E2EA] border-b border-[#D7E2EA]/40 pb-0.5 hover:border-[#D7E2EA] transition-colors"
                    >
                      Read publication
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="uppercase tracking-widest text-[#D7E2EA]/35">Link coming soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function PublicationsSection() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(0);
  const [hovering, setHovering] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!PUBLICATIONS?.length) return null;

  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Hover intent: open after a short pause so passing over rows doesn't flicker.
  const onHover = (i) => {
    if (!canHover()) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), 160);
  };
  const onToggle = (i) => {
    clearTimeout(timer.current);
    setOpen((cur) => (cur === i ? null : i));
  };

  return (
    <section
      id="publications"
      className="relative z-10 bg-[#0C0C0C] py-20 sm:py-28 border-t border-[#D7E2EA]/10"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        <FadeIn y={30}>
          <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
            <div className="flex flex-col gap-2">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
                Research & Academic Contributions
              </span>
              <h2
                className="hero-heading font-black uppercase tracking-tight leading-none"
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)" }}
              >
                Publications
              </h2>
            </div>
            <span className="hidden sm:block font-mono text-xs text-[#D7E2EA]/40 pb-2">
              {String(PUBLICATIONS.length).padStart(2, "0")} papers
            </span>
          </div>
        </FadeIn>

        <ul
          onMouseEnter={() => canHover() && setHovering(true)}
          onMouseLeave={() => {
            clearTimeout(timer.current);
            setHovering(false);
          }}
          className="relative border-b border-[#D7E2EA]/15"
        >
          {PUBLICATIONS.map((pub, i) => (
            <Row
              key={i}
              pub={pub}
              index={i}
              open={open === i}
              dimmed={hovering && open !== null && open !== i}
              onHover={onHover}
              onToggle={onToggle}
              reduced={reduced}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
