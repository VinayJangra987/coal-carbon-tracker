import express from "express";
import {
  getTargets,
  createTarget,
  getTargetProgress,
} from "../controllers/targetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTargets);
router.post("/", protect, createTarget);
router.get("/:id/progress", protect, getTargetProgress);

export default router;
