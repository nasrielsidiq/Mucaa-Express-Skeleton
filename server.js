import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Production validation & rate limiting
import "./config/env.validation.js";
import { globalLimiter, authLimiter } from "./middleware/rate-limit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ConnectDB } from "./config/db.js";
import { initDB }    from "./config/db.init.js";
import { setupSwagger } from "./config/swagger.js";
import userRoutes    from "./routes/user.routes.js";
import authRoutes    from "./routes/auth.routes.js";
import directorRoutes from "./routes/director.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import groupRoutes from "./routes/group.routes.js";
import studentRoutes from "./routes/student.routes.js";
import taskRoutes from "./routes/task.routes.js";
import givedTaskRoutes from "./routes/gived_task.routes.js";
import gradeCategoryRoutes from "./routes/grade_category.routes.js";
import gradeRoutes from "./routes/grade.routes.js";
import logActivityRoutes from "./routes/log_activity.routes.js";
import performanceRoutes from "./routes/performance.routes.js";
import fileRoutes from "./routes/file.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// app.use(helmet());
// Replace app.use(helmet()); with this:
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "upgrade-insecure-requests": null, // This stops the HTTPS force
      },
    },
  })
);


app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static file serving for uploads - use absolute path
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// Apply rate limiting
app.use(globalLimiter);

// Swagger Documentation
setupSwagger(app);

// Auth routes with stricter rate limiting
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/directors", directorRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/gived-tasks", givedTaskRoutes);
app.use("/api/v1/grade-categories", gradeCategoryRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/grades", gradeRoutes);
app.use("/api/v1/activities", logActivityRoutes);
app.use("/api/v1/performances", performanceRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  
  console.error(err.stack);
  
  // Don't expose error details in production
  res.status(err.status || 500).json({
    error: isProd ? "Internal Server Error" : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
});

// Also add this to help Express handle the Nginx headers correctly
app.set('trust proxy', 1);

// Connect DB → init tables → start server
let server;
const start = async () => {
  try {
    await ConnectDB();
    // await initDB(); --- IGNORE ---
    server = app.listen(PORT, () => {
      console.log(`🖥️ Server running on port ${PORT} (NODE_ENV: ${process.env.NODE_ENV || "development"})`);
      
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  }
});