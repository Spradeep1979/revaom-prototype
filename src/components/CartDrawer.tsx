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

  const pricePerUnit = 78;
  const subtotal = count * pricePerUnit;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#120207] border-l border-[#eee4d8]/20 shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-6 border-b border-[#eee4d8]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#eee4d8]" />
            <h3 className="font-cinzel text-lg font-light text-[#eee4d8] tracking-widest uppercase">
              Ritual Bag ({count})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2a040d]/60 hover:bg-[#3a0716] flex items-center justify-center text-[#eee4d8]/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {count > 0 ? (
            <div className="space-y-4">
              {/* Product Row */}
              <div className="p-4 rounded-2xl bg-[#1e040c]/70 border border-[#eee4d8]/15 flex gap-4">
                <div className="relative w-20 h-24 rounded-xl bg-[#0f0206] flex-shrink-0 flex items-center justify-center p-2 border border-[#eee4d8]/10">
                  <Image
                    src="/images/reset-bottle-cutout.jpg"
                    alt="REVAÔM RESET Bottle"
                    fill
                    className="object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#eee4d8]/60 uppercase">
                      ActivIQ™ Clarifying Concentrate
                    </span>
                    <h4 className="font-cinzel text-sm font-semibold text-[#eee4d8] tracking-wide mt-0.5">
                      RESET Clarifying Serum (20g)
                    </h4>
                    <p className="text-xs text-[#eee4d8]/60 font-light mt-0.5">
                      Salicylic Acid + Clarifying Peptides
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#eee4d8]/10">
                    <div className="flex items-center gap-2 bg-[#0f0206] px-2 py-1 rounded-full border border-[#eee4d8]/20">
                      <button
                        onClick={() => setCount(Math.max(1, count - 1))}
                        className="text-[#eee4d8]/70 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium text-white px-1">
                        {count}
                      </span>
                      <button
                        onClick={() => setCount(count + 1)}
                        className="text-[#eee4d8]/70 hover:text-white"
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
              <div className="p-3.5 rounded-2xl bg-[#3a0716]/40 border border-[#eee4d8]/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#eee4d8]/10 flex items-center justify-center text-[#eee4d8] flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[#eee4d8] font-medium block">
                    Complimentary Precision Crystal Applicator
                  </span>
                  <span className="text-[#eee4d8]/60 text-[11px]">
                    Included with every REVAÔM RESET reservation.
                  </span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#eee4d8]/70 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#eee4d8]" />
                <span>30-Day Dermal Clarifying Guarantee</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#eee4d8]/70">
              <ShoppingBag className="w-12 h-12 stroke-[1] mb-3 text-[#eee4d8]/30" />
              <p className="font-cinzel text-base text-white">Your Bag is Empty</p>
              <p className="text-xs mt-1">Add RESET to initiate your clarifying ritual.</p>
              <button
                onClick={() => setCount(1)}
                className="mt-4 px-4 py-2 rounded-full bg-white text-slate-950 text-xs font-semibold"
              >
                Add 1x RESET ($78)
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {count > 0 && (
          <div className="p-6 border-t border-[#eee4d8]/15 bg-[#0a0104] space-y-4">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-[#eee4d8]/70 font-mono">Subtotal</span>
              <span className="font-mono text-xl font-bold text-white">
                ${subtotal}.00 USD
              </span>
            </div>

            <p className="text-[11px] text-[#eee4d8]/60 font-mono">
              Taxes calculated at checkout • Carbon-neutral courier dispatch
            </p>

            <button
              onClick={() => {
                alert("Thank you for experiencing REVAÔM RESET! Reservation flow initialized.");
              }}
              className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-[#0f0206] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(238,228,216,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
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
