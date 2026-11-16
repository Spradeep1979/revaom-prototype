"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOTION, prefersReducedMotion } from "@/lib/motion";
import { measureHeroBand } from "@/lib/heroLayout";
import { BOTTLE_READY_EVENT, bottleScrollState } from "./bottleScrollState";

/* ------------------------------------------------------------------ */
/*  Inline botanical shapes (ingredient cues: leaf, sprig, petal,      */
/*  willow seed, zinc crystal). Burgundy / cream tints.                */
/* ------------------------------------------------------------------ */
type Shape = "leaf" | "sprig" | "petal" | "seed" | "crystal";

function Botanical({ shape, color }: { shape: Shape; color: string }) {
  switch (shape) {
    case "leaf":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          <path d="M50 4 C82 22 88 62 50 96 C12 62 18 22 50 4 Z" fill={color} />
          <path d="M50 12 L50 90" stroke="rgba(15,2,6,0.35)" strokeWidth="2" fill="none" />
        </svg>
      );
    case "sprig":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          <path d="M50 96 C48 70 52 40 50 8" stroke={color} strokeWidth="3" fill="none" />
          <ellipse cx="36" cy="38" rx="12" ry="7" transform="rotate(-35 36 38)" fill={color} />
          <ellipse cx="64" cy="52" rx="12" ry="7" transform="rotate(35 64 52)" fill={color} />
          <ellipse cx="38" cy="66" rx="11" ry="6" transform="rotate(-30 38 66)" fill={color} />
          <ellipse cx="50" cy="14" rx="7" ry="10" fill={color} />
        </svg>
      );
    case "petal":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="50" cy="28" rx="13" ry="22" transform={`rotate(${r} 50 50)`} fill={color} />
          ))}
          <circle cx="50" cy="50" r="9" fill="rgba(238,228,216,0.45)" />
        </svg>
      );
    case "seed":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          <path d="M50 6 C70 30 74 64 50 94 C26 64 30 30 50 6 Z" fill={color} />
          <path d="M50 94 C56 76 66 66 84 60" stroke={color} strokeWidth="2.5" fill="none" />
        </svg>
      );
    case "crystal":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
          <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill={color} />
          <polygon points="50,6 88,28 50,50 12,28" fill="rgba(238,228,216,0.18)" />
        </svg>
      );
  }
}

/** x / y: offset from the bottle centre in vw / vh. depth: 0 (far) → 1 (near). */
const BOTANICALS: { shape: Shape; x: number; y: number; size: number; depth: number; rot: number; color: string }[] = [
  { shape: "leaf", x: -30, y: -16, size: 92, depth: 0.45, rot: -24, color: "rgba(140,27,53,0.85)" },
  { shape: "sprig", x: 28, y: -22, size: 78, depth: 0.7, rot: 18, color: "rgba(185,140,120,0.7)" },
  { shape: "petal", x: -24, y: 20, size: 104, depth: 0.95, rot: 12, color: "rgba(120,24,46,0.8)" },
  { shape: "seed", x: 33, y: 15, size: 62, depth: 0.5, rot: -32, color: "rgba(214,170,140,0.55)" },
  { shape: "crystal", x: -42, y: 3, size: 48, depth: 0.3, rot: 8, color: "rgba(238,228,216,0.35)" },
  { shape: "leaf", x: 42, y: -4, size: 84, depth: 0.85, rot: 140, color: "rgba(98,16,36,0.85)" },
  { shape: "seed", x: -12, y: -30, size: 42, depth: 0.35, rot: 58, color: "rgba(214,170,140,0.5)" },
  { shape: "sprig", x: 17, y: 29, size: 66, depth: 0.8, rot: -120, color: "rgba(140,27,53,0.75)" },
];

/** Depth-of-field: pieces far from the focal plane (depth ≈ 0.55) blur more. */
const blurFor = (depth: number) => Math.round(1.5 + Math.abs(depth - 0.55) * 14);
const scaleFor = (depth: number) => 0.6 + depth * 0.6;

