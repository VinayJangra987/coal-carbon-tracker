import express from "express";

import {
  getMines,
  getMine,
  createMine,
  updateMine,
  deleteMine,
} from "../controllers/mineController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMines);

router.get("/:id", protect, getMine);

router.post(
  "/",
  protect,
  requireRole("moc_admin"),
  createMine
);

router.put(
  "/:id",
  protect,
  requireRole("moc_admin"),
  updateMine
);

router.delete(
  "/:id",
  protect,
  requireRole("moc_admin"),
  deleteMine
);

export default router;
