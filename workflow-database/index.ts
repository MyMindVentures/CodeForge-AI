import fs from "fs";
import path from "path";

const WORKFLOW_DB_PATH = path.join(process.cwd(), "data", "workflow.json");

export const workflowDb = {
  getPlan: (projectId: string) => {
    if (!fs.existsSync(WORKFLOW_DB_PATH)) return null;
    const data = JSON.parse(fs.readFileSync(WORKFLOW_DB_PATH, "utf8"));
    return data[projectId] || null;
  },
  savePlan: (projectId: string, plan: any) => {
    if (!fs.existsSync(path.dirname(WORKFLOW_DB_PATH))) {
      fs.mkdirSync(path.dirname(WORKFLOW_DB_PATH), { recursive: true });
    }
    let data = {};
    if (fs.existsSync(WORKFLOW_DB_PATH)) {
      data = JSON.parse(fs.readFileSync(WORKFLOW_DB_PATH, "utf8"));
    }
    data = { ...data, [projectId]: plan };
    fs.writeFileSync(WORKFLOW_DB_PATH, JSON.stringify(data, null, 2));
    return { status: "success" };
  }
};
