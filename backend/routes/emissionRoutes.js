import express from "express";

import {
  getEmissions,
  createEmission,
  updateEmission,
  deleteEmission,
} from "../controllers/emissionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getEmissions);

router.post("/", protect, createEmission);

router.put("/:id", protect, updateEmission);

router.delete("/:id", protect, deleteEmission);

export default router;