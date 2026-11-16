"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BOTTLE_READY_EVENT, bottleScrollState, type LinkGroup } from "./bottleScrollState";
import { MOTION, prefersReducedMotion } from "@/lib/motion";
import { measureHeroBand } from "@/lib/heroLayout";
import IngredientParticles from "./IngredientParticles";

/* ------------------------------------------------------------------ */
/*  Assets                                                             */
/* ------------------------------------------------------------------ */
export const BOTTLE_MODEL_URL = "/models/cosmetic_serum_bottle_split.glb";
/** Used automatically if the split model is missing from public/models. */
export const FALLBACK_MODEL_URL = "/models/cosmetic_serum_bottle.glb";
export const LABEL_TEXTURE_URL = "/textures/revaom_label.jpg";

/* ------------------------------------------------------------------ */
/*  Layout / shatter settings (motion values live in src/lib/motion.ts) */
/* ------------------------------------------------------------------ */
const LABEL_FRONT_Y = 0; // adjust if the label faces away from the camera
const HERO_ROTATION_Y = LABEL_FRONT_Y - 0.22;
const EXPLOSION_ROTATION_Y = LABEL_FRONT_Y;
const GLASS_SHARDS = 12; // Voronoi clusters
const LABEL_PANELS = 4; // vertical curved panels
const SHATTER_SEED = 7; // change for a different (but stable) fracture pattern
const LABEL_TEXTURE = {
  flipY: false,
  rotation: 0,
  repeat: [1, 1] as [number, number],
  offset: [0, 0] as [number, number],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
type Part = "glass" | "label" | "cap" | "bulb" | "other";

function classify(mesh: THREE.Mesh): Part {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const key = [mesh.name, mesh.parent?.name, mat?.name].filter(Boolean).join(" ").toLowerCase();
  if (/label|sticker|sleeve|wrap|decal/.test(key)) return "label";
  if (/bulb|rubber|teat|pipette|dropper/.test(key)) return "bulb";
  if (/cap|collar|lid|ring|neck/.test(key)) return "cap";
  if (/glass|bottle|body/.test(key)) return "glass";
  return "other";
}

/** Deterministic RNG so the fracture pattern is identical on every load. */
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

function correlation(a: number[], b: number[]) {
  const n = a.length;
  const ma = a.reduce((x, y) => x + y, 0) / n;
  const mb = b.reduce((x, y) => x + y, 0) / n;
  let c = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    c += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return da && db ? c / Math.sqrt(da * db) : 0;
}

/**
 * Give the label a straight cylindrical wrap (u = 0.5 faces +Z / the camera)
 * unless its UVs already follow the bottle height. Call after final orientation.
 */
function ensureWrapUV(mesh: THREE.Mesh) {
  mesh.updateWorldMatrix(true, false);
  const toLocal = new THREE.Matrix3().setFromMatrix4(mesh.matrixWorld).invert();
  const up = new THREE.Vector3(0, 1, 0).applyMatrix3(toLocal).normalize();
  const fwd = new THREE.Vector3(0, 0, 1).applyMatrix3(toLocal);
  fwd.addScaledVector(up, -fwd.dot(up)).normalize();
  const side = new THREE.Vector3().crossVectors(up, fwd).normalize();

  const geom = mesh.geometry;
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();
  const heights: number[] = [];
  for (let i = 0; i < pos.count; i++) heights.push(v.fromBufferAttribute(pos, i).dot(up));

  const uvAttr = geom.attributes.uv;
  if (uvAttr) {
    const us: number[] = [];
    const vs: number[] = [];
    for (let i = 0; i < uvAttr.count; i++) {
      us.push(uvAttr.getX(i));
      vs.push(uvAttr.getY(i));
    }
    const fit = Math.max(Math.abs(correlation(heights, us)), Math.abs(correlation(heights, vs)));
    if (fit > 0.9) return false;
  }

  geom.computeBoundingBox();
  const c = geom.boundingBox!.getCenter(new THREE.Vector3());
  const h0 = Math.min(...heights);
  const h1 = Math.max(...heights);
  const uv = new Float32Array(pos.count * 2);
  const d = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).sub(c);
    const ang = Math.atan2(d.dot(side), d.dot(fwd));
    uv[i * 2] = 0.5 + ang / (2 * Math.PI);
    uv[i * 2 + 1] = (h1 - heights[i]) / Math.max(h1 - h0, 1e-6); // flipY=false: v=0 is the image top
  }
  const g = geom.clone();
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  mesh.geometry = g;
  return true;
}

