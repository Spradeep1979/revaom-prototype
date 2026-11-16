"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { Move3d, Sparkles, RotateCw } from "lucide-react";

// --- GLTF BOTTLE MODEL LOADER WITH BRAND OVERRIDE ---
function Model() {
  const { scene } = useGLTF("/cosmetic_serum_bottle.glb");

  useEffect(() => {
    // 1. Premium Unbranded Dark Glass Material (Deep Burgundy)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#4A0404"), // Deep Burgundy requested
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.8,
      transparent: true,
      ior: 1.52,
      thickness: 1.4,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      attenuationColor: new THREE.Color("#2a0202"),
      attenuationDistance: 1.5,
    });

    // 2. High-end Matte Dropper Material for the Rubber Bulb & Cap
    const rubberMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#181518"),
      roughness: 0.65,
      metalness: 0.15,
    });

    // CRITICAL: Traverse scene to override materials and completely hide old branding
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const nameLower = mesh.name.toLowerCase();

        // If it's the old branding label mesh, hide it or replace with unbranded glass
        if (nameLower.includes("material.002") || nameLower.includes("label")) {
          // Hide the old branding label geometry completely
          mesh.visible = false;
        } else if (nameLower.includes("rubber")) {
          // Apply sleek matte rubber material to the dropper bulb
          mesh.material = rubberMaterial;
        } else {
          // Apply luxury dark burgundy physical glass material
          mesh.material = glassMaterial;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]} // Rotate 180 degrees as requested to hide any geometry logos
    />
  );
}

// Preload the 3D model
useGLTF.preload("/cosmetic_serum_bottle.glb");

// --- MAIN INTERACTIVE WEBGL COMPONENT ---
export default function InteractiveBottle3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="webgl-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 sm:px-12 lg:px-20 py-24 sm:py-32 overflow-hidden select-none bg-[#0f0206]"
    >
      {/* Background Burgundy Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,4,4,0.45)_0%,rgba(15,2,6,0.98)_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      {/* Header Overlay */}
      <div className="relative z-20 text-center max-w-2xl mx-auto pt-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3a0716]/60 border border-[#eee4d8]/20 text-[10px] font-mono tracking-[0.3em] text-[#eee4d8]/80 uppercase mb-4 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-[#eee4d8] animate-pulse" />
          <span>TRUE WEBGL GLTF RUNTIME • THREE.JS</span>
        </div>

        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-[#eee4d8] tracking-tight leading-tight">
          Interactive WebGL Prototype
        </h2>
        <p className="font-cormorant italic text-xl sm:text-2xl text-[#eee4d8]/75 font-light mt-1">
          Drag to Rotate — Real-time 3D Physical Glass Shader
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-mono text-[#eee4d8]/50 tracking-widest uppercase">
          <Move3d className="w-3.5 h-3.5 text-[#eee4d8]/70" />
          <span>Click & Drag to Rotate 360°</span>
          <span className="mx-1">•</span>
          <RotateCw className="w-3 h-3 text-[#eee4d8]/70 animate-spin" style={{ animationDuration: "10s" }} />
          <span>Auto-Orbit Active</span>
        </div>
      </div>

      {/* 3D Canvas Stage Container */}
      <div className="relative z-10 w-full h-[650px] sm:h-[750px] lg:h-[820px] max-w-6xl mx-auto my-auto cursor-grab active:cursor-grabbing">
        {mounted ? (
          <Canvas
            shadows
            camera={{ position: [0, 0.4, 5.2], fov: 42 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
          >
            {/* Dynamic Studio Lighting */}
            <ambientLight intensity={0.7} />
            <spotLight
              position={[5, 8, 6]}
              intensity={3.2}
              angle={0.65}
              penumbra={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            {/* Secondary Spotlight for Rim Glass Reflections */}
            <spotLight
              position={[-5, 4, -4]}
              intensity={2.2}
              angle={0.75}
              penumbra={1}
              color="#f5e6d3"
            />
            {/* Soft Front Fill Light */}
            <directionalLight position={[0, 3, 5]} intensity={1.2} />

            <Suspense
              fallback={
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.7, 0.7, 2.2, 32]} />
                  <meshStandardMaterial color="#4A0404" roughness={0.3} />
                </mesh>
              }
            >
              <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.25}>
                <Model />
              </Float>

              {/* Realistic Contact Floor Shadow */}
              <ContactShadows
                position={[0, -2.1, 0]}
                opacity={0.65}
                scale={7}
                blur={2.2}
                far={3.8}
                color="#000000"
              />

              {/* HDRI Environment for Natural Glass Specular Reflections */}
              <Environment preset="city" />
            </Suspense>

            {/* Orbit Controls (enableZoom={false} as requested) */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.75}
              autoRotate={true}
              autoRotateSpeed={1.0}
              dampingFactor={0.06}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#eee4d8]/20 border-t-[#eee4d8] animate-spin" />
          </div>
        )}
      </div>

      {/* Technical Spec Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-[#eee4d8]/40 uppercase tracking-widest pb-4">
        <span>Asset: cosmetic_serum_bottle.glb</span>
        <span>•</span>
        <span>Material: Custom MeshPhysicalMaterial (#4A0404 Deep Burgundy)</span>
        <span>•</span>
        <span>Engine: Three.js + R3F + Drei</span>
      </div>
    </section>
  );
}
