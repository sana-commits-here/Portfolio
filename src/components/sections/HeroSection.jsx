import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ContactButton from "@/components/ContactButton";
import LiveProjectButton from "@/components/LiveProjectButton";
import { PROFILE, NAV_LINKS } from "@/content/portfolio";

export default function HeroSection() {
  const heroRef = useRef(null);

  // Scroll-parallax with depth: the portrait drifts, tilts and recedes slightly
  // slower than the page content — same behaviour on touch and desktop.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const parallaxY = useSpring(yRaw, { stiffness: 80, damping: 18 });
  const parallaxRotate = useSpring(rotateRaw, { stiffness: 80, damping: 18 });
  const parallaxScale = useSpring(scaleRaw, { stiffness: 80, damping: 18 });

  return (
    <section ref={heroRef} className="relative h-screen flex flex-col" style={{ overflowX: "clip" }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between px-6 md:px-10 pt-6 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5">
            Hi, i&apos;m {PROFILE.name}
          </h1>
        </FadeIn>
      </div>

      {/* Portrait — sits directly under the heading, never overlapping it.
          Swap PROFILE.portrait for a photo, avatar or illustration. */}
      <div className="flex-1 min-h-0 flex justify-center items-start relative z-10 -mt-[2vh]">
        <motion.div
          className="flex justify-center"
          style={{
            y: parallaxY,
            rotate: parallaxRotate,
            scale: parallaxScale,
            willChange: "transform",
            transformPerspective: 900,
          }}
        >
          <FadeIn delay={0.6} y={30}>
            <img
              src={PROFILE.portrait}
              alt={`${PROFILE.name} — ${PROFILE.role}`}
              className="w-auto max-w-[92vw] object-contain"
              style={{ height: "clamp(260px, 56vh, 720px)" }}
            />
          </FadeIn>
        </motion.div>
      </div>

      <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <div className="max-w-[160px] sm:max-w-[240px] md:max-w-[300px]">
            <p
              className="text-[#D7E2EA] font-medium uppercase tracking-widest mb-2"
              style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.6rem)" }}
            >
              {PROFILE.role}
            </p>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug"
              style={{ fontSize: "clamp(0.7rem, 1.2vw, 1.2rem)" }}
            >
              {PROFILE.tagline}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20">
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4">
            <LiveProjectButton href="#work">View My Work</LiveProjectButton>
            <ContactButton href="#contact">Let&apos;s Work Together</ContactButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}