/** Mesh geometry baked into the model's normalised space, non-indexed. */
function bakedGeometry(mesh: THREE.Mesh) {
  let g = mesh.geometry.clone();
  if (g.index) g = g.toNonIndexed();
  g.applyMatrix4(mesh.matrixWorld);
  return g;
}

/** Split a non-indexed geometry into clusters, one triangle at a time. */
function splitTriangles(
  geom: THREE.BufferGeometry,
  clusters: number,
  assign: (cx: number, cy: number, cz: number) => number
) {
  const names = Object.keys(geom.attributes);
  const src = names.map((n) => geom.attributes[n] as THREE.BufferAttribute);
  const out: number[][][] = Array.from({ length: clusters }, () => names.map(() => []));
  const pos = geom.attributes.position;
  for (let t = 0; t < pos.count; t += 3) {
    const cx = (pos.getX(t) + pos.getX(t + 1) + pos.getX(t + 2)) / 3;
    const cy = (pos.getY(t) + pos.getY(t + 1) + pos.getY(t + 2)) / 3;
    const cz = (pos.getZ(t) + pos.getZ(t + 1) + pos.getZ(t + 2)) / 3;
    const k = assign(cx, cy, cz);
    src.forEach((attr, a) => {
      const arr = attr.array as ArrayLike<number>;
      const size = attr.itemSize;
      for (let i = t * size; i < (t + 3) * size; i++) out[k][a].push(arr[i]);
    });
  }
  return out
    .filter((attrs) => attrs[0].length > 0)
    .map((attrs) => {
      const g = new THREE.BufferGeometry();
      names.forEach((n, a) => g.setAttribute(n, new THREE.Float32BufferAttribute(attrs[a], src[a].itemSize)));
      return g;
    });
}

