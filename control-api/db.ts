import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "factory.db");
export const db = new Database(dbPath, { timeout: 5000 });

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      description TEXT,
      framework_profile TEXT,
      runtime_profile TEXT,
      boilerplate_profile_id TEXT,
      repository_binding_id TEXT,
      blueprint_version_id TEXT,
      active_step_plan_id TEXT,
      active_release_profile_id TEXT,
      status TEXT DEFAULT 'idle',
      policy TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS repository_binding (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      binding_mode TEXT,
      repo_url TEXT,
      default_branch TEXT,
      auth_secret_ref TEXT,
      sync_status TEXT,
      last_synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
    CREATE TABLE IF NOT EXISTS boilerplate_profile (
      id TEXT PRIMARY KEY,
      name TEXT,
      stack_family TEXT,
      product_type TEXT,
      version TEXT,
      template_source TEXT,
      manifest_json TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      name TEXT,
      type TEXT,
      content TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      status TEXT,
      phase TEXT,
      logs TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
    CREATE TABLE IF NOT EXISTS step_telemetry (
      id TEXT PRIMARY KEY,
      run_id TEXT,
      step_id TEXT,
      status TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(run_id) REFERENCES runs(id)
    );
    CREATE TABLE IF NOT EXISTS workflow_steps (
      id TEXT PRIMARY KEY,
      plan_id TEXT,
      phase TEXT,
      stage TEXT,
      step TEXT,
      task TEXT,
      status TEXT,
      step_no INTEGER,
      step_id TEXT,
      script_name TEXT,
      pass_condition TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      run_id TEXT,
      name TEXT,
      type TEXT,
      path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(run_id) REFERENCES runs(id)
    );
  `);
} catch (err) {
  console.error("Error initializing database:", err);
}
