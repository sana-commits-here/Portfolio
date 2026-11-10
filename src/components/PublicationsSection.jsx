import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { PUBLICATIONS } from "@/content/portfolio";

/*
 * Featured + compact. The newest paper gets a large block with an image that
 * unmasks and drifts on scroll; the rest sit underneath as compact rows.
 */

const EASE = [0.22, 1, 0.36, 1];
const BRAND = "linear-gradient(90deg, #B600A8, #7621B0, #BE4C00)";
const hasLink = (p) => p.link && p.link !== "https://doi.org/";

function Featured({ pub, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const fade = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  const Wrapper = hasLink(pub) ? "a" : "div";
  const wrapperProps = hasLink(pub)
    ? { href: pub.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative grid md:grid-cols-12 gap-0 rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/15 bg-white/[0.02] overflow-hidden"
    >
      {/* gradient top edge */}
      <div className="absolute top-0 left-8 right-8 h-px z-10" style={{ background: BRAND }} />

      {/* Image: unmask from the left + parallax drift + zoom on hover */}
      <motion.div
        ref={ref}
        className="relative md:col-span-5 aspect-[16/10] md:aspect-auto md:min-h-[440px] overflow-hidden"
        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <motion.img
          src={pub.image}
          alt=""
          loading="lazy"
          decoding="async"
          style={reduced ? undefined : { y: imgY }}
          className="absolute inset-0 w-full h-full object-cover scale-[1.18] transition-transform duration-700 ease-out group-hover:scale-[1.26]"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#0C0C0C]/70" />
        <span className="absolute top-4 left-4 rounded-full bg-[#0C0C0C]/70 backdrop-blur px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#D7E2EA]">
          Featured · {pub.year}
        </span>
      </motion.div>

      {/* Content */}
      <div className="md:col-span-7 p-6 sm:p-10 flex flex-col">
        <motion.span {...fade(0.1)} className="text-[0.7rem] uppercase tracking-widest text-[#D7E2EA]/55">
          {pub.badge}
        </motion.span>
        <motion.h3
          {...fade(0.18)}
          className="mt-3 text-[#D7E2EA] font-semibold leading-[1.08] tracking-tight"
          style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)" }}
        >
          {pub.title}
        </motion.h3>
        <motion.p {...fade(0.26)} className="mt-3 text-sm text-[#D7E2EA]/55 leading-relaxed">
          {pub.conference}
        </motion.p>
        <motion.p {...fade(0.32)} className="mt-6 text-[#D7E2EA]/80 text-sm sm:text-base leading-relaxed font-light">
          {pub.abstract}
        </motion.p>

        <motion.div {...fade(0.4)} className="flex flex-wrap gap-2 mt-6">
          {pub.topics.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs font-mono rounded-full bg-white/[0.04] text-[#D7E2EA]/70 border border-[#D7E2EA]/10"
            >
              {t}
            </span>
          ))}
        </motion.div>

        <motion.div
          {...fade(0.48)}
          className="mt-auto pt-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-widest"
        >
          <span className="text-[#D7E2EA]/50">{pub.role}</span>
          {hasLink(pub) ? (
            <span className="inline-flex items-center gap-2 text-[#D7E2EA]">
              Read paper
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45" style={{ background: BRAND }}>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </span>
          ) : (
            <span className="text-[#D7E2EA]/35">Link coming soon</span>
          )}
        </motion.div>
      </div>
    </Wrapper>
  );
}

function CompactRow({ pub, index, reduced }) {
  const Tag = hasLink(pub) ? "a" : "div";
  const linkProps = hasLink(pub) ? { href: pub.link, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
      className="relative"
    >
      <Tag
        {...linkProps}
        className="group relative grid grid-cols-[3.5rem_1fr_auto] sm:grid-cols-[5rem_1fr_auto] items-center gap-4 sm:gap-6 py-6 sm:py-7 border-b border-[#D7E2EA]/10"
      >
        {/* hover underline sweep */}
        <span
          aria-hidden="true"
          className="absolute left-0 bottom-[-1px] h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: BRAND }}
        />
        <span className="font-mono text-sm text-[#D7E2EA]/50">{pub.year}</span>
        <span className="min-w-0">
          <span className="block text-[#D7E2EA] font-medium text-base sm:text-xl leading-snug group-hover:translate-x-1 transition-transform duration-300">
            {pub.title}
          </span>
          <span className="block mt-1 text-xs sm:text-sm text-[#D7E2EA]/45 truncate">
            {pub.badge} · {pub.conference}
          </span>
        </span>
        <span
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
            hasLink(pub)
              ? "border-[#D7E2EA]/30 text-[#D7E2EA] group-hover:border-transparent group-hover:rotate-45"
              : "border-[#D7E2EA]/10 text-[#D7E2EA]/25"
          }`}
          title={hasLink(pub) ? "Read paper" : "Link coming soon"}
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </Tag>
    </motion.li>
  );
}

export default function PublicationsSection() {
  const reduced = useReducedMotion();
  if (!PUBLICATIONS?.length) return null;

  // Newest paper is featured; the rest are listed underneath.
  const sorted = [...PUBLICATIONS].sort((a, b) => Number(b.year) - Number(a.year));
  const [featured, ...others] = sorted;

  return (
    <section
      id="publications"
      className="relative z-10 bg-[#0C0C0C] py-20 sm:py-28 border-t border-[#D7E2EA]/10"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        <FadeIn y={30}>
          <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
            <div className="flex flex-col gap-2">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
                Research & Academic Contributions
              </span>
              <h2
                className="hero-heading font-black uppercase tracking-tight leading-none"
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)" }}
              >
                Publications
              </h2>
            </div>
            <span className="hidden sm:block font-mono text-xs text-[#D7E2EA]/40 pb-2">
              {String(PUBLICATIONS.length).padStart(2, "0")} papers
            </span>
          </div>
        </FadeIn>

        <Featured pub={featured} reduced={reduced} />

        {others.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <FadeIn y={16}>
              <span className="text-[#D7E2EA]/45 uppercase tracking-widest text-xs font-mono">
                More publications
              </span>
            </FadeIn>
            <ul className="mt-2">
              {others.map((pub, i) => (
                <CompactRow key={pub.title} pub={pub} index={i} reduced={reduced} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
