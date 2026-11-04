import React from "react";
import FadeIn from "@/components/FadeIn";
import { EXPERIENCES } from "@/content/portfolio";
import { Calendar, MapPin, CheckCircle2, Briefcase } from "lucide-react";

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative z-10 bg-[#0C0C0C] py-24 sm:py-32 border-t border-[#D7E2EA]/10"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        {/* Section Header */}
        <FadeIn y={30}>
          <div className="flex flex-col gap-2 mb-16 sm:mb-20">
            <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-mono">
              Career Trajectory
            </span>
            <h2
              className="hero-heading font-black uppercase text-[#D7E2EA] tracking-tight leading-none"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)" }}
            >
              Work Experience
            </h2>
          </div>
        </FadeIn>

        {/* Timeline Stack Container */}
        <div className="space-y-12 sm:space-y-16 relative before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-[1px] before:bg-[#D7E2EA]/15">
          {EXPERIENCES && EXPERIENCES.length > 0 ? (
            EXPERIENCES.map((exp, index) => (
              <FadeIn key={index} delay={index * 0.15} y={30}>
                <div className="relative pl-8 sm:pl-12 group">
                  {/* Timeline Node Point */}
                  <div className="absolute left-1.5 sm:left-2.5 top-2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#0C0C0C] border-2 border-[#D7E2EA]/40 group-hover:border-teal-400 group-hover:bg-teal-400/20 transition-all duration-300" />

                  {/* Experience Card */}
                  <div className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/15 bg-white/[0.02] p-6 sm:p-10 hover:border-[#D7E2EA]/30 transition-colors">
                    {/* Role & Company Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D7E2EA]/10 pb-6 mb-6">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold text-[#D7E2EA]">
                            {exp.role}
                          </h3>
                          {exp.type && (
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20">
                              {exp.type}
                            </span>
                          )}
                        </div>
                        <div className="text-base sm:text-lg text-[#D7E2EA]/80 font-medium mt-1">
                          {exp.company}
                        </div>
                      </div>

                      {/* Period & Location Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#D7E2EA]/60">
                        {exp.period && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            <span>{exp.period}</span>
                          </div>
                        )}
                        {exp.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-teal-400" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary Description */}
                    {exp.description && (
                      <p className="text-[#D7E2EA]/80 text-sm sm:text-base leading-relaxed mb-6 font-light">
                        {exp.description}
                      </p>
                    )}

                    {/* Highlight Bullets */}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {exp.highlights.map((item, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-3 text-xs sm:text-sm text-[#D7E2EA]/75 leading-relaxed font-light"
                          >
                            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Badges */}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1 text-xs font-mono rounded-full bg-white/[0.03] text-[#D7E2EA]/70 border border-[#D7E2EA]/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))
          ) : (
            <div className="text-[#D7E2EA]/40 text-sm font-mono">
              No experience records found in portfolio data.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}