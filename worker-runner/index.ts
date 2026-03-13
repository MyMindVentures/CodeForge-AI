import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export const executeTask = async (projectId: string, command: string, workingDir: string) => {
  const projectDir = path.join(process.cwd(), "workspace", "app", projectId);
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  const cwd = path.join(projectDir, workingDir || "");
  console.log(`[${new Date().toISOString()}] Executing task in ${cwd}: ${command}`);
  
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return { status: "success", output: stdout || stderr };
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Task failed: ${error.message}`);
    return { status: "failed", error: error.message };
  }
};
