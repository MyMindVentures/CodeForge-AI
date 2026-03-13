import { HARDCODED_STEPS } from "./hardcoded-steps.js";
import { db } from "../control-api/db.js";
import { updateLogs } from "./utils.js";
import { executeTask } from "../worker-runner/index.js";
import { telemetryStore } from "../step-telemetry-store/index.js";

export const orchestratorLoop = async (projectId: string, runId: string) => {
  console.log(`[${new Date().toISOString()}] Starting hardcoded orchestrator loop for project ${projectId} run ${runId}...`);
  
  try {
    updateLogs(runId, "Starting hardcoded orchestrator loop...");
    telemetryStore.logStep(runId, "start", "running", "Orchestrator loop started");
    
    for (let i = 0; i < HARDCODED_STEPS.length; i++) {
      const s = HARDCODED_STEPS[i];
      const stepLabel = `${s.phase}: ${s.stage}: ${s.step}: ${s.task}`;
      updateLogs(runId, `Executing step ${i + 1}/50: ${stepLabel}`);
      telemetryStore.logStep(runId, `step_${i}`, "running", `Executing: ${stepLabel}`);
      
      // Execute the task
      await executeTask(projectId, s.task, "");
      
      telemetryStore.logStep(runId, `step_${i}`, "success", `Completed: ${stepLabel}`);
    }
    
    // 10. Emit final verdict
    updateLogs(runId, "Emitting final verdict...");
    db.prepare("UPDATE runs SET status = 'success', phase = 'completed' WHERE id = ?").run(runId);
    telemetryStore.logStep(runId, "finish", "success", "Orchestrator loop completed");
    
    console.log(`[${new Date().toISOString()}] Orchestrator loop completed for project ${projectId}.`);
  } catch (error: any) {
    updateLogs(runId, `Orchestrator loop failed: ${error}`);
    telemetryStore.logStep(runId, "error", "failed", error.message);
    db.prepare("UPDATE runs SET status = 'failed' WHERE id = ?").run(runId);
    console.error(`[${new Date().toISOString()}] Orchestrator loop failed for project ${projectId}:`, error);
  }
};
