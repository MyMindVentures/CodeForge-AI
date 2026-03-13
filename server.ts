process.env.NODE_ENV = 'development';
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { router as controlApiRouter } from "./control-api/routes.js";

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
});

async function startServer() {
  const PORT = 3000;
  const app = express();

  console.log(`[${new Date().toISOString()}] Starting Cloud App Factory Server...`);
  
  app.use(express.json());
  app.use(cors());

  // Log all requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/ping", (req, res) => {
    res.json({ pong: true, timestamp: new Date().toISOString() });
  });

  app.use("/api", (req, res, next) => {
    console.log(`[${new Date().toISOString()}] API request: ${req.method} ${req.url}`);
    next();
  }, controlApiRouter);

  // 404 for API routes
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found", path: req.url });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[${new Date().toISOString()}] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Fatal error during server startup:", err);
  process.exit(1);
});
