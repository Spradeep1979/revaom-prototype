"use client";

import { Zap, Dna, Sparkles, ArrowRight } from "lucide-react";

interface FormulaSectionProps {
  onAddToCart: () => void;
}

export default function FormulaSection({ onAddToCart }: FormulaSectionProps) {
  return (
    <section
      id="formula-section"
      className="relative min-h-screen w-full flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-52 sm:pb-64 bg-[#050b16] select-none"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_50%,rgba(18,44,90,0.35)_0%,rgba(5,11,22,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      {/* 50/50 PERFECT TWO-COLUMN GRID (Left is bottle landing zone, Right is minimal typography) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 items-center gap-8 sm:gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: LANDING ZONE FOR THE POISE BOTTLE */}
        <div
          id="bottle-landing-zone"
          className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] flex items-center justify-center pointer-events-none"
        >
          {/* Subtle Ambient Landing Aura & Floor Shadow */}
          <div className="absolute inset-0 bg-radial from-blue-500/[0.08] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-6 bg-black/70 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[1px] pointer-events-none" />
        </div>

        {/* RIGHT COLUMN: PUNCHY MINIMAL TYPOGRAPHY */}
        <div className="formula-reveal-content flex flex-col justify-center space-y-8 lg:pl-10 max-w-xl">
          
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
            
            {/* 01: ActivIQ Technology */}
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

            {/* 02: Advanced Bio-Peptides */}
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

            {/* 03: Botanical Biomimetics */}
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
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#040812] font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
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
