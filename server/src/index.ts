import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";

import { env } from "./env";
import { router } from "./routes/index";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import experienceRoutes from "./routes/experience.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://abc123.ngrok.io",
      "https://abhinandan19909-default-pwcarbusinesscards.dev.8thwall.app",
      "https://pwcarbusinesscards.8thwall.app",
      "https://*.8thwall.app",
      "https://*.8thwall.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---- API routes ----
app.use("/api", router);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/experience", experienceRoutes);

// ---- Error handler ALWAYS last before listen ----
app.use(errorHandler);

// ---- Static frontend only in production ----
const thisDirname = __dirname;
const frontendDir = path.resolve(thisDirname, "../../frontend");
const distDir = path.join(frontendDir, "dist");

if (env.NODE_ENV === "production") {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

// ---- Single listen() ----
const PORT = Number(process.env.PORT) || 5174;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
