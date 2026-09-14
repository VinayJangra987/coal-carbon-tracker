import express from "express";

import { getPathway } from "../controllers/pathwayController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:mineId", protect, getPathway);

export default router;
