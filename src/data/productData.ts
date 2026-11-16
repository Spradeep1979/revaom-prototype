export type ProductId = "poise" | "awake";

export interface IngredientItem {
  id: number;
  badgeNum: string;
  name: string;
  tagline: string;
  metric: string;
  description: string;
  iconName: "Zap" | "Dna" | "Sparkles" | "Droplets" | "Eye" | "Coffee" | "Shield";
  hotspotTop: string;
  hotspotLeft: string;
}

export interface ArchwayPortal {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  caption: string;
  image: string;
  aspect: string;
}

export interface CarouselCard {
  id: number;
  title: string;
  tagline: string;
  badge: string;
  price?: string;
  stat?: string;
  statLabel?: string;
  image: string;
  imageType: "bottle" | "box" | "duo" | "macro";
  description: string;
  iconName: "Zap" | "Dna" | "Sparkles" | "Award" | "Box" | "Droplets";
}

export interface ClinicalMetric {
  day: string;
  title: string;
  percentage: string;
  label: string;
  metric: string;
  description: string;
}

export interface ProductConfig {
  id: ProductId;
  name: string;
  subtitle: string;
  volume: string;
  price: string;
  priceNum: number;
  badge: string;
  keyActives: string;
  description: string;
  bottleImage: string;
  boxImage: string;
  duoImage: string;
  theme: {
    bgRoot: string;
    accentGlow: string;
    accentBorder: string;
    accentText: string;
    pillBg: string;
    pillActive: string;
    dotGlow: string;
    sidebarActiveBg: string;
    sidebarActiveBorder: string;
    buttonBg: string;
  };
  ingredients: IngredientItem[];
  archways: ArchwayPortal[];
  carouselCards: CarouselCard[];
  clinicals: {
    heroStat: string;
    heroLabel: string;
    sampleSize: string;
    timeline: ClinicalMetric[];
  };
  ritual: {
    step: string;
    instructions: string[];
    pairingTip: string;
  };
}

