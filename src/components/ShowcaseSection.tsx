"use client";

import { useRef, useEffect } from "react";
import ProductTiltCard from "./ProductTiltCard";
import { Activity, Award, CheckCircle2, ChevronDown, Layers } from "lucide-react";
import gsap from "gsap";

interface ShowcaseSectionProps {
  onAddToCart: () => void;
  onOpenSpecs: () => void;
  onNextSection: () => void;
}

export default function ShowcaseSection({
  onAddToCart,
  onOpenSpecs,
  onNextSection,
}: ShowcaseSectionProps) {
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupCardTilt = (el: HTMLDivElement | null) => {
      if (!el) return;
      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          rotateX: -(y / rect.height) * 14,
          rotateY: (x / rect.width) * 14,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.4,
        });
      };
      const handleLeave = () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          ease: "elastic.out(1, 0.7)",
          duration: 0.8,
        });
      };
      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      return () => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
      };
    };

    const cleanup2 = setupCardTilt(card2Ref.current);
    const cleanup3 = setupCardTilt(card3Ref.current);

    return () => {
      cleanup2?.();
      cleanup3?.();
    };
  }, []);

  return (
    <section
      id="showcase-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 bg-[#08101e] overflow-hidden select-none"
    >
      {/* Background Navy Gradient & Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(20,48,90,0.45)_0%,rgba(8,16,30,0.98)_75%)] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[600px] h-[350px] bg-blue-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col justify-center">
        
        {/* Section Header (Scrub Revealed) */}
        <div className="showcase-reveal flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-blue-400/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-blue-200/70 uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Section 02 / The Product Showcase</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
              Tactile Engineering.
            </h2>
          </div>

          <div className="mt-2 sm:mt-0 flex items-center gap-4 text-xs font-mono text-blue-200/70">
            <span>HOVER CARD FOR 3D TACTILE TILT</span>
            <span className="hidden lg:inline text-blue-400/40">•</span>
            <button
              onClick={onNextSection}
              className="hidden lg:flex items-center gap-1 text-white hover:text-cyan-300 transition-colors"
            >
              <span>Explore Science Below</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Trio of Cards: 3D Tilt Card + Companion Cards */}
        <div className="showcase-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-center justify-center">
          
          {/* 1. PRIMARY FEATURED PRODUCT TILT CARD */}
          <div className="flex justify-center">
            <ProductTiltCard
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenSpecs}
            />
          </div>

          {/* 2. ACTIVIQ™ CELLULAR BIO-MATRIX CARD (Tilting) */}
          <div className="perspective-1000 hidden md:block">
            <div
              ref={card2Ref}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full max-w-[380px] rounded-3xl p-6 sm:p-7 luxury-card-navy border border-blue-400/25 shadow-xl transition-shadow will-change-transform"
            >
              <div className="flex items-center justify-between pb-3 border-b border-blue-400/15">
                <span className="text-[9px] font-mono tracking-widest text-blue-200 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-300" />
                  CELLULAR UPTAKE KINETICS
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-[9px] font-mono text-cyan-300 border border-blue-400/20">
                  ACTIVIQ™
                </span>
              </div>

              <div className="my-4">
                <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                  Bio-Membrane Fusion
                </h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  Standard peptide formulations degrade on the surface. REVAÔM POISE utilizes lipid-mimetic nanosomes that fuse directly with living cell membranes to release intact bio-peptides.
                </p>
              </div>

              {/* Kinetic Absorption Comparison Bars */}
              <div className="space-y-3.5 my-5 p-3.5 rounded-2xl bg-[#040813]/70 border border-blue-400/15">
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1.5">
                    <span className="text-white font-medium">REVAÔM ActivIQ™ Uptake</span>
                    <span className="text-cyan-400 font-bold">98.4% Cellular</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-950 overflow-hidden">
                    <div className="w-[98%] h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-white rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1.5">
                    <span className="text-blue-300/60">Standard Bio-Peptide Serum</span>
                    <span className="text-blue-300/60">26.2% Cellular</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-950 overflow-hidden">
                    <div className="w-[26%] h-full bg-blue-800/60 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <ul className="space-y-2 text-xs text-blue-100/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Stimulates Fibroblast Collagen Scaffolding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Epigenetic Senescence Reversal Defense</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. CLINICAL EVIDENCE CARD (Tilting) */}
          <div className="perspective-1000 hidden lg:block">
            <div
              ref={card3Ref}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full max-w-[380px] rounded-3xl p-6 sm:p-7 luxury-card-navy border border-blue-400/25 shadow-xl transition-shadow will-change-transform"
            >
              <div className="flex items-center justify-between pb-3 border-b border-blue-400/15">
                <span className="text-[9px] font-mono tracking-widest text-blue-200 uppercase flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-300" />
                  28-DAY IN-VIVO TRIAL
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-[9px] font-mono text-cyan-300 border border-blue-400/20">
                  N = 64 COHORT
                </span>
              </div>

              <div className="my-4">
                <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                  Clinical Remodeling
                </h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  Independent instrumental ultrasound and dermatological evaluation measured dramatic cellular density renewal across key aging markers.
                </p>
              </div>

              {/* Big Metric Badges */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-400/20 text-center">
                  <span className="font-cormorant text-4xl font-light text-white block">
                    95%
                  </span>
                  <span className="text-[9px] font-mono text-blue-200 uppercase tracking-wider block mt-1">
                    Increased Dermal Elasticity
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-400/20 text-center">
                  <span className="font-cormorant text-4xl font-light text-white block">
                    91%
                  </span>
                  <span className="text-[9px] font-mono text-blue-200 uppercase tracking-wider block mt-1">
                    Reduced Wrinkle Depth
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#040813]/60 border border-blue-400/15 flex items-center justify-between text-xs font-mono text-blue-200">
                <span className="text-blue-300/60">Formula POE-08</span>
                <span className="text-white font-medium">Batch Certified ✦</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
