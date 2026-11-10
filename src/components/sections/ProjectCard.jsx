import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ContactButton from "@/components/ContactButton";

// Visible "belt" (px) of each card sitting under the active one.
export const STACK_GAP = 70;
const EASE = [0.22, 1, 0.36, 1];

function Belt({ number, name, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center justify-between w-full gap-3 pt-4 mt-1 border-t border-[#D7E2EA]/20 text-left disabled:cursor-default"
      aria-label={`Show ${name}`}
    >
      <span className="flex items-baseline gap-3 min-w-0">
        <span
          className="hero-heading font-black leading-none shrink-0"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
        >
          {number}
        </span>
        <span className="text-[#D7E2EA]/70 font-medium uppercase tracking-wider text-xs sm:text-sm truncate">
          {name}
        </span>
      </span>
      {!disabled && (
        <span className="flex items-center gap-2 text-[#D7E2EA]/45 text-[0.65rem] sm:text-xs uppercase tracking-widest shrink-0 group-hover:text-[#D7E2EA] transition-colors duration-300">
          {label}
          <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </span>
      )}
    </button>
  );
}

export default function ProjectCard({
  project,
  index,
  activeIndex,
  totalCards,
  onSelect,
  reducedMotion,
}) {
  const isActive = index === activeIndex;
  const isBelow = index < activeIndex; // already seen — peeks out as a belt
  const depth = activeIndex - index;

  const animate = isActive
    ? { y: 0, x: "0vw", rotate: 0, opacity: 1 }
    : isBelow
    ? { y: depth * STACK_GAP, x: "0vw", rotate: 0, opacity: 1 }
    : { y: "85vh", x: "6vw", rotate: 5, opacity: 0 };

  return (
    <motion.div
      className={`${index === 0 ? "relative" : "absolute inset-x-0 top-0"} rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6`}
      style={{
        zIndex: isActive ? totalCards + 1 : index + 1,
        pointerEvents: index > activeIndex ? "none" : "auto",
      }}
      animate={animate}
      initial={false}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: EASE }}
    >
      {project.cta ? (
        <>
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8 py-10 sm:py-14 md:py-16 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(182,0,168,0.35) 0%, rgba(118,33,176,0.12) 40%, transparent 70%)",
              }}
            />
            <span
              className="hero-heading font-black leading-none relative"
              style={{ fontSize: "clamp(3.5rem, 12vw, 160px)" }}
            >
              {project.number}
            </span>
            <h3
              className="hero-heading font-black uppercase leading-none tracking-tight relative"
              style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)" }}
            >
              {project.title}
            </h3>
            <p
              className="text-[#D7E2EA] font-light leading-relaxed max-w-xl relative"
              style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.3rem)", opacity: 0.75 }}
            >
              {project.subline}
            </p>
            <div className="relative mt-2">
              <ContactButton href={project.buttonHref}>{project.buttonLabel}</ContactButton>
            </div>
          </div>
          <Belt
            number={project.number}
            name={project.title}
            label="Show"
            onClick={() => onSelect(index)}
            disabled={isActive}
          />
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
              <span
                className="hero-heading font-black leading-none"
                style={{ fontSize: "clamp(2.5rem, 8vw, 110px)" }}
              >
                {project.number}
              </span>
              <div className="flex flex-col">
                <span className="text-[#D7E2EA] font-light uppercase tracking-widest text-xs sm:text-sm opacity-60">
                  {project.category} · {project.client} · {project.year}
                </span>
                <span
                  className="text-[#D7E2EA] font-medium uppercase"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {project.name}
                </span>
              </div>
            </div>
            <Link
              to={`/work/${project.slug}`}
              className="inline-block text-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors duration-200 hover:bg-[#D7E2EA]/10"
            >
              View Case Study
            </Link>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <div className="w-[40%] flex flex-col gap-3 sm:gap-4">
              <img
                src={project.col1[0]}
                alt={`${project.name} preview 1`}
                loading="lazy"
                className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(110px, 13vw, 190px)" }}
              />
              <img
                src={project.col1[1]}
                alt={`${project.name} preview 2`}
                loading="lazy"
                className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(130px, 17vw, 260px)" }}
              />
            </div>
            <div className="w-[60%]">
              <img
                src={project.col2}
                alt={`${project.name} main preview`}
                loading="lazy"
                className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
              />
            </div>
          </div>

          <Belt
            number={project.number}
            name={project.name}
            label="Show"
            onClick={() => onSelect(index)}
            disabled={isActive}
          />
        </>
      )}
    </motion.div>
  );
}