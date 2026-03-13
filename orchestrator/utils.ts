import { db } from "../control-api/db.js";

export const updateLogs = (runId: string, log: string) => {
  const run = db.prepare("SELECT logs FROM runs WHERE id = ?").get(runId) as any;
  const logs = JSON.parse(run.logs);
  logs.push(`[${new Date().toISOString()}] ${log}`);
  db.prepare("UPDATE runs SET logs = ? WHERE id = ?").run(JSON.stringify(logs), runId);
};
