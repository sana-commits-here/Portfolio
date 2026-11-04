import React, { useRef, useEffect, useMemo } from "react";

const IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ROW_1 = IMAGES.slice(0, 11);
const ROW_2 = IMAGES.slice(11);

function MarqueeRow({ images, direction, innerRef }) {
  // Tripled once via useMemo — never re-computed since the row never re-renders.
  const tripled = useMemo(() => [...images, ...images, ...images], [images]);

  return (
    <div
      ref={innerRef}
      className="flex gap-3"
      style={{ willChange: "transform" }}
    >
      {tripled.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="rounded-2xl object-cover flex-shrink-0"
          style={{ width: "clamp(260px, 30vw, 420px)", height: "clamp(167px, 19vw, 270px)" }}
        />
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    let rafId = null;
    const mult = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches ? 0.6 : 0.3;

    const apply = () => {
      rafId = null;
      const el = sectionRef.current;
      if (!el) return;

      // Skip work entirely when the section is off-screen.
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const value = (window.scrollY - el.offsetTop + window.innerHeight) * mult;
      const t1 = value - 200;
      const t2 = -(value - 200);

      if (row1Ref.current) row1Ref.current.style.transform = `translateX(${t1}px)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(${t2}px)`;
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3"
      style={{
        contain: "layout paint",
        contentVisibility: "auto",
        containIntrinsicSize: "auto 700px",
      }}
    >
      <MarqueeRow images={ROW_1} direction="right" innerRef={row1Ref} />
      <MarqueeRow images={ROW_2} direction="left" innerRef={row2Ref} />
    </section>
  );
}