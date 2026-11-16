"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Portal {
  id: string;
  num: string;
  title: string;
  sub: string;
  image: string;
}

const portals: Portal[] = [
  {
    id: "reset-box",
    num: "01",
    title: "The Artisan Box",
    sub: "Deep Burgundy Precision Housing",
    image: "/images/portal-reset-box.jpg",
  },
  {
    id: "reset-logo",
    num: "02",
    title: "The REVAÔM Sigil",
    sub: "Embossed Luxury Insignia",
    image: "/images/portal-reset-logo.jpg",
  },
  {
    id: "reset-chemistry",
    num: "03",
    title: "The Chemistry",
    sub: "Targeted Clarifying Formulation",
    image: "/images/portal-reset-chemistry.jpg",
  },
  {
    id: "reset-ingredients",
    num: "04",
    title: "The Actives",
    sub: "Clinical-Grade Ingredient Dossier",
    image: "/images/portal-reset-ingredients.jpg",
  },
];

export default function ArchwaySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Subtle GSAP scale parallax effect on the images inside the locked arch frames:
      // As the user scrolls down through the section, the images slowly zoom out from 1.20 to 1.0
      // while the outer arch frames stay mathematically locked in a clean horizontal row.
      gsap.fromTo(
        ".arch-parallax-img",
        {
          scale: 1.2,
        },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Smooth weighted scrub
            invalidateOnRefresh: true,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="archway-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-36 sm:py-48 overflow-hidden select-none bg-[#0f0206]"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(58,7,22,0.35)_0%,rgba(15,2,6,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col justify-center my-auto">
        
        {/* Minimalist Section Headline */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#eee4d8]/50 uppercase block mb-2.5">
            ANATOMY OF RESET
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-[#eee4d8] tracking-wide">
            Four Portals. Pure Form.
          </h2>
          <p className="mt-2 text-xs font-mono text-[#eee4d8]/40 tracking-wider">
            The architectural breakdown of REVAÔM RESET engineering.
          </p>
        </div>

        {/* 4 ARCHWAYS: UNIFORM DIMENSIONS, EXACT 3:4 ASPECT RATIO, MATHEMATICAL ALIGNMENT */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-8 w-full max-w-6xl mx-auto items-start justify-center">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className="flex flex-col items-center group w-full"
            >
              {/* Strict Uniform CSS Container with Roman Archway Silhouette & Aspect 3/4 */}
              <div className="relative w-full aspect-[3/4] rounded-t-[140px] sm:rounded-t-[160px] rounded-b-2xl overflow-hidden border border-[#eee4d8]/12 bg-gradient-to-b from-[#3a0716]/30 via-[#1a0409]/60 to-[#0f0206] shadow-[0_25px_60px_rgba(0,0,0,0.85)] group-hover:border-[#eee4d8]/30 transition-colors duration-500">
                
                {/* Parallax Image Target: Zoom out inside locked frame */}
                <div className="arch-parallax-img absolute inset-0 w-full h-full will-change-transform">
                  <Image
                    src={portal.image}
                    alt={portal.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                </div>

                {/* Subtle Ambient Shadow & Luxury Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Subtle Roman Arch Number Badge */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-300 tracking-widest pointer-events-none">
                  {portal.num}
                </div>
              </div>

              {/* Single, Elegant, Ultra-Minimalist Label Centered Perfectly Below Each Arch */}
              <div className="mt-4 sm:mt-5 text-center">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#eee4d8]/60 group-hover:text-[#eee4d8]/90 transition-colors block">
                  {portal.title}
                </span>
                <span className="text-[9px] font-mono tracking-wider text-[#eee4d8]/30 block mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {portal.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
