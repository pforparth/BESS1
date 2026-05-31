import { useState } from "react";
import { BESS_CHEMISTRIES, INDIAN_BESS_MANUFACTURERS } from "../data";
import { BatteryChemistry, BessManufacturer } from "../types";
import { 
  Award, 
  CheckCircle, 
  Factory, 
  Flame, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Briefcase,
  HelpCircle,
  Truck
} from "lucide-react";

export default function ChemistryGrid() {
  const [activeTab, setActiveTab] = useState<"players" | "chemistries">("players");
  const [selectedChem, setSelectedChem] = useState<BatteryChemistry>(BESS_CHEMISTRIES[0]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<BessManufacturer>(INDIAN_BESS_MANUFACTURERS[0]);

  return (
    <div className="space-y-6">
      {/* Header and Tab Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">
            Indian Sourcing & Technology Profiles
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Understand the complete B2B supply pipeline. Compare certified BESS manufacturers in India alongside individual battery electrochemistries.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("players")}
            id="tab-btn-players"
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "players"
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🇮🇳 Top BESS Manufacturers
          </button>
          <button
            onClick={() => setActiveTab("chemistries")}
            id="tab-btn-chemistries"
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "chemistries"
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚡ Chemistry Comparison
          </button>
        </div>
      </div>

      {activeTab === "players" ? (
        /* =================== TAB 1: INDIAN MANUFACTURERS DIRECTORY =================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Manufacturer List */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1">
              <Factory className="w-4 h-4 text-cyan-600" />
              Domestic Sourcing Partners
            </h3>
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {INDIAN_BESS_MANUFACTURERS.map((m) => {
                const isSelected = selectedManufacturer.id === m.id;
                return (
                  <button
                    key={m.id}
                    id={`mfg-btn-${m.id}`}
                    onClick={() => setSelectedManufacturer(m)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? "bg-cyan-50/70 border-cyan-500/35 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{m.name}</span>
                        {m.tierRating === "Tier-1 Partner" && (
                          <span className="text-[8px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono font-semibold">
                            Tier-1
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-450 block mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {m.gigafactoryLocation.split(",")[1]?.trim() || "India"} Plant
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-600 bg-slate-105 font-bold px-1.5 py-0.5 rounded">
                      {m.annualCapacityGwh} GWh
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-500/10 space-y-1">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                National PLI & Storage Push
              </h4>
              <p className="text-[10px] text-emerald-950 leading-relaxed font-sans">
                India's Production-Linked Incentive (PLI) scheme actively supports over 50 GWh of advanced cell chemistry manufacturing. This domestic initiative accelerates grid battery localized integration, enabling high-performance storage blocks for regional power systems.
              </p>
            </div>
          </div>

          {/* Right Side: Sourcing Partner Deep Dive */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-4 h-full shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-700 font-bold block">
                      Manufacturer Dossier ({selectedManufacturer.tierRating})
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mt-1">
                      {selectedManufacturer.name}
                    </h3>
                  </div>
                  <Factory className="w-8 h-8 text-cyan-600 opacity-20 shrink-0" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedManufacturer.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-mono">
                      Headquarters
                    </span>
                    <span className="text-xs font-semibold text-slate-850 block">
                      {selectedManufacturer.headquarters}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-mono">
                      Gigafactory Location
                    </span>
                    <span className="text-xs font-semibold text-slate-850 block">
                      {selectedManufacturer.gigafactoryLocation.split(",")[0]}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-1 col-span-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-mono">
                      Technology & Chemistry Focus
                    </span>
                    <span className="text-xs font-semibold text-cyan-700 block">
                      {selectedManufacturer.chemistryFocus}
                    </span>
                  </div>
                </div>

                {/* Specific Sizing fitting */}
                <div className="p-3 bg-cyan-50/40 border border-cyan-500/10 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono font-bold text-cyan-700 uppercase tracking-wide block">
                    Sizing & Application Profile
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed font-sans">
                    🌟 <strong>Primary Domain:</strong> {selectedManufacturer.bestFitUse} <br />
                    📦 <strong>Core Product Line:</strong> {selectedManufacturer.representativeModel}
                  </p>
                </div>
              </div>

              {/* Sourcing Margin advantage */}
              <div className="p-3.5 bg-slate-900 rounded-xl text-white space-y-1.5 mt-3">
                <span className="text-[9px] font-mono font-semibold text-emerald-400 uppercase block tracking-wider">
                  Techno-Commercial Advantage
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  ✓ {selectedManufacturer.tradingAdvantage.replace("trading margins", "project economics").replace("higher margins", "better economic scaling")}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =================== TAB 2: SIMPLIFIED BATTERY CHEMISTRIES =================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side: Chem Selection Grid */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-600" />
              Electrochemistry Options
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {BESS_CHEMISTRIES.map((c) => {
                const isSelected = selectedChem.id === c.id;
                return (
                  <button
                    key={c.id}
                    id={`chem-grid-btn-${c.id}`}
                    onClick={() => setSelectedChem(c)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-50 border-cyan-500/40 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block">{c.name}</span>
                    <span className="text-[10px] text-slate-450 block mt-1 truncate">{c.fullName.split("(")[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-500/10 space-y-1">
              <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Climate Safe Note for India
              </h4>
              <p className="text-[10px] text-amber-950 leading-relaxed">
                Temperatures in central and northern India routinely cross 45°C. Stationary storage batteries must maintain stable cell chemistry. <strong>LFP</strong> is heavily preferred (safe up to 270°C) over <strong>NMC</strong> (weakest safety boundary, combusts at 210°C).
              </p>
            </div>
          </div>

          {/* Right side: Chemistry Specifics */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-4 h-full shadow-sm flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-700 font-bold block">
                      Chemical Specification
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mt-1">
                      {selectedChem.fullName}
                    </h3>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedChem.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-mono">
                      Cycle Life Span
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {selectedChem.cycleLife.toLocaleString()} Cycles
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-mono">
                      Thermal Safety Rating
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {selectedChem.safetyRating}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 space-y-0.5 col-span-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 block font-mono">
                      Indian Industry Suitability
                    </span>
                    <span className="text-xs font-bold text-cyan-700 block leading-relaxed font-sans">
                      {selectedChem.typicalUse}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technology profile advisory */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 flex items-start gap-2.5 text-[11px] text-slate-600">
                <Award className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Advisory Note:</strong> For highly cost-sensitive remote agricultural segments and off-grid irrigation backup, <strong>Sodium-ion (Na-Ion)</strong> is emerging as a powerful, lithium-free option. For heavy industrial C&I settings requiring 10+ year continuous operation lifespans, <strong>LFP (Lithium Iron Phosphate)</strong> container packages offer the best overall safety and lifespan guarantees.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
