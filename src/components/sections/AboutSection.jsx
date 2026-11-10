import React from "react";
import FadeIn from "@/components/FadeIn";
import AnimatedText from "@/components/AnimatedText";
import ContactButton from "@/components/ContactButton";
import { PROFILE, METRICS } from "@/content/portfolio";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 900px" }}
    >
      {/* Soft brand-colour glows (replaces template clip-art) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -left-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #B600A8 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #7621B0 0%, transparent 65%)" }}
      />

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-12 sm:gap-14 md:gap-16">
          <AnimatedText
            text={PROFILE.aboutText}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
          />

          <FadeIn y={30}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 sm:gap-x-14 md:gap-x-20 gap-y-8 text-center">
              {METRICS.map((metric) => (
                <div key={metric.label} className="flex flex-col items-center gap-1">
                  <span
                    className="hero-heading font-black leading-none"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
                  >
                    {metric.value}
                  </span>
                  <span className="text-[#D7E2EA] font-light uppercase tracking-widest text-[0.65rem] sm:text-xs opacity-60">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn y={20}>
            <ContactButton href="#contact" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}