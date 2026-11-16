"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Dna, Sparkles, ArrowRight } from "lucide-react";

interface HeroFormulaSectionProps {
  onAddToCart: () => void;
}

export default function HeroFormulaSection({ onAddToCart }: HeroFormulaSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const heroSubheadRef = useRef<HTMLDivElement>(null);
  const heroScrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const bottle = bottleRef.current;
    const rightCol = rightColRef.current;
    const watermark = watermarkRef.current;
    const subhead = heroSubheadRef.current;
    const scrollCue = heroScrollCueRef.current;

    if (!container || !bottle || !rightCol || !watermark || !subhead || !scrollCue) return;

    const ctx = gsap.context(() => {
      // Calculate exact offset from Left Column native position to dead center of viewport
      const calcCenterOffset = () => {
        gsap.set(bottle, { clearProps: "x,scale" });
        const rect = bottle.getBoundingClientRect();
        return (window.innerWidth / 2) - (rect.left + rect.width / 2);
      };

      const initialOffset = calcCenterOffset();

      // Set initial positions
      gsap.set(bottle, {
        x: initialOffset,
        scale: window.innerWidth >= 1024 ? 1.12 : 1.0,
      });

      gsap.set(rightCol, {
        opacity: 0,
        x: 40,
      });

      // Pinned scrub timeline (Apple effect: scrubs seamlessly as user scrolls)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1, // Smooth, weighted physical scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Hero text and giant watermark fade out as scroll starts
      tl.to([watermark, subhead, scrollCue], {
        opacity: 0,
        y: -40,
        ease: "power1.out",
        duration: 0.25,
      }, 0);

      // 2. POISE bottle smoothly glides from screen center into Left Column and scales down
      tl.to(bottle, {
        x: 0,
        scale: window.innerWidth >= 1024 ? 0.9 : 0.82,
        ease: "power2.inOut",
        duration: 0.6,
      }, 0);

      // 3. Right column typography smoothly fades in early so it remains in full view
      tl.to(rightCol, {
        opacity: 1,
        x: 0,
        ease: "power2.out",
        duration: 0.45,
      }, 0.15);

    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative w-full h-screen bg-[#040812] select-none overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,42,88,0.45)_0%,rgba(4,8,18,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-blue-600/[0.08] rounded-full blur-[180px] pointer-events-none" />

      {/* Giant REVAÔM Typography sitting BEHIND the bottle (Apple effect) */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center text-center pointer-events-none select-none z-0"
      >
        <span className="font-cinzel text-[22vw] font-black text-white/[0.035] tracking-[0.14em] block whitespace-nowrap leading-none">
          REVAÔM
        </span>
      </div>

      {/* Minimal Top Brand Sub-Header */}
      <div
        ref={heroSubheadRef}
        className="absolute top-28 sm:top-32 inset-x-0 flex flex-col items-center text-center z-10 pointer-events-none px-4"
      >
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

      {/* Scroll indicator */}
      <div
        ref={heroScrollCueRef}
        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] text-slate-400 uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-cyan-400/60 to-transparent" />
      </div>

      {/* 50/50 PERFECT TWO-COLUMN GRID */}
      <div className="relative z-20 w-full max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 items-center px-6 sm:px-12 lg:px-20">
        
        {/* LEFT COLUMN: THE BOTTLE STAGE */}
        <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[640px] flex items-center justify-center">
          
          {/* THE POISE BOTTLE (Starts centered on screen, scrubs into left column) */}
          <div
            ref={bottleRef}
            className="relative w-[260px] sm:w-[300px] lg:w-[330px] h-[480px] sm:h-[550px] lg:h-[600px] flex items-center justify-center will-change-transform"
          >
            {/* Ambient Reflection */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 sm:w-60 h-6 bg-black/80 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[1px] pointer-events-none" />

            <Image
              src="/images/poise-bottle-cutout.png"
              alt="REVAÔM POISE Serum Bottle"
              fill
              priority
              sizes="(max-width: 768px) 300px, 450px"
              className="object-contain filter drop-shadow-[0_30px_60px_rgba(2,6,18,0.98)] select-none"
            />
          </div>

        </div>

        {/* RIGHT COLUMN: PUNCHY MINIMAL TYPOGRAPHY (Fades & floats in as user scrolls) */}
        <div
          ref={rightColRef}
          className="flex flex-col justify-center space-y-8 lg:pl-10 max-w-xl will-change-transform"
        >
          {/* Section 2 Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-400/20 text-[10px] font-mono tracking-[0.25em] text-cyan-300 uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>THE ARCHITECTURE OF REVAÔM</span>
            </div>

            <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.05]">
              Cellular Firming.
            </h2>
            <p className="font-cormorant italic text-2xl sm:text-3xl text-blue-200/90 font-light mt-1">
              Enduring Skin Architecture.
            </p>
          </div>

          {/* 3 Striking Feature Callouts (Zero fluff) */}
          <div className="space-y-6 border-t border-white/10 pt-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-white tracking-wide">
                    ActivIQ Technology
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    98.4% Uptake
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5 tracking-wider">
                  Phospholipid nanosomes identical to human cellular lipid bilayers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-white tracking-wide">
                    Advanced Bio-Peptides
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    +38% Density
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5 tracking-wider">
                  Hexapeptide-8 pro-collagen signaling deep extracellular scaffolding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-white tracking-wide">
                    Botanical Biomimetics
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Longevity Shield
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5 tracking-wider">
                  Haberlea resurrection extracts reversing cellular senescence.
                </p>
              </div>
            </div>
          </div>

          {/* Minimal Action */}
          <div className="pt-4 flex flex-wrap items-center gap-5">
            <button
              onClick={onAddToCart}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-[#040812] font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
            >
              <span>Acquire POISE — $94</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              30 ML / 1.0 FL. OZ. • Complimentary Shipping
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
