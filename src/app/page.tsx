"use client";

import Navbar from "@/components/Navbar";
import BottleCanvas from "@/components/BottleCanvas";
import HeroSection from "@/components/HeroSection";
import ExplosionSection from "@/components/ExplosionSection";
import CartDrawer from "@/components/CartDrawer";
import ProductSlider from "@/components/ProductSlider";
import { CartProvider, useCart } from "@/context/CartContext";

export default function Home() {
  return (
    <CartProvider initialCount={1}>
      <HomeContent />
    </CartProvider>
  );
}

function HomeContent() {
  const cart = useCart();

  const handleScrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToExplosion = () => {
    const el = document.getElementById("explosion-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative bg-[#0f0206] text-[#eee4d8] min-h-screen flex flex-col overflow-x-clip">
      {/* 1. Ultra-Minimalist Floating Header */}
      <Navbar
        cartCount={cart.count}
        onOpenCart={cart.open}
        onAcquire={handleScrollToProducts}
      />

      {/* 2. Global 3D Bottle Canvas (fixed layer behind Hero & Explosion, fades out before the slider) */}
      <BottleCanvas />

      {/* 3. Hero Section (Standard HTML overlaying the 3D canvas) */}
      <HeroSection onExplore={handleScrollToExplosion} onShop={handleScrollToProducts} />

      {/* 4. Explosion Section (Standard HTML with Radial Ingredient Burst scrubbed via GSAP) */}
      <ExplosionSection onExplore={handleScrollToProducts} />

      {/* 5. Product Slider (drag + snap carousel) */}
      <ProductSlider />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.close}
        count={cart.count}
        setCount={cart.setCount}
      />
    </main>
  );
}
