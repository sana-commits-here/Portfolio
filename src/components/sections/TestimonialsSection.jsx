import React, { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/FadeIn";
import { TESTIMONIALS } from "@/content/portfolio";

function Card({ t }) {
  return (
    <div className="h-full rounded-[30px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 flex flex-col gap-6 transition-colors duration-300 hover:border-[#D7E2EA]/50">
      <span className="hero-heading font-black leading-none text-5xl sm:text-6xl">&ldquo;</span>
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
  );
}

export default function TestimonialsSection() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  // Track which slide is centred in the phone carousel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = [...track.children];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(slides.indexOf(e.target));
        });
      },
      { root: track, threshold: 0.6 }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    // Scroll only the track horizontally, never the page.
    const track = trackRef.current;
    const slide = track?.children[i];
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
  };

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

      {/* Phones: swipeable, snapping carousel with a peek of the next card */}
      <div className="md:hidden -mx-5">
        <div
          ref={trackRef}
          className="relative flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 pb-2"
        >
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="snap-center shrink-0 w-[84%]">
              <Card t={t} />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-[#D7E2EA]" : "w-2 bg-[#D7E2EA]/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tablet/desktop: grid */}
      <div className="hidden md:grid max-w-6xl mx-auto grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.12}>
            <Card t={t} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
