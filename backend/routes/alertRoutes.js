import express from "express";
import {
  getAlerts,
  generateMineAlerts,
  acknowledgeAlert,
} from "../controllers/alertController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAlerts);
router.post("/generate/:mineId", protect, generateMineAlerts);
router.put("/:id/acknowledge", protect, acknowledgeAlert);

export default router;  