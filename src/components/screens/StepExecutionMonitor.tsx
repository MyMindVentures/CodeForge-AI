import React, { useState, useEffect } from 'react';
import { Terminal, FileText, CheckCircle2, Activity, AlertCircle, Clock, RefreshCw, User } from 'lucide-react';
import { StepTree } from '../execution/StepTree';
import { StepDetails } from '../execution/StepDetails';
import { StandardWorkflow } from '../execution/StandardWorkflow';

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
  created_at: string;
  updated_at: string;
  environment?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  resource_usage?: string;
  error_code?: string | null;
  trace_id?: string;
  span_id?: string;
  node_id?: string;
  cluster_id?: string;
  region?: string;
  retry_policy?: string;
  timeout?: string;
  dependencies?: string[];
  tags?: string[];
}

export const StepExecutionMonitor = ({ projectId }: { projectId: string }) => {
  console.log('StepExecutionMonitor rendered with projectId:', projectId);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [activeTab, setActiveTab] = useState<'execution' | 'standard'>('execution');

  const fetchWorkflow = async () => {
    console.log(`Fetching workflow for project: ${projectId}`);
    try {
      const res = await fetch(`/api/projects/${projectId}/workflow`);
      console.log(`Workflow fetch response status: ${res.status}`);
      if (!res.ok) throw new Error('Failed to fetch workflow');
      const data = await res.json();
      console.log('Workflow data received:', data);
      setSteps(data);
    } catch (err) {
      console.error('Failed to fetch workflow', err);
    }
  };

  useEffect(() => {
    fetchWorkflow();
    const interval = setInterval(fetchWorkflow, 3000);
    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[600px]">
      {/* Left Panel: structured_step_tree */}
      <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8 flex flex-col h-[400px] lg:h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Execution Step Tree</h2>
          <div className="flex bg-white/5 rounded-lg p-1">
            <button 
              className={`px-3 py-1 text-xs rounded-md ${activeTab === 'execution' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
              onClick={() => setActiveTab('execution')}
            >Execution</button>
            <button 
              className={`px-3 py-1 text-xs rounded-md ${activeTab === 'standard' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
              onClick={() => setActiveTab('standard')}
            >Standard</button>
          </div>
        </div>
        
        {activeTab === 'execution' ? (
          <StepTree steps={steps} selectedStepId={selectedStep?.id || null} onSelectStep={setSelectedStep} />
        ) : (
          <StandardWorkflow />
        )}
      </div>
      
      {/* Right Panel: status_and_log_panel */}
      <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8 flex flex-col h-[400px] lg:h-full">
        <h2 className="text-xl font-bold text-white mb-6">Step Details</h2>
        <StepDetails step={selectedStep} />
      </div>
    </div>
  );
};
