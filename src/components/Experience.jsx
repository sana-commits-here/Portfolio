import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowDownRight, Calendar, ChevronDown, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { EXPERIENCES } from "@/content/portfolio";

const EASE = [0.22, 1, 0.36, 1];
const BRAND = "linear-gradient(90deg, #B600A8, #7621B0, #BE4C00)";
const BRAND_V = "linear-gradient(180deg, #B600A8, #7621B0 60%, #BE4C00)";
const pad = (n) => String(n + 1).padStart(2, "0");
// "Sep 2025 – Present" → "2025"
const startYear = (period = "") => (period.match(/\d{4}/) || [""])[0];

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function TypePill({ children }) {
  return (
    <span className="text-[0.65rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA]/80 bg-white/[0.03]">
      {children}
    </span>
  );
}

function Meta({ exp }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[#D7E2EA]/55">
      {exp.period && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {exp.period}
        </span>
      )}
      {exp.location && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {exp.location}
        </span>
      )}
    </div>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};
const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

function Highlights({ items, reduced }) {
  return (
    <motion.ul
      className="space-y-3"
      variants={listVariants}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={itemVariants}
          className="flex items-start gap-3 text-sm text-[#D7E2EA]/75 leading-relaxed font-light"
        >
          <ArrowDownRight className="w-4 h-4 shrink-0 mt-0.5 text-[#D7E2EA]/40 -rotate-45" />
          <span>{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Skills({ skills, reduced, scroll = false }) {
  return (
    <motion.div
      className={
        scroll
          ? "flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1"
          : "flex flex-wrap gap-2"
      }
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {skills.map((s) => (
        <motion.span
          key={s}
          variants={chipVariants}
          className="shrink-0 px-3 py-1 text-xs font-mono rounded-full bg-white/[0.04] text-[#D7E2EA]/75 border border-[#D7E2EA]/10"
        >
          {s}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: sticky index on the left, spotlight cards on the right     */
/* ------------------------------------------------------------------ */

function DesktopCard({ exp, index, active, onActive, reduced }) {
  const ref = useRef(null);
  // "Active" when the card crosses the middle band of the viewport.
  const inMiddle = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inMiddle) onActive(index);
  }, [inMiddle, index, onActive]);

  // Cursor-following spotlight via CSS variables (no re-renders).
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      ref={ref}
      id={`exp-${index}`}
      onMouseMove={onMove}
      animate={reduced ? undefined : { opacity: active ? 1 : 0.35, scale: active ? 1 : 0.97 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group relative scroll-mt-28 rounded-[36px] border border-[#D7E2EA]/15 bg-white/[0.02] p-10 overflow-hidden"
    >
      {/* spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(182,0,168,0.14), transparent 60%)",
        }}
      />
      {/* gradient top edge on the active card */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-10 right-10 h-px origin-left"
        style={{ background: BRAND }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      {/* oversized index number */}
      <span
        aria-hidden="true"
        className="hero-heading absolute -top-4 right-6 font-black leading-none opacity-[0.08] select-none"
        style={{ fontSize: "9rem" }}
      >
        {pad(index)}
      </span>

      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          {exp.type && <TypePill>{exp.type}</TypePill>}
          <Meta exp={exp} />
        </div>
        <h3 className="text-3xl font-semibold text-[#D7E2EA] leading-tight">{exp.role}</h3>
        <p className="text-lg text-[#D7E2EA]/70 mt-1">{exp.company}</p>

        {exp.description && (
          <p className="text-[#D7E2EA]/80 text-base leading-relaxed font-light mt-6 max-w-2xl">
            {exp.description}
          </p>
        )}

        <div className="h-px bg-[#D7E2EA]/10 my-7" />

        {exp.highlights?.length > 0 && <Highlights items={exp.highlights} reduced={reduced} />}

        {exp.skills?.length > 0 && (
          <div className="mt-8">
            <Skills skills={exp.skills} reduced={reduced} />
          </div>
        )}
      </div>
    </motion.article>
  );
}

function DesktopExperience({ reduced }) {
  const [active, setActive] = useState(0);
  const onActive = React.useCallback((i) => setActive(i), []);
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.6", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  const jump = (i) =>
    document.getElementById(`exp-${i}`)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });

  return (
    <div className="hidden lg:grid grid-cols-12 gap-14">
      {/* Left: sticky index */}
      <div className="col-span-5">
        <div className="sticky top-28">
          <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-sm font-mono">
            Career Trajectory
          </span>
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-[0.9] mt-2"
            style={{ fontSize: "clamp(3rem, 5.5vw, 5.2rem)" }}
          >
            Work
            <br />
            Experience
          </h2>

          {/* Big year that swaps with the active role */}
          <div className="relative h-[5.5rem] overflow-hidden mt-8" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={active}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-0 font-black leading-none text-transparent"
                style={{ fontSize: "5.5rem", WebkitTextStroke: "1.5px rgba(215,226,234,0.35)" }}
              >
                {startYear(EXPERIENCES[active]?.period)}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Role index with progress rail */}
          <div className="relative mt-8 pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#D7E2EA]/10" />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[2px] -translate-x-[0.5px] origin-top"
              style={{ scaleY: reduced ? 1 : progress, background: BRAND_V }}
            />
            <ul className="space-y-1">
              {EXPERIENCES.map((exp, i) => {
                const on = i === active;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={on}
                      className="w-full text-left py-3 group/idx"
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`font-mono text-xs transition-colors duration-300 ${
                            on ? "text-[#D7E2EA]" : "text-[#D7E2EA]/35"
                          }`}
                        >
                          {pad(i)}
                        </span>
                        <div className="min-w-0">
                          <div
                            className={`text-lg font-medium leading-snug transition-all duration-300 ${
                              on
                                ? "text-[#D7E2EA] translate-x-1"
                                : "text-[#D7E2EA]/40 group-hover/idx:text-[#D7E2EA]/70"
                            }`}
                          >
                            {exp.role}
                          </div>
                          <div
                            className={`text-sm transition-colors duration-300 ${
                              on ? "text-[#D7E2EA]/70" : "text-[#D7E2EA]/30"
                            }`}
                          >
                            {exp.company} · {exp.period}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Right: cards */}
      <div ref={listRef} className="col-span-7 flex flex-col gap-10 pt-2 pb-[18vh]">
        {EXPERIENCES.map((exp, i) => (
          <DesktopCard
            key={i}
            exp={exp}
            index={i}
            active={i === active}
            onActive={onActive}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: scroll-drawn timeline with expandable cards                 */
/* ------------------------------------------------------------------ */

const PREVIEW = 2; // highlights shown before "Show more"

function MobileCard({ exp, index, reduced }) {
  const [open, setOpen] = useState(false);
  const extra = (exp.highlights?.length || 0) - PREVIEW;

  return (
    <div className="relative pl-9">
      {/* timeline node */}
      <motion.span
        aria-hidden="true"
        // left-0 + w-4 centres the dot on the 7–8px line without a CSS
        // translate (framer's inline transform would override it).
        className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-[#0C0C0C]"
        initial={reduced ? false : { scale: 0.4, borderColor: "rgba(215,226,234,0.3)" }}
        whileInView={{ scale: 1, borderColor: "#B600A8", boxShadow: "0 0 0 6px rgba(182,0,168,0.15)" }}
        viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
        transition={{ duration: 0.45, ease: EASE }}
      />

      {/* period chip sits on the line, above the card */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex items-center gap-2 mb-3"
      >
        <span className="font-mono text-xs text-[#D7E2EA]/40">{pad(index)}</span>
        <span className="font-mono text-xs text-[#D7E2EA]/80">{exp.period}</span>
      </motion.div>

      <motion.article
        initial={reduced ? false : { opacity: 0, x: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="relative rounded-[24px] border border-[#D7E2EA]/15 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 overflow-hidden"
      >
        <div className="absolute top-0 left-5 right-5 h-px" style={{ background: BRAND }} />
        <span
          aria-hidden="true"
          className="hero-heading absolute -top-2 right-3 font-black leading-none opacity-[0.08] select-none text-7xl"
        >
          {pad(index)}
        </span>

        <div className="relative">
          {exp.type && <TypePill>{exp.type}</TypePill>}
          <h3 className="text-xl font-semibold text-[#D7E2EA] leading-tight mt-3">{exp.role}</h3>
          <p className="text-base text-[#D7E2EA]/70 mt-0.5">{exp.company}</p>
          {exp.location && (
            <p className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D7E2EA]/50 mt-2">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </p>
          )}

          {exp.description && (
            <p className="text-[#D7E2EA]/80 text-sm leading-relaxed font-light mt-4">
              {exp.description}
            </p>
          )}

          {exp.highlights?.length > 0 && (
            <div className="mt-5">
              <Highlights items={exp.highlights.slice(0, PREVIEW)} reduced={reduced} />
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="more"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      <Highlights items={exp.highlights.slice(PREVIEW)} reduced={reduced} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {extra > 0 && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#D7E2EA]/70 active:text-[#D7E2EA]"
                >
                  {open ? "Show less" : `Show ${extra} more`}
                  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              )}
            </div>
          )}

          {exp.skills?.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#D7E2EA]/10">
              <Skills skills={exp.skills} reduced={reduced} scroll />
            </div>
          )}
        </div>
      </motion.article>
    </div>
  );
}

function MobileExperience({ reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.5"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  return (
    <div className="lg:hidden">
      <FadeIn y={30}>
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
            Career Trajectory
          </span>
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: "clamp(2.4rem, 9vw, 4.8rem)" }}
          >
            Work Experience
          </h2>
        </div>
      </FadeIn>

      <div ref={ref} className="relative space-y-12">
        <div aria-hidden="true" className="absolute left-[7px] top-2 bottom-0 w-px bg-[#D7E2EA]/10" />
        <motion.div
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-0 w-[2px] -translate-x-[0.5px] origin-top"
          style={{ scaleY: reduced ? 1 : line, background: BRAND_V }}
        />
        {EXPERIENCES.map((exp, i) => (
          <MobileCard key={i} exp={exp} index={i} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Experience() {
  const reduced = useReducedMotion();
  if (!EXPERIENCES?.length) return null;

  return (
    <section
      id="experience"
      className="relative z-10 bg-[#0C0C0C] py-24 sm:py-32 border-t border-[#D7E2EA]/10"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        <DesktopExperience reduced={reduced} />
        <MobileExperience reduced={reduced} />
      </div>
    </section>
  );
}
