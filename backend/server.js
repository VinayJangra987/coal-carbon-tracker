import dns from "dns";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Existing routes
import authRoutes from "./routes/authRoutes.js";
import mineRoutes from "./routes/mineRoutes.js";
import emissionRoutes from "./routes/emissionRoutes.js";
import pathwayRoutes from "./routes/pathwayRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// New feature routes
import targetRoutes from "./routes/targetRoutes.js";
import carbonScoreRoutes from "./routes/carbonScoreRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

// Load environment variables
dotenv.config();

// Force IPv4 first for DNS resolution
dns.setDefaultResultOrder("ipv4first");

// Configure DNS servers
dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
  "2001:4860:4860::8888",
  "2001:4860:4860::8844",
]);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // e.g. https://coal-carbon-tracker.vercel.app
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Coal Carbon Tracker API is running",
  });
});

// ===============================
// Existing API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/mines", mineRoutes);
app.use("/api/emissions", emissionRoutes);
app.use("/api/pathway", pathwayRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// New Feature API Routes
// ===============================

// Carbon targets
app.use("/api/targets", targetRoutes);

// Carbon score
app.use("/api/carbon-score", carbonScoreRoutes);

// Emission alerts
app.use("/api/alerts", alertRoutes);

// Emission forecasting
app.use("/api/forecast", forecastRoutes);

// Carbon recommendations / advisor
app.use("/api/recommendations", recommendationRoutes);

// Audit logs
app.use("/api/audit", auditRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// Carbon reduction projects
app.use("/api/projects", projectRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});