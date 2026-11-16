"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bottleScrollState, type LinkGroup } from "./bottleScrollState";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

interface IngredientBadge {
  id: string;
  num: string;
  title: string;
  sub: string;
  angle: number; // Position on the radial ring, degrees (0 = right, 90 = below)
  rotate: number; // Card tilt in degrees
  link: LinkGroup; // Bottle piece(s) this card is linked to
}

// Ring angles keep the space directly above the bottle clear for the section title
const ingredients: IngredientBadge[] = [
  { id: "activiq", num: "ACTIVE 01", title: "ActivIQ™", sub: "Biomimetic Cellular Delivery", angle: 90, rotate: 0, link: "glass" },
  { id: "salicylic", num: "ACTIVE 02", title: "Salicylic Acid", sub: "2% BHA Pore Clarifier", angle: 218, rotate: -3, link: "cap" },
  { id: "peptides", num: "ACTIVE 03", title: "Clarifying Peptides", sub: "Copper Tripeptide-1 Complex", angle: -38, rotate: 3, link: "bulb" },
  { id: "zinc", num: "ACTIVE 04", title: "Zinc PCA", sub: "Sebum Regulation Matrix", angle: 166, rotate: 2, link: "labelL" },
  { id: "botanicals", num: "ACTIVE 05", title: "Soothing Botanicals", sub: "Houttuynia + Scutellaria Extracts", angle: 14, rotate: -2, link: "labelR" },
];

const TITLE = "The Chemistry of RESET";

/** Radii of the elliptical card formation, responsive to the viewport. */
const getRing = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 640) return { rx: w * 0.3, ry: h * 0.31, cardScale: 0.72 };
  if (w < 1024) return { rx: Math.min(w * 0.34, 360), ry: Math.min(h * 0.31, 270), cardScale: 0.88 };
  return { rx: Math.min(w * 0.36, 520), ry: Math.min(h * 0.31, 280), cardScale: 1 };
};
const ringX = (deg: number) => getRing().rx * Math.cos((deg * Math.PI) / 180);
const ringY = (deg: number) => getRing().ry * Math.sin((deg * Math.PI) / 180);

/**
 * Every frame: draw each card's connector to the nearest piece of its linked
 * group, and sync card ↔ piece highlight state.
 */
