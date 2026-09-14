import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    const filter = {};

    if (req.query.mine) filter.mine = req.query.mine;
    if (req.query.user) filter.user = req.query.user;
    if (req.query.entity) filter.entity = req.query.entity;

    const logs = await AuditLog.find(filter)
      .populate("user", "name email role")
      .populate("mine", "name code")
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(req.query.limit || 100), 500));

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: err.message,
    });
  }
};
