import React, { useState } from 'react';
import { CheckCircle2, Activity, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';

interface WorkflowStep {
  id: string;
  phase: string;
  stage: string;
  step: string;
  task: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  step_no: number;
  step_id: string;
}

interface StepTreeProps {
  steps: WorkflowStep[];
  selectedStepId: string | null;
  onSelectStep: (step: WorkflowStep) => void;
}

export const StepTree: React.FC<StepTreeProps> = ({ steps, selectedStepId, onSelectStep }) => {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  const toggleStage = (stage: string) => {
    setExpandedStages(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  // Group steps by Phase and then Stage
  const phases = steps.reduce((acc, step) => {
    if (!acc[step.phase]) acc[step.phase] = {};
    if (!acc[step.phase][step.stage]) acc[step.phase][step.stage] = [];
    acc[step.phase][step.stage].push(step);
    return acc;
  }, {} as Record<string, Record<string, WorkflowStep[]>>);

  return (
    <div className="space-y-2 overflow-y-auto flex-1 text-sm pr-2 custom-scrollbar">
      {Object.entries(phases).map(([phaseName, stages]) => (
        <div key={phaseName} className="space-y-1">
          <button 
            onClick={() => togglePhase(phaseName)}
            className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-left transition-colors group"
          >
            {expandedPhases[phaseName] ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">{phaseName}</span>
          </button>

          {expandedPhases[phaseName] && (
            <div className="ml-4 space-y-1 border-l border-white/5 pl-2">
              {Object.entries(stages).map(([stageName, stageSteps]) => (
                <div key={stageName} className="space-y-1">
                  <button 
                    onClick={() => toggleStage(stageName)}
                    className="w-full flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg text-left transition-colors group"
                  >
                    {expandedStages[stageName] ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
                    <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">{stageName}</span>
                  </button>

                  {expandedStages[stageName] && (
                    <div className="ml-4 space-y-1 border-l border-white/5 pl-2">
                      {stageSteps.map((step) => (
                        <div 
                          key={step.id} 
                          className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                            selectedStepId === step.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                          onClick={() => onSelectStep(step)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="flex items-center justify-center w-4">
                              {step.status === 'success' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> :
                               step.status === 'running' ? <Activity className="w-3 h-3 text-amber-500 animate-pulse" /> :
                               step.status === 'failed' ? <AlertCircle className="w-3 h-3 text-red-500" /> : 
                               <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] text-white truncate font-medium">
                                <span className="text-zinc-500 mr-1">#{step.step_no}</span>
                                {step.step}
                              </div>
                              <div className="text-[9px] text-zinc-500 truncate">{step.task}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
