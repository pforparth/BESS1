import { useState, FormEvent } from "react";
import { EstimatorInputs, EstimatorOutput } from "../types";
import { 
  Building, 
  Calculator, 
  Coins, 
  Cpu, 
  Factory, 
  Home, 
  Info, 
  Leaf, 
  Maximize, 
  TrendingUp, 
  Zap,
  Briefcase,
  Layers,
  Sparkles
} from "lucide-react";

export default function SizingEstimator() {
  const [inputs, setInputs] = useState<EstimatorInputs>({
    facilityType: "commercial",
    avgDailyConsumptionKwh: 3500,
    peakDemandKw: 600,
    solarOutputKw: 250,
    backupRequirementHours: 4,
    primaryGoal: "shaving"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimatorOutput | null>({
    systemType: "C&I Containerized BESS (Liquid Cooled LFP)",
    recommendedCapacityMwh: 1.2,
    recommendedPowerMw: 0.5,
    durationHours: 2.4,
    estimatedFootprintSqM: 35,
    estimatedCostSavingsYearlyUSD: 115000, 
    estimatedCo2ReductionTonnes: 184,
    roiYears: 5.8,
    chemistryRecommendation: "Lithium Iron Phosphate (LFP) due to high state thermal safety boundaries supporting regular 45°C ambient summers in India.",
    reasoning: "Excellent setup for Indian Commercial & Industrial (C&I) clients. Your Coimbatore or Surat style textile/manufacturing facility operates heavy motor equipment resulting in intensive peak-demand charges. Sourcing a 1.2 MWh LFP storage rack from partners like Tata AutoComp or Exide lets you shave these peak fees, synchronize with co-located 250 kW solar panels, and maintain continuous operations during state power cuts.",
    bmsSettingsSummary: "BMS config: Charge battery via cheap grid tariff (or excess solar) at ₹4.0/kWh between 10 AM to 3 PM; discharge peak capacity during high-demand industrial evening slots (₹15.0/kWh) to maximize arbitrage margins."
  });
  const [error, setError] = useState<string | null>(null);

  const formatINR = (usdAmount: number) => {
    // Treat usdAmount as baseline and convert to INR (1 USD = ₹83 approximate standard conversion)
    const inrAmount = usdAmount * 83;
    if (inrAmount >= 10000000) {
      return `₹ ${(inrAmount / 10000000).toFixed(2)} Crores`;
    }
    return `₹ ${(inrAmount / 100000).toFixed(2)} Lakhs`;
  };

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/size-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error("Failed to compute estimation. Please check backend status.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (type: "residential" | "commercial" | "utility") => {
    if (type === "residential") {
      setInputs({
        facilityType: "residential",
        avgDailyConsumptionKwh: 450,
        peakDemandKw: 80,
        solarOutputKw: 40,
        backupRequirementHours: 6,
        primaryGoal: "resilience"
      });
    } else if (type === "commercial") {
      setInputs({
        facilityType: "commercial",
        avgDailyConsumptionKwh: 4500,
        peakDemandKw: 750,
        solarOutputKw: 350,
        backupRequirementHours: 4,
        primaryGoal: "shaving"
      });
    } else {
      setInputs({
        facilityType: "utility",
        avgDailyConsumptionKwh: 65000,
        peakDemandKw: 12000,
        solarOutputKw: 15000,
        backupRequirementHours: 4,
        primaryGoal: "arbitrage"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-cyan-600" />
          BESS Sizing & Feasibility Calculator
        </h2>
        <p className="text-xs text-slate-500 max-w-xl">
          Calculate electrochemical capacity constraints and power demand matching for standard installations inside India. Select presets to evaluate cost savings in both Indian Rupees (₹) and USD.
        </p>
      </div>

      {/* Preset Fast Selection Chips */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/70 p-3 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Quick Presets for Indian Facilities
          </h4>
          <p className="text-[11px] text-slate-500 font-sans">Pick a segment to instantly simulate realistic engineering specifications and payback periods.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreset("residential")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              inputs.facilityType === "residential"
                ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                : "bg-white border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50"
            }`}
          >
            🏢 Residential Society (Gurugram)
          </button>
          <button
            type="button"
            onClick={() => setPreset("commercial")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              inputs.facilityType === "commercial"
                ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                : "bg-white border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50"
            }`}
          >
            🏭 Textile Mill / C&I (Coimbatore)
          </button>
          <button
            type="button"
            onClick={() => setPreset("utility")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              inputs.facilityType === "utility"
                ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                : "bg-white border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50"
            }`}
          >
            ☀️ Solar Farm IPP (Rajasthan)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form Card */}
        <form onSubmit={handleCalculate} id="bess-estimator-form" className="lg:col-span-5 glass-panel p-5 rounded-2xl space-y-4 bg-white border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            Project Parameters
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">
                Average Daily Consumption (kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  id="input-consumption"
                  value={inputs.avgDailyConsumptionKwh}
                  onChange={(e) => setInputs({ ...inputs, avgDailyConsumptionKwh: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition-all font-mono"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500">kWh/day</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">
                Peak Load Demand (kW)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  id="input-demand"
                  value={inputs.peakDemandKw}
                  onChange={(e) => setInputs({ ...inputs, peakDemandKw: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition-all font-mono"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500">kW peak</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">
                Co-located Solar PV Array (kW)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  id="input-solar"
                  value={inputs.solarOutputKw}
                  onChange={(e) => setInputs({ ...inputs, solarOutputKw: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition-all font-mono"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500">kWp Solar</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-mono text-slate-600 block">
                  Required Backup Duration
                </label>
                <span className="text-xs font-mono font-bold text-cyan-700">{inputs.backupRequirementHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                id="input-backup-hours"
                value={inputs.backupRequirementHours}
                onChange={(e) => setInputs({ ...inputs, backupRequirementHours: Number(e.target.value) })}
                className="w-full accent-cyan-600 bg-slate-100 cursor-pointer h-1 rounded select-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">
                Primary Dispatch Goal
              </label>
              <select
                id="input-goal"
                value={inputs.primaryGoal}
                onChange={(e: any) => setInputs({ ...inputs, primaryGoal: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/10 outline-none rounded-xl px-3 py-2 text-xs text-slate-700 font-medium"
              >
                <option value="shaving">Peak Shaving (Reduces Peak Demand Multipliers)</option>
                <option value="arbitrage">Energy Arbitrage (Charge Low Solar, Discharge at Peak)</option>
                <option value="resilience">Complete Backup Protection (Against Grid Outages)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="estimate-submit-btn"
            className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-500/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer text-white"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white">Calculating Indian Grid Feasibility...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-white" />
                <span className="text-white">Sizing & Pricing Proposal</span>
              </>
            )}
          </button>
        </form>

        {/* Results Estimation Report Display Card */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Primary Visual Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl border-l-[3px] border-cyan-500 bg-white border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    Calculated Capacity
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900 font-display">
                      {result.recommendedCapacityMwh >= 0.1 
                        ? `${result.recommendedCapacityMwh.toFixed(2)} MWh` 
                        : `${Math.round(result.recommendedCapacityMwh * 1000)} kWh`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Total stored storage energy</p>
                </div>

                <div className="glass-panel p-4 rounded-xl border-l-[3px] border-emerald-500 bg-white border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    Inverter (PCS) Size
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900 font-display">
                      {result.recommendedPowerMw >= 0.1
                        ? `${result.recommendedPowerMw.toFixed(2)} MW`
                        : `${Math.round(result.recommendedPowerMw * 1000)} kW`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Max instantaneous flow rate</p>
                </div>

                <div className="glass-panel p-4 rounded-xl border-l-[3px] border-amber-500 bg-white border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    Expected ROI Period
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900 font-display">
                      ~ {result.roiYears || 6} Years
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Payback estimate based on current regional tariffs</p>
                </div>
              </div>

              {/* Comprehensive Descriptive Detail Panel */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest select-none">
                      BESS Physical Architecture
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {result.systemType}
                    </h4>
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                    <Maximize className="w-3.5 h-3.5 text-cyan-600" />
                    Footprint: ~ {result.estimatedFootprintSqM} m²
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                      AI Sizing & Commercial Logic
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {result.reasoning}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-cyan-50/50 border border-cyan-500/10 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono font-bold text-cyan-700 uppercase tracking-wide block">
                        Electrochemical Recommendation
                      </span>
                      <p className="text-[11px] text-slate-650 leading-relaxed">
                        {result.chemistryRecommendation}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/50 border border-emerald-500/10 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wide block">
                        EMS / Optimization Rule
                      </span>
                      <p className="text-[11px] text-slate-655 leading-relaxed">
                        {result.bmsSettingsSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Economic & Environmental Co-benefits (Rupee & USD Dual Display) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-550/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block font-mono uppercase">
                        Annual Savings for End Client
                      </span>
                      <strong className="text-xs text-slate-800 block">
                        {formatINR(result.estimatedCostSavingsYearlyUSD)}
                      </strong>
                      <span className="text-[9px] text-slate-400 font-mono">
                        ~ ${result.estimatedCostSavingsYearlyUSD.toLocaleString()} USD
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block font-mono uppercase">
                        CO₂ Reduction Impact
                      </span>
                      <strong className="text-xs text-slate-800 block">
                        ~ {result.estimatedCo2ReductionTonnes} Tonnes / Yr
                      </strong>
                      <span className="text-[9px] text-slate-400 font-mono">Clean decarbonization value</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Investment & Economic Estimates */}
              <div className="glass-panel p-4 rounded-xl bg-slate-900 text-white space-y-2.5 shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  Estimated System Investment & Viability
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A typical <strong className="text-white">{(result.recommendedCapacityMwh * 1000).toFixed(0)} kWh</strong> system includes battery modular racks, grid-connected inverters, state HVAC cooling, fire suppression systems, and active energy management.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-305">
                  <div>
                    <span className="text-slate-400 block">Estimated CAPEX:</span>
                    <span className="text-white font-bold">{formatINR(result.recommendedCapacityMwh * 225000)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Avg Levelized Cost:</span>
                    <span className="text-cyan-400 font-bold">₹ 6.5 - 7.5 / kWh</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-slate-400 block">Project Viability:</span>
                    <span className="text-emerald-400 font-bold">Excellent Payback</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