/** Spread seed points over the surface with farthest-point sampling (Voronoi sites). */
function voronoiSeeds(geom: THREE.BufferGeometry, count: number, rand: () => number) {
  const pos = geom.attributes.position;
  const tris = pos.count / 3;
  const step = Math.max(1, Math.floor(tris / 4000));
  const pts: THREE.Vector3[] = [];
  for (let t = 0; t < tris; t += step) {
    const i = t * 3;
    pts.push(
      new THREE.Vector3(
        (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3,
        (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3,
        (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3
      )
    );
  }
  const seeds = [pts[Math.floor(rand() * pts.length)]];
  const dist = pts.map((p) => p.distanceToSquared(seeds[0]));
  while (seeds.length < count) {
    let best = 0;
    for (let i = 1; i < pts.length; i++) if (dist[i] > dist[best]) best = i;
    seeds.push(pts[best]);
    for (let i = 0; i < pts.length; i++) dist[i] = Math.min(dist[i], pts[i].distanceToSquared(pts[best]));
  }
  return seeds;
}

/** One movable piece of the shattered bottle. */
type Piece = {
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  group: LinkGroup;
  progress: "glass" | "label" | "cap" | "bulb";
  base: THREE.Vector3; // centroid, model space
  dir: THREE.Vector3; // outward unit direction
  dist: number; // travel at full burst, in bottle heights
  axis: THREE.Vector3; // spin axis
  spin: number; // spin at full burst, radians
  phase: number; // idle float phase
  radius: number; // bounding radius, model space
};

/* ------------------------------------------------------------------ */
/*  Hero layout measurement (keeps the bottle clear of the heading and shop row) */
/* ------------------------------------------------------------------ */
function useHeroLayout() {
  const layout = useRef({ heightPx: 400, offsetPx: 0, vh: 800 });
  useEffect(() => {
    const measure = () => {
      layout.current = measureHeroBand();
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return layout;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroBottleModel({ url = BOTTLE_MODEL_URL }: { url?: string }) {
  const { scene } = useGLTF(url);
  const labelTexture = useTexture(LABEL_TEXTURE_URL);
  const gl = useThree((s) => s.gl);

  const groupRef = useRef<THREE.Group>(null);
  const layout = useHeroLayout();

  // Particles: fewer on small screens, none for reduced motion
  const particleCount = useMemo(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return 0;
    return window.innerWidth < MOTION.smallScreen ? MOTION.particles.perActiveMobile : MOTION.particles.perActive;
  }, []);

  /* ---------- Materials (one per link group so groups can dim / glow independently) ---------- */
  const materials = useMemo(() => {
    const map = labelTexture.clone();
    map.flipY = LABEL_TEXTURE.flipY;
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = gl.capabilities.getMaxAnisotropy();
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.center.set(0.5, 0.5);
    map.rotation = LABEL_TEXTURE.rotation;
    map.repeat.set(...LABEL_TEXTURE.repeat);
    map.offset.set(...LABEL_TEXTURE.offset);
    map.needsUpdate = true;

    const label = new THREE.MeshStandardMaterial({
      map,
      roughness: 0.55,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      emissive: new THREE.Color("#a3404f"), // burgundy lift — brightens without washing out the print
      emissiveIntensity: 0,
    });
    const mats: Record<LinkGroup, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial> = {
      // See-through amber / burgundy glass, double-sided so shard interiors read as glass
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#e8784f"),
        metalness: 0,
        roughness: 0.05,
        transmission: 1,
        thickness: 0.22, // DoubleSide = light passes two walls, so keep each wall thin
        ior: 1.5,
        attenuationColor: new THREE.Color("#8a2410"),
        attenuationDistance: 1.1,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        specularIntensity: 1,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
        transparent: true,
        emissive: new THREE.Color("#ff6a3d"),
        emissiveIntensity: 0,
      }),
      labelL: label,
      labelR: label.clone(),
      cap: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#121012"),
        roughness: 0.45,
        metalness: 0.1,
        transparent: true,
        emissive: new THREE.Color("#8a6f6a"),
        emissiveIntensity: 0,
      }),
      bulb: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0e0c0d"),
        roughness: 0.75,
        metalness: 0.05,
        transparent: true,
        emissive: new THREE.Color("#8a6f6a"),
        emissiveIntensity: 0,
      }),
    };
    return mats;
  }, [labelTexture, gl]);

  useEffect(
    () => () => {
      (materials.labelL as THREE.MeshStandardMaterial).map?.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    },
    [materials]
  );

  /* ---------- Build: normalise (Y-up, centred, height 1) then shatter into pieces ---------- */
  const built = useMemo(() => {
    const root = scene.clone(true);
    const orient = new THREE.Group();
    orient.add(root);
    orient.updateMatrixWorld(true);

    // 1. Up axis
    const size = new THREE.Box3().setFromObject(orient).getSize(new THREE.Vector3());
    if (size.z > size.y && size.z >= size.x) orient.rotation.x = -Math.PI / 2;
    else if (size.x > size.y && size.x > size.z) orient.rotation.z = Math.PI / 2;
    orient.updateMatrixWorld(true);

    // 2. Classify
    const meshes: THREE.Mesh[] = [];
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });
    const parts = meshes.map(classify);
    if (!parts.includes("label")) {
      const others = parts.flatMap((p, i) => (p === "other" ? [i] : []));
      if (others.length === 1) parts[others[0]] = "label";
    }

    // 3. Cap end up
    const capBox = new THREE.Box3();
    meshes.forEach((m, i) => (parts[i] === "cap" || parts[i] === "bulb") && capBox.expandByObject(m));
    const full = new THREE.Box3().setFromObject(orient);
    if (!capBox.isEmpty() && capBox.getCenter(new THREE.Vector3()).y < full.getCenter(new THREE.Vector3()).y) {
      orient.rotateX(Math.PI);
      orient.updateMatrixWorld(true);
      full.setFromObject(orient);
    }

    // 4. Label UVs need the final orientation
    meshes.forEach((m, i) => parts[i] === "label" && ensureWrapUV(m));

    // 5. Normalise to height 1, centred on the origin
    const center = full.getCenter(new THREE.Vector3());
    const height = full.getSize(new THREE.Vector3()).y || 1;
    orient.position.sub(center);
    const normalised = new THREE.Group();
    normalised.add(orient);
    normalised.scale.setScalar(1 / height);
    normalised.updateMatrixWorld(true);

    // 6. Shatter. Every piece's geometry is baked into normalised space and
    //    re-centred on its own centroid, which becomes the pivot.
    const rand = rng(SHATTER_SEED);
    const top = new THREE.Group();
    const pieces: Piece[] = [];
    const addPiece = (
      geom: THREE.BufferGeometry,
      group: LinkGroup,
      progress: Piece["progress"],
      opts: { dist: number; spin: number; dir?: THREE.Vector3 }
    ) => {
      geom.computeBoundingBox();
      const c = geom.boundingBox!.getCenter(new THREE.Vector3());
      geom.translate(-c.x, -c.y, -c.z);
      geom.computeBoundingSphere();
      const mesh = new THREE.Mesh(geom, materials[group]);
      mesh.castShadow = true;
      mesh.receiveShadow = progress !== "glass";
      mesh.renderOrder = progress === "glass" ? 2 : 1;
      mesh.userData.group = group;
      const pivot = new THREE.Group();
      pivot.position.copy(c);
      pivot.add(mesh);
      top.add(pivot);
      const dir = (opts.dir ?? c.clone()).clone();
      if (dir.lengthSq() < 1e-6) dir.set(rand() - 0.5, rand() - 0.5, 0.5);
      dir.normalize();
      const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
      pieces.push({
        pivot,
        mesh,
        group,
        progress,
        base: c.clone(),
        dir,
        dist: opts.dist,
        axis,
        spin: opts.spin,
        phase: rand() * Math.PI * 2,
        radius: geom.boundingSphere?.radius ?? 0.05,
      });
    };

    const E = MOTION.explosion;
    const spinRad = THREE.MathUtils.degToRad(E.spinDeg);
    meshes.forEach((m, i) => {
      const part = parts[i];
      const g = bakedGeometry(m);
      if (part === "glass" || part === "other") {
        // Voronoi split: each triangle joins its nearest of N seed points
        const seeds = voronoiSeeds(g, GLASS_SHARDS, rand);
        const tmp = new THREE.Vector3();
        splitTriangles(g, seeds.length, (x, y, z) => {
          tmp.set(x, y, z);
          let best = 0;
          let bd = Infinity;
          seeds.forEach((s, k) => {
            const d = s.distanceToSquared(tmp);
            if (d < bd) {
              bd = d;
              best = k;
            }
          });
          return best;
        }).forEach((shard) => {
          // radial (XZ) outward with a bit of the vertical component, so shards fan out sideways
          shard.computeBoundingBox();
          const c = shard.boundingBox!.getCenter(new THREE.Vector3());
          const dir = new THREE.Vector3(c.x, c.y * (c.y < 0 ? 0.25 : 0.45), c.z);
          addPiece(shard, "glass", "glass", {
            dist: E.glassDistance * (0.75 + rand() * 0.5),
            spin: spinRad * (0.5 + rand() * 0.5),
            dir,
          });
        });
      } else if (part === "label") {
        // Vertical curved panels by angle around the bottle axis (front = +Z)
        splitTriangles(g, LABEL_PANELS, (x, _y, z) => {
          const a = Math.atan2(x, z); // -π..π, 0 = front
          return Math.min(LABEL_PANELS - 1, Math.floor(((a + Math.PI) / (2 * Math.PI)) * LABEL_PANELS));
        }).forEach((panel) => {
          panel.computeBoundingBox();
          const c = panel.boundingBox!.getCenter(new THREE.Vector3());
          addPiece(panel, c.x < 0 ? "labelL" : "labelR", "label", {
            dist: E.labelDistance * (0.9 + rand() * 0.2),
            spin: spinRad * (0.4 + rand() * 0.4),
            dir: new THREE.Vector3(c.x, 0, c.z),
          });
        });
      } else {
        // Cap / collar and bulb stay whole and lift straight up — never rotate (no unscrewing)
        addPiece(g, part, part, {
          dist: part === "cap" ? E.capLift : E.bulbLift,
          spin: 0,
          dir: new THREE.Vector3(0, 1, 0),
        });
      }
    });

    if (process.env.NODE_ENV !== "production") {
      const count = pieces.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.group]: (acc[p.group] ?? 0) + 1 }), {});
      console.info("[HeroBottleModel] pieces:", count);
    }
    return { model: top, pieces };
  }, [scene, materials]);

  /* ---------- Mutable per-frame state (refs are safe to mutate) ---------- */
  const dyn = useRef({
    pointer: new THREE.Vector2(0, 0),
    pointerInside: false,
    tilt: new THREE.Vector2(0, 0),
    dragRot: 0,
    dragVel: 0,
    dragging: false,
    lean: [] as THREE.Vector3[],
    pull: [] as number[],
    glow: {} as Record<string, number>,
    opacity: {} as Record<string, number>,
    reduced: false,
    v: new THREE.Vector3(),
    q: new THREE.Quaternion(),
    camLocal: new THREE.Vector3(),
    pointerLocal: new THREE.Vector3(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    ray: new THREE.Raycaster(),
  });

  // Tell the entrance timeline the GLB + label texture are loaded
  useEffect(() => {
    bottleScrollState.ready = true;
    window.dispatchEvent(new Event(BOTTLE_READY_EVENT));
  }, []);

  /* ---------- Pointer tracking + horizontal drag with inertia (never blocks page scroll) ---------- */
  useEffect(() => {
    const d = dyn.current;
    d.reduced = prefersReducedMotion();
    const el = gl.domElement;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastT = 0;
    let pending = false;

    const onMove = (e: PointerEvent) => {
      d.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      d.pointerInside = true;
      if (!pending && !d.dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (pending) {
        if (Math.abs(dy) > MOTION.drag.threshold && Math.abs(dy) > Math.abs(dx)) {
          pending = false; // vertical intent → let the page scroll
          return;
        }
        if (Math.abs(dx) > MOTION.drag.threshold) {
          pending = false;
          d.dragging = true;
          el.setPointerCapture?.(e.pointerId);
          lastX = e.clientX;
          lastT = performance.now();
        }
        return;
      }
      const now = performance.now();
      const step = (e.clientX - lastX) * MOTION.drag.sensitivity;
      d.dragRot += step;
      d.dragVel = step / Math.max((now - lastT) / 16.7, 0.5);
      lastX = e.clientX;
      lastT = now;
    };
    const onDown = (e: PointerEvent) => {
      if (d.reduced || e.button !== 0) return;
      pending = true;
      startX = e.clientX;
      startY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      pending = false;
      if (d.dragging) el.releasePointerCapture?.(e.pointerId);
      d.dragging = false;
    };
    const onLeave = () => {
      d.pointerInside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  /* ---------- 3D hover → highlight the linked card ---------- */
  const onPieceMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const exploded = bottleScrollState.lines > 0.5;
    bottleScrollState.hoverPiece = exploded ? (e.object.userData.group as LinkGroup) : null;
    gl.domElement.style.setProperty("cursor", exploded ? "pointer" : "grab");
  };
  const onPieceOut = () => {
    bottleScrollState.hoverPiece = null;
    gl.domElement.style.removeProperty("cursor");
  };

  /* ---------- Per frame ---------- */
  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const d = dyn.current;
    const st = bottleScrollState;
    const { pieces } = built;
    const { heightPx, offsetPx } = layout.current;
    const lerp = THREE.MathUtils.lerp;
    const damp = THREE.MathUtils.damp;
    const t = state.clock.elapsedTime;
    const pxToWorld = state.viewport.height / state.size.height;
    const H = MOTION.hover;
    const I = MOTION.idle;
    const intro = st.intro;
    const active = st.approach > 0.5 && st.exit < 0.98; // explosion section on screen
    const idleOn = active && !d.reduced;

    // Assembly: size, position, rotation (entrance rise + half-turn, drag with inertia)
    const narrow = state.size.width < MOTION.explosion.mobile.maxWidth;
    const burstScale = narrow ? MOTION.explosion.mobile.assemblyScale : MOTION.explosion.assemblyScale;
    const spread = narrow ? MOTION.explosion.mobile.spread : 1;
    const worldH = heightPx * pxToWorld * lerp(1, burstScale, st.burst);
    g.scale.setScalar(worldH);
    const heroY = -offsetPx * pxToWorld;
    const exitY = st.exit * state.size.height * pxToWorld;
    const introY = -(1 - intro) * MOTION.intro.bottle.rise * worldH;
    g.position.set(0, lerp(heroY, 0, st.approach) + exitY + introY, 0);

    if (!d.dragging) {
      d.dragRot += d.dragVel;
      d.dragVel *= Math.pow(MOTION.drag.inertia, delta * 60);
      // outside the explosion section, ease any drag spin back so the label faces front
      if (!active) d.dragRot = damp(d.dragRot, 0, 2.5, delta);
    }
    d.tilt.x = damp(d.tilt.x, d.pointer.x * 0.25, 4, delta);
    d.tilt.y = damp(d.tilt.y, -d.pointer.y * 0.08, 4, delta);
    g.rotation.set(
      d.tilt.y,
      lerp(HERO_ROTATION_Y, EXPLOSION_ROTATION_Y, st.approach) +
        d.tilt.x +
        d.dragRot +
        (1 - intro) * MOTION.intro.bottle.turns * Math.PI * 2,
      0
    );
    g.updateMatrixWorld(true);

    // Camera direction and pointer, expressed in the assembly's local space
    d.q.copy(g.quaternion).invert();
    d.camLocal.set(0, 0, 1).applyQuaternion(d.q);
    d.ray.setFromCamera(d.pointer, state.camera);
    const hit = d.ray.ray.intersectPlane(d.plane, d.v);
    if (hit) d.pointerLocal.copy(g.worldToLocal(d.v.clone()));

    // Hover targets (card hover wins over piece hover)
    const focus = st.hoverCard ?? st.hoverPiece;
    (Object.keys(materials) as LinkGroup[]).forEach((grp) => {
      const on = focus === grp;
      d.glow[grp] = damp(d.glow[grp] ?? 0, on ? H.glow : 0, H.lerp, delta);
      d.opacity[grp] = damp(d.opacity[grp] ?? 1, focus && !on ? H.dimOpacity : 1, H.lerp, delta);
      materials[grp].setValues({ emissiveIntensity: d.glow[grp], opacity: d.opacity[grp] });
    });

    // Pieces
    if (d.lean.length !== pieces.length) {
      d.lean = pieces.map(() => new THREE.Vector3());
      d.pull = pieces.map(() => 0);
    }
    const progressOf = { glass: st.glass, label: st.label, cap: st.cap, bulb: st.bulb };
    const pxPerUnit = worldH / pxToWorld;
    if (st.pieces.length !== pieces.length) {
      st.pieces = pieces.map((p) => ({ group: p.group, x: 0, y: 0, r: 0 }));
    }
    pieces.forEach((p, i) => {
      const k = progressOf[p.progress];
      const pos = d.v.copy(p.base).addScaledVector(p.dir, p.dist * k * spread);

      // idle float + drift, only while the explosion section is active
      if (idleOn) {
        const amp = st.burst;
        pos.y += Math.sin(t * I.floatSpeed + p.phase) * I.floatAmp * amp;
        pos.x += Math.sin(t * I.floatSpeed * 0.63 + p.phase * 1.7) * I.driftAmp * amp;
      }

      // lean away from the cursor (small, damped)
      const lean = d.lean[i];
      if (d.pointerInside && !d.reduced && k > 0.05) {
        const away = d.v.clone().sub(d.pointerLocal).setZ(0);
        const dist = Math.max(away.length(), 1e-3);
        away.multiplyScalar((H.leanAmp * Math.exp(-dist * 2.2) * k) / dist);
        lean.set(damp(lean.x, away.x, H.lerp, delta), damp(lean.y, away.y, H.lerp, delta), 0);
      } else {
        lean.multiplyScalar(Math.exp(-H.lerp * delta));
      }
      pos.add(lean);

      // hovered group comes toward the camera
      d.pull[i] = damp(d.pull[i], focus === p.group ? H.pull * Math.max(k, 0.3) : 0, H.lerp, delta);
      pos.addScaledVector(d.camLocal, d.pull[i]);

      p.pivot.position.copy(pos);
      const idleSpin = idleOn ? Math.sin(t * 0.5 + p.phase) * I.spinAmp * st.burst : 0;
      p.pivot.quaternion.setFromAxisAngle(p.axis, p.spin * k + (p.spin ? idleSpin : 0));

      // screen position for the connector lines
      p.pivot.getWorldPosition(d.v).project(state.camera);
      const a = st.pieces[i];
      a.x = (d.v.x + 1) * 0.5 * state.size.width;
      a.y = (1 - d.v.y) * 0.5 * state.size.height;
      a.r = Math.max(p.radius * pxPerUnit * 0.6, 6);
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={built.model} onPointerMove={onPieceMove} onPointerOut={onPieceOut} />
      {particleCount > 0 && <IngredientParticles perActive={particleCount} />}
      <ContactShadows
        position={[0, -0.51, 0]}
        opacity={0.6}
        scale={1.4}
        blur={2.6}
        far={0.6}
        resolution={512}
        color="#000000"
      />
    </group>
  );
}

useTexture.preload(LABEL_TEXTURE_URL);
