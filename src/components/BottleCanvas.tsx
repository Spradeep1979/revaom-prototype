"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import HeroBottleModel, { BOTTLE_MODEL_URL, FALLBACK_MODEL_URL } from "./HeroBottleModel";
import HeroBackdrop from "./HeroBackdrop";
import { MOTION } from "@/lib/motion";

/** Warm point light that follows the cursor (lerped) so the glass catches it. */
function CursorLight() {
  const light = useRef<THREE.PointLight>(null);
  const ndc = useRef({ x: 0.4, y: 0.3, seen: false });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ndc.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      ndc.current.seen = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame((state, delta) => {
    const l = light.current;
    if (!l) return;
    const { width, height } = state.viewport;
    const damp = THREE.MathUtils.damp;
    l.position.set(
      damp(l.position.x, (ndc.current.x * width) / 2, 4, delta),
      damp(l.position.y, (ndc.current.y * height) / 2, 4, delta),
      2.4
    );
    l.intensity = damp(l.intensity, ndc.current.seen ? MOTION.hero.cursorLight.light3dIntensity : 0, 3, delta);
  });
  return (
    <pointLight
      ref={light}
      color="#ffb48a"
      intensity={0}
      distance={MOTION.hero.cursorLight.light3dDistance}
      decay={1.4}
    />
  );
}

/**
 * Full-viewport fixed canvas. The bottle's size and position are computed in
 * world units from the live viewport inside HeroBottleModel, so it always fits
 * between the RESET heading and the scroll prompt and is never cropped.
 */
export default function BottleCanvas() {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  // Use the split model if it exists, otherwise fall back so the page never crashes on a 404
  useEffect(() => {
    let cancelled = false;
    fetch(BOTTLE_MODEL_URL, { method: "HEAD" })
      .then((r) => (r.ok ? BOTTLE_MODEL_URL : FALLBACK_MODEL_URL))
      .catch(() => FALLBACK_MODEL_URL)
      .then((url) => {
        if (cancelled) return;
        if (url === FALLBACK_MODEL_URL) {
          console.warn(`[BottleCanvas] ${BOTTLE_MODEL_URL} not found — using ${FALLBACK_MODEL_URL}`);
        }
        setModelUrl(url);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas fade-out on exit is driven by ExplosionSection (scroll ticker).

  return (
    <div
      ref={canvasWrapperRef}
      id="bottle-canvas-wrapper"
      className="fixed inset-0 w-full h-screen pointer-events-none z-10 will-change-[opacity]"
    >
      {/* Hero backdrop: cursor light, outline word, pulsing rings, floating botanicals */}
      <HeroBackdrop />

      {/* Background darkens one step when the pieces separate (scrubbed by the explosion timeline) */}
      <div id="explosion-darken" className="absolute inset-0 bg-black opacity-0 pointer-events-none" />

      {/* Shockwave ring — expands from the bottle centre at the moment of separation */}
      <div
        id="explosion-shockwave"
        className="absolute top-1/2 left-1/2 w-[38vh] h-[38vh] -ml-[19vh] -mt-[19vh] rounded-full border-2 border-[#eee4d8]/60 opacity-0 pointer-events-none will-change-transform"
        style={{ boxShadow: "0 0 40px rgba(140,27,53,0.6), inset 0 0 30px rgba(238,228,216,0.15)" }}
      />

      {/* Dark radial glow behind the bottle — expanded by the explosion timeline */}
      <div
        id="explosion-glow"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full pointer-events-none opacity-0 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(140, 27, 53, 0.65) 0%, rgba(68, 8, 26, 0.40) 45%, rgba(15, 2, 6, 0) 75%)",
          filter: "blur(35px)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 2]} // devicePixelRatio capped at 2
        camera={{ position: [0, 0, 8], fov: 30, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        className="bottle-canvas"
        // hover + horizontal drag on the pieces; vertical swipes still scroll the page
        style={{ pointerEvents: "auto", touchAction: "pan-y" }}
      >
        {/* Studio lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 7, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 2, -4]} intensity={1.2} color="#f5e6d3" />
        {/* Rim light from behind — makes the amber glass glow */}
        <spotLight position={[0, 4, -6]} intensity={3.2} angle={0.7} penumbra={1} color="#ffd9c2" />
        <CursorLight />

        <Suspense fallback={null}>
          {modelUrl && <HeroBottleModel url={modelUrl} />}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
