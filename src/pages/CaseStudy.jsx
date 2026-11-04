import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import ContactButton from "@/components/ContactButton";
import { PROJECTS } from "@/content/portfolio";

function Block({ label, text, delay }) {
  return (
    <FadeIn delay={delay}>
      <div className="border-t border-[#D7E2EA]/20 py-10 sm:py-12 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
        <h3
          className="text-[#D7E2EA] font-medium uppercase tracking-widest"
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.5rem)" }}
        >
          {label}
        </h3>
        <p
          className="md:col-span-2 text-[#D7E2EA] font-light leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.25rem)", opacity: 0.85 }}
        >
          {text}
        </p>
      </div>
    </FadeIn>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main
        className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center gap-6 px-5"
        style={{ fontFamily: "'Kanit', sans-serif" }}
      >
        <h1 className="hero-heading font-black uppercase text-4xl sm:text-6xl">Not Found</h1>
        <Link
          to="/"
          className="text-[#D7E2EA] font-medium uppercase tracking-widest text-sm hover:opacity-60 transition-opacity"
        >
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-8 sm:py-10"
      style={{ overflowX: "clip", fontFamily: "'Kanit', sans-serif" }}
    >
      <FadeIn y={-20}>
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-[#D7E2EA] font-medium uppercase tracking-widest text-xs sm:text-sm hover:opacity-60 transition-opacity duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Selected Work
        </Link>
      </FadeIn>

      <div className="max-w-6xl mx-auto mt-10 sm:mt-14 md:mt-16">
        <FadeIn y={40} delay={0.1}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-widest text-xs sm:text-sm opacity-60 mb-4">
            {project.category} · {project.client} · {project.year}
          </p>
          <h1
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 130px)" }}
          >
            {project.name}
          </h1>
        </FadeIn>

        <FadeIn y={40} delay={0.25}>
          <img
            src={project.col2}
            alt={`${project.name} main`}
            className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px] mt-10 sm:mt-14"
            style={{ height: "clamp(240px, 45vw, 560px)" }}
          />
        </FadeIn>

        <div className="mt-14 sm:mt-16 md:mt-20">
          <Block label="Challenge" text={project.challenge} delay={0} />
          <Block label="My Role" text={project.myRole} delay={0.05} />
          <Block label="Solution" text={project.solution} delay={0.1} />
        </div>

        <FadeIn delay={0.1}>
          <div className="border-t border-[#D7E2EA]/20 py-10 sm:py-12 md:py-14">
            <h3
              className="text-[#D7E2EA] font-medium uppercase tracking-widest mb-8 sm:mb-10"
              style={{ fontSize: "clamp(1rem, 1.8vw, 1.5rem)" }}
            >
              Result
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-[30px] sm:rounded-[36px] border border-[#D7E2EA]/20 p-6 sm:p-8 text-center flex flex-col gap-2"
                >
                  <span
                    className="hero-heading font-black leading-none"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                  >
                    {r.value}
                  </span>
                  <span className="text-[#D7E2EA] font-light uppercase tracking-widest text-[0.65rem] sm:text-xs opacity-60">
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
            {project.col1.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.name} detail ${i + 1}`}
                loading="lazy"
                className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(200px, 26vw, 380px)" }}
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center gap-8 py-20 sm:py-24 md:py-28 text-center">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(2rem, 6vw, 80px)" }}
            >
              Like what you see?
            </h2>
            <ContactButton href="/#contact">Let&apos;s Work Together</ContactButton>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}