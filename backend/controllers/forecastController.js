import EmissionRecord from "../models/EmissionRecord.js";
import Mine from "../models/Mine.js";
import { forecastEmissions } from "../utils/forecastCalculator.js";

export const getForecast = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.mineId).lean();

    if (!mine) {
      return res.status(404).json({ message: "Mine not found" });
    }

    const limit = Math.min(
      60,
      Math.max(3, Number(req.query.history || 12))
    );

    const forecastPeriods = Math.min(
      24,
      Math.max(1, Number(req.query.periods || 6))
    );

    const records = await EmissionRecord.find({
      mine: req.params.mineId,
    })
      .sort({ period: 1 })
      .limit(limit)
      .lean();

    const result = forecastEmissions(records, forecastPeriods);

    res.json({
      mine: {
        id: mine._id,
        name: mine.name,
        code: mine.code,
      },
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to generate forecast",
      error: err.message,
    });
  }
};
