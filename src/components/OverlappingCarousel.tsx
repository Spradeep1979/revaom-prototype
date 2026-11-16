"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Check, ChevronLeft, ChevronRight, Zap, Dna, Sparkles, Box, Award, MoveHorizontal } from "lucide-react";

interface OverlappingCarouselProps {
  onAddToCart: () => void;
}

interface MinimalCard {
  id: number;
  badge: string;
  title: string;
  sub: string;
  image: string;
  imageType: "bottle" | "box" | "macro" | "duo";
  stat?: string;
  statLabel?: string;
  price?: string;
}

const cardsData: MinimalCard[] = [
  {
    id: 0,
    badge: "FLAGSHIP",
    title: "RESET Clarifying Serum",
    sub: "Deep Burgundy Flint Glass",
    image: "/images/reset-bottle-cutout.jpg",
    imageType: "bottle",
    price: "$78.00",
  },
  {
    id: 1,
    badge: "CASING",
    title: "Artisan Box",
    sub: "UV-Shield Curved Housing",
    image: "/images/reset-box-cutout.jpg",
    imageType: "box",
    price: "Included",
  },
  {
    id: 2,
    badge: "BIO-ACTIVE",
    title: "ActivIQ™ Nanosomes",
    sub: "Sub-Micron Phospholipid Fusion",
    image: "/images/arch-label.jpg",
    imageType: "macro",
    stat: "98.4%",
    statLabel: "Membrane Uptake",
  },
  {
    id: 3,
    badge: "SCAFFOLDING",
    title: "Advanced Bio-Peptides",
    sub: "Hexapeptide-8 Synthesis",
    image: "/images/arch-dropper.jpg",
    imageType: "macro",
    stat: "+38%",
    statLabel: "Dermal Density",
  },
  {
    id: 4,
    badge: "SYNTHESIS",
    title: "The RESET Ritual",
    sub: "Complete Day & Night Architecture",
    image: "/images/reset-hero.jpg",
    imageType: "duo",
    price: "$78.00",
  },
];

export default function OverlappingCarousel({ onAddToCart }: OverlappingCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [added, setAdded] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    setDragOffset(delta);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60 && activeIndex < cardsData.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (dragOffset > 60 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
    setDragOffset(0);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - dragStartX;
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -50 && activeIndex < cardsData.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (dragOffset > 50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
    setDragOffset(0);
  };

  const handleAdd = () => {
    setAdded(true);
    onAddToCart();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section
      id="showcase-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-36 sm:py-48 overflow-hidden select-none bg-[#0f0206]"
    >
      {/* Background Navy Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,40,82,0.4)_0%,rgba(5,11,22,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        
        {/* Minimalist Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#eee4d8]/60 uppercase block mb-2">
            THE SPECTRUM
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
            RESET in Dimension.
          </h2>
          <p className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#eee4d8]/80 animate-pulse" />
            <span>Drag horizontally to explore</span>
          </p>
        </div>

        {/* 3D OVERLAPPING DRAG STAGE (Cards made larger, text simplified) */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="perspective-1500 relative w-full h-[540px] sm:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing my-4"
        >
          {cardsData.map((card, i) => {
            const offset = i - activeIndex;
            const isCenter = offset === 0;

            const dragInfluence = isDragging ? dragOffset * 0.15 : 0;
            const translateX = offset * 180 + dragInfluence;
            const translateZ = -Math.abs(offset) * 95;
            const rotateY = offset * -15;
            const scale = isCenter ? 1.05 : Math.max(0.82, 1 - Math.abs(offset) * 0.08);
            const zIndex = 50 - Math.abs(offset) * 10;
            const opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.22);

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (Math.abs(dragOffset) < 10) setActiveIndex(i);
                }}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: isDragging
                    ? "none"
                    : "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
                }}
                className={`absolute w-[320px] sm:w-[380px] lg:w-[410px] h-[480px] sm:h-[540px] rounded-3xl p-8 border transition-colors select-none will-change-transform flex flex-col justify-between ${
                  isCenter
                    ? "border-[#eee4d8]/30/50 shadow-[0_30px_70px_rgba(2,6,18,0.95),0_0_35px_rgba(56,189,248,0.25)] bg-gradient-to-b from-[#0f2444] via-[#09172c] to-[#050c18]"
                    : "border-[#eee4d8]/15 shadow-xl bg-[#1a0409]/80 hover:border-[#eee4d8]/30"
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[10px] font-mono tracking-widest text-[#eee4d8]/60 uppercase">
                    {card.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    0{card.id + 1}
                  </span>
                </div>

                {/* Card Visual Canvas */}
                <div className="relative h-56 sm:h-64 my-auto flex items-center justify-center">
                  <div className="absolute bottom-2 w-40 h-6 bg-black/70 rounded-full blur-md" />
                  
                  {card.imageType === "bottle" && (
                    <div className="relative w-32 sm:w-36 h-52 sm:h-60">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-contain filter drop-shadow-[0_20px_35px_rgba(2,6,18,0.95)]"
                      />
                    </div>
                  )}

                  {card.imageType === "box" && (
                    <div className="relative w-36 sm:w-40 h-52 sm:h-60">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-contain filter drop-shadow-[0_20px_35px_rgba(2,6,18,0.95)]"
                      />
                    </div>
                  )}

                  {card.imageType === "macro" && (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      {card.stat && (
                        <div className="absolute bottom-4 left-5">
                          <span className="font-cinzel text-4xl font-bold text-[#eee4d8]/80 block">
                            {card.stat}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 tracking-wider">
                            {card.statLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {card.imageType === "duo" && (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <span className="font-cinzel text-2xl font-bold text-white block">
                          REVAÔM RESET
                        </span>
                        <span className="text-[10px] font-mono text-[#eee4d8]/60 tracking-wider">
                          Full Architecture
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Info & Acquisition */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      {card.sub}
                    </p>
                  </div>

                  {card.price && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd();
                      }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs tracking-wider uppercase transition-all shadow-md ${
                        added
                          ? "bg-[#2a5c40] text-white"
                          : "bg-white hover:bg-slate-100 text-[#1a0409] font-bold shadow-white/20"
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Acquire</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Minimalist Carousel Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {cardsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx
                    ? "w-8 h-1 bg-[#eee4d8]/60"
                    : "w-1.5 h-1 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setActiveIndex((prev) => Math.min(cardsData.length - 1, prev + 1))
            }
            disabled={activeIndex === cardsData.length - 1}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
