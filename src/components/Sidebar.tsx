import React from 'react';
import { Layout, Activity, ShieldCheck, Database, Settings, Cloud, Terminal } from 'lucide-react';

export const Sidebar = ({ onSelect }: { onSelect: (tab: string) => void }) => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#0D0D0E] z-50 hidden lg:block">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Cloud className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-white tracking-tight">App Factory</span>
      </div>
      
      <nav className="p-4 space-y-1">
        <button data-testid="nav-projects" onClick={() => onSelect('projects')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 text-white transition-all">
          <Layout className="w-4 h-4" />
          <span className="text-sm font-medium">Projects</span>
        </button>
        <button data-testid="nav-runs" onClick={() => onSelect('runs')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Active Runs</span>
        </button>
        <button data-testid="nav-monitor" onClick={() => onSelect('monitor')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Execution Monitor</span>
        </button>
        <button data-testid="nav-governance" onClick={() => onSelect('governance')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-medium">Governance</span>
        </button>
        <button data-testid="nav-artifacts" onClick={() => onSelect('artifacts')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all">
          <Database className="w-4 h-4" />
          <span className="text-sm font-medium">Artifacts</span>
        </button>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
        <button onClick={() => onSelect('settings')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
