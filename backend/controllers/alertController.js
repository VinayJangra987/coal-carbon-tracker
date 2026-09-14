import Alert from "../models/Alert.js";
import { generateAlertsForMine } from "../utils/alertEngine.js";

export const getAlerts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.mine) filter.mine = req.query.mine;
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.acknowledged !== undefined) {
      filter.acknowledged = req.query.acknowledged === "true";
    }

    const alerts = await Alert.find(filter)
      .populate("mine", "name code state")
      .populate("acknowledgedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: err.message,
    });
  }
};

export const generateMineAlerts = async (req, res) => {
  try {
    const created = await generateAlertsForMine(req.params.mineId);

    res.json({
      message: "Alert scan completed",
      alerts: created,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to generate alerts",
      error: err.message,
    });
  }
};

export const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        acknowledged: true,
        acknowledgedBy: req.user?._id,
        acknowledgedAt: new Date(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json(alert);
  } catch (err) {
    res.status(500).json({
      message: "Failed to acknowledge alert",
      error: err.message,
    });
  }
};
