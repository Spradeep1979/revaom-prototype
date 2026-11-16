"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { ProductId, productsData } from "@/data/productData";

interface ClinicalSectionProps {
  selectedProduct: ProductId;
}

export default function ClinicalSection({ selectedProduct = "poise" }: ClinicalSectionProps) {
  const [selectedStage, setSelectedStage] = useState(0);
  const currentProduct = productsData[selectedProduct] || productsData.poise;
  const clinicals = currentProduct.clinicals;
  const isPoise = selectedProduct === "poise";

  return (
    <section
      id="clinical-section"
      className={`relative min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-24 overflow-hidden select-none transition-colors duration-700 ${
        isPoise ? "bg-[#08101e]" : "bg-[#0c0d12]"
      }`}
    >
      {/* Background ambient spotlight */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isPoise
            ? "bg-[radial-gradient(circle_at_40%_55%,rgba(20,50,95,0.4)_0%,rgba(8,16,30,0.98)_75%)]"
            : "bg-[radial-gradient(circle_at_40%_55%,rgba(38,32,18,0.35)_0%,rgba(12,13,18,0.98)_75%)]"
        }`}
      />

      <div className="relative z-10 w-full max-w-7xl flex flex-col justify-center">
        
        {/* Section Header */}
        <div className="clinical-reveal flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase mb-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPoise ? "bg-cyan-400" : "bg-amber-400"
                }`}
              />
              <span>Section 04 / In-Vivo Clinical Efficacy</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
              Documented Proof.
            </h2>
          </div>

          <div className="mt-2 sm:mt-0 flex items-center gap-2 text-xs font-mono text-slate-300">
            <ShieldCheck
              className={`w-4 h-4 ${
                isPoise ? "text-cyan-400" : "text-amber-400"
              }`}
            />
            <span>{clinicals.sampleSize}</span>
          </div>
        </div>

        {/* 2-Column Clinical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Column 1: Big Clinical Callout Metric (5 cols) */}
          <div className="clinical-reveal lg:col-span-5 flex flex-col justify-center">
            <div
              className={`relative rounded-3xl p-8 sm:p-10 border transition-all ${
                isPoise
                  ? "bg-gradient-to-br from-[#0c203e]/90 via-[#071326]/90 to-[#040914] border-cyan-400/40 shadow-[0_20px_50px_rgba(2,6,18,0.9)]"
                  : "bg-gradient-to-br from-[#1c1a16]/90 via-[#131210]/90 to-[#0a0a0d] border-amber-400/40 shadow-[0_20px_50px_rgba(2,6,18,0.9)]"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase ${
                    isPoise ? "text-cyan-300" : "text-amber-300"
                  }`}
                >
                  Clinical Standard
                </span>
                <Award
                  className={`w-4 h-4 ${
                    isPoise ? "text-cyan-400" : "text-amber-400"
                  }`}
                />
              </div>

              <div className="my-6">
                <span
                  className={`font-cinzel text-6xl sm:text-7xl font-bold tracking-tight block ${
                    isPoise ? "text-cyan-400" : "text-amber-400"
                  }`}
                >
                  {clinicals.heroStat}
                </span>
                <p className="font-cinzel text-lg sm:text-xl text-white font-medium mt-2 leading-snug">
                  {clinicals.heroLabel}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>REVAÔM {currentProduct.name}</span>
                <span>Third-Party Verified</span>
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Timeline Accordion / Progression (7 cols) */}
          <div className="clinical-reveal lg:col-span-7 flex flex-col gap-3">
            {clinicals.timeline.map((stage, idx) => {
              const isSelected = selectedStage === idx;

              return (
                <div
                  key={stage.day}
                  onClick={() => setSelectedStage(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? isPoise
                        ? "bg-blue-950/80 border-cyan-400/60 shadow-lg shadow-cyan-500/10"
                        : "bg-zinc-900/80 border-amber-400/60 shadow-lg shadow-amber-500/10"
                      : "bg-slate-950/40 hover:bg-slate-900/40 border-white/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                          isSelected
                            ? isPoise
                              ? "bg-cyan-950/80 border-cyan-400/50 text-cyan-300"
                              : "bg-amber-950/80 border-amber-400/50 text-amber-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {stage.day}
                      </span>
                      <h4 className="font-cinzel text-base sm:text-lg font-semibold text-white">
                        {stage.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-sm font-bold ${
                          isPoise ? "text-cyan-400" : "text-amber-400"
                        }`}
                      >
                        {stage.percentage}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isSelected
                            ? isPoise
                              ? "text-cyan-400"
                              : "text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-300/80 font-light leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
