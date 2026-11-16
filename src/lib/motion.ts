/**
 * REVAÔM motion system — every timing, ease and amplitude lives here.
 * Pacing follows the reference: quick ease-outs (0.3–0.6 s), tight staggers,
 * scroll links that trail slightly (scrub 1), no springy overshoot.
 */
export const MOTION = {
  ease: {
    out: "power3.out", // entrances, hovers, reveals
    inOut: "power2.inOut", // scroll-linked transforms
    burst: "power3.out", // shards leaving the bottle
    soft: "power2.out",
  },

  /** Scroll links: seconds the animation trails behind the scrollbar. */
  scrub: 1,

  /** Entrance (on load, after GLB + label texture are ready). Total ≈ 1.6 s. */
  intro: {
    nav: { duration: 0.6, y: -24 }, // nav fades down
    letters: { duration: 0.55, stagger: 0.06, yPercent: 110 }, // RESET, letter by letter
    sub: { duration: 0.6, y: 14 }, // eyebrow + italic subline
    bottle: { duration: 1.1, rise: 0.35, turns: 0.5 }, // rise (fraction of bottle height) + half-turn
    hint: { duration: 0.5, pulse: 1.8 }, // "Scroll to explore" fade-in, then slow pulse period
    at: { nav: 0, letters: 0.15, sub: 0.45, bottle: 0.25, hint: 1.1 },
    failSafeMs: 4000, // start anyway if assets haven't reported ready
  },

  /** Explosion section (one scrubbed, pinned timeline). */
  explosion: {
    pinLength: "+=160%",
    assemblyScale: 0.8, // whole bottle scales down
    glassDistance: 0.34, // shard travel, in bottle heights
    labelDistance: 0.3,
    capLift: 0.16,
    bulbLift: 0.28,
    spinDeg: 40, // max spin per piece
    stagger: 0.06, // between cards / piece groups
    titleWordStagger: 0.08,
    linesAt: 0.6, // timeline position where connector lines fade in
    hold: 0.4, // hold the formation before un-pinning
    /** Narrow screens (< 640 px): smaller assembly and tighter spread so shards stay on screen. */
    mobile: { maxWidth: 640, assemblyScale: 0.55, spread: 0.7 },
  },

  /** Idle motion while the explosion section is on screen (disabled for reduced motion). */
  idle: {
    floatAmp: 0.018, // bob, in bottle heights
    floatSpeed: 1.1, // rad/s
    driftAmp: 0.01,
    spinAmp: 0.04, // rad
  },

  /** Interaction. */
  hover: {
    duration: 0.35, // card ↔ piece highlight
    pull: 0.18, // toward camera, in bottle heights
    dimOpacity: 0.4,
    glow: 0.35, // emissive boost on highlighted pieces
    leanAmp: 0.03, // pieces lean away from the cursor
    lerp: 6, // damping speed for hover/lean (higher = snappier)
  },
  drag: {
    threshold: 8, // px before a horizontal drag starts
    sensitivity: 0.006, // rad per px
    inertia: 0.92, // velocity kept per frame (60 fps)
  },

  /** Product slider (reference: side item rotates to centre 0.4 s power3.out, colour sweeps 0.25 s). */
  slider: {
    enter: { duration: 0.7, y: 60, stagger: 0.09 },
    heading: { duration: 0.7, stagger: 0.08 },
    snap: { duration: 0.4, ease: "power3.out" },
    focus: { duration: 0.4, ease: "power3.out", activeScale: 1.04, sideScale: 0.88, sideRotateY: 16, sideOpacity: 0.6 },
    sweep: { duration: 0.25, ease: "power2.out" },
  },

  /** Hero backdrop (all CSS/DOM — no canvas cost). */
  hero: {
    rings: { count: 4, countMobile: 3, duration: 7, maxScale: 2.4, opacity: 0.5 },
    botanicals: {
      count: 8,
      countMobile: 4,
      sharpen: { duration: 1.2, stagger: 0.07, fromBlur: 18 }, // blur → depth blur on load
      drift: { x: 14, y: 18, rotate: 8, durationMin: 6, durationMax: 10 }, // px / deg, yoyo loop
      parallax: 18, // px at the nearest depth; scaled by depth
      parallaxDuration: 0.9, // lerp-like follow time
    },
    cursorLight: { size: 560, follow: 0.6, light3dIntensity: 7, light3dDistance: 6 },
    outlineWord: { fadeEnd: "+=30%" }, // cross-fades out as the scroll begins
  },

  /** Shop controls in the hero — last items of the entrance timeline. */
  shopIntro: { at: 1.25, duration: 0.5, y: 14, stagger: 0.07 },

  /** Explosion extras, placed on the pinned timeline. */
  shockwave: { at: 0.06, peak: 0.12, duration: 0.55, maxScale: 5, darken: 0.32 },
  particles: {
    perActive: 50,
    perActiveMobile: 24,
    radiusMin: 0.45, // bottle heights
    radiusMax: 1.15,
    sizeMin: 2.2, // px (before devicePixelRatio)
    sizeMax: 5.5,
    orbitSpeed: 0.18, // rad/s once settled
    at: 0.04,
    duration: 1,
  },

  /** Ingredient card hover. */
  cardHover: { tiltMax: 6, tiltDuration: 0.4, roll: { duration: 0.38, stagger: 0.018 } },

  /** Fly-to-cart. */
  cart: { flyDuration: 0.75, thumbSize: 64, bumpScale: 1.3, bumpDuration: 0.35 },

  /** Screens below this width get fewer particles, rings and botanicals. */
  smallScreen: 768,
} as const;

/** True when the user asked the OS for reduced motion. Safe on the server. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
