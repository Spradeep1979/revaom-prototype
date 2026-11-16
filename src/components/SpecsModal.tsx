"use client";

import { X, ShieldCheck } from "lucide-react";

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpecsModal({ isOpen, onClose }: SpecsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fadeIn"
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#091526] border border-blue-400/30 p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-400/20">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase">
              TECHNICAL SPECIFICATIONS & BIOMIMETIC DOSSIER
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide mt-0.5">
              REVAÔM POISE Formulation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-blue-950/60 hover:bg-blue-900/60 flex items-center justify-center text-blue-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-400/15">
            <span className="text-blue-300/60 block text-[10px]">FORMULA CODE</span>
            <span className="text-white font-semibold">POE-08-REV</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-400/15">
            <span className="text-blue-300/60 block text-[10px]">NET VOLUME</span>
            <span className="text-white font-semibold">30 ML / 1.0 FL.OZ</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-400/15">
            <span className="text-blue-300/60 block text-[10px]">OPTIMAL PH</span>
            <span className="text-white font-semibold">5.2 - 5.6 (ISO-DERMIC)</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-400/15">
            <span className="text-blue-300/60 block text-[10px]">CARRIER SYSTEM</span>
            <span className="text-cyan-300 font-semibold">ActivIQ™ LIPOSOMAL</span>
          </div>
        </div>

        {/* Primary Actives Breakdown */}
        <div className="space-y-3">
          <h4 className="font-cinzel text-sm font-bold text-white tracking-wider">
            Key Active Constituents
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-400/15">
              <div className="flex justify-between font-mono font-medium text-white mb-1">
                <span>Advanced Bio-Peptide Complex (4.2%)</span>
                <span className="text-cyan-300">Hexapeptide-8 + Palmitoyl-38</span>
              </div>
              <p className="text-blue-100/70 font-light leading-relaxed">
                Dual-acting matrix peptide chains that signal epidermal fibroblasts to synthesize 6 major structural components of the extracellular matrix.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-400/15">
              <div className="flex justify-between font-mono font-medium text-white mb-1">
                <span>Botanical Biomimetics (3.8%)</span>
                <span className="text-cyan-300">Haberlea Rhodopensis Stem Cells</span>
              </div>
              <p className="text-blue-100/70 font-light leading-relaxed">
                Biomimetic plant embryonic factors that shield cellular DNA, halt senescence-associated secretory phenotypes, and stimulate cellular respiration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-400/15">
              <div className="flex justify-between font-mono font-medium text-white mb-1">
                <span>ActivIQ™ Phospholipid Micro-Vesicles</span>
                <span className="text-cyan-300">Membrane Fusion Vehicle</span>
              </div>
              <p className="text-blue-100/70 font-light leading-relaxed">
                Ultra-pure biomimetic lipid spheres that seamlessly integrate into the skin's lipid bilayers, guaranteeing 98.4% bio-available penetration.
              </p>
            </div>
          </div>
        </div>

        {/* Complete INCI List */}
        <div>
          <h4 className="font-mono text-xs font-semibold text-blue-200/70 uppercase tracking-widest mb-1.5">
            Full INCI List (International Nomenclature)
          </h4>
          <p className="p-3.5 rounded-xl bg-[#040813]/80 border border-blue-400/15 text-[11px] font-mono text-blue-200/60 leading-relaxed">
            Aqua (Water), Phospholipids (ActivIQ™ Carrier), Acetyl Hexapeptide-8, Palmitoyl Tripeptide-38, Haberlea Rhodopensis Leaf Extract, Sodium Hyaluronate Crosspolymer, Niacinamide, Glycerin, Butylene Glycol, Caprylyl Glycol, Hydroxypropyl Cyclodextrin, Phenoxyethanol, Ethylhexylglycerin, Disodium EDTA.
          </p>
        </div>

        {/* Safety & Testing */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-blue-200/70 border-t border-blue-400/20">
          <span className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Dermatologist Certified In-Vivo
          </span>
          <span>100% Vegan • Cruelty-Free • Paraben-Free</span>
        </div>

      </div>
    </div>
  );
}