export default function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [small, setSmall] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const update = () => {
      setSmall(window.innerWidth < MOTION.smallScreen);
      setReduced(prefersReducedMotion());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const H = MOTION.hero;
  const ringCount = small ? H.rings.countMobile : H.rings.count;
  const botanicals = BOTANICALS.slice(0, small ? H.botanicals.countMobile : H.botanicals.count);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const root = rootRef.current;
      if (!root) return;

      // Centre everything on the bottle's band in the hero
      const centre = () => {
        const { offsetPx } = measureHeroBand();
        root.style.setProperty("--hero-cy", `calc(50% + ${offsetPx}px)`);
      };
      centre();
      document.fonts?.ready.then(centre);
      window.addEventListener("resize", centre);

      // useGSAP scopes selector strings to this component, so the hero (outside it) is passed as an element
      const hero = document.getElementById("hero-section");

      // The backdrop scrolls away with the hero (it lives in a fixed layer)
      const group = root.querySelector(".hero-backdrop-scroll");
      gsap.to(group, {
        yPercent: -100, // the layer is one viewport tall, so this matches the hero scrolling away
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });

      // Outline word cross-fades out as the scroll begins
      gsap.to(root.querySelector(".hero-outline-word"), {
        opacity: 0,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: H.outlineWord.fadeEnd, scrub: true },
      });

      // Botanicals sharpen from blur once the bottle is ready, then drift
      const items = gsap.utils.toArray<HTMLElement>(".hero-botanical", root);
      gsap.set(items, { opacity: 0, filter: `blur(${H.botanicals.sharpen.fromBlur}px)` });
      gsap.set(".hero-outline-word", { opacity: 0 });
      const intro = () => {
        gsap.to(".hero-outline-word", { opacity: 1, duration: 1, ease: MOTION.ease.soft, delay: 0.2 });
        items.forEach((el, i) => {
          const depth = Number(el.dataset.depth);
          gsap.to(el, {
            opacity: Number(el.dataset.opacity),
            filter: `blur(${blurFor(depth)}px)`,
            duration: H.botanicals.sharpen.duration,
            delay: 0.25 + i * H.botanicals.sharpen.stagger,
            ease: MOTION.ease.out,
          });
          if (reduced) return;
          const inner = el.querySelector(".hero-botanical-inner");
          const D = H.botanicals.drift;
          gsap.to(inner, {
            x: gsap.utils.random(-D.x, D.x),
            y: gsap.utils.random(-D.y, D.y),
            rotation: gsap.utils.random(-D.rotate, D.rotate),
            duration: gsap.utils.random(D.durationMin, D.durationMax),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: Math.random(),
          });
        });
      };
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        intro();
      };
      if (bottleScrollState.ready) start();
      window.addEventListener(BOTTLE_READY_EVENT, start);
      const failSafe = window.setTimeout(start, MOTION.intro.failSafeMs);

      // Cursor: parallax on botanicals (scaled by depth) + warm light that follows with lerp
      const glow = root.querySelector<HTMLElement>(".hero-cursor-light");
      const glowX = glow ? gsap.quickTo(glow, "x", { duration: H.cursorLight.follow, ease: "power3.out" }) : null;
      const glowY = glow ? gsap.quickTo(glow, "y", { duration: H.cursorLight.follow, ease: "power3.out" }) : null;
      const movers = items.map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: H.botanicals.parallaxDuration, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: H.botanicals.parallaxDuration, ease: "power3.out" }),
      }));
      let glowShown = false;
      const onMove = (e: PointerEvent) => {
        if (glow && glowX && glowY) {
          if (!glowShown) {
            glowShown = true;
            gsap.set(glow, { x: e.clientX, y: e.clientY });
            gsap.to(glow, { opacity: 1, duration: 0.6 });
          }
          glowX(e.clientX);
          glowY(e.clientY);
        }
        if (reduced) return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        movers.forEach((m) => {
          m.x(-nx * H.botanicals.parallax * m.depth);
          m.y(-ny * H.botanicals.parallax * m.depth);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      return () => {
        window.removeEventListener("resize", centre);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener(BOTTLE_READY_EVENT, start);
        window.clearTimeout(failSafe);
      };
    },
    { scope: rootRef, dependencies: [small, reduced], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Warm cursor light (fixed to the pointer, fades with the canvas layer) */}
      <div
        className="hero-cursor-light absolute top-0 left-0 rounded-full opacity-0 mix-blend-screen will-change-transform"
        style={{
          width: H.cursorLight.size,
          height: H.cursorLight.size,
          marginLeft: -H.cursorLight.size / 2,
          marginTop: -H.cursorLight.size / 2,
          background: "radial-gradient(circle, rgba(255,176,128,0.13) 0%, rgba(160,48,58,0.07) 38%, rgba(15,2,6,0) 70%)",
        }}
      />

      <div className="hero-backdrop-scroll absolute inset-0 will-change-transform">
        {/* Large faint outline word behind the bottle */}
        <div
          className="hero-outline-word absolute left-1/2 -translate-x-1/2 -translate-y-1/2 font-cinzel font-black leading-none whitespace-nowrap select-none text-[38vw] sm:text-[30vw] tracking-[0.06em]"
          style={{ top: "var(--hero-cy, 50%)", color: "transparent", WebkitTextStroke: "1px rgba(238,228,216,0.09)" }}
        >
          RESET
        </div>

        {/* Pulsing concentric rings */}
        {Array.from({ length: ringCount }).map((_, i) => (
          <div
            key={i}
            className="hero-ring absolute left-1/2 rounded-full border border-[#8c1b35]/70 motion-reduce:animate-none motion-reduce:opacity-20"
            style={{
              top: "var(--hero-cy, 50%)",
              width: "min(46vh, 70vw)",
              height: "min(46vh, 70vw)",
              ["--ring-max" as string]: H.rings.maxScale,
              ["--ring-opacity" as string]: H.rings.opacity,
              animation: `revaom-ring ${H.rings.duration}s cubic-bezier(0.215,0.61,0.355,1) infinite`,
              animationDelay: `${(-i * H.rings.duration) / ringCount}s`,
            }}
          />
        ))}

        {/* Floating botanicals at different depths */}
        {botanicals.map((b, i) => (
          <div
            key={i}
            className="hero-botanical absolute will-change-transform"
            data-depth={b.depth}
            data-opacity={0.35 + b.depth * 0.35}
            style={{
              left: `calc(50% + ${b.x}vw)`,
              top: `calc(var(--hero-cy, 50%) + ${b.y}vh)`,
              width: b.size * scaleFor(b.depth),
              height: b.size * scaleFor(b.depth),
              marginLeft: (-b.size * scaleFor(b.depth)) / 2,
              marginTop: (-b.size * scaleFor(b.depth)) / 2,
            }}
          >
            <div className="hero-botanical-inner w-full h-full" style={{ transform: `rotate(${b.rot}deg)` }}>
              <Botanical shape={b.shape} color={b.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
