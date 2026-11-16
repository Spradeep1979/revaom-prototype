"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Plus, Check, Zap, Sparkles, Dna } from "lucide-react";

interface ProductTiltCardProps {
  onAddToCart: () => void;
  onOpenDetails?: () => void;
}

export default function ProductTiltCard({
  onAddToCart,
  onOpenDetails,
}: ProductTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState<"bottle" | "box" | "duo">("bottle");

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    const bottle = bottleRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 3D tilt angles (-16 to +16 deg)
      const rotateX = ((y - centerY) / centerY) * -16;
      const rotateY = ((x - centerX) / centerX) * 16;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1200,
        ease: "power2.out",
        duration: 0.45,
      });

      // Subtle parallax on the product asset inside the card
      if (bottle) {
        gsap.to(bottle, {
          x: ((x - centerX) / centerX) * 12,
          y: ((y - centerY) / centerY) * 12,
          z: 30,
          duration: 0.45,
          ease: "power2.out",
        });
      }

      // Specular shine overlay in sapphire tone
      if (glare) {
        glare.style.opacity = "1";
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.3) 0%, rgba(56, 189, 248, 0.15) 35%, transparent 75%)`;
      }
    };

    const handleMouseEnter = () => {
      isHovered = true;
      gsap.to(card, {
        scale: 1.02,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.7)",
      });

      if (bottle) {
        gsap.to(bottle, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.7)",
        });
      }

      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    const targetEl = container;
    targetEl.addEventListener("mousemove", handleMouseMove);
    targetEl.addEventListener("mouseenter", handleMouseEnter);
    targetEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      targetEl.removeEventListener("mousemove", handleMouseMove);
      targetEl.removeEventListener("mouseenter", handleMouseEnter);
      targetEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleAdd = () => {
    setAdded(true);
    onAddToCart();
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      ref={containerRef}
      className="perspective-1200 cursor-pointer select-none py-2"
    >
      <div
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-[320px] sm:w-[360px] lg:w-[380px] rounded-3xl p-5 sm:p-6 luxury-card-navy border border-blue-400/25 shadow-[0_25px_65px_rgba(2,6,18,0.85)] will-change-transform overflow-hidden"
      >
        {/* Specular Glare Overlay */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 z-30"
          style={{ opacity: 0 }}
        />

        {/* Ambient Top Sapphire Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/[0.1] rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-blue-200 uppercase">
              POISE BIO-SYSTEM
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-400/20 text-[9px] font-mono text-blue-200">
            30 ML / 1.0 FL. OZ.
          </span>
        </div>

        {/* Visual View Switcher (Bottle / Box / Duo) */}
        <div className="flex justify-center mt-2.5 relative z-20">
          <div className="inline-flex p-0.5 rounded-full bg-blue-950/80 border border-blue-400/20 text-[9px] font-mono">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMode("bottle");
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                viewMode === "bottle"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-blue-200/70 hover:text-white"
              }`}
            >
              Bottle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMode("box");
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                viewMode === "box"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-blue-200/70 hover:text-white"
              }`}
            >
              Box
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMode("duo");
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                viewMode === "duo"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-blue-200/70 hover:text-white"
              }`}
            >
              Full Set
            </button>
          </div>
        </div>

        {/* Card Interactive Image Canvas with 3D Pop-Out */}
        <div className="relative h-44 sm:h-48 my-2 flex items-center justify-center">
          <div className="absolute bottom-1 w-36 h-6 bg-[#030712]/80 rounded-full blur-md" />
          
          <div
            ref={bottleRef}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            {viewMode === "bottle" && (
              <div className="relative w-28 sm:w-32 h-40 sm:h-46 animate-fadeIn">
                <Image
                  src="/images/poise-bottle-cutout.png"
                  alt="REVAÔM POISE Serum Dropper Bottle"
                  fill
                  className="object-contain filter drop-shadow-[0_15px_25px_rgba(2,6,18,0.9)]"
                />
              </div>
            )}

            {viewMode === "box" && (
              <div className="relative w-28 sm:w-32 h-40 sm:h-46 animate-fadeIn">
                <Image
                  src="/images/poise-box-cutout.png"
                  alt="REVAÔM POISE Packaging Box"
                  fill
                  className="object-contain filter drop-shadow-[0_15px_25px_rgba(2,6,18,0.9)]"
                />
              </div>
            )}

            {viewMode === "duo" && (
              <div className="relative w-44 sm:w-48 h-40 sm:h-46 animate-fadeIn">
                <Image
                  src="/images/poise-hero.jpg"
                  alt="REVAÔM POISE Duo - Bottle and Box"
                  fill
                  className="object-contain rounded-xl filter drop-shadow-[0_15px_25px_rgba(2,6,18,0.9)]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Product Title and Brand */}
        <div className="relative z-10 pt-2 border-t border-blue-400/15">
          <div className="flex items-baseline justify-between">
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
              POISE Serum
            </h3>
            <span className="font-mono text-sm font-semibold text-white">
              $94.00
            </span>
          </div>

          <p className="font-cormorant italic text-xs sm:text-sm text-blue-200">
            Anti-Aging Serum with ActivIQ™
          </p>

          <p className="text-[11px] text-blue-100/70 font-light mt-1.5 leading-relaxed line-clamp-2">
            Bio-engineered peptides and botanical biomimetics restore structural dermal scaffolding, erasing micro-wrinkles and firming contours.
          </p>
        </div>

        {/* Key Actives Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5 relative z-10">
          <span className="px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-400/20 text-[9px] font-mono text-blue-200 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-cyan-300" /> ActivIQ™ Carrier
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-400/20 text-[9px] font-mono text-blue-200 flex items-center gap-1">
            <Dna className="w-2.5 h-2.5 text-cyan-300" /> Bio-Peptides
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-400/20 text-[9px] font-mono text-blue-200 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-300" /> Botanical Biomimetics
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-blue-400/15 flex items-center justify-between gap-2.5 relative z-10">
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-4 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
              added
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.7)]"
                : "bg-white hover:bg-blue-50 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added To Ritual</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add To Ritual • $94</span>
              </>
            )}
          </button>

          {onOpenDetails && (
            <button
              onClick={onOpenDetails}
              className="py-2.5 px-3 rounded-full bg-blue-950/50 hover:bg-blue-900/50 border border-blue-400/20 text-blue-200 hover:text-white text-[10px] font-mono tracking-wider transition-colors"
            >
              Specs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