function updateLinks(svg: SVGSVGElement, cards: Map<string, HTMLElement>) {
  const { lines, pieces, hoverCard, hoverPiece } = bottleScrollState;
  const focus = hoverCard ?? hoverPiece;
  svg.style.opacity = String(lines);
  const origin = svg.getBoundingClientRect();
  ingredients.forEach((ing) => {
    const card = cards.get(ing.id);
    const line = svg.querySelector<SVGLineElement>(`[data-line="${ing.id}"]`);
    const dot = svg.querySelector<SVGCircleElement>(`[data-dot="${ing.id}"]`);
    if (!card || !line || !dot) return;
    const on = focus === ing.link && lines > 0.5;
    card.dataset.active = String(on);
    line.setAttribute("stroke-opacity", on ? "0.95" : focus ? "0.15" : "0.35");
    dot.setAttribute("fill-opacity", on ? "1" : focus ? "0.25" : "0.7");
    if (lines <= 0.001) return;

    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    // nearest piece of the linked group
    let best = -1;
    let bd = Infinity;
    pieces.forEach((p, i) => {
      if (p.group !== ing.link) return;
      const d = (p.x - cx) ** 2 + (p.y - cy) ** 2;
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    if (best < 0) return;
    const a = pieces[best];
    const dx = a.x - cx;
    const dy = a.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const tCard = Math.min(
      Math.abs(dx) > 1e-3 ? r.width / 2 / Math.abs(dx) : Infinity,
      Math.abs(dy) > 1e-3 ? r.height / 2 / Math.abs(dy) : Infinity
    );
    const sx = cx + dx * tCard + ux * 6;
    const sy = cy + dy * tCard + uy * 6;
    const ex = a.x - ux * a.r;
    const ey = a.y - uy * a.r;
    line.setAttribute("x1", String(sx - origin.left));
    line.setAttribute("y1", String(sy - origin.top));
    line.setAttribute("x2", String(ex - origin.left));
    line.setAttribute("y2", String(ey - origin.top));
    dot.setAttribute("cx", String(ex - origin.left));
    dot.setAttribute("cy", String(ey - origin.top));
  });
}

interface ExplosionSectionProps {
  onExplore?: () => void;
}

export default function ExplosionSection({ onExplore }: ExplosionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const section = sectionRef.current;
      if (!section) return;
      const E = MOTION.explosion;

      // Initial state: cards collapsed behind the bottle at the exact viewport centre
      gsap.set(".ingredient-badge", { x: 0, y: 0, xPercent: -50, yPercent: -50, scale: 0.35, opacity: 0, rotation: 0 });
      // The glow lives in BottleCanvas (behind the bottle), so select it outside this scope
      const glow = document.getElementById("explosion-glow");
      if (glow) gsap.set(glow, { scale: 0.5, opacity: 0 });

      // 1. APPROACH — the bottle glides from its hero spot to the centre; title words rise from a mask
      gsap.to(bottleScrollState, {
        approach: 1,
        ease: MOTION.ease.inOut,
        scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: MOTION.scrub },
      });
      gsap.fromTo(
        ".explosion-eyebrow, .explosion-subline",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          ease: MOTION.ease.out,
          stagger: E.titleWordStagger,
          scrollTrigger: { trigger: section, start: "top 70%", end: "top 10%", scrub: MOTION.scrub },
        }
      );
      gsap.fromTo(
        ".explosion-title-word",
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: MOTION.ease.out,
          stagger: E.titleWordStagger,
          scrollTrigger: { trigger: section, start: "top 65%", end: "top 15%", scrub: MOTION.scrub },
        }
      );

      // 2. SHATTER — section pins; one timeline drives every piece group, the cards and the lines
      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.inOut },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: E.pinLength,
          pin: true,
          pinSpacing: true, // <main> is flex — GSAP would otherwise default this to false
          scrub: MOTION.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(bottleScrollState, { burst: 1, duration: 1 }, 0)
        .to(bottleScrollState, { glass: 1, duration: 0.9, ease: MOTION.ease.burst }, 0)
        .to(bottleScrollState, { label: 1, duration: 0.9, ease: MOTION.ease.burst }, E.stagger)
        .to(bottleScrollState, { cap: 1, duration: 0.85, ease: MOTION.ease.burst }, E.stagger * 2)
        .to(bottleScrollState, { bulb: 1, duration: 0.85, ease: MOTION.ease.burst }, E.stagger * 3)
        .to(glow, { scale: 2.2, opacity: 0.95, duration: 1, ease: MOTION.ease.soft }, 0);

      ingredients.forEach((ing, i) => {
        tl.to(
          `.ingredient-badge-${ing.id}`,
          {
            x: () => ringX(ing.angle),
            y: () => ringY(ing.angle),
            scale: () => getRing().cardScale,
            opacity: 1,
            rotation: ing.rotate,
            duration: 0.9,
            ease: MOTION.ease.out,
          },
          0.05 + i * E.stagger
        );
      });

      // Shockwave ring + one-step background darken at the moment the pieces separate
      const SW = MOTION.shockwave;
      const shock = document.getElementById("explosion-shockwave");
      const darken = document.getElementById("explosion-darken");
      if (shock) {
        gsap.set(shock, { scale: 0.2, opacity: 0 });
        tl.to(
          shock,
          {
            keyframes: [
              { scale: 1, opacity: 0.9, duration: SW.peak, ease: MOTION.ease.out },
              { scale: SW.maxScale, opacity: 0, duration: SW.duration - SW.peak, ease: MOTION.ease.soft },
            ],
          },
          SW.at
        );
      }
      if (darken) {
        gsap.set(darken, { opacity: 0 });
        tl.to(darken, { opacity: SW.darken, duration: SW.peak * 2, ease: MOTION.ease.soft }, SW.at);
      }

      // Ingredient particles burst, then settle into slow orbits (GPU, one draw call)
      tl.to(bottleScrollState, { particles: 1, duration: MOTION.particles.duration, ease: "none" }, MOTION.particles.at);

      tl.to(bottleScrollState, { lines: 1, duration: 0.3, ease: MOTION.ease.soft }, E.linesAt);
      tl.to({}, { duration: E.hold });

      // 3. EXIT + per-frame links. Section position is read live (no dependency on later sections).
      const stage = section.querySelector<HTMLElement>(".explosion-stage");
      const canvasWrapper = document.getElementById("bottle-canvas-wrapper");
      const canvasEl = canvasWrapper?.querySelector<HTMLElement>(".bottle-canvas");
      const svg = section.querySelector<SVGSVGElement>(".explosion-connectors");
      const cards = new Map<string, HTMLElement>();
      ingredients.forEach((ing) => {
        const el = section.querySelector<HTMLElement>(`.ingredient-badge-${ing.id} .ingredient-card`);
        if (el) cards.set(ing.id, el);
      });
      const fade = (v: number, from: number, to: number) => 1 - gsap.utils.clamp(0, 1, (v - from) / (to - from));
      const onTick = () => {
        const top = section.getBoundingClientRect().top;
        const exit = gsap.utils.clamp(0, 1, -top / window.innerHeight);
        bottleScrollState.exit = exit;
        if (stage) stage.style.opacity = String(fade(exit, 0.05, 0.35));
        if (canvasWrapper) canvasWrapper.style.opacity = String(fade(exit, 0.2, 0.6));
        // the canvas only takes pointer events while it's visible
        if (canvasEl) canvasEl.style.pointerEvents = exit < 0.5 ? "auto" : "none";
        if (svg) updateLinks(svg, cards);
      };
      gsap.ticker.add(onTick);

      return () => {
        gsap.ticker.remove(onTick);
        Object.assign(bottleScrollState, {
          approach: 0,
          burst: 0,
          glass: 0,
          label: 0,
          cap: 0,
          bulb: 0,
          lines: 0,
          exit: 0,
          hoverCard: null,
          particles: 0,
        });
      };
    },
    { scope: sectionRef }
  );

  /** Card hover: highlight linked pieces, roll the title letters, tilt toward the cursor. */
  const onCardEnter = (link: LinkGroup) => (e: React.PointerEvent<HTMLDivElement>) => {
    bottleScrollState.hoverCard = link;
    bottleScrollState.hoverPiece = null; // the canvas never sees pointer-out under a card
    const R = MOTION.cardHover.roll;
    gsap.to(e.currentTarget.querySelectorAll(".roll-inner"), {
      yPercent: -100,
      duration: R.duration,
      stagger: R.stagger,
      ease: MOTION.ease.out,
      overwrite: true,
    });
  };
  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const T = MOTION.cardHover;
    gsap.to(el, {
      rotationY: px * 2 * T.tiltMax,
      rotationX: -py * 2 * T.tiltMax,
      transformPerspective: 700,
      duration: T.tiltDuration,
      ease: MOTION.ease.out,
      overwrite: "auto",
    });
  };
  const onCardLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    bottleScrollState.hoverCard = null;
    const T = MOTION.cardHover;
    gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: T.tiltDuration, ease: MOTION.ease.out, overwrite: "auto" });
    gsap.to(e.currentTarget.querySelectorAll(".roll-inner"), {
      yPercent: 0,
      duration: T.roll.duration,
      stagger: T.roll.stagger,
      ease: MOTION.ease.out,
      overwrite: true,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="explosion-section"
      // z-20 + pointer-events-none: sits above the 3D canvas (the pin makes it a fixed
      // stacking context), but only the cards and the button take pointer events
      className="explosion-section relative z-20 h-screen w-full overflow-hidden select-none pointer-events-none"
    >
      {/* Top Title Overlay */}
      <div className="explosion-title-overlay absolute top-0 inset-x-0 pt-20 sm:pt-24 text-center px-4 pointer-events-none z-30">
        <span className="explosion-eyebrow text-[10px] font-mono tracking-[0.35em] text-[#eee4d8]/50 uppercase block mb-1">
          ACTIVIQ™ FORMULATION MATRIX
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-light text-[#eee4d8] tracking-widest" aria-label={TITLE}>
          {TITLE.split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em]" aria-hidden>
              <span className="explosion-title-word inline-block will-change-transform">{word}</span>
              {i < TITLE.split(" ").length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h2>
        <p className="explosion-subline font-cormorant italic text-sm sm:text-base text-[#eee4d8]/60 mt-1">
          5 Targeted Actives Clarify, Balance &amp; Calm Blemish-Prone Skin
        </p>
      </div>

      {/* Pinned stage — its centre is the viewport centre, i.e. where the 3D bottle sits */}
      <div className="explosion-stage absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {/* Thin connector lines: card → nearest linked piece (updated every frame) */}
        <svg className="explosion-connectors absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }} aria-hidden>
          {ingredients.map((ing) => (
            <g key={ing.id}>
              <line
                data-line={ing.id}
                stroke="#eee4d8"
                strokeOpacity={0.35}
                strokeWidth={1}
                style={{ transition: `stroke-opacity ${MOTION.hover.duration}s ease-out` }}
              />
              <circle data-dot={ing.id} r={2.5} fill="#eee4d8" fillOpacity={0.7} />
            </g>
          ))}
        </svg>

        {/* 5 Ingredient Cards (radial burst outward on scrub) */}
        {ingredients.map((ing) => (
          <div
            key={ing.id}
            className={`ingredient-badge ingredient-badge-${ing.id} absolute pointer-events-none select-none will-change-transform`}
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(0.35)", opacity: 0 }}
          >
            <div
              data-active="false"
              onPointerEnter={onCardEnter(ing.link)}
              onPointerMove={onCardMove}
              onPointerLeave={onCardLeave}
              className="ingredient-card w-[190px] sm:w-[220px] rounded-xl px-4 py-3 border border-[#eee4d8]/20 bg-[#1a0409]/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-0.5 pointer-events-auto cursor-default transition-[border-color,box-shadow,translate] ease-out data-[active=true]:border-[#eee4d8]/60 data-[active=true]:-translate-y-1 data-[active=true]:shadow-[0_20px_60px_rgba(140,27,53,0.55)]"
              style={{ transitionDuration: `${MOTION.hover.duration}s` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#eee4d8]/60 shrink-0" />
                <span className="text-[8px] font-mono tracking-[0.3em] text-[#eee4d8]/50 uppercase">{ing.num}</span>
              </div>
              {/* Title rolls letter by letter on hover: old letters slide up out of the mask, new rise from below */}
              <span className="font-cinzel text-sm sm:text-base font-semibold text-[#eee4d8] leading-tight" aria-label={ing.title}>
                {ing.title.split(" ").map((word, w, words) => (
                  <span key={w} aria-hidden>
                    <span className="inline-flex">
                      {Array.from(word).map((ch, i) => (
                        <span key={i} className="relative inline-block overflow-hidden">
                          <span className="roll-inner relative inline-block">
                            <span className="block">{ch}</span>
                            <span className="absolute left-0 top-full block">{ch}</span>
                          </span>
                        </span>
                      ))}
                    </span>
                    {w < words.length - 1 && " "}
                  </span>
                ))}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#eee4d8]/50 tracking-wider leading-snug">
                {ing.sub}
              </span>
              <div className="mt-1.5 h-[1px] w-full bg-gradient-to-r from-[#eee4d8]/25 via-[#eee4d8]/40 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom transition to the product range */}
      <div className="absolute bottom-0 inset-x-0 pb-8 sm:pb-10 text-center pointer-events-auto z-30">
        <span className="text-[9px] font-mono tracking-[0.25em] text-[#eee4d8]/40 uppercase block mb-2">
          ActivIQ™ Clinical Bio-Matrix
        </span>
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#eee4d8]/70 hover:text-white uppercase transition-colors cursor-pointer"
        >
          <span>Explore the Range ↓</span>
        </button>
      </div>
    </section>
  );
}
