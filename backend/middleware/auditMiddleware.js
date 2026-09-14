import AuditLog from "../models/AuditLog.js";

export const writeAuditLog = async ({
  req,
  action,
  entity,
  entityId,
  mine,
  oldData = null,
  newData = null,
}) => {
  try {
    await AuditLog.create({
      user: req.user?._id,
      action,
      entity,
      entityId,
      mine,
      oldData,
      newData,
      ipAddress:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
