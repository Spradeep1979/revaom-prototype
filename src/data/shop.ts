/**
 * Shop placeholders — edit prices, copy and ratings here.
 * Used by the hero shop controls, the product slider and the cart.
 */

export const currency = "$";

/** Hero shop controls. */
export const heroShop = {
  productId: "reset",
  price: 78,
  compareAt: null as number | null, // e.g. 92 to show a struck-through price
  size: "30 ml",
  ctaLabel: "Shop Now",
  trust: ["Dermatologist-tested", "Free shipping", "30-day returns"],
};

export interface ShopProduct {
  id: string;
  name: string;
  caption: string;
  image: string;
  price: number;
  rating: number; // out of 5
  reviews: number;
  /** Background tone that sweeps out when this card becomes the centre card. */
  tone: string;
}

export const products: ShopProduct[] = [
  { id: "reset", name: "RESET", caption: "Clarifying Serum for Acne-Prone Skin", image: "/images/products/reset.jpg", price: 78, rating: 4.8, reviews: 214, tone: "#2a0611" },
  { id: "awake", name: "AWAKE", caption: "Advanced Under Eye Elixir", image: "/images/products/awake.jpg", price: 68, rating: 4.7, reviews: 156, tone: "#1c1416" },
  { id: "poise", name: "POISE", caption: "Anti-Aging Serum", image: "/images/products/poise.jpg", price: 94, rating: 4.9, reviews: 302, tone: "#120a1f" },
  { id: "reset-set", name: "RESET", caption: "Clarifying Serum, with its carton", image: "/images/products/reset-set.jpg", price: 78, rating: 4.8, reviews: 214, tone: "#240510" },
];

export const formatPrice = (n: number) => `${currency}${n.toFixed(0)}`;
