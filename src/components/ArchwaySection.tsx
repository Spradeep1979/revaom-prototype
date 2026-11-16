"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Eye } from "lucide-react";

export default function ArchwaySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroArchRef = useRef<HTMLDivElement>(null);
  const archGroupRef = useRef<HTMLDivElement>(null);

  const archways = [
    {
      id: "dropper",
      num: "01",
      label: "Cryo-Pipette",
      image: "/images/arch-dropper.jpg",
    },
    {
      id: "monument",
      num: "02",
      label: "Flint Glass Flacon",
      image: "/images/arch-duo.jpg",
      isHeroCenter: true,
    },
    {
      id: "box",
      num: "03",
      label: "Artisan Box",
      image: "/images/arch-box.jpg",
    },
    {
      id: "label",
      num: "04",
      label: "ActivIQ™ Seal",
      image: "/images/arch-label.jpg",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const heroArch = heroArchRef.current;
    const archGroup = archGroupRef.current;
    if (!section || !heroArch || !archGroup) return;

    const ctx = gsap.context(() => {
      // Pin section and scrub the central arch expansion
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1, // Smooth cinematic scrub
          anticipatePin: 1,
        },
      });

      // Side arches fade and spread outward
      tl.to(".side-arch-left", {
        x: -200,
        opacity: 0.1,
        scale: 0.8,
        ease: "power1.inOut",
      }, 0);

      tl.to(".side-arch-right", {
        x: 200,
        opacity: 0.1,
        scale: 0.8,
        ease: "power1.inOut",
      }, 0);

      // Hero archway expands to reveal full image across the viewport
      tl.to(heroArch, {
        scale: 2.3,
        borderRadius: "28px",
        ease: "power2.inOut",
      }, 0);

      // Arch mask morphs from arched silhouette to full frame
      tl.to(".hero-arch-mask", {
        clipPath: "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)",
        ease: "power2.inOut",
      }, 0.2);

      // Headline fades out to immerse into the visual
      tl.to(".arch-headline", {
        opacity: 0,
        y: -40,
        ease: "none",
      }, 0);

      // Revealing overlay caption inside the expanded image
      tl.from(".arch-expanded-caption", {
        opacity: 0,
        y: 30,
        ease: "power2.out",
      }, 0.6);

    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="archway-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-36 sm:py-48 overflow-hidden select-none bg-[#040812]"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,34,72,0.4)_0%,rgba(4,8,18,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col justify-center my-auto">
        
        {/* Minimalist Section Headline */}
        <div className="arch-headline text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-mono tracking-[0.35em] text-cyan-300 uppercase block mb-2">
            THE ARCHITECTURE
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
            Four Portals. Pure Form.
          </h2>
        </div>

        {/* 4 ARCHWAYS DISPLAY GRID (Stripped of clutter, larger scale) */}
        <div
          ref={archGroupRef}
          className="relative flex items-center justify-center gap-6 sm:gap-8 lg:gap-10 w-full max-w-6xl mx-auto h-[480px] sm:h-[540px]"
        >
          {/* Arch 1 (Left Outer) */}
          <div className="side-arch-left hidden sm:flex flex-col items-center">
            <div className="luxury-arch-css relative w-40 sm:w-48 lg:w-52 h-72 sm:h-84 lg:h-92 overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={archways[0].image}
                alt={archways[0].label}
                fill
                sizes="(max-width: 768px) 180px, 240px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-3 right-3 text-center">
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 block uppercase">
                  {archways[0].num}
                </span>
                <span className="text-xs font-cinzel text-white block mt-0.5">
                  {archways[0].label}
                </span>
              </div>
            </div>
          </div>

          {/* Arch 2: THE HERO CENTRAL ARCHWAY (Expands on scrub) */}
          <div
            ref={heroArchRef}
            className="relative z-20 flex flex-col items-center will-change-transform"
          >
            <div className="hero-arch-mask luxury-arch-css relative w-64 sm:w-76 lg:w-88 h-88 sm:h-[440px] lg:h-[480px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/20 group">
              <Image
                src={archways[1].image}
                alt={archways[1].label}
                fill
                priority
                sizes="(max-width: 768px) 350px, 500px"
                className="object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Reveal Overlay on Scrub Expansion */}
              <div className="arch-expanded-caption absolute inset-x-6 bottom-10 z-20 flex flex-col items-center text-center">
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400">
                  ActivIQ™ Precision
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl text-white font-bold tracking-wider mt-1">
                  REVAÔM POISE
                </h3>
              </div>
            </div>
          </div>

          {/* Arch 3 (Right Inner) */}
          <div className="side-arch-right hidden sm:flex flex-col items-center">
            <div className="luxury-arch-css relative w-40 sm:w-48 lg:w-52 h-72 sm:h-84 lg:h-92 overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={archways[2].image}
                alt={archways[2].label}
                fill
                sizes="(max-width: 768px) 180px, 240px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-3 right-3 text-center">
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 block uppercase">
                  {archways[2].num}
                </span>
                <span className="text-xs font-cinzel text-white block mt-0.5">
                  {archways[2].label}
                </span>
              </div>
            </div>
          </div>

          {/* Arch 4 (Right Outer) */}
          <div className="side-arch-right hidden lg:flex flex-col items-center opacity-60">
            <div className="luxury-arch-css relative w-36 sm:w-44 h-64 sm:h-76 overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={archways[3].image}
                alt={archways[3].label}
                fill
                sizes="180px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-3 right-3 text-center">
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 block uppercase">
                  {archways[3].num}
                </span>
                <span className="text-xs font-cinzel text-white block mt-0.5">
                  {archways[3].label}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
