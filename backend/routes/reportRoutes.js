import express from "express";
import {
  generateReport,
  getReports,
  getReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getReports);
router.post("/generate", protect, generateReport);
router.get("/:id", protect, getReport);

export default router;
