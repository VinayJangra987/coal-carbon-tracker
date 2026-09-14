import Mine from "../models/Mine.js";
import EmissionRecord from "../models/EmissionRecord.js";
import CarbonTarget from "../models/CarbonTarget.js";
import { calculateCarbonScore } from "../utils/carbonScore.js";

export const getCarbonScore = async (req, res) => {
  try {
    const mineId = req.params.mineId;
    const mine = await Mine.findById(mineId).lean();

    if (!mine) {
      return res.status(404).json({ message: "Mine not found" });
    }

    const records = await EmissionRecord.find({ mine: mineId })
      .sort({ period: 1 })
      .lean();

    const first = records[0];
    const latest = records[records.length - 1];

    const reductionPercent =
      first && latest && Number(first.totalTonnesCO2e) > 0
        ? Math.max(
            0,
            ((Number(first.totalTonnesCO2e) -
              Number(latest.totalTonnesCO2e)) /
              Number(first.totalTonnesCO2e)) *
              100
          )
        : 0;

    const target = await CarbonTarget.findOne({
      mine: mineId,
    })
      .sort({ year: -1 })
      .lean();

    const targetAchievementPercent =
      target && latest && Number(target.targetTonnesCO2e) > 0
        ? Math.min(
            100,
            Math.max(
              0,
              (Number(target.targetTonnesCO2e) /
                Number(latest.totalTonnesCO2e || 1)) *
                100
            )
          )
        : 0;

    const score = calculateCarbonScore({
      renewablePercent: mine.renewableSharePercent,
      reductionPercent,
      targetAchievementPercent,
      dataCompletenessPercent: Math.min(100, (records.length / 12) * 100),
      intensityImprovementPercent: reductionPercent,
    });

    res.json({
      mine: {
        id: mine._id,
        name: mine.name,
        code: mine.code,
      },
      ...score,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to calculate carbon score",
      error: err.message,
    });
  }
};
