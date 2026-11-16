"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FormulaSection from "@/components/FormulaSection";
import ArchwaySection from "@/components/ArchwaySection";
import OverlappingCarousel from "@/components/OverlappingCarousel";
import RitualSection from "@/components/RitualSection";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const bottle = document.getElementById("scrub-poise-bottle");
      const hero = document.getElementById("hero-section");
      const formula = document.getElementById("formula-section");

      if (!bottle || !hero || !formula) return;

      const getTargetDelta = () => {
        const bottle = document.getElementById("scrub-poise-bottle");
        const target = document.getElementById("bottle-landing-zone");
        if (!bottle || !target) return { x: -window.innerWidth * 0.24 };

        const bRect = bottle.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();

        return {
          x: (tRect.left + tRect.width / 2) - (bRect.left + bRect.width / 2),
        };
      };

      // 1. PIN BOTTLE continuously while viewing Hero and Section 2
      ScrollTrigger.create({
        trigger: hero,
        endTrigger: formula,
        start: "top top",
        end: "90% top",
        pin: bottle,
        pinSpacing: false,
        anticipatePin: 1,
      });

      // 2. SCRUB TIMELINE: Bottle translates smoothly into Section 2 Left Column as user scrolls
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Smooth Apple-style weighted scrub
          invalidateOnRefresh: true,
        },
      });

      // Fade out hero watermark & text
      tl.to(
        ".hero-fade",
        {
          opacity: 0,
          y: -50,
          ease: "power1.out",
          duration: 0.35,
        },
        0
      );

      // Move bottle from center to Left Column of 50/50 grid
      tl.to(
        bottle,
        {
          x: () => getTargetDelta().x,
          scale: () => (window.innerWidth < 640 ? 0.75 : window.innerWidth < 1024 ? 0.82 : 0.88),
          ease: "power2.inOut",
          duration: 1,
        },
        0
      );

      // 3. Section 2 right column typography reveals as Section 2 enters
      gsap.from(".formula-reveal-content", {
        opacity: 0,
        y: 60,
        ease: "power2.out",
        scrollTrigger: {
          trigger: formula,
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
        },
      });

      // 4. Smooth Exit from Section 2: Bottle scrolls naturally up and fades out before Archway section enters
      gsap.to(bottle, {
        y: -180,
        opacity: 0,
        ease: "power1.in",
        scrollTrigger: {
          trigger: formula,
          start: "50% top",
          end: "85% top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const handleScrollToRitual = () => {
    const el = document.getElementById("ritual-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToFormula = () => {
    const el = document.getElementById("formula-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative bg-[#040812] text-[#f1f5f9] min-h-screen flex flex-col overflow-x-hidden">
      {/* 1. Ultra-Minimalist Floating Header */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onAcquire={handleScrollToRitual}
      />

      {/* 2. SECTION 01: Hero Section (Oversized centered bottle & giant REVAÔM) */}
      <HeroSection onExplore={handleScrollToFormula} />

      {/* 3. SECTION 02: Formula Section (50/50 Grid with Bottle Landing Zone) */}
      <FormulaSection onAddToCart={handleAddToCart} />

      {/* 4. SECTION 03: Archway Scroll Masks (Four expanding portals) */}
      <ArchwaySection />

      {/* 5. SECTION 04: 3D Overlapping Drag Carousel (Large cards, spacious negative space) */}
      <OverlappingCarousel onAddToCart={handleAddToCart} />

      {/* 6. SECTION 05: Final Ritual & Minimalist Acquisition */}
      <RitualSection
        onAddToCart={handleAddToCart}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        count={cartCount}
        setCount={setCartCount}
      />
    </main>
  );
}
