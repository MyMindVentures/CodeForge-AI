import React, { useState, useEffect } from 'react';
import { FileText, Activity } from 'lucide-react';

export const BlueprintAndWorkflow = ({ projectId }: { projectId: string }) => {
  const [blueprint, setBlueprint] = useState<any>(null);
  const [workflow, setWorkflow] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/blueprint`)
      .then(res => res.json())
      .then(data => setBlueprint(data))
      .catch(err => console.error(err));

    fetch(`/api/projects/${projectId}/workflow`)
      .then(res => res.json())
      .then(data => setWorkflow(data))
      .catch(err => console.error(err));
  }, [projectId]);

  return (
    <div className="space-y-8">
      <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Blueprint Overview</h2>
        {blueprint ? (
          <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-5">
            <li>Name: {blueprint.name}</li>
            <li>Version: {blueprint.blueprint_version}</li>
            <li>Mission: {blueprint.mission}</li>
            {/* Add more fields as needed */}
          </ul>
        ) : (
          <p className="text-zinc-500">Loading blueprint...</p>
        )}
      </div>

      <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Workflow Steps</h2>
        {workflow.length > 0 ? (
          <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-5">
            {workflow.map((step, i) => (
              <li key={i}>{step.task} - {step.status}</li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No workflow steps found.</p>
        )}
      </div>
    </div>
  );
};
