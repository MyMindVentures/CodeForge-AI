import fs from "fs";
import path from "path";

const TELEMETRY_PATH = path.join(process.cwd(), "data", "telemetry.json");

export const telemetryStore = {
  logStep: (runId: string, stepId: string, status: string, message: string) => {
    if (!fs.existsSync(path.dirname(TELEMETRY_PATH))) {
      fs.mkdirSync(path.dirname(TELEMETRY_PATH), { recursive: true });
    }
    let data = {};
    if (fs.existsSync(TELEMETRY_PATH)) {
      data = JSON.parse(fs.readFileSync(TELEMETRY_PATH, "utf8"));
    }
    const runData = data[runId] || [];
    runData.push({ stepId, status, message, timestamp: new Date().toISOString() });
    data = { ...data, [runId]: runData };
    fs.writeFileSync(TELEMETRY_PATH, JSON.stringify(data, null, 2));
    return { status: "success" };
  }
};
