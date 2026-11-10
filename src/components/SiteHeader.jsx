import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, PROFILE, SOCIALS } from "@/content/portfolio";

const EASE = [0.22, 1, 0.36, 1];

// Full-screen menu grows as a circle out of the menu button (top-right).
const menuVariants = {
  closed: {
    clipPath: "circle(0px at calc(100% - 40px) 32px)",
    transition: { duration: 0.45, ease: EASE, when: "afterChildren" },
  },
  open: {
    clipPath: "circle(150% at calc(100% - 40px) 32px)",
    transition: { duration: 0.6, ease: EASE, when: "beforeChildren", staggerChildren: 0.05 },
  },
};
const linkVariants = {
  closed: { opacity: 0, y: 28 },
  open: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

// Sticky header that appears once the hero is scrolled past. On phones it
// tucks away while scrolling down and returns on scroll up.
export default function SiteHeader() {
  const reduced = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight * 0.8);
      const isPhone = window.innerWidth < 768;
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(isPhone && delta > 0 && y > window.innerHeight);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const showBar = (pastHero && !hidden) || open;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: showBar ? 0 : -90 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
        className={`fixed top-0 inset-x-0 z-[68] border-b transition-colors duration-300 ${
          open
            ? "bg-transparent border-transparent"
            : "bg-[#0C0C0C]/75 backdrop-blur-md border-[#D7E2EA]/10"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="hero-heading font-black uppercase tracking-tight text-2xl"
          >
            {PROFILE.name}
          </a>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#D7E2EA]/80 hover:text-[#D7E2EA] font-medium uppercase tracking-wider text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {/* Spacer so the floating menu button never covers the logo */}
          <span className="md:hidden w-11" />
        </div>
        {/* Reading progress */}
        {!open && (
          <motion.div
            className="absolute left-0 right-0 bottom-0 h-[2px] origin-left"
            style={{
              scaleX: progress,
              background: "linear-gradient(90deg, #B600A8, #7621B0, #BE4C00)",
            }}
          />
        )}
      </motion.header>

      {/* Phone menu button — always reachable, morphs between ☰ and ✕ */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        whileTap={{ scale: 0.88 }}
        animate={{ y: hidden && !open ? -90 : 0 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
        className="md:hidden fixed top-[10px] right-4 z-[70] w-11 h-11 rounded-full border border-[#D7E2EA]/30 bg-[#0C0C0C]/70 backdrop-blur flex items-center justify-center text-[#D7E2EA]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            variants={menuVariants}
            initial={reduced ? "open" : "closed"}
            animate="open"
            exit="closed"
            className="md:hidden fixed inset-0 z-[65] bg-[#0C0C0C] flex flex-col px-6 pt-24 pb-10 overflow-y-auto"
            aria-label="Mobile"
          >
            {/* Glow is clipped by its own wrapper so it never adds scroll height */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, #B600A8 0%, transparent 65%)" }}
              />
            </div>
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                variants={linkVariants}
                whileTap={{ x: 8 }}
                className="relative flex items-baseline gap-4 py-3 border-b border-[#D7E2EA]/10"
              >
                <span className="text-[#D7E2EA]/40 font-mono text-xs w-6">0{i + 1}</span>
                <span
                  className="hero-heading font-black uppercase tracking-tight leading-none"
                  style={{ fontSize: "clamp(2rem, 10vw, 3rem)" }}
                >
                  {link.label}
                </span>
              </motion.a>
            ))}

            <motion.div variants={linkVariants} className="relative mt-auto pt-10 flex flex-wrap gap-x-6 gap-y-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D7E2EA]/70 uppercase tracking-widest text-xs"
                >
                  {s.label}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
