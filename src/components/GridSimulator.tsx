import { useState, useMemo } from "react";
import { runBessSimulation } from "../data";
import { SimulationParameters, SimulationHourData } from "../types";
import { 
  Activity, 
  ArrowDownLeft, 
  Battery, 
  BatteryCharging, 
  Layers, 
  Sun, 
  TrendingUp, 
  Zap,
  Info
} from "lucide-react";

export default function GridSimulator() {
  const [params, setParams] = useState<SimulationParameters>({
    batteryCapacityMwh: 2.0, // Sized cleanly for Indian C&I factories (e.g. 2 MWh)
    maxPowerMw: 0.8,
    solarCapacityMw: 1.2,
    strategy: "shaving"
  });

  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Compute simulation data
  const simulationData = useMemo(() => {
    return runBessSimulation(params);
  }, [params]);

  // Derived economic metrics for the day inside India
  const summaryMetrics = useMemo(() => {
    let totalArbitrageProfitINR = 0;
    let originalPeakImport = 0;
    let actualPeakImport = 0;
    let solarUtilizedMwh = 0;
    let totalDischargeAmountKwh = 0;

    simulationData.forEach((hour) => {
      // Hour details calculation
      // hourly battery energy in MWh -> convert to kWh by * 1000
      const energyKwh = Math.abs(hour.batteryChargeDischargeMw) * 1000;
      
      if (hour.batteryChargeDischargeMw < 0) {
        // Discharging (Releasing energy to C&I plant during peak ₹14-15 tariff)
        totalArbitrageProfitINR += energyKwh * hour.marginalCostUSD; // marginalCostUSD is mapped to ₹ tariff in data
        totalDischargeAmountKwh += energyKwh;
      } else if (hour.batteryChargeDischargeMw > 0) {
        // Charging (Buying grid units during cheap night slot or local solar peaks)
        const solarContributionRatio = hour.solarGenMw > 0 ? Math.min(1, hour.solarGenMw / hour.batteryChargeDischargeMw) : 0;
        const boughtKwh = energyKwh * (1 - solarContributionRatio);
        totalArbitrageProfitINR -= boughtKwh * hour.marginalCostUSD;
      }

      if (hour.gridDemandMw > originalPeakImport) {
        originalPeakImport = hour.gridDemandMw;
      }
      if (hour.gridImportMw > actualPeakImport) {
        actualPeakImport = hour.gridImportMw;
      }

      if (hour.solarGenMw > 0) {
        solarUtilizedMwh += Math.min(hour.solarGenMw, hour.gridDemandMw + Math.max(0, hour.batteryChargeDischargeMw));
      }
    });

    const peakShavingPercentage = originalPeakImport > 0 
      ? Math.round(((originalPeakImport - actualPeakImport) / originalPeakImport) * 100)
      : 0;

    // nominal peak demand saving penalties (Indian DISCOMs levy massive charge offsets on peak demand excess)
    const nominalDemandFeeSavingsINR = peakShavingPercentage * 4500; 
    const finalProfitINR = Math.max(500, totalArbitrageProfitINR + nominalDemandFeeSavingsINR);

    return {
      peakShavedPercent: Math.max(0, peakShavingPercentage),
      originalPeak: originalPeakImport,
      newPeak: actualPeakImport,
      totalRevenueINR: Math.round(finalProfitINR),
      solarSelfConsumptionRate: Math.round(Math.min(100, (solarUtilizedMwh / (params.solarCapacityMw * 4.5 || 1)) * 100)),
      totalDischargeKwh: Math.round(totalDischargeAmountKwh)
    };
  }, [simulationData, params]);

  // Render SVG Sparkline / Component Chart helper values
  const maxVal = 10;
  const height = 150;
  const width = 640;
  const padding = 20;

  // Chart point helper
  const getPoints = (key: keyof SimulationHourData, multiplier = 1) => {
    return simulationData.map((d, index) => {
      const val = (d[key] as number) * multiplier;
      const x = padding + (index / 23) * (width - 2 * padding);
      const y = height - padding - (val / maxVal) * (height - 2 * padding);
      return { x, y, val: d[key] as number };
    });
  };

  const gridDemandPoints = getPoints("gridDemandMw", 3);
  const gridImportPoints = getPoints("gridImportMw", 3);
  const solarGenPoints = getPoints("solarGenMw", 3);
  const socPoints = getPoints("batterySoc", 0.08); // scaled 0-100 down for viz

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-600" />
            BESS Performance Simulator
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Simulate how a battery mitigates grid demand. Watch peak load shaving, solar-absorption, and electricity arbitrage happen in real-time.
          </p>
        </div>

        {/* Strategy Control Switches */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 gap-1 shrink-0">
          {(["shaving", "arbitrage", "backup"] as const).map((strategy) => (
            <button
              key={strategy}
              id={`strat-tab-${strategy}`}
              onClick={() => setParams({ ...params, strategy })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                params.strategy === strategy
                  ? "bg-white text-cyan-850 shadow-sm border border-slate-205/50 font-bold text-cyan-600"
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {strategy === "shaving" ? "Peak Shaving" : strategy === "arbitrage" ? "Arbitrage" : "Reserve Backup"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Displays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Peak Shaved Reduction</span>
            <strong className="text-xl font-bold font-display text-cyan-600">{summaryMetrics.peakShavedPercent}%</strong>
            <p className="text-[9px] text-slate-400">Peak drops: {summaryMetrics.originalPeak.toFixed(1)}MW to {summaryMetrics.newPeak.toFixed(1)}MW</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Daily Utility Savings</span>
            <strong className="text-xl font-bold font-display text-emerald-700">₹ {summaryMetrics.totalRevenueINR.toLocaleString()}</strong>
            <p className="text-[9px] text-slate-400">Offset tariff & backup generator expenses</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100 shrink-0">
            <ArrowDownLeft className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Solar Storage Rate</span>
            <strong className="text-xl font-bold font-display text-amber-700">{summaryMetrics.solarSelfConsumptionRate}%</strong>
            <p className="text-[9px] text-slate-400">Solar local consumption ratio</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100 shrink-0">
            <Sun className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center justify-between bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Daily Unit Flow</span>
            <strong className="text-xl font-bold font-display text-purple-700">{summaryMetrics.totalDischargeKwh} Units</strong>
            <p className="text-[9px] text-slate-400">Total kWh energy cycles completed</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 border border-purple-100 shrink-0">
            <BatteryCharging className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Control Deck */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl space-y-4 bg-white border-slate-200 shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2 font-bold">
            Interactive Scaling Console
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">BESS Capacity Size</span>
                <span className="font-mono font-bold text-cyan-600">{(params.batteryCapacityMwh * 1000).toFixed(0)} kWh (MWh: {params.batteryCapacityMwh})</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                id="capacity-slider"
                value={params.batteryCapacityMwh}
                onChange={(e) => setParams({ ...params, batteryCapacityMwh: parseFloat(e.target.value) })}
                className="w-full accent-cyan-600 bg-slate-100 cursor-pointer h-1 rounded"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                <span>500 kWh</span>
                <span>8000 kWh (8 MWh)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Inverter (PCS) Output</span>
                <span className="font-mono font-bold text-cyan-600">{(params.maxPowerMw * 1000).toFixed(0)} kW (MW: {params.maxPowerMw})</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4.0"
                step="0.1"
                id="power-slider"
                value={params.maxPowerMw}
                onChange={(e) => setParams({ ...params, maxPowerMw: parseFloat(e.target.value) })}
                className="w-full accent-cyan-600 bg-slate-100 cursor-pointer h-1 rounded"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                <span>100 kW</span>
                <span>4000 kW (4 MW)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Solar PV Array Co-allocated</span>
                <span className="font-mono font-bold text-cyan-600">{(params.solarCapacityMw * 1000).toFixed(0)} kWp (MW: {params.solarCapacityMw})</span>
              </div>
              <input
                type="range"
                min="0"
                max="6.0"
                step="0.1"
                id="solar-slider"
                value={params.solarCapacityMw}
                onChange={(e) => setParams({ ...params, solarCapacityMw: parseFloat(e.target.value) })}
                className="w-full accent-cyan-600 bg-slate-100 cursor-pointer h-1 rounded"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                <span>No Solar (0)</span>
                <span>6000 kW (6 MWp)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-500/10 text-[11px] text-slate-600 leading-relaxed space-y-1">
            <strong className="text-cyan-700 font-mono text-[9px] uppercase block tracking-wider">Dynamic Controller Logic</strong>
            {params.strategy === "shaving" && (
              <p>Charges cheaply during solar peak slots. Discharges to cut off power peaks, saving the commercial client immense peak contract penalties.</p>
            )}
            {params.strategy === "arbitrage" && (
              <p>Charges from grid at off-peak rates (₹4.5/kWh). Discharges during afternoon & evening peak grids (₹14-15/kWh) to secure peak arbitrage.</p>
            )}
            {params.strategy === "backup" && (
              <p>Actively reserves capacity at 95% full state. Discharges only during sudden power-cuts, protecting critical manufacturing motors.</p>
            )}
          </div>
        </div>

        {/* Interactive SVG Chart Display */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl bg-white border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              Grid Load & Dispatch Telemetry
            </h4>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-mono">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Load</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-550 rounded-full"></span> New Import</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Solar</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Battery %</span>
            </div>
          </div>

          {/* SVG Chart area */}
          <div className="relative py-4 pr-1">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="glow-panel-gradient-inr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((v, i) => {
                const y = padding + v * (height - 2 * padding);
                return (
                  <line 
                    key={i} 
                    x1={padding} 
                    y1={y} 
                    x2={width - padding} 
                    y2={y} 
                    stroke="rgba(15,23,42,0.06)" 
                    strokeDasharray="4 4" 
                  />
                );
              })}

              {/* Load Demand Series (Rose Line) */}
              <path 
                d={gridDemandPoints.reduce((acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
              />

              {/* Grid Imports (Cyan Line) */}
              <path 
                d={gridImportPoints.reduce((acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Solar Gen (Amber Line) */}
              <path 
                d={solarGenPoints.reduce((acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')}
                fill="none"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeOpacity="0.75"
              />

              {/* State of Charge SOC (Emerald Fill overlay) */}
              <path 
                d={
                  socPoints.reduce((acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '') + 
                  ` L ${socPoints[socPoints.length - 1].x} ${height - padding} L ${socPoints[0].x} ${height - padding} Z`
                }
                fill="url(#glow-panel-gradient-inr)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />

              {/* Interactive Hover Vertical Guide */}
              {hoveredHour !== null && (
                <line 
                  x1={padding + (hoveredHour / 23) * (width - 2 * padding)} 
                  y1={padding} 
                  x2={padding + (hoveredHour / 23) * (width - 2 * padding)} 
                  y2={height - padding} 
                  stroke="rgba(15,23,42,0.12)" 
                  strokeWidth="1"
                />
              )}
            </svg>

            {/* Simulated Interactive Range Zones */}
            <div className="absolute inset-x-5 inset-y-4 flex justify-between z-10">
              {simulationData.map((d) => (
                <div 
                  key={d.hour} 
                  onMouseEnter={() => setHoveredHour(d.hour)}
                  onMouseLeave={() => setHoveredHour(null)}
                  className="flex-1 h-full cursor-pointer opacity-0 hover:opacity-10"
                />
              ))}
            </div>
          </div>

          {/* Interactive telemetry values box */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-205/65 min-h-[64px] flex flex-col justify-center">
            {hoveredHour !== null ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[10px] font-mono">
                <div>
                  <span className="text-slate-400 block">Hour</span>
                  <strong className="text-slate-800 text-xs">{simulationData[hoveredHour].timeLabel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Factory Load</span>
                  <strong className="text-slate-700 text-xs">{(simulationData[hoveredHour].gridDemandMw * 1000).toFixed(0)} kW</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Solar PV Out</span>
                  <strong className="text-amber-700 text-xs">{(simulationData[hoveredHour].solarGenMw * 1000).toFixed(0)} kW</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">BESS Active</span>
                  <strong className={`text-xs ${
                    simulationData[hoveredHour].batteryChargeDischargeMw > 0 ? "text-emerald-700" :
                    simulationData[hoveredHour].batteryChargeDischargeMw < 0 ? "text-rose-700" : "text-slate-400"
                  }`}>
                    {simulationData[hoveredHour].batteryChargeDischargeMw > 0 ? "🔌 Charging +" :
                     simulationData[hoveredHour].batteryChargeDischargeMw < 0 ? "🔋 Discharging " : "⊙ Idle"}
                    {simulationData[hoveredHour].batteryChargeDischargeMw !== 0 && ` ${(Math.abs(simulationData[hoveredHour].batteryChargeDischargeMw) * 1000).toFixed(0)} kW`}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">SOC / Utility Price</span>
                  <strong className="text-cyan-700 text-xs">
                    {simulationData[hoveredHour].batterySoc}% SOC (₹ {simulationData[hoveredHour].marginalCostUSD}/unit)
                  </strong>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-center text-slate-500 text-[11px]">
                <Info className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Hover over points along the timeline chart to inspect hourly peak load dispatch currents and tariff unit rates.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
