import React from 'react';

const ENTERPRISE_STEPS = [
  "Requirement Analysis", "Context Gathering", "Impact Assessment", "Environment Preparation",
  "Dependency Audit", "Implementation Planning", "Code Implementation", "Unit Testing",
  "Static Analysis", "Build Verification", "E2E Testing", "Security Audit",
  "Documentation", "Final Verification", "Summary & Handover"
];

export const StandardWorkflow: React.FC = () => {
  return (
    <div className="space-y-2 overflow-y-auto flex-1">
      {ENTERPRISE_STEPS.map((stepName, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-zinc-500 font-mono text-xs w-6">#{index + 1}</span>
          <span className="text-sm text-zinc-300">{stepName}</span>
        </div>
      ))}
    </div>
  );
};
