"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BOTTLE_READY_EVENT, bottleScrollState } from "./bottleScrollState";
import { MOTION, prefersReducedMotion } from "@/lib/motion";
import { formatPrice, heroShop } from "@/data/shop";
import { Check } from "lucide-react";

interface HeroSectionProps {
  onExplore?: () => void;
  onShop?: () => void;
}

const HEADING = "RESET";

export default function HeroSection({ onExplore, onShop }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);

  /**
   * Entrance — one timeline (~1.6 s), started only once the GLB + label texture
   * have loaded: nav fades down, RESET reveals letter by letter, the bottle rises
   * with a short fade and a half-turn, then the scroll hint starts a slow pulse.
   */
  useGSAP(
    () => {
      const I = MOTION.intro;
      const reduced = prefersReducedMotion();
      // Nav + canvas live outside this component, so look them up as elements
      // (string selectors are scoped to the hero by useGSAP).
      const canvasEl = () => document.querySelector<HTMLElement>("#bottle-canvas-wrapper .bottle-canvas");
      const navEl = () => document.querySelector<HTMLElement>("header");

      // Hidden start state (applied before first paint)
      gsap.set(navEl(), { opacity: 0, y: reduced ? 0 : I.nav.y });
      gsap.set(".hero-letter", { yPercent: reduced ? 0 : I.letters.yPercent, opacity: reduced ? 0 : 1 });
      gsap.set(".hero-eyebrow, .hero-subline", { opacity: 0, y: reduced ? 0 : I.sub.y });
      gsap.set(".hero-hint", { opacity: 0 });
      gsap.set(".hero-shop-item", { opacity: 0, y: reduced ? 0 : MOTION.shopIntro.y });
      gsap.set(canvasEl(), { opacity: 0 });
      bottleScrollState.intro = reduced ? 1 : 0;

      // Built when the assets are ready, so every target is looked up fresh
      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } });
        tl.to(navEl(), { opacity: 1, y: 0, duration: I.nav.duration }, I.at.nav)
          .to(
            ".hero-letter",
            reduced
              ? { opacity: 1, duration: 0.4 }
              : { yPercent: 0, duration: I.letters.duration, stagger: I.letters.stagger },
            I.at.letters
          )
          .to(".hero-eyebrow, .hero-subline", { opacity: 1, y: 0, duration: I.sub.duration, stagger: 0.08 }, I.at.sub)
          .to(canvasEl(), { opacity: 1, duration: 0.45, ease: MOTION.ease.soft }, I.at.bottle)
          .to(".hero-hint", { opacity: 1, duration: I.hint.duration }, I.at.hint)
          // shop controls are the last items of the entrance
          .to(
            ".hero-shop-item",
            { opacity: 1, y: 0, duration: MOTION.shopIntro.duration, stagger: MOTION.shopIntro.stagger },
            MOTION.shopIntro.at
          );
        if (!reduced) {
          tl.to(bottleScrollState, { intro: 1, duration: I.bottle.duration, ease: MOTION.ease.out }, I.at.bottle);
          // slow pulse on the scroll hint once the entrance is done
          tl.add(() => {
            gsap.to(".hero-hint-line", {
              scaleY: 0.45,
              opacity: 0.35,
              transformOrigin: "top center",
              duration: I.hint.pulse / 2,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });
        }
      };

      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        play();
      };
      if (bottleScrollState.ready) start();
      window.addEventListener(BOTTLE_READY_EVENT, start);
      const failSafe = window.setTimeout(start, I.failSafeMs);
      return () => {
        window.removeEventListener(BOTTLE_READY_EVENT, start);
        window.clearTimeout(failSafe);
      };
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col justify-between items-center pt-28 sm:pt-32 pb-8 sm:pb-10 px-4 pointer-events-none select-none z-20"
    >
      {/* Giant Watermark BEHIND Bottle */}
      <div className="hero-watermark absolute inset-0 flex items-center justify-center text-center pointer-events-none select-none -z-10">
        <span className="font-cinzel text-[22vw] font-black text-[#eee4d8]/[0.028] tracking-[0.14em] block whitespace-nowrap leading-none">
          REVAÔM
        </span>
      </div>

      {/* Top Brand Sub-Header */}
      <div className="hero-text-overlay flex flex-col items-center text-center pointer-events-none">
        <span className="hero-eyebrow text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#eee4d8]/60 uppercase">
          ACTIVIQ™ CLARIFYING CONCENTRATE
        </span>
        <h1
          className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-[#eee4d8] font-light tracking-[0.2em] mt-1.5 uppercase"
          aria-label={HEADING}
        >
          {HEADING.split("").map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
              <span className="hero-letter inline-block will-change-transform">{ch}</span>
            </span>
          ))}
        </h1>
        <p className="hero-subline font-cormorant italic text-lg sm:text-xl text-[#eee4d8]/75 font-light -mt-0.5">
          Clarifying Serum for Acne-Prone Skin
        </p>
      </div>

      {/* Bottom block: shop controls + scroll prompt */}
      <div className="hero-text-overlay flex flex-col items-center gap-5 sm:gap-6">
        <div className="flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-4 sm:gap-5">
            <p className="hero-shop-item flex items-baseline gap-2">
              <span className="font-cinzel text-2xl sm:text-3xl text-[#eee4d8] tracking-wider">{formatPrice(heroShop.price)}</span>
              {heroShop.compareAt && (
                <s className="font-cinzel text-sm text-[#eee4d8]/40">{formatPrice(heroShop.compareAt)}</s>
              )}
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#eee4d8]/50 uppercase">{heroShop.size}</span>
            </p>
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                onShop?.();
              }}
              className="hero-shop-item inline-flex items-center rounded-full bg-[#eee4d8] text-[#1a0409] px-6 sm:px-7 py-2.5 sm:py-3 text-[10px] font-mono font-semibold tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-white"
            >
              {heroShop.ctaLabel}
            </a>
          </div>
          <ul className="hero-shop-item flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9px] font-mono tracking-[0.2em] text-[#eee4d8]/55 uppercase">
            {heroShop.trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#c9506b]" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="hero-hint flex flex-col items-center gap-2 pointer-events-auto cursor-pointer group"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#eee4d8]/40 group-hover:text-[#eee4d8]/80 transition-colors uppercase">
            Scroll to explore
          </span>
          <span className="hero-hint-line block w-[1px] h-6 bg-gradient-to-b from-[#eee4d8]/50 to-transparent group-hover:h-9 transition-all" />
        </button>
      </div>
    </section>
  );
}
