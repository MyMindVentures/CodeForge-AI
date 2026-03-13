import React from 'react';
import { Search, Plus } from 'lucide-react';

interface HeaderProps {
  serverStatus: 'connecting' | 'online' | 'offline';
  onNewProject: () => void;
}

export const Header = ({ serverStatus, onNewProject }: HeaderProps) => {
  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-full max-w-sm lg:w-96">
        <Search className="w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full text-zinc-200 placeholder:text-zinc-600"
        />
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className={`w-2 h-2 rounded-full ${
            serverStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
            serverStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
            'bg-red-500'
          }`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            System {serverStatus}
          </span>
        </div>
        <button 
          data-testid="new-project-button"
          onClick={onNewProject}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 lg:px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">New Project</span>
        </button>
      </div>
    </header>
  );
};
