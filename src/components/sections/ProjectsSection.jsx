import React, { useRef, useState, useEffect, useCallback } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard, { STACK_GAP } from "@/components/sections/ProjectCard";
import DeckDots from "@/components/sections/DeckDots";
import { PROJECTS, WORK_CTA } from "@/content/portfolio";

const CARDS = [...PROJECTS, WORK_CTA];

export default function ProjectsSection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Framer Motion's native scroll tracker tied directly to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    const count = CARDS.length;
    // Map scroll progress cleanly to card indices [0, 1, 2, 3, 4]
    const nextIndex = Math.min(count - 1, Math.floor(latest * count));
    setActiveIndex(nextIndex);
  });

  const jumpTo = useCallback(
    (i) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = (i + 0.1) / CARDS.length;
      const targetTop = rect.top + window.scrollY + progress * scrollable;
      window.scrollTo({ top: targetTop, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion]
  );

  // Mobile View
  if (isMobile) {
    return (
      <section
        id="work"
        className="relative z-10 bg-[#0C0C0C] px-5 sm:px-8 py-20 border-t border-[#D7E2EA]/10"
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn y={30}>
            <div className="flex flex-col gap-2 mb-12">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
                Projects
              </span>
              <h2
                className="hero-heading font-black uppercase text-[#D7E2EA] tracking-tight leading-none"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)" }}
              >
                My Work
              </h2>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-8">
            {CARDS.map((project) => (
              <FadeIn key={project.slug || "work-cta"} y={30} duration={0.6}>
                <ProjectCard project={project} flow />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop View
  return (
    <section
      id="work"
      ref={containerRef}
      className="relative z-10 bg-[#0C0C0C] border-t border-[#D7E2EA]/10"
      style={{ height: `${CARDS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-8 px-6 sm:px-12 md:px-16 lg:px-20 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full flex flex-col h-full justify-between relative">
          {/* Section Header */}
          <div className="pt-2 pb-4">
            <div className="flex items-end justify-between border-b border-[#D7E2EA]/10 pb-4">
              <div>
                <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs font-mono">
                  Projects
                </span>
                <h2
                  className="hero-heading font-black uppercase text-[#D7E2EA] tracking-tight leading-none mt-1"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  My Work
                </h2>
              </div>
              <span className="text-xs font-mono text-[#D7E2EA]/40">
                0{activeIndex + 1} / 0{CARDS.length}
              </span>
            </div>
          </div>

          {/* Cards Deck Stack */}
          <div
            className="relative w-full pr-12 my-auto"
            style={{ paddingBottom: (CARDS.length - 1) * STACK_GAP }}
          >
            {CARDS.map((project, index) => (
              <ProjectCard
                key={project.slug || "work-cta"}
                project={project}
                index={index}
                activeIndex={activeIndex}
                totalCards={CARDS.length}
                onSelect={jumpTo}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
            <DeckDots
              total={CARDS.length}
              activeIndex={activeIndex}
              onSelect={jumpTo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}