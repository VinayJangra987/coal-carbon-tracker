import EmissionRecord from "../models/EmissionRecord.js";
import Mine from "../models/Mine.js";
import CarbonTarget from "../models/CarbonTarget.js";
import { generateRecommendations } from "../utils/recommendationEngine.js";

export const getRecommendations = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.mineId).lean();

    if (!mine) {
      return res.status(404).json({ message: "Mine not found" });
    }

    const latest = await EmissionRecord.findOne({
      mine: req.params.mineId,
    })
      .sort({ period: -1 })
      .lean();

    const target = await CarbonTarget.findOne({
      mine: req.params.mineId,
    })
      .sort({ year: -1 })
      .lean();

    const recommendations = generateRecommendations({
      renewablePercent: mine.renewableSharePercent,
      dieselLitres: latest?.dieselLitres || 0,
      gridElectricityKWh: latest?.gridElectricityKWh || 0,
      transportTonneKm: latest?.coalTransportedTonneKm || 0,
      carbonIntensity:
        latest && Number(latest.coalProductionTonnes) > 0
          ? Number(latest.totalTonnesCO2e) /
            Number(latest.coalProductionTonnes)
          : 0,
      targetReductionPercent: target?.targetReductionPercent ?? null,
    });

    res.json({
      mine: {
        id: mine._id,
        name: mine.name,
        code: mine.code,
      },
      basedOnPeriod: latest?.period || null,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to generate recommendations",
      error: err.message,
    });
  }
};
