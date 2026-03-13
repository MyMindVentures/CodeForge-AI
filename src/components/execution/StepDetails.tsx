import React from 'react';

interface WorkflowStep {
  id: string;
  phase: string;
  stage: string;
  step: string;
  task: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  step_no: number;
  step_id: string;
  script_name: string;
  pass_condition: string;
  // Additional fields
  agent?: string;
  elapsed_time?: string;
  retry_count?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  environment?: string;
  region?: string;
  cluster_id?: string;
  node_id?: string;
  trace_id?: string;
  span_id?: string;
  last_message?: string;
  logs?: string;
}

interface StepDetailsProps {
  step: WorkflowStep | null;
}

export const StepDetails: React.FC<StepDetailsProps> = ({ step }) => {
  if (!step) {
    return <div className="text-center text-zinc-500 py-10">Select a step to view details.</div>;
  }

  return (
    <div className="space-y-6 flex-1 overflow-y-auto">
      <div className="grid grid-cols-3 gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-lg">
        {[
          { label: 'Step No', value: step.step_no },
          { label: 'Step ID', value: step.step_id },
          { label: 'Script', value: step.script_name },
          { label: 'Phase', value: step.phase },
          { label: 'Stage', value: step.stage },
          { label: 'Step', value: step.step },
          { label: 'Task', value: step.task },
          { label: 'Status', value: step.status?.toUpperCase() },
          { label: 'Agent', value: step.agent },
          { label: 'Elapsed', value: step.elapsed_time },
          { label: 'Retries', value: step.retry_count },
          { label: 'Priority', value: step.priority },
          { label: 'Environment', value: step.environment },
          { label: 'Region', value: step.region },
          { label: 'Cluster', value: step.cluster_id },
          { label: 'Node', value: step.node_id },
          { label: 'Trace ID', value: step.trace_id },
          { label: 'Span ID', value: step.span_id },
        ].map((item, i) => (
          <div key={i} className="border-b border-white/5 pb-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.label}</div>
            <div className="text-sm text-white font-mono truncate">{item.value || '-'}</div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Pass Condition</div>
        <div className="text-sm text-zinc-300">{step.pass_condition || '-'}</div>
      </div>

      <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Last Message</div>
        <div className="text-sm text-zinc-300">{step.last_message || '-'}</div>
      </div>

      <div className="p-4 bg-black/40 rounded-xl border border-white/5 shadow-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Logs</div>
        <div className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">{step.logs || '-'}</div>
      </div>
    </div>
  );
};
