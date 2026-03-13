import fs from "fs";
import path from "path";

export const templateRegistry = {
  getTemplate: (profile: string) => {
    const templatePath = path.join(process.cwd(), "repo", "templates", profile);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template profile ${profile} not found`);
    }
    return templatePath;
  },
  hydrate: (templatePath: string, destination: string) => {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    // Simple copy for now
    fs.cpSync(templatePath, destination, { recursive: true });
    return { status: "success" };
  }
};
