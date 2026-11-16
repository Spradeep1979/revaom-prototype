"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { bottleScrollState } from "./bottleScrollState";
import { MOTION } from "@/lib/motion";

/** Seeded RNG — stable pattern on every load (and pure for React). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One tint per active: ActivIQ, Salicylic Acid, Clarifying Peptides, Zinc PCA, Botanicals. */
const ACTIVE_TINTS = ["#eee4d8", "#f1c7a8", "#d98a5b", "#c9b8b0", "#b9b37a"];

const vertex = /* glsl */ `
  attribute vec3 aDir;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aSpin;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vRot;
  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    float burst = 1.0 - pow(1.0 - p, 3.0);          // power3.out
    float settle = smoothstep(0.55, 1.0, p);         // orbit only once settled
    vec3 d = normalize(aDir);
    float ang = settle * uTime * aSpeed;
    float c = cos(ang), s = sin(ang);
    d.xz = mat2(c, -s, s, c) * d.xz;                 // slow orbit around the bottle axis
    vec3 pos = d * aRadius * burst;
    pos.y += sin(uTime * 0.7 + aPhase) * 0.025 * settle;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio;
    vRot = aSpin * (burst * 5.0 + uTime * 0.5 * settle) + aPhase;
    vAlpha = smoothstep(0.0, 0.12, p) * (0.55 + 0.45 * aPhase / 6.2831);
    vColor = aColor;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vRot;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float s = sin(vRot), k = cos(vRot);
    c = mat2(k, -s, s, k) * c;                       // per-point spin
    float d = abs(c.x) * 1.7 + abs(c.y);             // little diamond / seed shape
    float a = smoothstep(0.5, 0.3, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/**
 * 40–60 particles per active, all in ONE Points draw call. Every particle's
 * burst, orbit and spin is computed on the GPU from a single scrubbed progress
 * value, so it reverses exactly with scroll.
 */
export default function IngredientParticles({ perActive }: { perActive: number }) {
  const { geometry, material } = useMemo(() => {
    const P = MOTION.particles;
    const n = perActive * ACTIVE_TINTS.length;
    const dir = new Float32Array(n * 3);
    const color = new Float32Array(n * 3);
    const radius = new Float32Array(n);
    const speed = new Float32Array(n);
    const spin = new Float32Array(n);
    const size = new Float32Array(n);
    const phase = new Float32Array(n);
    const tint = new THREE.Color();
    const random = rng(42);
    for (let i = 0; i < n; i++) {
      // random direction, flattened a little so the cloud reads as a wide ring
      const u = random() * Math.PI * 2;
      const v = (random() - 0.5) * 1.1;
      dir.set([Math.cos(u), v, Math.sin(u)], i * 3);
      tint.set(ACTIVE_TINTS[Math.floor(i / perActive)]);
      color.set([tint.r, tint.g, tint.b], i * 3);
      radius[i] = P.radiusMin + random() * (P.radiusMax - P.radiusMin);
      speed[i] = P.orbitSpeed * (0.5 + random()) * (random() < 0.5 ? -1 : 1);
      spin[i] = (random() - 0.5) * 2;
      size[i] = P.sizeMin + random() * (P.sizeMax - P.sizeMin);
      phase[i] = random() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    g.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aSpin", new THREE.BufferAttribute(spin, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    // Uniforms are fed right before each draw (no React state involved)
    const timer = new THREE.Timer();
    m.onBeforeRender = (renderer) => {
      timer.update();
      m.uniforms.uProgress.value = bottleScrollState.particles;
      m.uniforms.uTime.value = timer.getElapsed();
      m.uniforms.uPixelRatio.value = Math.min(renderer.getPixelRatio(), 2);
    };
    return { geometry: g, material: m };
  }, [perActive]);

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={3} />;
}
