import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ContactButton from "@/components/ContactButton";

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 120, damping: 22, mass: 0.4 };

// Phone-only project card. Scroll-linked: the card rises and un-tilts as it
// enters, the main image unmasks from the centre and drifts (parallax) while
// it passes through the viewport. All motion is skipped for reduced-motion.
export default function MobileProjectCard({ project }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  // 0 → 1 while the card's top travels from the bottom of the screen to ~55%.
  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start 0.55"],
  });
  // 0 → 1 across the card's full trip through the viewport (for parallax).
  const { scrollYProgress: pass } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const e = useSpring(enter, SPRING);
  const scale = useTransform(e, [0, 1], [0.9, 1]);
  const y = useTransform(e, [0, 1], [70, 0]);
  const rotateX = useTransform(e, [0, 1], [10, 0]);
  const opacity = useTransform(e, [0, 0.6], [0.25, 1]);
  const clip = useTransform(
    e,
    [0.15, 1],
    ["inset(14% 10% 14% 10% round 28px)", "inset(0% 0% 0% 0% round 16px)"]
  );
  const imgY = useTransform(pass, [0, 1], ["-9%", "9%"]);

  const cardStyle = reduced
    ? undefined
    : { scale, y, rotateX, opacity, transformPerspective: 1000, transformOrigin: "50% 0%" };

  if (project.cta) {
    return (
      <motion.article
        ref={ref}
        style={cardStyle}
        className="relative rounded-[28px] border border-[#D7E2EA]/25 bg-[#0C0C0C] overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(182,0,168,0.35) 0%, rgba(118,33,176,0.12) 45%, transparent 75%)",
          }}
        />
        <div className="relative flex flex-col items-center text-center gap-5 px-6 py-14">
          <span className="hero-heading font-black leading-none text-6xl">{project.number}</span>
          <h3 className="hero-heading font-black uppercase leading-none tracking-tight text-4xl">
            {project.title}
          </h3>
          <p className="text-[#D7E2EA]/75 font-light leading-relaxed text-base max-w-xs">
            {project.subline}
          </p>
          <div className="mt-2">
            <ContactButton href={project.buttonHref}>{project.buttonLabel}</ContactButton>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={ref}
      style={cardStyle}
      className="relative rounded-[28px] border border-[#D7E2EA]/25 bg-gradient-to-b from-white/[0.04] to-transparent p-3.5 flex flex-col gap-3 overflow-hidden"
    >
      {/* Main image: centre-out reveal + parallax drift */}
      <Link
        to={`/work/${project.slug}`}
        aria-label={`Open ${project.name} case study`}
        className="block"
      >
        <motion.div
          className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl"
          style={reduced ? undefined : { clipPath: clip }}
        >
          <motion.img
            src={project.col2}
            alt={`${project.name} main preview`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover scale-[1.2]"
            style={reduced ? undefined : { y: imgY }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/85 via-[#0C0C0C]/10 to-transparent" />
          <span className="absolute top-3 left-3 rounded-full bg-[#0C0C0C]/60 backdrop-blur px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#D7E2EA]/90">
            {project.category}
          </span>
          <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
            <span className="hero-heading font-black leading-none text-5xl shrink-0">
              {project.number}
            </span>
            <span className="text-[#D7E2EA] font-medium uppercase leading-tight text-base pb-1">
              {project.name}
            </span>
          </div>
        </motion.div>
      </Link>

      {/* Thumbnails slide in from opposite sides */}
      <div className="grid grid-cols-2 gap-3">
        {project.col1.map((src, i) => (
          <motion.div
            key={src}
            className="overflow-hidden rounded-xl aspect-[16/10]"
            initial={reduced ? false : { opacity: 0, x: i === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 * i }}
          >
            <img
              src={src}
              alt={`${project.name} preview ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-1 pt-1">
        <span className="text-[#D7E2EA]/55 font-light uppercase tracking-widest text-[0.7rem] truncate">
          {project.client} · {project.year}
        </span>
        <motion.div whileTap={{ scale: 0.94 }} className="shrink-0">
          <Link
            to={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-4 py-2.5 text-xs active:bg-[#D7E2EA] active:text-[#0C0C0C] transition-colors"
          >
            Case Study
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
