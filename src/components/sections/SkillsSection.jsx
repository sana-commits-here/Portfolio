import React from "react";
import FadeIn from "@/components/FadeIn";
import { SKILLS } from "@/content/portfolio";

export default function SkillsSection() {
  const doubled = [...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS];

  return (
    <section id="skills" className="bg-[#0C0C0C] pt-20 sm:pt-24 md:pt-28 pb-6 overflow-hidden">
      <FadeIn y={30}>
        <p className="text-[#D7E2EA] font-medium uppercase tracking-[0.3em] text-center text-xs sm:text-sm md:text-base opacity-60 mb-8 sm:mb-10">
          Tools I work with
        </p>
      </FadeIn>

      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-4 sm:gap-6 w-max skills-marquee"
        >
          {doubled.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-4 sm:gap-6 flex-shrink-0"
            >
              <span
                className="hero-heading font-black uppercase tracking-tight whitespace-nowrap"
                style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)", lineHeight: 1.1 }}
              >
                {skill}
              </span>
              <span
                className="rounded-full border border-[#D7E2EA]/30 flex-shrink-0"
                style={{ width: "clamp(10px, 1.2vw, 16px)", height: "clamp(10px, 1.2vw, 16px)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}