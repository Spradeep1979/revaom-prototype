"use client";

import Image from "next/image";
import { Zap, Dna, Sparkles, ArrowRight } from "lucide-react";

interface FormulaSectionProps {
  onAddToCart: () => void;
}

export default function FormulaSection({ onAddToCart }: FormulaSectionProps) {
  return (
    <section
      id="formula-section"
      className="relative min-h-screen w-full flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-52 sm:pb-64 bg-[#0f0206] select-none"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_50%,rgba(58,7,22,0.35)_0%,rgba(15,2,6,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      {/* 50/50 PERFECT TWO-COLUMN GRID */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 items-center gap-8 sm:gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: THE RESET BOTTLE */}
        <div
          id="bottle-landing-zone"
          className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] flex items-center justify-center pointer-events-none"
        >
          {/* Ambient Landing Aura */}
          <div className="absolute inset-0 bg-radial from-[#3a0716]/[0.18] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-6 bg-black/80 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-[#eee4d8]/20 to-transparent blur-[1px] pointer-events-none" />
          
          <div className="relative w-44 sm:w-52 lg:w-60 h-72 sm:h-84 lg:h-96">
            <Image
              src="/images/reset-bottle-cutout.jpg"
              alt="REVAÔM RESET Bottle"
              fill
              sizes="(max-width: 768px) 200px, 300px"
              className="object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: PUNCHY MINIMAL TYPOGRAPHY */}
        <div className="formula-reveal-content flex flex-col justify-center space-y-8 lg:pl-10 max-w-xl">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a0716]/60 border border-[#eee4d8]/15 text-[10px] font-mono tracking-[0.25em] text-[#eee4d8]/70 uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eee4d8]/60 animate-pulse" />
              <span>THE ARCHITECTURE OF REVAÔM RESET</span>
            </div>

            <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-light text-[#eee4d8] tracking-tight leading-[1.05]">
              Clarify.<br />Calm. Renew.
            </h2>
            <p className="font-cormorant italic text-2xl sm:text-3xl text-[#eee4d8]/70 font-light mt-1">
              Targeted Acne-Prone Architecture.
            </p>
          </div>

          {/* 3 Feature Callouts */}
          <div className="space-y-6 border-t border-[#eee4d8]/10 pt-6">
            
            {/* 01: ActivIQ Technology */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#3a0716]/50 border border-[#eee4d8]/15 flex items-center justify-center text-[#eee4d8]/70 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-[#eee4d8] tracking-wide">
                    ActivIQ Technology
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#eee4d8]/60">
                    98.4% Uptake
                  </span>
                </div>
                <p className="text-xs font-mono text-[#eee4d8]/40 mt-0.5 tracking-wider">
                  Phospholipid nanosomes identical to human cellular lipid bilayers.
                </p>
              </div>
            </div>

            {/* 02: Salicylic Acid + Peptides */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#3a0716]/50 border border-[#eee4d8]/15 flex items-center justify-center text-[#eee4d8]/70 shrink-0 mt-0.5">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-[#eee4d8] tracking-wide">
                    Salicylic Acid + Peptides
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#eee4d8]/60">
                    Pore Clarity
                  </span>
                </div>
                <p className="text-xs font-mono text-[#eee4d8]/40 mt-0.5 tracking-wider">
                  Copper Tripeptide-1 + 2% BHA deep pore clarification.
                </p>
              </div>
            </div>

            {/* 03: Soothing Botanicals */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#3a0716]/50 border border-[#eee4d8]/15 flex items-center justify-center text-[#eee4d8]/70 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-[#eee4d8] tracking-wide">
                    Soothing Botanicals
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#eee4d8]/60">
                    Calm Shield
                  </span>
                </div>
                <p className="text-xs font-mono text-[#eee4d8]/40 mt-0.5 tracking-wider">
                  Houttuynia & Scutellaria extracts reversing blemish-induced inflammation.
                </p>
              </div>
            </div>

          </div>

          {/* Minimal Action */}
          <div className="pt-4 flex flex-wrap items-center gap-5">
            <button
              onClick={onAddToCart}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#eee4d8] hover:bg-[#f5f0eb] text-[#1a0409] font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(238,228,216,0.15)] hover:shadow-[0_0_35px_rgba(238,228,216,0.3)] hover:scale-105 active:scale-95"
            >
              <span>Acquire RESET — $78</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-[#eee4d8]/40">
              20 g / 0.70 OZ. • Complimentary Shipping
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
