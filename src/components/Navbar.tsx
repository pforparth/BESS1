import { BatteryCharging, Cpu, HardHat, Info, Zap, Briefcase, BookOpen } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const navItems = [
    { id: "learning", label: "Learning Hub", icon: BookOpen },
    { id: "simulator", label: "Grid Simulation", icon: Zap },
    { id: "chemistry", label: "Sourcing & Tech", icon: BatteryCharging },
    { id: "sizing", label: "Sizing Calculator", icon: Cpu },
    { id: "ai-expert", label: "AI Specialist", icon: HardHat },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10">
          <Zap className="w-5 h-5 animate-pulse text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600">
            BESS India Hub
          </h1>
          <p className="text-[10px] font-mono text-cyan-600 font-semibold tracking-widest uppercase">
            Power Transition & Learning Portal
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-1 bg-slate-100/85 p-1 rounded-xl border border-slate-200/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 text-cyan-700 border border-cyan-550/20 shadow-sm bg-white"
                  : "text-slate-550 hover:text-slate-900 hover:bg-slate-200/40 border border-transparent"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden lg:flex items-center gap-2 text-right">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-550"></span>
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Status: <strong className="text-slate-800">Educational Portal</strong>
        </span>
      </div>
    </header>
  );
}
