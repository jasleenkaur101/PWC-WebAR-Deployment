import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import fs from "fs";

import { env } from "./env";
import { router } from "./routes/index";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import experienceRoutes from "./routes/experience.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://api.qrserver.com"],
    },
  },
}));app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---- API routes ----
app.use("/api", router);

// ---- Error handler ALWAYS last before listen ----
app.use(errorHandler);

// ---- Static frontend only in production ----
const thisDirname = __dirname;
const frontendDir = path.resolve(thisDirname, "../../frontend");
const distDir = path.join(frontendDir, "dist");

// Serve frontend if dist directory exists
if (fs.existsSync(distDir)) {
  console.log("Serving frontend from:", distDir);
  app.use(express.static(distDir));
  
  // Serve index.html for all non-API routes (SPA support)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  console.log("Frontend dist not found, API-only mode");
}

// ---- Single listen() ----
const PORT = Number(process.env.PORT) || 5174;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  if (fs.existsSync(distDir)) {
    console.log(`Frontend available at http://localhost:${PORT}`);
  }
});