export const productsData: Record<ProductId, ProductConfig> = {
  poise: {
    id: "poise",
    name: "POISE",
    subtitle: "Anti-Aging Serum",
    volume: "30 ML / 1.0 FL. OZ.",
    price: "$94.00",
    priceNum: 94,
    badge: "REVAÔM FORMULATION NO. 02 • FACIAL ARCHITECTURE",
    keyActives: "Advanced Bio-Peptides + Botanical Biomimetics",
    description: "Formulated for deep cellular scaffolding remodeling, mitochondrial renewal, and osmotic longevity across dermal layers.",
    bottleImage: "/images/poise-bottle-cutout.png",
    boxImage: "/images/poise-box-cutout.png",
    duoImage: "/images/poise-hero.jpg",
    theme: {
      bgRoot: "bg-[#060c18]",
      accentGlow: "rgba(30, 80, 180, 0.35)",
      accentBorder: "border-blue-400/30",
      accentText: "text-cyan-400",
      pillBg: "bg-blue-950/40 border-blue-500/20",
      pillActive: "bg-gradient-to-r from-blue-700 to-cyan-700 text-white shadow-[0_0_18px_rgba(56,189,248,0.4)]",
      dotGlow: "bg-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]",
      sidebarActiveBg: "bg-gradient-to-r from-blue-950/90 via-blue-900/40 to-slate-950/80",
      sidebarActiveBorder: "border-cyan-400/60 shadow-[0_10px_35px_rgba(6,182,212,0.15)]",
      buttonBg: "bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
    },
    ingredients: [
      {
        id: 1,
        badgeNum: "01",
        name: "ActivIQ™ Bio-Vehicle",
        tagline: "Cellular Lipid Membrane Fusion",
        metric: "98.4% Uptake",
        description: "Phospholipid nanosomes identical to human cellular bilayers. Delivers actives directly through periorbital lipid barriers without irritation.",
        iconName: "Zap",
        hotspotTop: "15%",
        hotspotLeft: "52%",
      },
      {
        id: 2,
        badgeNum: "02",
        name: "Advanced Bio-Peptides",
        tagline: "Cellular Scaffolding Remodeling",
        metric: "+38% Density",
        description: "Hexapeptide-8 and Palmitoyl-38 signal fibroblasts to accelerate extracellular type I, III, and IV collagen synthesis.",
        iconName: "Dna",
        hotspotTop: "44%",
        hotspotLeft: "28%",
      },
      {
        id: 3,
        badgeNum: "03",
        name: "Botanical Biomimetics",
        tagline: "Epigenetic Longevity Defense",
        metric: "Reverses Senescence",
        description: "Bio-engineered Haberlea resurrection extracts replicating embryonic plant longevity to defend against oxidative stress.",
        iconName: "Sparkles",
        hotspotTop: "68%",
        hotspotLeft: "72%",
      },
      {
        id: 4,
        badgeNum: "04",
        name: "Chrono-Hydric Cushion",
        tagline: "Multi-Depth Moisture Scaffolding",
        metric: "1,000x Cushion",
        description: "Multi-weight cross-polymer hyaluronate delivering sustained osmotic hydration that firms and smooths micro-creases.",
        iconName: "Droplets",
        hotspotTop: "84%",
        hotspotLeft: "42%",
      },
    ],
    archways: [
      {
        id: "arch-1",
        number: "01",
        title: "Micro-Dosing Pipette",
        subtitle: "AEROSPACE TOLERANCE",
        caption: "Metered cryo-dispenser delivering exact 0.25ml cellular doses.",
        image: "/images/arch-dropper.jpg",
        aspect: "h-[320px] sm:h-[400px] w-[180px] sm:w-[220px]",
      },
      {
        id: "arch-2",
        number: "02",
        title: "Artisan Box Architecture",
        subtitle: "UV-BARRIER LINING",
        caption: "Deep royal navy and chalk casing precision-milled to shield delicate peptides from photo-degradation.",
        image: "/images/arch-box.jpg",
        aspect: "h-[380px] sm:h-[480px] w-[220px] sm:w-[280px]",
      },
      {
        id: "arch-3",
        number: "03",
        title: "Full Synthesis Flacon",
        subtitle: "COBALT FLINT GLASS",
        caption: "Heavy base sculpted bottle paired with the ceremonial presentation housing.",
        image: "/images/arch-duo.jpg",
        aspect: "h-[380px] sm:h-[480px] w-[220px] sm:w-[280px]",
      },
      {
        id: "arch-4",
        number: "04",
        title: "ActivIQ™ Bio-Active",
        subtitle: "INTELLIGENT FUSION",
        caption: "The molecular engine optimizing active absorption deep within dermal layers.",
        image: "/images/arch-label.jpg",
        aspect: "h-[320px] sm:h-[400px] w-[180px] sm:w-[220px]",
      },
    ],
    carouselCards: [
      {
        id: 0,
        title: "POISE Serum",
        tagline: "30 ML / 1.0 FL. OZ.",
        badge: "FLAGSHIP FORMULATION",
        price: "$94.00",
        image: "/images/poise-bottle-cutout.png",
        imageType: "bottle",
        description: "Advanced bio-peptides and botanical biomimetics in deep cobalt glass with precision cryo-dispenser.",
        iconName: "Zap",
      },
      {
        id: 1,
        title: "Architectural Box",
        tagline: "ARTISAN CASING",
        badge: "UV-BARRIER PROTECTION",
        price: "Included",
        image: "/images/poise-box-cutout.png",
        imageType: "box",
        description: "Architectural royal navy & chalk curved packaging designed to shield sensitive bio-peptides from light.",
        iconName: "Box",
      },
      {
        id: 2,
        title: "ActivIQ™ Nanosomes",
        tagline: "CELLULAR BIO-VEHICLE",
        badge: "98.4% BIO-UPTAKE",
        stat: "98.4%",
        statLabel: "Membrane Fusion",
        image: "/images/arch-label.jpg",
        imageType: "macro",
        description: "Sub-micron phospholipid bilayers that fuse seamlessly with epidermal cell walls for deep dermal delivery.",
        iconName: "Dna",
      },
      {
        id: 3,
        title: "In-Vivo Longevity",
        tagline: "CLINICAL CONFIRMATION",
        badge: "DOUBLE BLIND TRIAL",
        stat: "+38%",
        statLabel: "Dermal Density",
        image: "/images/arch-duo.jpg",
        imageType: "macro",
        description: "Third-party biometric scanning confirms increased extracellular matrix thickness and wrinkle reduction in 28 days.",
        iconName: "Award",
      },
      {
        id: 4,
        title: "The Complete Duo",
        tagline: "AWAKE + POISE RITUAL",
        badge: "COMPLEMENTARY PROTOCOL",
        price: "$165.00",
        image: "/images/poise-hero.jpg",
        imageType: "duo",
        description: "Layer POISE Anti-Aging Serum with AWAKE Under Eye Elixir for comprehensive periorbital and facial cellular rejuvenation.",
        iconName: "Sparkles",
      },
    ],
    clinicals: {
      heroStat: "94.6%",
      heroLabel: "Patients reported measurable lifting and skin elasticity rejuvenation",
      sampleSize: "n = 64 • 28-Day Clinical Trial",
      timeline: [
        {
          day: "DAY 07",
          title: "Micro-Relief & Hydration",
          percentage: "+46%",
          label: "Hydration Barrier Surge",
          metric: "TEWL Reduced by 34%",
          description: "Immediate stratum corneum plumping; superficial fine micro-creases visibly smoothed.",
        },
        {
          day: "DAY 14",
          title: "Cellular Firming",
          percentage: "+29%",
          label: "Tensile Dermal Firmness",
          metric: "Cutometer R0 / R2 Index",
          description: "Bio-peptides stimulate pro-collagen synthesis, firming facial contours and cheek volume.",
        },
        {
          day: "DAY 28",
          title: "Deep Scaffolding Architecture",
          percentage: "-38%",
          label: "Depth of Expression Wrinkles",
          metric: "Optical 3D Profilometry",
          description: "Mitochondrial energy replenished, cellular senescence stalled, and structural dermal density visibly restored.",
        },
      ],
    },
    ritual: {
      step: "02 • FACIAL RESTORATION",
      instructions: [
        "Warm 3-4 drops between fingertips to activate biomimetic lipid carriers.",
        "Press gently upwards along jawline, cheekbones, and forehead.",
        "Allow 60 seconds for ActivIQ™ nanosomes to fully fuse with cellular membranes.",
      ],
      pairingTip: "Follow with AWAKE Under Eye Elixir on the orbital rim for targeted darkness and de-puffing.",
    },
  },

  awake: {
    id: "awake",
    name: "AWAKE",
    subtitle: "Advanced Under Eye Elixir",
    volume: "30 ML / 1.0 FL. OZ.",
    price: "$88.00",
    priceNum: 88,
    badge: "REVAÔM FORMULATION NO. 01 • PERIORBITAL MICRO-CIRCULATION",
    keyActives: "Encapsulated Caffeine + Tri-Peptide Complex",
    description: "Engineered specifically for the delicate 0.5mm periorbital eye envelope: draining lymphatic fluid, draining dark vascular pooling, and firming orbital micro-scaffolding.",
    bottleImage: "/images/revaom-bottle-cutout.png",
    boxImage: "/images/revaom-box-cutout.png",
    duoImage: "/images/revaom-hero.jpg",
    theme: {
      bgRoot: "bg-[#0a0b0e]",
      accentGlow: "rgba(217, 119, 6, 0.25)",
      accentBorder: "border-amber-400/30",
      accentText: "text-amber-300",
      pillBg: "bg-zinc-900/60 border-zinc-700/40",
      pillActive: "bg-gradient-to-r from-zinc-700 to-amber-700 text-white shadow-[0_0_18px_rgba(245,158,11,0.35)]",
      dotGlow: "bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)]",
      sidebarActiveBg: "bg-gradient-to-r from-zinc-900/90 via-zinc-800/40 to-black/80",
      sidebarActiveBorder: "border-amber-400/60 shadow-[0_10px_35px_rgba(245,158,11,0.15)]",
      buttonBg: "bg-gradient-to-r from-zinc-800 via-amber-700 to-amber-600 hover:from-zinc-700 hover:to-amber-500",
    },
    ingredients: [
      {
        id: 1,
        badgeNum: "01",
        name: "ActivIQ™ Caffeine Liposomes",
        tagline: "Micro-Encapsulated Bio-Drainage",
        metric: "96.8% Penetration",
        description: "Phospholipid spheres encapsulating pure pharmaceutical caffeine for controlled 18-hour sustained periorbital drainage.",
        iconName: "Coffee",
        hotspotTop: "18%",
        hotspotLeft: "52%",
      },
      {
        id: 2,
        badgeNum: "02",
        name: "Tri-Peptide Periorbital Complex",
        tagline: "Micro-Capillary Tone Restoration",
        metric: "-42% Puffiness",
        description: "Acetyl Tetrapeptide-5 and Palmitoyl Tripeptide-38 strengthen micro-capillary walls to prevent lymphatic fluid leakage.",
        iconName: "Dna",
        hotspotTop: "48%",
        hotspotLeft: "30%",
      },
      {
        id: 3,
        badgeNum: "03",
        name: "Phyto-Brightening Matrix",
        tagline: "Chromophore & Pigment Eraser",
        metric: "Fades Hemoglobin",
        description: "Niacinamide, Chrysin, and Ruscus Aculeatus target both blue/purple vascular pooling and brown melanin shadowing.",
        iconName: "Eye",
        hotspotTop: "68%",
        hotspotLeft: "70%",
      },
      {
        id: 4,
        badgeNum: "04",
        name: "Optical Soft-Focus Prisms",
        tagline: "Sub-Micron Light Refraction",
        metric: "Instant Luminescence",
        description: "Micro-milled optical silica spheres refract ambient light away from shadow hollows for an immediate radiant awakening effect.",
        iconName: "Sparkles",
        hotspotTop: "84%",
        hotspotLeft: "46%",
      },
    ],
    archways: [
      {
        id: "arch-awake-1",
        number: "01",
        title: "Periorbital Micro-Droplet",
        subtitle: "CRYO-METERED CALIBRATION",
        caption: "Exact 0.15ml dose engineered specifically for the ultra-thin 0.5mm ocular barrier.",
        image: "/images/arch-awake-dropper.jpg",
        aspect: "h-[320px] sm:h-[400px] w-[180px] sm:w-[220px]",
      },
      {
        id: "arch-awake-2",
        number: "02",
        title: "Obsidian Packaging",
        subtitle: "CHARCOAL TACTILE CASING",
        caption: "Deep mineral charcoal soft-touch casing embossed with silver foil typography.",
        image: "/images/arch-awake-box.jpg",
        aspect: "h-[380px] sm:h-[480px] w-[220px] sm:w-[280px]",
      },
      {
        id: "arch-awake-3",
        number: "03",
        title: "Nocturnal & Morning Elixir",
        subtitle: "PERIORBITAL MONOLITH",
        caption: "Flacon housing the amber-tinted active matrix shielded against ambient degradation.",
        image: "/images/arch-awake-duo.jpg",
        aspect: "h-[380px] sm:h-[480px] w-[220px] sm:w-[280px]",
      },
      {
        id: "arch-awake-4",
        number: "04",
        title: "ActivIQ™ Micro-Delivery",
        subtitle: "ENCAPSULATED CAFFEINE",
        caption: "Sub-micron encapsulation delivering sustained vascular drain for 18 continuous hours.",
        image: "/images/arch-awake-label.jpg",
        aspect: "h-[320px] sm:h-[400px] w-[180px] sm:w-[220px]",
      },
    ],
    carouselCards: [
      {
        id: 0,
        title: "AWAKE Elixir",
        tagline: "30 ML / 1.0 FL. OZ.",
        badge: "PERIORBITAL ELIXIR",
        price: "$88.00",
        image: "/images/revaom-bottle-cutout.png",
        imageType: "bottle",
        description: "Encapsulated caffeine and tri-peptides in charcoal amber glass for targeted under-eye awakening.",
        iconName: "Zap",
      },
      {
        id: 1,
        title: "Charcoal Monolith Box",
        tagline: "TACTILE ARTISAN CASING",
        badge: "MINERAL PACKAGING",
        price: "Included",
        image: "/images/revaom-box-cutout.png",
        imageType: "box",
        description: "Tactile charcoal finish packaging reflecting the minimalist Parisian laboratory aesthetic.",
        iconName: "Box",
      },
      {
        id: 2,
        title: "Encapsulated Caffeine",
        tagline: "LIPOSOMAL BIO-DRAIN",
        badge: "96.8% OSMOTIC FLUX",
        stat: "-42%",
        statLabel: "Under-Eye Volume",
        image: "/images/arch-awake-label.jpg",
        imageType: "macro",
        description: "Pharmaceutical-grade caffeine delivers rapid micro-capillary vasoconstriction to eliminate eye bag edema.",
        iconName: "Droplets",
      },
      {
        id: 3,
        title: "Dark Circle Fading",
        tagline: "CLINICAL EVALUATION",
        badge: "CHROMATIC SPECTROPHOTOMETRY",
        stat: "91.2%",
        statLabel: "Visible Brightening",
        image: "/images/arch-awake-duo.jpg",
        imageType: "macro",
        description: "Clinical imaging confirms breakdown of stagnant iron deposits and hemoglobin pigmentation under the eyes.",
        iconName: "Award",
      },
      {
        id: 4,
        title: "The Synergistic Duo",
        tagline: "POISE + AWAKE RITUAL",
        badge: "TOTAL FACIAL PROTOCOL",
        price: "$165.00",
        image: "/images/revaom-hero.jpg",
        imageType: "duo",
        description: "Pair AWAKE for the periorbital zone with POISE Anti-Aging Serum across the face, neck, and décolleté.",
        iconName: "Sparkles",
      },
    ],
    clinicals: {
      heroStat: "92.4%",
      heroLabel: "Subjects exhibited significant reduction in under-eye bag volume & dark shadowing",
      sampleSize: "n = 58 • 28-Day Clinical Trial",
      timeline: [
        {
          day: "DAY 07",
          title: "Micro-Circulation Surge",
          percentage: "-34%",
          label: "Morning Eye Puffiness",
          metric: "Ultrasound Cutaneous Profiling",
          description: "Liposomal caffeine stimulates lymphatic return, draining fluid accumulation within 20 minutes of application.",
        },
        {
          day: "DAY 14",
          title: "Vascular De-Congestion",
          percentage: "+41%",
          label: "Periorbital Luminescence",
          metric: "Spectrophotometric Chromophore Analysis",
          description: "Breakdown of pooling hemoglobin clears deep blue and brown circles beneath delicate ocular tissue.",
        },
        {
          day: "DAY 28",
          title: "Tensile Orbital Scaffolding",
          percentage: "+33%",
          label: "Micro-Skin Elasticity & Firmness",
          metric: "Dermal Ballistometry",
          description: "Tri-peptide network fortifies thin periorbital tissue, preventing fluid pooling recurrence and smoothing crow's feet.",
        },
      ],
    },
    ritual: {
      step: "01 • PERIORBITAL AWAKENING",
      instructions: [
        "Dispense 1 micro-drop onto ring finger pad.",
        "Gently press along orbital bone from inner eye outward to temple.",
        "Allow 30 seconds for optical micro-prisms to refract light before applying facial serum.",
      ],
      pairingTip: "Follow immediately with POISE Anti-Aging Serum across the entire face for full dermal remodeling.",
    },
  },
};
