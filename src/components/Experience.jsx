import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import CountUp from "@/components/CountUp";
import { EXPERIENCES } from "@/content/portfolio";

/*
 * Stats-led experience. Each role opens with its impact numbers in huge
 * gradient type that count up on scroll, then the role details, highlights
 * and skills. Same structure on phone, just tighter.
 */

const EASE = [0.22, 1, 0.36, 1];
const BRAND = "linear-gradient(90deg, #B600A8, #7621B0, #BE4C00)";

function Role({ exp, index, reduced }) {
  const fade = (delay = 0, y = 24) => ({
    initial: reduced ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <article className="relative py-14 sm:py-20">
      {/* divider draws in from the left */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-[#D7E2EA]/15 origin-left"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE }}
      />

      {/* Role heading */}
      <motion.div {...fade(0)} className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-[#D7E2EA]/40">{String(index + 1).padStart(2, "0")}</span>
            {exp.type && (
              <span className="text-[0.65rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA]/75">
                {exp.type}
              </span>
            )}
          </div>
          <h3
            className="text-[#D7E2EA] font-semibold uppercase leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)" }}
          >
            {exp.role}
          </h3>
          <p className="mt-2 text-base sm:text-lg text-[#D7E2EA]/70">
            {exp.company}
            {exp.location && (
              <span className="inline-flex items-center gap-1 text-sm text-[#D7E2EA]/45 ml-3">
                <MapPin className="w-3.5 h-3.5" />
                {exp.location}
              </span>
            )}
          </p>
        </div>
        <span className="font-mono text-sm text-[#D7E2EA]/60 md:pb-2 shrink-0">{exp.period}</span>
      </motion.div>

      {/* Impact numbers */}
      {exp.stats?.length > 0 && (
        <div className="grid grid-cols-3 mt-10 sm:mt-14 border-y border-[#D7E2EA]/10">
          {exp.stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fade(0.1 + i * 0.12, 40)}
              className={`py-6 sm:py-10 ${i > 0 ? "pl-3 sm:pl-8 border-l border-[#D7E2EA]/10" : "pr-3 sm:pr-8"} ${
                i === 1 ? "pr-3 sm:pr-8" : ""
              }`}
            >
              <CountUp
                value={s.value}
                className="hero-heading block font-black leading-none tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 8vw, 6.5rem)" }}
              />
              <span className="block mt-2 sm:mt-3 text-[0.62rem] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/55 leading-snug">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Details */}
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 mt-10 sm:mt-12">
        <motion.p
          {...fade(0.1)}
          className="md:col-span-4 text-[#D7E2EA]/80 text-base sm:text-lg leading-relaxed font-light"
        >
          {exp.description}
        </motion.p>

        <div className="md:col-span-8">
          {exp.highlights?.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {exp.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  {...fade(0.08 * i, 16)}
                  className="flex gap-3 text-sm text-[#D7E2EA]/75 leading-relaxed font-light"
                >
                  <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-[#B600A8]" />
                  <span>{h}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {exp.skills?.length > 0 && (
            <motion.div {...fade(0.2, 12)} className="flex flex-wrap gap-2 mt-8">
              {exp.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-xs font-mono rounded-full bg-white/[0.04] text-[#D7E2EA]/70 border border-[#D7E2EA]/10"
                >
                  {s}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Experience() {
  const reduced = useReducedMotion();
  if (!EXPERIENCES?.length) return null;

  return (
    <section
      id="experience"
      className="relative z-10 bg-[#0C0C0C] py-24 sm:py-32 border-t border-[#D7E2EA]/10 overflow-hidden"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #7621B0 0%, transparent 65%)" }}
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        <FadeIn y={30}>
          <div className="flex items-end justify-between gap-6 mb-6 sm:mb-10">
            <div className="flex flex-col gap-2">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
                Career Trajectory
              </span>
              <h2
                className="hero-heading font-black uppercase tracking-tight leading-none"
                style={{ fontSize: "clamp(2.4rem, 7vw, 5.2rem)" }}
              >
                Work Experience
              </h2>
            </div>
            <div className="hidden sm:block h-[3px] w-24 rounded-full mb-4" style={{ background: BRAND }} />
          </div>
        </FadeIn>

        {EXPERIENCES.map((exp, i) => (
          <Role key={i} exp={exp} index={i} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}
