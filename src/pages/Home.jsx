import React from "react";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/sections/HeroSection";
import SkillsSection from "@/components/sections/SkillsSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import Experience from "@/components/Experience";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PublicationsSection from "@/components/PublicationsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function Home() {
  return (
    <main
      className="bg-[#0C0C0C] min-h-screen"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      <SiteHeader />
      <HeroSection />
      <SkillsSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <Experience />
      <ProjectsSection />
      <PublicationsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </main>
  );
}