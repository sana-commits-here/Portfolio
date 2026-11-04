import React from "react";
import FadeIn from "@/components/FadeIn";
import { TESTIMONIALS } from "@/content/portfolio";

export default function TestimonialsSection() {
  return (
    <section
      className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-12 sm:mb-16 md:mb-20"
          style={{ fontSize: "clamp(2.2rem, 7vw, 90px)" }}
        >
          What Clients Say
        </h2>
      </FadeIn>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.12}>
            <div className="h-full rounded-[30px] sm:rounded-[36px] border border-[#D7E2EA]/20 p-6 sm:p-8 flex flex-col gap-6 transition-colors duration-300 hover:border-[#D7E2EA]/50">
              <span className="hero-heading font-black leading-none text-5xl sm:text-6xl">
                &ldquo;
              </span>
              <p
                className="text-[#D7E2EA] font-light leading-relaxed flex-1"
                style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}
              >
                {t.quote}
              </p>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm sm:text-base">
                  {t.name}
                </span>
                <span className="text-[#D7E2EA] font-light uppercase tracking-widest text-[0.65rem] sm:text-xs opacity-60">
                  {t.role}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}