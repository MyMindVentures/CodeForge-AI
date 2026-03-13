import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Github, Activity, CheckCircle2, AlertCircle, ChevronRight, Play } from 'lucide-react';

interface ProjectCardProps {
  key?: string;
  project: any;
  onClick: () => void;
  onStartBuild: (id: string) => void;
}

export const ProjectCard = ({ project, onClick, onStartBuild }: ProjectCardProps) => {
  return (
    <motion.div 
      layoutId={project.id}
      onClick={onClick}
      data-testid={`project-card-${project.id}`}
      className="group relative bg-[#0D0D0E] border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5 text-zinc-500" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
          <Terminal className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h3 data-testid="project-name" className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{project.name}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Github className="w-3 h-3" />
            {project.repo_url || 'No repository linked'}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-zinc-400 uppercase tracking-wider">
              {project.framework}
            </span>
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-zinc-400 uppercase tracking-wider">
              {project.deployment_target}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Status</span>
          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
            project.status === 'building' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' :
            project.status === 'success' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
            'text-zinc-400 border-white/10 bg-white/5'
          }`}>
            {project.status === 'building' && <Activity className="w-3 h-3 animate-pulse" />}
            {project.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
            {project.status === 'failed' && <AlertCircle className="w-3 h-3" />}
            {project.status.toUpperCase()}
          </span>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: project.status === 'building' ? '65%' : project.status === 'success' ? '100%' : '0%' }}
            className={`h-full ${project.status === 'building' ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
        </div>

        <div className="pt-4 flex items-center gap-3">
          <button 
            data-testid="start-build-button"
            onClick={(e) => { e.stopPropagation(); onStartBuild(project.id); }}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-all border border-white/5"
          >
            <Play className="w-3.5 h-3.5" />
            Start Build
          </button>
        </div>
      </div>
    </motion.div>
  );
};
