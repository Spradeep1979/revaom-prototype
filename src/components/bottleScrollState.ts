/**
 * Shared, mutable state between the GSAP scroll timeline (ExplosionSection),
 * the entrance timeline (HeroSection) and the R3F model (HeroBottleModel).
 * GSAP tweens the numbers; the model reads them every frame — so the 3D pieces
 * and the HTML cards are driven by the same timelines and reverse together.
 */

/** Which pieces a card is linked to. */
export type LinkGroup = "glass" | "cap" | "bulb" | "labelL" | "labelR";

/** Screen-space (viewport px) position of one bottle piece, written every frame. */
export type PieceAnchor = { group: LinkGroup; x: number; y: number; r: number };

export const bottleScrollState = {
  /** 0 → 1 entrance (bottle rises + half-turn) */
  intro: 0,
  /** 0 → 1 hero layout → centred in viewport */
  approach: 0,
  /** 0 → 1 whole assembly scales down */
  burst: 0,
  /** 0 → 1 per-group explosion progress */
  glass: 0,
  label: 0,
  cap: 0,
  bulb: 0,
  /** 0 → 1 ingredient particles: burst outward, then settle into slow orbits */
  particles: 0,
  /** 0 → 1 connector line opacity */
  lines: 0,
  /** 0 → 1 section scrolled away after the pin */
  exit: 0,
  /** Hover links: card → pieces and piece → card */
  hoverCard: null as LinkGroup | null,
  hoverPiece: null as LinkGroup | null,
  /** Projected piece positions for the connector lines */
  pieces: [] as PieceAnchor[],
  /** GLB + label texture loaded and the model is mounted */
  ready: false,
};

export const BOTTLE_READY_EVENT = "revaom:bottle-ready";
