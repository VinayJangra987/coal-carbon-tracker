import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  requireRole("moc_admin"),
  getAuditLogs
);

export default router;
