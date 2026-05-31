import { useState } from "react";
import Navbar from "./components/Navbar";
import GridSimulator from "./components/GridSimulator";
import ChemistryGrid from "./components/ChemistryGrid";
import SizingEstimator from "./components/SizingEstimator";
import AiExpert from "./components/AiExpert";
import LearningHub from "./components/LearningHub";
import { 
  Award, 
  Battery, 
  Cpu, 
  HelpCircle, 
  Info, 
  Layers, 
  Milestone, 
  ShieldCheck, 
  Thermometer, 
  Zap 
} from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("learning");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] grid-bg flex flex-col">
      {/* Dynamic Navigation Header */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Hero Interactive Engineering Block */}
      <section className="bg-gradient-to-b from-[#f1f5f9] to-[#f8fafc] border-b border-slate-200/50 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-[10px] font-mono uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
              </span>
              Next-Gen Clean Energy Infrastructure
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-[1.1] text-slate-900 tracking-tight">
              Battery Energy Storage <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600">
                Systems (BESS)
              </span>
            </h1>
            <p className="text-slate-600 text-xs md:text-sm max-w-xl leading-relaxed">
              A Battery Energy Storage System (BESS) captures electrical power from renewable solar/wind arrays or the grid, storing it in advanced electrochemistry cells to coordinate active peak shaving, energy arbitrage, and continuous sub-cycle backup protection.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#bess-architecture"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-100 rounded-xl transition-all"
              >
                Explore System Architecture
              </a>
              <button
                onClick={() => setActiveSection("ai-expert")}
                className="px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-xs font-semibold text-cyan-700 rounded-xl border border-cyan-500/25 transition-all"
              >
                Talk to an Expert
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Quick Fact Cards */}
            <div className="glass-panel p-4 rounded-2xl border-slate-200 hover:border-cyan-500/30 transition-all bg-white">
              <Zap className="w-5 h-5 text-cyan-600 mb-2" />
              <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Grid Balancing</h3>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                Mitigates instantaneous grid frequency fluctuations with sub-second active power deployment.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-slate-200 hover:border-emerald-500/30 transition-all bg-white">
              <Battery className="w-5 h-5 text-emerald-600 mb-2" />
              <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Arbitrage Revenue</h3>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                Buys cheap energy during surplus solar production, discharging into high evening pricing peaks.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-slate-200 hover:border-amber-500/30 transition-all bg-white">
              <Thermometer className="w-5 h-5 text-amber-600 mb-2" />
              <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Thermal Cooling</h3>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                Advanced fluid dielectric pumps maintain uniform temperature, safeguarding cell lifespans.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-slate-200 hover:border-purple-500/30 transition-all bg-white">
              <Cpu className="w-5 h-5 text-purple-600 mb-2" />
              <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">EMS Logic</h3>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                SCADA co-orchestration autonomously manages charge cycles to prevent early cell wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic View Panels Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden shadow-2xl border-slate-200 bg-white">
          <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/2 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-emerald-500/2 blur-[120px] rounded-full pointer-events-none"></div>

          {activeSection === "learning" && <LearningHub />}
          {activeSection === "simulator" && <GridSimulator />}
          {activeSection === "chemistry" && <ChemistryGrid />}
          {activeSection === "sizing" && <SizingEstimator />}
          {activeSection === "ai-expert" && <AiExpert />}
        </div>
      </main>

      {/* Structured Core Architecture / informational learning path */}
      <section id="bess-architecture" className="max-w-7xl w-full mx-auto px-4 md:px-8 py-12 border-t border-slate-200/60">
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Anatomy of a Utility-Scale BESS Enclosure
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            A standard containerized BESS packs thousands of electrochemical battery cells alongside cooling lines, fire safety gear, and solid-state inverters. Each subsystem performs a critical physical or computational role:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-4 rounded-2xl space-y-2.5 bg-white border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-750 text-xs font-mono font-bold">1</div>
            <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Battery Management System (BMS)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Acts as the hardware's safety brain. Operates down to the cell level to check individual voltages, voltages balancing thresholds, and State of Charge (SoC). Triggers instant electrical isolators if abnormal thermal levels are read.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-2.5 bg-white border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-755 text-xs font-mono font-bold">2</div>
            <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Power Conversion System (PCS)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The bidirectional inverter mechanism. It swaps DC electrical power stored inside battery packs to AC utility power synchronized with the local grid. Corrects voltage phase displacements to deliver active/reactive grid power quality.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-2.5 bg-white border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-750 text-xs font-mono font-bold">3</div>
            <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Thermal Management System (TMS)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Responsible for heat rejection and cooling. Utilizes HVAC or active water-glycol coolant loop pathing. Maintains temperature variance under ±2°C to prevent local hotspots, preventing thermal cell cascading or accelerated decay.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-2.5 bg-white border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-750 text-xs font-mono font-bold">4</div>
            <h3 className="text-xs font-bold text-slate-800 uppercase font-mono">Energy Management System (EMS)</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The overarching software coordinator. Pulls spot price market data, solar PV forecast inputs, and factory demand schedules to calculate optimal energy dispatch timing, optimizing storage ROI lifetimes automatically.
            </p>
          </div>
        </div>

        {/* BTM vs FTM Explanation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="p-5 bg-white shadow-sm rounded-3xl border border-slate-200/60 space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-widest flex items-center gap-1.5">
              <Milestone className="w-4 h-4" />
              Behind-the-Meter (BTM) Applications
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Installed locally at consumer nodes (factories, smart housing, datacenters). Primarily optimized to limit grid demand spike penalties. If a commercial user's load demands spike above historic thresholds even for 15 minutes, local utilities charge heavy peak-demand multiplier penalties. BTM systems shave this peak off.
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-mono">
              <li>✓ Peak Shaving & Demand Fee Lowering</li>
              <li>✓ Renewable PV Integration (Solar Self-Consumption)</li>
              <li>✓ Backup Power Resilience during outages</li>
            </ul>
          </div>

          <div className="p-5 bg-white shadow-sm rounded-3xl border border-slate-200/60 space-y-3">
            <h4 className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Front-of-the-Meter (FTM) Grid-Scale
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Large utility substations directly serving transmission systems. They bid stored capacity directly into spot markets as frequency response or black-start services, absorbing wind power dumps when turbine output exceeds grid transmission lines.
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-mono">
              <li>✓ Frequency Over-injection Regulation (FFR)</li>
              <li>✓ Energy Arbitrage (Market Charging & Discharging bidding)</li>
              <li>✓ Synthetic Inertia & Reactive Voltage Stabilization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Humble professional learning footer */}
      <footer className="mt-auto py-8 text-center border-t border-slate-200/60 bg-slate-100">
        <p className="text-xs text-slate-600 font-mono tracking-wider">
          Battery Energy Storage System Technology Hub © 2026
        </p>
        <p className="text-[10px] text-slate-500 font-mono mt-1">
          Designed for high-fidelity smart utility study and electrochemical optimization.
        </p>
      </footer>
    </div>
  );
}
