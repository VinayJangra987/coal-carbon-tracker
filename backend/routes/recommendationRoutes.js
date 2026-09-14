import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:mineId", protect, getRecommendations);

export default router;
