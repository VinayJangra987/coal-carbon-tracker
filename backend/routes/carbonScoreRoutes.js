import express from "express";
import { getCarbonScore } from "../controllers/carbonScoreController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:mineId", protect, getCarbonScore);

export default router;
