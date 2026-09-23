import Mine from "../models/Mine.js";
import EmissionRecord from "../models/EmissionRecord.js";
import { projectNeutralityPathway } from "../utils/emissionCalculator.js";

export const getPathway = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.mineId);

    if (!mine) {
      return res.status(404).json({
        message: "Mine not found",
      });
    }

    const records = await EmissionRecord.find({
      mine: mine._id,
    })
      .sort({ period: -1 })
      .limit(12);

    if (records.length === 0) {
      return res.status(400).json({
        message:
          "No emission records yet for this mine — add data first",
      });
    }

    const baselineTonnesCO2e =
      (records.reduce(
        (sum, r) => sum + r.totalTonnesCO2e,
        0
      ) /
        records.length) *
      12;

    const result = projectNeutralityPathway({
      baselineTonnesCO2e,
      currentRenewablePercent: mine.renewableSharePercent,
      afforestationHectares: mine.afforestationAreaHectares,
      ...req.body,
    });

    res.json({
      mine: mine.name,
      baselineTonnesCO2e: Math.round(baselineTonnesCO2e),
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to compute pathway",
      error: err.message,
    });
  }
};