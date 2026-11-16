"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, ShieldCheck, ArrowRight } from "lucide-react";

interface RitualSectionProps {
  onAddToCart: () => void;
  onOpenCart: () => void;
}

export default function RitualSection({
  onAddToCart,
  onOpenCart,
}: RitualSectionProps) {
  const [added, setAdded] = useState(false);

  const handleOrder = () => {
    setAdded(true);
    onAddToCart();
    setTimeout(() => {
      setAdded(false);
      onOpenCart();
    }, 600);
  };

  return (
    <section
      id="ritual-section"
      className="relative w-full flex flex-col items-center overflow-hidden select-none bg-[#0f0206]"
    >
      {/* Background ambient spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(58,7,22,0.50)_0%,rgba(15,2,6,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      {/* FULL-HEIGHT DEAD-CENTER CONTAINER FOR ACQUIRE RESET */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-20">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Sub-label */}
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#eee4d8]/60 uppercase block mb-3">
            ACTIVIQ™ FORMULATION MATRIX
          </span>

          {/* Massive Punchy Headline */}
          <h2 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.05]">
            RESET Clarifying Serum.
          </h2>

          {/* Minimal Clinical Stat Callout */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="font-cinzel text-3xl sm:text-4xl font-bold text-[#eee4d8]/90">
              98.4%
            </span>
            <span className="text-xs sm:text-sm font-mono text-slate-300 text-left max-w-xs">
              Subject Agreement: Clarifies Pores & Balances Excess Sebum
            </span>
          </div>

          {/* Product Visual Presentation (Bottle + Box) */}
          <div className="relative w-full max-w-md h-72 sm:h-84 my-8 flex items-center justify-center">
            {/* Subtle Base Shadow & Halo */}
            <div className="absolute bottom-2 w-64 sm:w-80 h-8 bg-black/80 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 w-52 sm:w-64 h-[1px] bg-gradient-to-r from-transparent via-[#eee4d8]/40 to-transparent blur-[1px] pointer-events-none" />

            {/* Bottle Cutout */}
            <div className="relative w-36 sm:w-44 h-64 sm:h-76 -mr-6 z-20">
              <Image
                src="/images/reset-bottle-cutout.jpg"
                alt="REVAÔM RESET Serum"
                fill
                className="object-contain filter drop-shadow-[0_25px_45px_rgba(2,6,18,0.98)]"
              />
            </div>

            {/* Box Cutout */}
            <div className="relative w-40 sm:w-48 h-64 sm:h-76 -ml-6 z-10 opacity-90">
              <Image
                src="/images/reset-box-cutout.jpg"
                alt="REVAÔM RESET Box"
                fill
                className="object-contain filter drop-shadow-[0_25px_45px_rgba(2,6,18,0.98)]"
              />
            </div>
          </div>

          {/* Pricing & Acquisition Action */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
                $78.00
              </span>
              <span className="text-xs font-mono text-[#eee4d8]/70">
                USD / 20 G (ACNE-PRONE SERUM)
              </span>
            </div>

            <button
              onClick={handleOrder}
              className={`inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 ${
                added
                  ? "bg-[#2a5c40] text-white"
                  : "bg-white hover:bg-slate-100 text-[#040812]"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Reserved in Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire RESET Ritual</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] font-mono text-slate-400 tracking-wider">
              Complimentary Climate-Neutral Delivery • 30-Day Dermal Trial
            </p>

            {/* Packaging Free-From Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10px] font-mono tracking-widest text-[#eee4d8]/50 uppercase">
              <span>✦ Paraben Free</span>
              <span>✦ Silicone Free</span>
              <span>✦ Ethanol Free</span>
              <span>✦ Mineral Oil Free</span>
            </div>
          </div>

        </div>
      </div>

      {/* Ultra-Minimal Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 text-[10px] font-mono text-slate-400 uppercase tracking-widest gap-4">
        <span>REVAÔM LABORATOIRES • PARIS</span>
        <span>ActivIQ™ Biomimetic Cellular Intelligence</span>
        <span>© 2026 ALL RIGHTS RESERVED</span>
      </footer>
    </section>
  );
}
