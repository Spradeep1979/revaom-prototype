/**
 * The free vertical band in the hero between the heading block and the bottom
 * block (shop controls + scroll hint). The 3D bottle and the hero backdrop
 * (rings, botanicals, outline word) both centre on this band.
 */
export const HERO_PADDING_PX = 28;
export const HERO_MAX_VH = 0.6;
export const HERO_MIN_PX = 200;

export function measureHeroBand() {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const hero = document.getElementById("hero-section");
  const heroTop = hero ? hero.getBoundingClientRect().top + sy : 0;
  const overlays = document.querySelectorAll<HTMLElement>("#hero-section .hero-text-overlay");
  let top = vh * 0.22;
  let bottom = vh * 0.85;
  if (overlays[0]) top = overlays[0].getBoundingClientRect().bottom + sy - heroTop;
  if (overlays[1]) bottom = overlays[1].getBoundingClientRect().top + sy - heroTop;
  bottom = Math.min(bottom, vh);
  const avail = bottom - top - HERO_PADDING_PX * 2;
  const heightPx = Math.min(Math.max(avail, HERO_MIN_PX), vh * HERO_MAX_VH);
  return { heightPx, offsetPx: (top + bottom) / 2 - vh / 2, vh };
}
