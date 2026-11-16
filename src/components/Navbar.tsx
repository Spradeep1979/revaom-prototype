"use client";

import { ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onAcquire: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onAcquire }: NavbarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 sm:py-6">
      {/* Logo */}
      <span className="font-cinzel text-sm sm:text-base font-semibold tracking-[0.3em] text-[#eee4d8] uppercase select-none">
        REVAÔM
      </span>

      {/* Right Actions */}
      <div className="flex items-center gap-5 sm:gap-6">
        <button
          onClick={onAcquire}
          className="hidden sm:inline-flex text-[10px] font-mono tracking-[0.25em] text-[#eee4d8]/60 uppercase hover:text-[#eee4d8] transition-colors"
        >
          Acquire
        </button>
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-1.5 text-[#eee4d8]/70 hover:text-[#eee4d8] transition-colors"
          aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          data-cart-icon
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] font-mono text-[#eee4d8]/50">
            Bag {cartCount > 0 ? cartCount : ""}
          </span>
        </button>
      </div>
    </header>
  );
}
