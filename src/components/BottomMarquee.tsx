"use client";

import { Compass } from "lucide-react";

interface BottomMarqueeProps {
  progress: number;
  currentSection: number;
}

const sectionNames = [
  "01 / 05 • POISE HERO",
  "02 / 05 • ARCHWAY PORTALS",
  "03 / 05 • 3D CAROUSEL",
  "04 / 05 • CLINICAL PROOF",
  "05 / 05 • THE RITUAL",
];

export default function BottomMarquee({
  progress,
  currentSection,
}: BottomMarqueeProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none select-none">
      {/* Sleek Ticker Bar */}
      <div className="pointer-events-auto bg-[#070e1c]/90 backdrop-blur-md border-t border-blue-500/20 px-4 py-2 flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-blue-200/60 font-mono">
        
        {/* Left Section Tracker */}
        <div className="hidden sm:flex items-center gap-2 text-white font-semibold min-w-[220px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{sectionNames[currentSection] || sectionNames[0]}</span>
        </div>

        {/* Center Marquee */}
        <div className="flex-1 overflow-hidden whitespace-nowrap mx-4 opacity-85 mask-marquee">
          <div className="inline-block animate-[marquee_30s_linear_infinite]">
            <span className="mx-6 text-blue-200">✦ REVAÔM LABORATOIRES PARIS</span>
            <span className="mx-6 text-white font-medium">✦ ACTIVIQ™ CELLULAR INTELLIGENCE</span>
            <span className="mx-6 text-blue-200">✦ ADVANCED BIO-PEPTIDES + BOTANICAL BIOMIMETICS</span>
            <span className="mx-6 text-white">✦ POISE ANTI-AGING SERUM</span>
            <span className="mx-6 text-blue-200">✦ ARCHWAY SCROLL MASKS & 3D DRAG CAROUSEL</span>
            <span className="mx-6 text-white">✦ 98.4% BIO-CELLULAR UPTAKE</span>
            <span className="mx-6 text-blue-200">✦ CLINICALLY CERTIFIED IN-VIVO</span>
            <span className="mx-6 text-white">✦ FORMULA POE-08</span>
          </div>
          <div className="inline-block animate-[marquee_30s_linear_infinite]" aria-hidden="true">
            <span className="mx-6 text-blue-200">✦ REVAÔM LABORATOIRES PARIS</span>
            <span className="mx-6 text-white font-medium">✦ ACTIVIQ™ CELLULAR INTELLIGENCE</span>
            <span className="mx-6 text-blue-200">✦ ADVANCED BIO-PEPTIDES + BOTANICAL BIOMIMETICS</span>
            <span className="mx-6 text-white">✦ POISE ANTI-AGING SERUM</span>
            <span className="mx-6 text-blue-200">✦ ARCHWAY SCROLL MASKS & 3D DRAG CAROUSEL</span>
            <span className="mx-6 text-white">✦ 98.4% BIO-CELLULAR UPTAKE</span>
            <span className="mx-6 text-blue-200">✦ CLINICALLY CERTIFIED IN-VIVO</span>
            <span className="mx-6 text-white">✦ FORMULA POE-08</span>
          </div>
        </div>

        {/* Right Scroll Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-blue-200/70 font-mono text-[10px] min-w-[220px] justify-end">
          <Compass className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: "12s" }} />
          <span>SCROLL DOWN • {Math.round(progress * 100)}%</span>
        </div>
      </div>

      {/* Blue illuminated progress bar */}
      <div className="w-full h-[2px] bg-blue-950 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-white shadow-[0_0_12px_rgba(56,189,248,0.9)] transition-all duration-100 ease-out"
          style={{ width: `${Math.max(2, progress * 100)}%` }}
        />
      </div>
    </footer>
  );
}
