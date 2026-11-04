import React from "react";
import FadeIn from "@/components/FadeIn";
import ContactButton from "@/components/ContactButton";
import { SOCIALS } from "@/content/portfolio";

export default function FinalCTASection() {
  return (
    <section
      id="contact"
      className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 md:pt-40 pb-10 sm:pb-12 flex flex-col items-center text-center"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 500px" }}
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 9vw, 140px)" }}
        >
          Let&apos;s Build
          <br />
          Something Great
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={30}>
        <p
          className="text-[#D7E2EA] font-light uppercase tracking-wide mt-8 sm:mt-10 max-w-[420px]"
          style={{ fontSize: "clamp(0.85rem, 1.4vw, 1.15rem)" }}
        >
          Have a project, idea or opportunity in mind? Let&apos;s talk.
        </p>
      </FadeIn>

      <FadeIn delay={0.3} y={20}>
        <div className="mt-10 sm:mt-12">
          <ContactButton href={SOCIALS[0].href} />
        </div>
      </FadeIn>

      <FadeIn delay={0.4} y={20}>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 sm:mt-20 md:mt-24">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-[#D7E2EA] font-medium uppercase tracking-widest text-xs sm:text-sm hover:opacity-60 transition-opacity duration-200"
            >
              {social.label}
            </a>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}