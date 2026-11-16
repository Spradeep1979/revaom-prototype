"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { MOTION } from "@/lib/motion";
import { formatPrice, products } from "@/data/shop";
import { useCart } from "@/context/CartContext";

const HEADING = "The Range";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-3 h-3"
          strokeWidth={1.5}
          color="#e6b9a3"
          fill={i < Math.round(rating) ? "#e6b9a3" : "transparent"}
        />
      ))}
    </span>
  );
}

export default function ProductSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { addToCart } = useCart();
  const total = products.length;

  const cards = () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>(".slider-card") ?? []);

  /** Scroll position that centres card i. */
  const centreOf = useCallback((i: number) => {
    const track = trackRef.current;
    const el = track?.querySelectorAll<HTMLElement>(".slider-card")[i];
    if (!track || !el) return 0;
    return el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2;
  }, []);

  /** Rotate card i to the centre (reference: ~0.4 s, power3.out). */
  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const idx = gsap.utils.clamp(0, total - 1, i);
      track.style.scrollSnapType = "none";
      gsap.to(track, {
        scrollLeft: centreOf(idx),
        duration: MOTION.slider.snap.duration,
        ease: MOTION.slider.snap.ease,
        overwrite: true,
        onComplete: () => {
          track.style.scrollSnapType = "";
        },
      });
    },
    [centreOf, total]
  );

  /* ---------- side padding so every card (first and last too) can sit in the centre ---------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const pad = () => {
      const first = track.querySelector<HTMLElement>(".slider-card");
      if (!first) return;
      const p = Math.max((track.clientWidth - first.offsetWidth) / 2, 16);
      track.style.paddingInline = `${p}px`;
    };
    pad();
    window.addEventListener("resize", pad);
    return () => window.removeEventListener("resize", pad);
  }, []);

  /* ---------- active card + progress indicator ---------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const max = Math.max(track.scrollWidth - track.clientWidth, 1);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(track.scrollLeft / max, 0.02)})`;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bd = Infinity;
      track.querySelectorAll<HTMLElement>(".slider-card").forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setActive(best);
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ---------- centre card scales up, side cards turn away; background colour sweeps from the centre card ---------- */
  const firstSweep = useRef(true);
  useEffect(() => {
    const F = MOTION.slider.focus;
    cards().forEach((el, i) => {
      const inner = el.querySelector(".slider-card-inner");
      const side = Math.sign(i - active);
      gsap.to(inner, {
        scale: i === active ? F.activeScale : F.sideScale,
        rotationY: -side * F.sideRotateY,
        opacity: i === active ? 1 : F.sideOpacity,
        transformPerspective: 1100,
        duration: F.duration,
        ease: F.ease,
        overwrite: "auto",
      });
    });

    const section = sectionRef.current;
    const bg = bgRef.current;
    const card = cards()[active];
    if (!section || !bg || !card) return;
    const tone = products[active].tone;
    if (firstSweep.current) {
      firstSweep.current = false;
      bg.style.backgroundColor = tone;
      return;
    }
    // radial sweep: a circle of the new tone grows from the centre card, then becomes the background
    const s = section.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const cx = c.left + c.width / 2 - s.left;
    const cy = c.top + c.height / 2 - s.top;
    const r = Math.hypot(Math.max(cx, s.width - cx), Math.max(cy, s.height - cy));
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      position: "absolute",
      left: `${cx - r}px`,
      top: `${cy - r}px`,
      width: `${r * 2}px`,
      height: `${r * 2}px`,
      borderRadius: "9999px",
      background: tone,
      pointerEvents: "none",
    });
    bg.appendChild(dot);
    gsap.fromTo(
      dot,
      { scale: 0 },
      {
        scale: 1,
        duration: MOTION.slider.sweep.duration,
        ease: MOTION.slider.sweep.ease,
        onComplete: () => {
          bg.style.backgroundColor = tone;
          dot.remove();
        },
      }
    );
  }, [active]);

  /* ---------- mouse drag with snap (touch uses native horizontal scrolling) ---------- */
  const dragMoved = useRef(false);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let vel = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button")) return;
      down = true;
      dragMoved.current = false;
      startX = lastX = e.clientX;
      startLeft = track.scrollLeft;
      vel = 0;
      gsap.killTweensOf(track);
      track.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragMoved.current && Math.abs(dx) > 5) {
        dragMoved.current = true;
        track.setPointerCapture(e.pointerId);
        track.dataset.dragging = "true";
      }
      if (!dragMoved.current) return;
      vel = e.clientX - lastX;
      lastX = e.clientX;
      track.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      track.dataset.dragging = "false";
      if (!dragMoved.current) {
        track.style.scrollSnapType = "";
        return;
      }
      // flick momentum, then snap the nearest card to the centre
      const mid = track.scrollLeft - vel * 10 + track.clientWidth / 2;
      let best = 0;
      let bd = Infinity;
      track.querySelectorAll<HTMLElement>(".slider-card").forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      goTo(best);
    };
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    return () => {
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
    };
  }, [goTo]);

  /* ---------- slide in on scroll ---------- */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const S = MOTION.slider;
      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.out },
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", toggleActions: "play none none reverse" },
      });
      tl.from(".slider-eyebrow", { opacity: 0, y: 14, duration: S.heading.duration })
        .from(".slider-heading-word", { yPercent: 110, duration: S.heading.duration, stagger: S.heading.stagger }, 0.05)
        .from(".slider-card", { opacity: 0, y: S.enter.y, duration: S.enter.duration, stagger: S.enter.stagger }, 0.15)
        .from(".slider-controls", { opacity: 0, y: 12, duration: S.heading.duration }, 0.35);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative z-20 w-full bg-[#0f0206] pt-24 sm:pt-32 pb-24 sm:pb-32 select-none overflow-hidden"
    >
      {/* Tone layer (swept radially from the centre card) + burgundy atmosphere on top */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(58,7,22,0.45)_0%,rgba(15,2,6,0.85)_75%)] pointer-events-none" />

      {/* Heading + controls */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <span className="slider-eyebrow text-[10px] font-mono tracking-[0.35em] text-[#eee4d8]/50 uppercase block mb-2">
            ActivIQ™ Collection
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-[#eee4d8] tracking-widest" aria-label={HEADING}>
            {HEADING.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.3em]" aria-hidden>
                <span className="slider-heading-word inline-block">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="slider-controls flex items-center gap-5">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#eee4d8]/60 tabular-nums" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="relative w-24 sm:w-32 h-[1px] bg-[#eee4d8]/15 overflow-hidden" aria-hidden>
            <div ref={barRef} className="absolute inset-0 bg-[#eee4d8]/70 origin-left" style={{ transform: "scaleX(0.02)" }} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous product"
              className="w-10 h-10 rounded-full border border-[#eee4d8]/20 flex items-center justify-center text-[#eee4d8]/70 hover:text-[#eee4d8] hover:border-[#eee4d8]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active >= total - 1}
              aria-label="Next product"
              className="w-10 h-10 rounded-full border border-[#eee4d8]/20 flex items-center justify-center text-[#eee4d8]/70 hover:text-[#eee4d8] hover:border-[#eee4d8]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Track — cards snap to the centre */}
      <div
        ref={trackRef}
        className="slider-track relative z-10 flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory py-6 cursor-grab data-[dragging=true]:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p, i) => (
          <article
            key={p.id}
            className="slider-card snap-center shrink-0 w-[72vw] sm:w-[320px] lg:w-[360px]"
            onClick={() => {
              if (dragMoved.current) {
                dragMoved.current = false;
                return;
              }
              if (i !== active) goTo(i);
            }}
          >
            <div className="slider-card-inner group rounded-2xl overflow-hidden border border-[#eee4d8]/10 bg-[#1a0409]/85 will-change-transform">
              <div className="slider-card-image relative aspect-[4/5] overflow-hidden">
                <Image
                  src={p.image}
                  alt={`REVAÔM ${p.name} — ${p.caption}`}
                  fill
                  loading="lazy"
                  draggable={false}
                  sizes="(max-width: 640px) 72vw, 360px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:scale-[1.04]"
                />
                <span className="absolute top-4 left-4 text-[9px] font-mono tracking-[0.3em] text-[#eee4d8]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="px-5 pt-4 pb-5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-cinzel text-lg tracking-[0.2em] text-[#eee4d8]">{p.name}</h3>
                    <p className="font-cormorant italic text-base text-[#eee4d8]/60 leading-snug">{p.caption}</p>
                  </div>
                  <span className="font-cinzel text-lg text-[#eee4d8] shrink-0">{formatPrice(p.price)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2" aria-label={`Rated ${p.rating} out of 5 from ${p.reviews} reviews`}>
                    <Stars rating={p.rating} />
                    <span className="text-[9px] font-mono tracking-[0.15em] text-[#eee4d8]/50">
                      {p.rating.toFixed(1)} ({p.reviews})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const img = e.currentTarget.closest(".slider-card-inner")?.querySelector<HTMLElement>(".slider-card-image");
                      addToCart(img, p.image);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#eee4d8]/30 px-3.5 py-2 text-[9px] font-mono font-semibold tracking-[0.2em] uppercase text-[#eee4d8] hover:bg-[#eee4d8] hover:text-[#1a0409] transition-colors cursor-pointer"
                    aria-label={`Add ${p.name} to cart`}
                  >
                    <ShoppingBag className="w-3 h-3" aria-hidden />
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
