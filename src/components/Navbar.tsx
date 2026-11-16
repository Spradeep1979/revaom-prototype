"use client";

import { ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onAcquire: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onAcquire,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 lg:px-20 py-6 transition-all duration-500 bg-gradient-to-b from-[#040812]/80 via-[#040812]/40 to-transparent backdrop-blur-sm pointer-events-auto">
      {/* Brand Logo */}
      <a
        href="#hero-section"
        className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.3em] text-white hover:text-blue-200 transition-colors uppercase select-none"
      >
        REVAÔM
      </a>

      {/* Right Minimal Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Minimalist Cart Trigger */}
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-full hover:bg-white/5"
        >
          <ShoppingBag className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline uppercase">Bag</span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-cyan-300 font-mono">
            {cartCount}
          </span>
        </button>

        {/* Minimalist Acquire Pill */}
        <button
          onClick={onAcquire}
          className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#040812] font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
        >
          Acquire
        </button>
      </div>
    </header>
  );
}
