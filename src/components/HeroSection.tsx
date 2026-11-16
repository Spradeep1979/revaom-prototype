"use client";

import Image from "next/image";

interface HeroSectionProps {
  onExplore?: () => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section
      id="hero-section"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden select-none bg-[#040812]"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,42,88,0.45)_0%,rgba(4,8,18,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-blue-600/[0.08] rounded-full blur-[180px] pointer-events-none" />

      {/* Giant REVAÔM Typography sitting BEHIND the bottle (Apple effect) */}
      <div className="hero-fade absolute inset-0 flex items-center justify-center text-center pointer-events-none select-none z-0">
        <span className="font-cinzel text-[22vw] font-black text-white/[0.035] tracking-[0.14em] block whitespace-nowrap leading-none">
          REVAÔM
        </span>
      </div>

      {/* Minimal Top Brand Sub-Header */}
      <div className="hero-fade absolute top-28 sm:top-32 inset-x-0 flex flex-col items-center text-center z-10 pointer-events-none px-4">
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-cyan-300 uppercase">
          ACTIVIQ™ CELLULAR CONCENTRATE
        </span>
        <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-[0.2em] mt-1 uppercase">
          POISE
        </h1>
        <p className="font-cormorant italic text-lg sm:text-xl text-blue-200/80 font-light -mt-0.5">
          Anti-Aging Serum
        </p>
      </div>

      {/* THE POISE BOTTLE (Pinned by ScrollTrigger and translated directly into Section 2 Left Column) */}
      <div
        id="scrub-poise-bottle"
        className="relative z-20 flex items-center justify-center will-change-transform pointer-events-none"
      >
        <div className="relative w-[220px] sm:w-[260px] lg:w-[320px] h-[420px] sm:h-[480px] lg:h-[580px] flex items-center justify-center">
          {/* Subtle Ambient Reflection */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-6 bg-black/80 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 sm:w-52 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[1px] pointer-events-none" />

          <Image
            src="/images/poise-bottle-cutout.png"
            alt="REVAÔM POISE Serum Bottle"
            fill
            priority
            sizes="(max-width: 768px) 260px, 420px"
            className="object-contain filter drop-shadow-[0_30px_60px_rgba(2,6,18,0.98)] select-none"
          />
        </div>
      </div>

      {/* Minimal Bottom Scroll Indicator */}
      <div
        onClick={onExplore}
        className="hero-fade absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer z-10 group"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] text-slate-400 group-hover:text-cyan-300 transition-colors uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-cyan-400/60 to-transparent group-hover:h-9 transition-all" />
      </div>
    </section>
  );
}
