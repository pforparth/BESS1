import { useState, useEffect } from "react";
import { 
  Sun, 
  Grid, 
  Cpu, 
  Layers, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  Clock,
  ExternalLink,
  BookOpen
} from "lucide-react";

type FlowMode = "solar_charging" | "grid_charging" | "peak_shaving" | "backup_mode";
type ComponentKey = "bms" | "pcs" | "ems" | "battery" | "grid" | "solar" | "factory";

export default function LearningHub() {
  const [activeMode, setActiveMode] = useState<FlowMode>("solar_charging");
  const [selectedComponent, setSelectedComponent] = useState<ComponentKey>("battery");
  const [batteryCharge, setBatteryCharge] = useState(45);
  const [isAnimating, setIsAnimating] = useState(true);

  // Auto-oscillate battery percentage purely for interactive visuals when animating
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setBatteryCharge((prev) => {
        if (activeMode === "solar_charging" || activeMode === "grid_charging") {
          return prev >= 95 ? 40 : prev + 1;
        } else {
          return prev <= 20 ? 85 : prev - 1;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [activeMode, isAnimating]);

  // Handle mode change reset some state
  const selectMode = (mode: FlowMode) => {
    setActiveMode(mode);
    if (mode === "solar_charging" || mode === "grid_charging") {
      setBatteryCharge(45);
    } else {
      setBatteryCharge(85);
    }
  };

  const componentDetails = {
    battery: {
      title: "Electrochemical Battery Storage Cells",
      enelContext: "The physical heart of the BESS where chemical reactions store electric charges. Clean energy initiatives utilize highly stable Lithium-Iron Phosphate (LFP) containers for grid-scale stability.",
      howItWorks: "Groups of prismatic or cylindrical cells are wired together in modules, which are stacked vertically inside steel racks. These racks create giant DC voltage chains.",
      traderAction: "Crucial for high-temperature climates. LFP chemistry is preferred globally due to high thermal stability (safeguarding up to 270°C) and excellent cycle life supporting over 6,000 charge-discharge cycles."
    },
    bms: {
      title: "Battery Management System (BMS)",
      enelContext: "The internal safety shield, protecting cells from thermal runaway. It checks physical state criteria (voltage, temperature, pressure) and triggers isolators.",
      howItWorks: "Operates at a master-slave topology. The slave boards sit next to absolute cell groups reading telemetry, passing data to the master controller to balance cells.",
      traderAction: "Active cell balancing is critical. It continuously redistributes charges between individual cells, preserving state-of-health and avoiding localized degradation hotspots."
    },
    pcs: {
      title: "Power Conversion System (PCS) / Bi-directional Inverter",
      enelContext: "The critical gatekeeper bridging DC battery storage output with the AC high-voltage public power grid.",
      howItWorks: "Converts AC (from grid) into DC to charge battery cells, and back into clean AC when discharging to supply local factory equipment without phase lagging.",
      traderAction: "Modern grid code compliance demands millisecond-level step responses and grid-forming capabilities to stabilize local grids during heavy frequency excursions."
    },
    ems: {
      title: "Energy Management System (EMS) Brain",
      enelContext: "The intelligence orchestrating charging/discharging algorithms based on weather forecasting, tariff levels, and local demand.",
      howItWorks: "Gathers SCADA sensor data, analyzes real-time grid tariffs, and directs the PCS inverter with sub-second accuracy.",
      traderAction: "Autonomous optimization allows BESS to charge during high solar surplus intervals (saving solar energy from being curtailed) and discharge during heavy evening system stress."
    },
    grid: {
      title: "The Public Utility Grid",
      enelContext: "The main utility source. Grid operators face voltage drops and sudden frequency variations due to rapid solar/wind fluctuations.",
      howItWorks: "Supplies power when required, but subjects industrial factories to extreme maximum demand charges if consumption exceeds standard contract levels.",
      traderAction: "Connecting a BESS with the grid creates synthetic inertia and peak-load curtailment, significantly reducing the grid connection stress during peak city demand hours."
    },
    solar: {
      title: "Co-Located Solar PV Array",
      enelContext: "The clean green power source that generates DC electricity from sunlight, reducing overall reliance on coal-fired grids.",
      howItWorks: "Solar panels convert light to DC power. If a facility does not have storage, surplus solar energy generated on weekends or mid-day goes completely wasted.",
      traderAction: "Colocating solar plus storage ensures that zero green electrons are lost to grid export limitations, enabling 100% clean-energy microgrid operations."
    },
    factory: {
      title: "End Entity / Commercial Factory Loads",
      enelContext: "The point of use. Factories operate heavy machinery (motors, spinning units, cold-chains) resulting in sudden massive load draws.",
      howItWorks: "Consumes power continuously. Extreme spikes in loads trigger immediate peak charges or risk heavy voltage sags that can damage delicate equipment.",
      traderAction: "By shaving local factories' maximum demand, BESS protects sensitive motors, resolves grid voltage sags locally, and avoids the use of emergency diesel backup generators."
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-cyan-600 font-mono font-bold block">
            Inspired by Enel Learning Hub
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            Interactive BESS Flow Diagram
          </h2>
          <p className="text-xs text-slate-550 max-w-xl">
            A visual overview of how Battery Energy Storage Systems connect with solar arrays, utility grids, and industrial loads. Explore how the components interact in real-time.
          </p>
        </div>

        {/* Animation status bubble */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-[10px]">
          <span className="relative flex h-2 w-2">
            <span className={`${isAnimating ? "animate-ping" : ""} absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isAnimating ? "bg-cyan-600" : "bg-slate-400"}`}></span>
          </span>
          <span className="text-slate-600">Animation: {isAnimating ? "Active" : "Paused"}</span>
          <button 
            onClick={() => setIsAnimating(!isAnimating)}
            id="toggle-anim-btn"
            className="text-[10px] underline text-cyan-700 font-bold ml-1 hover:text-cyan-850 cursor-pointer"
          >
            {isAnimating ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive Flow Controllers */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 rounded-2xl bg-slate-50/50 border-slate-200/80 space-y-3 shadow-sm">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-cyan-600 animate-spin-slow" />
              1. Select Dispatch Mode
            </h4>
            <p className="text-[11px] text-slate-555 leading-relaxed">
              Toggle the modes below to see how electricity shifts between DC and AC via the bi-directional inverter system.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => selectMode("solar_charging")}
                id="mode-solar-btn"
                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                  activeMode === "solar_charging"
                    ? "bg-amber-50/70 border-amber-500/40 font-semibold text-amber-900"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeMode === "solar_charging" ? "bg-amber-100 text-amber-600" : "bg-slate-50 text-slate-500"}`}>
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block font-bold">Renewable Solar Storing</span>
                  <span className="text-[9px] text-slate-450 block truncate">DC solar power is captured in batteries</span>
                </div>
              </button>

              <button
                onClick={() => selectMode("grid_charging")}
                id="mode-grid-btn"
                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                  activeMode === "grid_charging"
                    ? "bg-blue-50/70 border-blue-500/40 font-semibold text-blue-900"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeMode === "grid_charging" ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500"}`}>
                  <Grid className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block font-bold">Grid Arbitrage Charging</span>
                  <span className="text-[9px] text-slate-450 block truncate">Cheap night tariff loads stored for peek hours</span>
                </div>
              </button>

              <button
                onClick={() => selectMode("peak_shaving")}
                id="mode-shaving-btn"
                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                  activeMode === "peak_shaving"
                    ? "bg-emerald-50/75 border-emerald-500/40 font-semibold text-emerald-900"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeMode === "peak_shaving" ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block font-bold">Active Peak Load Shaving</span>
                  <span className="text-[9px] text-slate-450 block truncate">Discharge to eliminate high grid peak rates</span>
                </div>
              </button>

              <button
                onClick={() => selectMode("backup_mode")}
                id="mode-backup-btn"
                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                  activeMode === "backup_mode"
                    ? "bg-purple-50/70 border-purple-500/40 font-semibold text-purple-900"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeMode === "backup_mode" ? "bg-purple-100 text-purple-600" : "bg-slate-50 text-slate-500"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block font-bold">Emergency Backup Reserves</span>
                  <span className="text-[9px] text-slate-450 block truncate">Sub-second power injects on total grid cut</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Energy Transition Goal
            </h4>
            <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
              Transitioning to high-capacity storage is a global pillar for grid decarbonization. Co-locating BESS allows wind and solar integration, providing instantaneous active power filtering and stabilization of the central power grid.
            </p>
            <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-300 font-mono">Recommended RTE Standard:</span>
              <span className="text-emerald-400 font-bold text-xs">≥ 88% RTE</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual SVG Flow Panel + Detail Block */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* SVG Animated Flow Canvas */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm min-h-[300px] relative overflow-hidden">
            <div className="absolute right-0 top-0 w-44 h-44 bg-cyan-500/1 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center justify-between">
              <span>Interactive Telemetry Display Panel</span>
              <span className="text-cyan-600 text-[10px] flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                Interactive Diagram
              </span>
            </div>

            {/* Custom Responsive Flow Grid Map */}
            <div className="grid grid-cols-12 gap-y-6 md:gap-y-0 gap-x-2 items-center justify-items-center relative py-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              
              {/* SOURCE COLUMN: SOLAR & GRID */}
              <div className="col-span-12 md:col-span-3 flex md:flex-col gap-4 justify-center items-center w-full">
                {/* Solar Node */}
                <button
                  type="button"
                  onClick={() => setSelectedComponent("solar")}
                  id="node-solar"
                  className={`w-full md:w-28 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedComponent === "solar" ? "bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-300/30" : "bg-white border-slate-200"
                  }`}
                >
                  <Sun className={`w-6 h-6 mx-auto ${activeMode === "solar_charging" ? "text-amber-500 animate-spin-slow" : "text-slate-400"}`} />
                  <span className="text-[10px] font-bold text-slate-800 block mt-1">Solar PV</span>
                  <span className="text-[8px] font-mono text-slate-400">DC Generated</span>
                </button>

                {/* Grid Node */}
                <button
                  type="button"
                  onClick={() => setSelectedComponent("grid")}
                  id="node-grid"
                  className={`w-full md:w-28 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedComponent === "grid" ? "bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-300/30" : "bg-white border-slate-200"
                  }`}
                >
                  <Grid className={`w-6 h-6 mx-auto ${activeMode === "grid_charging" ? "text-blue-500" : "text-slate-400"}`} />
                  <span className="text-[10px] font-bold text-slate-800 block mt-1">Utility Grid</span>
                  <span className="text-[8px] font-mono text-slate-400">AC Power</span>
                </button>
              </div>

              {/* ARROW JUNCTION / TRANSIT FLOW */}
              <div className="col-span-12 md:col-span-2 flex justify-center items-center h-full">
                <div className="flex md:flex-col gap-2 items-center">
                  <div className={`p-1 rounded-full ${
                    activeMode === "solar_charging" ? "bg-amber-100 text-amber-600 animate-pulse" :
                    activeMode === "grid_charging" ? "bg-blue-100 text-blue-600 animate-pulse" : "bg-slate-100 text-slate-400"
                  }`}>
                    <ArrowRight className="w-4 h-4 md:rotate-0 rotate-90" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 font-bold hidden md:inline">DC/AC Inputs</span>
                </div>
              </div>

              {/* CORE BESS SYSTEM: PCS & BATTERY */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-4 justify-center items-center bg-white border border-slate-200/90 shadow-sm p-3.5 rounded-2xl w-full max-w-[200px] relative">
                <span className="text-[8px] font-mono text-cyan-600 font-bold uppercase tracking-wider block absolute top-2">Core BESS Hub</span>
                
                {/* PCS Bidirectional Inverter */}
                <button
                  type="button"
                  onClick={() => setSelectedComponent("pcs")}
                  id="bess-node-pcs"
                  className={`w-full p-2.5 rounded-xl border text-center mt-3.5 transition-all cursor-pointer ${
                    selectedComponent === "pcs" ? "bg-cyan-50 border-cyan-500 shadow-sm" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <Cpu className="w-5 h-5 mx-auto text-cyan-600" />
                  <span className="text-[9px] font-bold text-slate-800 block mt-1">PCS Inverter</span>
                  <span className="text-[8px] font-mono text-slate-400">Bidirectional converter</span>
                </button>

                {/* Battery Pack Rack (DC storage) */}
                <button
                  type="button"
                  onClick={() => setSelectedComponent("battery")}
                  id="bess-node-battery"
                  className={`w-full p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedComponent === "battery" ? "bg-emerald-50 border-emerald-500 shadow-sm" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  {/* Faux battery bar fill gauge */}
                  <div className="w-10 h-4 bg-slate-200 mx-auto rounded overflow-hidden flex relative items-center border border-slate-300">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${batteryCharge}%` }}
                    />
                    <span className="absolute inset-0 text-[8px] font-mono text-slate-900 font-bold flex items-center justify-center">
                      {batteryCharge}%
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 block mt-1">LFP Cell Racks</span>
                  <span className="text-[8px] font-mono text-slate-400">BMS: Active Cell Balancing</span>
                </button>

                {/* Top overlay controller brains BMS and EMS tiny tags */}
                <div className="flex gap-1.5 w-full">
                  <button 
                    type="button" 
                    onClick={() => setSelectedComponent("bms")}
                    id="tag-bms"
                    className={`flex-1 text-[8px] py-1 border rounded font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedComponent === "bms" ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    BMS
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedComponent("ems")}
                    id="tag-ems"
                    className={`flex-1 text-[8px] py-1 border rounded font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedComponent === "ems" ? "bg-indigo-500 border-indigo-500 text-white" : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    EMS
                  </button>
                </div>
              </div>

              {/* DISCHARGE TRANSIT ARROW */}
              <div className="col-span-12 md:col-span-1 flex justify-center items-center h-full">
                <div className="flex md:flex-col gap-2 items-center">
                  <div className={`p-1 rounded-full ${
                    activeMode === "peak_shaving" || activeMode === "backup_mode" ? "bg-emerald-100 text-emerald-600 animate-pulse" : "bg-slate-100 text-slate-400"
                  }`}>
                    <ArrowRight className="w-4 h-4 md:rotate-0 rotate-90" />
                  </div>
                </div>
              </div>

              {/* DEMAND COLUMN: FACTORY END ENTITY */}
              <div className="col-span-12 md:col-span-2 flex justify-center items-center w-full">
                <button
                  type="button"
                  onClick={() => setSelectedComponent("factory")}
                  id="node-factory"
                  className={`w-full p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedComponent === "factory" ? "bg-indigo-50 border-indigo-500 shadow-sm ring-2 ring-indigo-300/30" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="w-8 h-8 mx-auto rounded bg-indigo-50 flex items-center justify-center text-indigo-700 font-mono font-bold text-xs">
                    🏭
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 block mt-1">C&I Factory</span>
                  <span className="text-[8px] font-mono text-indigo-600 font-semibold uppercase">{activeMode === "peak_shaving" ? "Discharge Support" : "Load Active"}</span>
                </button>
              </div>

            </div>

            {/* Instruction Cue */}
            <div className="mt-3 text-center text-[10px] text-slate-450 italic flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>Click on any component (e.g. Solar PV, PCS Inverter, EMS) in the map above to view expert engineering specifications.</span>
            </div>
          </div>

          {/* Component Informational Deep-Dive Panel */}
          <div className="glass-panel p-5 rounded-2xl bg-[#0f172a] text-white border border-slate-800 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Detail Dossier / Selected Component
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {componentDetails[selectedComponent].title}
                </h4>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
              {/* How it works description */}
              <div className="md:col-span-7 space-y-3">
                <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                  {componentDetails[selectedComponent].howItWorks}
                </p>
                
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.05] space-y-1">
                  <span className="text-[9px] font-mono uppercase text-emerald-400 font-semibold block">Grid Utility Context:</span>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    {componentDetails[selectedComponent].enelContext}
                  </p>
                </div>
              </div>

              {/* Operational Reference Card */}
              <div className="md:col-span-5 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-800/20 p-3.5 rounded-xl flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                    <BookOpen className="w-3.5 h-3.5 inline text-cyan-400" />
                    Technical Benchmark
                  </span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {componentDetails[selectedComponent].traderAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
