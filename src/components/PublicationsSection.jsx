import React from "react";
import FadeIn from "@/components/FadeIn";
import { PUBLICATIONS } from "@/content/portfolio";
import { BookOpen, ExternalLink, Award, Calendar } from "lucide-react";

export default function PublicationsSection() {
  if (!PUBLICATIONS || PUBLICATIONS.length === 0) return null;

  return (
    <section
      id="publications"
      className="relative z-10 bg-[#0C0C0C] py-20 sm:py-28 border-t border-[#D7E2EA]/10"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        {/* Header */}
        <FadeIn y={30}>
          <div className="flex flex-col gap-2 mb-14 sm:mb-16">
            <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
              Research & Academic Contributions
            </span>
            <h2
              className="hero-heading font-black uppercase text-[#D7E2EA] tracking-tight leading-none"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
            >
              Publications
            </h2>
          </div>
        </FadeIn>

        {/* Publication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PUBLICATIONS.map((pub, index) => (
            <FadeIn key={index} delay={index * 0.15} y={30}>
              <div className="h-full flex flex-col justify-between rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/15 bg-white/[0.02] p-6 sm:p-8 hover:border-[#D7E2EA]/35 transition-all duration-300 group">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-teal-400/10 text-teal-300 border border-teal-400/20">
                      <Award className="w-3.5 h-3.5" />
                      {pub.badge}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D7E2EA]/60">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      {pub.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#D7E2EA] leading-snug group-hover:text-white transition-colors mb-2">
                    {pub.title}
                  </h3>

                  {/* Conference / Venue */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D7E2EA]/75 font-mono mb-4">
                    <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="line-clamp-2">{pub.conference}</span>
                  </div>

                  {/* Abstract */}
                  <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light leading-relaxed mb-6">
                    {pub.abstract}
                  </p>
                </div>

                <div>
                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#D7E2EA]/10 mb-5">
                    {pub.topics.map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 text-[0.7rem] font-mono rounded-full bg-white/[0.03] text-[#D7E2EA]/70 border border-[#D7E2EA]/10"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Link / CTA */}
                  {pub.link && pub.link !== "https://doi.org/" ? (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-300 hover:text-teal-200 transition-colors"
                    >
                      <span>Read Publication</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-[#D7E2EA]/40">
                      Author Contribution: {pub.role}
                    </span>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}