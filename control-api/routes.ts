import { Router } from "express";
import { db } from "./db.js";
import fs from "fs";
import path from "path";
import { HARDCODED_STEPS } from "../orchestrator/hardcoded-steps.js";

export const router = Router();
console.log("Control API routes loaded");

router.get("/db-check", (req, res) => {
  try {
    const dbPath = path.join(process.cwd(), "factory.db");
    const stats = fs.statSync(dbPath);
    res.json({ exists: true, size: stats.size, mode: stats.mode });
  } catch (err) {
    res.status(500).json({ error: "Failed to check db", message: err });
  }
});

router.get("/projects", (req, res) => {
  try {
    const projects = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
    res.json(projects.map((p: any) => ({ ...p, policy: p.policy ? JSON.parse(p.policy) : null })));
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error fetching projects:`, err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

function populateSteps(projectId: string, planId: string) {
  // Clear existing steps
  db.prepare("DELETE FROM workflow_steps WHERE plan_id = ?").run(planId);
  
  // Insert 50 steps
  const insert = db.prepare("INSERT INTO workflow_steps (id, plan_id, phase, stage, step, task, status, step_no, step_id, script_name, pass_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (let i = 0; i < HARDCODED_STEPS.length; i++) {
    const s = HARDCODED_STEPS[i];
    insert.run(
      Math.random().toString(36).substring(7),
      planId,
      s.phase,
      s.stage,
      s.step,
      s.task,
      "pending",
      s.step_no,
      s.step_id,
      s.script_name,
      s.pass_condition
    );
  }
}

router.post("/projects", (req, res) => {
  try {
    const { name, slug, description, framework_profile, runtime_profile, boilerplate_profile_id } = req.body;
    const id = Math.random().toString(36).substring(7);
    const planId = Math.random().toString(36).substring(7);
    
    db.prepare("INSERT INTO projects (id, name, slug, description, framework_profile, runtime_profile, boilerplate_profile_id, active_step_plan_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(id, name, slug, description, framework_profile, runtime_profile, boilerplate_profile_id, planId);
    
    populateSteps(id, planId);
    
    res.json({ id, name, slug });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/projects/:id/policy", (req, res) => {
  try {
    const { policy } = req.body;
    db.prepare("UPDATE projects SET policy = ? WHERE id = ?").run(JSON.stringify(policy), req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update policy" });
  }
});

router.get("/projects/:id/documents", (req, res) => {
  try {
    console.log(`Fetching documents for project ${req.params.id}`);
    const docs = db.prepare("SELECT * FROM documents WHERE project_id = ?").all(req.params.id);
    res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

router.post("/projects/:id/documents", (req, res) => {
  try {
    const project = db.prepare("SELECT id FROM projects WHERE id = ?").get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const { name, type, content } = req.body;
    const id = Math.random().toString(36).substring(7);
    db.prepare("INSERT INTO documents (id, project_id, name, type, content) VALUES (?, ?, ?, ?, ?)").run(id, req.params.id, name, type, content);
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload document" });
  }
});

router.get("/projects/:id/runs", (req, res) => {
  try {
    const runs = db.prepare("SELECT * FROM runs WHERE project_id = ? ORDER BY started_at DESC").all(req.params.id);
    res.json(runs);
  } catch (err) {
    console.error("Error fetching runs:", err);
    res.status(500).json({ error: "Failed to fetch runs" });
  }
});

router.get("/runs/:id/artifacts", (req, res) => {
  try {
    console.log(`Fetching artifacts for run ${req.params.id}`);
    const artifacts = db.prepare("SELECT * FROM artifacts WHERE run_id = ?").all(req.params.id);
    res.json(artifacts);
  } catch (err) {
    console.error("Error fetching artifacts:", err);
    res.status(500).json({ error: "Failed to fetch artifacts" });
  }
});

let isBuildRunning = false;

router.post("/projects/:id/start-build", async (req, res) => {
  if (isBuildRunning) {
    return res.status(429).json({ error: "A build is already in progress. Please wait." });
  }
  
  try {
    const project = db.prepare("SELECT id FROM projects WHERE id = ?").get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    isBuildRunning = true;
    const { orchestratorLoop } = await import("../orchestrator/index.js");
    const projectId = req.params.id;
    const runId = Math.random().toString(36).substring(7);
    db.prepare("INSERT INTO runs (id, project_id, status, phase, logs) VALUES (?, ?, ?, ?, ?)").run(runId, projectId, 'running', 'initialization', JSON.stringify(['Build started...']));
    
    // Trigger orchestrator loop asynchronously
    orchestratorLoop(projectId, runId)
      .catch(err => console.error("Orchestrator error:", err))
      .finally(() => { isBuildRunning = false; });
      
    res.json({ success: true, message: "Build loop started", runId });
  } catch (err) {
    isBuildRunning = false;
    console.error("Error starting build:", err);
    res.status(500).json({ error: "Failed to start build" });
  }
});

router.post("/runs/:id/approve", (req, res) => {
  try {
    db.prepare("UPDATE runs SET status = 'approved' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve run" });
  }
});

router.get("/projects/:id/sandbox-health", (req, res) => {
  // Simulate health check
  res.json({ status: "healthy", last_checked: new Date().toISOString() });
});

router.post("/projects/:id/sandbox-reset", (req, res) => {
  // Simulate reset
  res.json({ success: true });
});

router.get("/projects/:id/blueprint", (req, res) => {
  try {
    // Assuming blueprint manifest is stored in a file or db
    const manifestPath = path.join(process.cwd(), "blueprint", "compiled", "blueprint-manifest.json");
    if (!fs.existsSync(manifestPath)) {
      return res.status(404).json({ error: "Blueprint not found" });
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    res.json(manifest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blueprint" });
  }
});


router.get("/projects/:id/workflow", (req, res) => {
  try {
    console.log(`Fetching workflow for project: ${req.params.id}`);
    const project = db.prepare("SELECT active_step_plan_id FROM projects WHERE id = ?").get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const steps = db.prepare("SELECT * FROM workflow_steps WHERE plan_id = ? ORDER BY created_at ASC").all(project.active_step_plan_id);
    console.log(`Fetched ${steps.length} steps for plan ${project.active_step_plan_id}`);
    if (steps.length > 0) {
      console.log('Sample step:', JSON.stringify(steps[0]));
    } else {
      console.log('No steps found for plan:', project.active_step_plan_id);
    }
    res.json(steps);
  } catch (err) {
    console.error("Error fetching workflow:", err);
    res.status(500).json({ error: "Failed to fetch workflow", details: err });
  }
});
