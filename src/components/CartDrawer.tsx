"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, ShieldCheck, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  setCount: (n: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  count,
  setCount,
}: CartDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pricePerUnit = 94;
  const subtotal = count * pricePerUnit;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#0a1526] border-l border-blue-400/25 shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-6 border-b border-blue-400/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h3 className="font-cinzel text-lg font-bold text-white tracking-wider">
              Ritual Bag ({count})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-blue-950/60 hover:bg-blue-900/60 flex items-center justify-center text-blue-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {count > 0 ? (
            <div className="space-y-4">
              {/* Product Row */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-400/20 flex gap-4">
                <div className="relative w-20 h-24 rounded-xl bg-[#040915] flex-shrink-0 flex items-center justify-center p-2 border border-blue-400/10">
                  <Image
                    src="/images/poise-bottle-cutout.png"
                    alt="REVAÔM POISE Bottle"
                    fill
                    className="object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase">
                      ActivIQ™ Series
                    </span>
                    <h4 className="font-cinzel text-sm font-bold text-white tracking-wide">
                      POISE Serum (30ml)
                    </h4>
                    <p className="text-xs text-blue-200/70 font-light mt-0.5">
                      Bio-Peptides + Botanical Biomimetics
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-400/10">
                    <div className="flex items-center gap-2 bg-[#040915] px-2 py-1 rounded-full border border-blue-400/20">
                      <button
                        onClick={() => setCount(Math.max(1, count - 1))}
                        className="text-blue-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium text-white px-1">
                        {count}
                      </span>
                      <button
                        onClick={() => setCount(count + 1)}
                        className="text-blue-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-semibold text-white">
                      ${subtotal}.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Complimentary Addition */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-cyan-200 font-medium block">
                    Complimentary Cryo Sculpting Spoon
                  </span>
                  <span className="text-blue-200/70 text-[11px]">
                    Included with every POISE reservation.
                  </span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-blue-200/70 pt-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>30-Day Dermal Re-Sculpting Guarantee</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-blue-200/70">
              <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-blue-400/40" />
              <p className="font-cinzel text-base text-white">Your Bag is Empty</p>
              <p className="text-xs mt-1">Add POISE to initiate your anti-aging ritual.</p>
              <button
                onClick={() => setCount(1)}
                className="mt-4 px-4 py-2 rounded-full bg-white text-slate-950 text-xs font-semibold"
              >
                Add 1x POISE ($94)
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {count > 0 && (
          <div className="p-6 border-t border-blue-400/15 bg-[#070f1c] space-y-4">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-blue-200/70 font-mono">Subtotal</span>
              <span className="font-mono text-xl font-bold text-white">
                ${subtotal}.00 USD
              </span>
            </div>

            <p className="text-[11px] text-blue-300/60 font-mono">
              Taxes calculated at checkout • Carbon-neutral courier dispatch
            </p>

            <button
              onClick={() => {
                alert("Thank you for experiencing REVAÔM POISE! Reservation flow initialized.");
              }}
              className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-blue-50 text-slate-950 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all"
            >
              <span>Proceed To Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
