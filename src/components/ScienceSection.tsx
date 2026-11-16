"use client";

import { useState } from "react";
import { Sparkles, Dna, ShieldCheck, Zap, Activity } from "lucide-react";

const sciencePillars = [
  {
    num: "01",
    title: "Bio-Peptide Scaffolding",
    subtitle: "Hexapeptide-8 + Palmitoyl-38",
    description:
      "Deep structural signaling peptides that trigger the synthesis of 6 major dermal matrix constituents, reinforcing extracellular facial scaffolding.",
    metric: "+38% Dermal Density",
    tag: "STRUCTURAL RENEWAL",
  },
  {
    num: "02",
    title: "Botanical Biomimetics",
    subtitle: "Embryonic Phyto-Compounds",
    description:
      "Bio-engineered desert resurrection actives that replicate plant epigenetic preservation mechanisms, halting cellular senescence and DNA strand degradation.",
    metric: "Epigenetic Defense",
    tag: "LONGEVITY DEFENSE",
  },
  {
    num: "03",
    title: "ActivIQ™ Bio-Vehicle",
    subtitle: "Liposomal Membrane Fusion",
    description:
      "Engineered with phospho-lipid bilayers identical to human cell membranes, enabling direct cellular fusion for 4.6x enhanced peptide delivery without barrier trauma.",
    metric: "98.4% Cellular Uptake",
    tag: "INTELLIGENT DELIVERY",
  },
  {
    num: "04",
    title: "Chrono-Hydric Scaffolding",
    subtitle: "Multi-Weight Hyaluronic Polymers",
    description:
      "Cross-linked molecular cushions that retain 1,000x their weight in water across epidermis and dermis, eliminating trans-epidermal dehydration creases.",
    metric: "+82% Moisture Retention",
    tag: "CHRONO-HYDRATION",
  },
];

export default function ScienceSection() {
  const [activeCard, setActiveCard] = useState<number>(0);

  return (
    <section
      id="science-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 bg-[#060c18] overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(22,52,98,0.45)_0%,rgba(6,12,24,0.98)_75%)] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 text-[14vw] font-cinzel font-black text-blue-500/[0.015] pointer-events-none select-none">
        ACTIVIQ
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col justify-center">
        
        {/* Section Headline */}
        <div className="science-reveal flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-blue-400/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-blue-200/70 uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Section 03 / Cellular Delivery Architecture</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
              The Biomimetic Synthesis.
            </h2>
          </div>

          <p className="mt-2 sm:mt-0 text-xs sm:text-sm font-light text-blue-100/70 max-w-md">
            Harnessing evolutionary botanicals and bio-peptides. Formulated to communicate directly with human skin cell receptors.
          </p>
        </div>

        {/* 4 Arched Architectural Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {sciencePillars.map((pillar, idx) => {
            const isHovered = activeCard === idx;
            return (
              <div
                key={pillar.num}
                onMouseEnter={() => setActiveCard(idx)}
                className={`science-card group relative rounded-3xl p-6 transition-all duration-500 cursor-pointer overflow-hidden border ${
                  isHovered
                    ? "bg-[#0f213d] border-blue-400/40 shadow-[0_20px_50px_rgba(2,6,18,0.85)] -translate-y-2"
                    : "bg-[#091528]/80 border-blue-400/15 hover:border-blue-400/30"
                }`}
              >
                {/* Top arch motif */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                {/* Card Number & Tag */}
                <div className="flex items-center justify-between pb-3 border-b border-blue-400/15 mb-4">
                  <span className="font-mono text-xs font-bold text-blue-300">
                    {pillar.num}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-950 text-[9px] font-mono tracking-wider text-cyan-300 uppercase border border-blue-400/20">
                    {pillar.tag}
                  </span>
                </div>

                {/* Subtitle & Title */}
                <div className="space-y-1 my-3">
                  <span className="text-[10px] font-mono text-blue-300/70 block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide group-hover:text-cyan-200 transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-blue-100/70 font-light leading-relaxed my-4">
                  {pillar.description}
                </p>

                {/* Metric pill */}
                <div className="mt-4 pt-3 border-t border-blue-400/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-blue-300/60 uppercase">
                    Observed Metric
                  </span>
                  <span className="text-xs font-mono font-semibold text-white tracking-wide">
                    {pillar.metric}
                  </span>
                </div>

                {/* Glowing bottom line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
