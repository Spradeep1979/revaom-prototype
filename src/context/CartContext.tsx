"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import gsap from "gsap";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

interface CartState {
  count: number;
  setCount: (n: number) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Fly a thumbnail from `from` to the nav cart icon, then bump the count. */
  addToCart: (from?: HTMLElement | null, imageSrc?: string) => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children, initialCount = 0 }: { children: ReactNode; initialCount?: number }) {
  const [count, setCount] = useState(initialCount);
  const [isOpen, setOpen] = useState(false);

  const addToCart = useCallback((from?: HTMLElement | null, imageSrc?: string) => {
    const icon = document.querySelector<HTMLElement>("[data-cart-icon]");
    const C = MOTION.cart;
    const land = () => {
      setCount((c) => c + 1);
      if (icon) gsap.fromTo(icon, { scale: C.bumpScale }, { scale: 1, duration: C.bumpDuration, ease: MOTION.ease.out });
    };
    if (!from || !icon || !imageSrc || prefersReducedMotion()) {
      land();
      return;
    }
    const a = from.getBoundingClientRect();
    const b = icon.getBoundingClientRect();
    const size = C.thumbSize;
    const thumb = document.createElement("img");
    thumb.src = imageSrc;
    thumb.alt = "";
    Object.assign(thumb.style, {
      position: "fixed",
      left: `${a.left + a.width / 2 - size / 2}px`,
      top: `${a.top + a.height / 2 - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      objectFit: "cover",
      borderRadius: "9999px",
      border: "1px solid rgba(238,228,216,0.4)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
      zIndex: "9999",
      pointerEvents: "none",
    });
    document.body.appendChild(thumb);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    // different eases on x and y give the thumbnail a curved path
    gsap
      .timeline({ onComplete: () => (thumb.remove(), land()) })
      .to(thumb, { x: dx, duration: C.flyDuration, ease: "power2.inOut" }, 0)
      .to(thumb, { y: dy, duration: C.flyDuration, ease: "power3.in" }, 0)
      .to(thumb, { scale: 0.3, opacity: 0.7, duration: C.flyDuration, ease: "power2.in" }, 0);
  }, []);

  const value = useMemo<CartState>(
    () => ({ count, setCount, isOpen, open: () => setOpen(true), close: () => setOpen(false), addToCart }),
    [count, isOpen, addToCart]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
