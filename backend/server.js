import dns from "dns";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import mineRoutes from "./routes/mineRoutes.js";
import emissionRoutes from "./routes/emissionRoutes.js";
import pathwayRoutes from "./routes/pathwayRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import targetRoutes from "./routes/targetRoutes.js";
import carbonScoreRoutes from "./routes/carbonScoreRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import exportRoute from "./routes/exportRoute.js";
import projectRoutes from "./routes/projectRoutes.js";


dotenv.config();

dns.setDefaultResultOrder("ipv4first");


dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
  "2001:4860:4860::8888",
  "2001:4860:4860::8844",
]);

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
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

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Coal Carbon Tracker API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/mines", mineRoutes);
app.use("/api/emissions", emissionRoutes);
app.use("/api/pathway", pathwayRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/carbon-score", carbonScoreRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/export",exportRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});