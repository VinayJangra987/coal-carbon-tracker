import CarbonTarget from "../models/CarbonTarget.js";
import EmissionRecord from "../models/EmissionRecord.js";

export const getTargets = async (req, res) => {
  try {
    const filter = req.query.mine ? { mine: req.query.mine } : {};
    const targets = await CarbonTarget.find(filter)
      .populate("mine", "name code state")
      .sort({ year: 1 });

    res.json(targets);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch carbon targets",
      error: err.message,
    });
  }
};

export const createTarget = async (req, res) => {
  try {
    const {
      mine,
      year,
      baselineTonnesCO2e,
      targetReductionPercent,
      renewableTargetPercent,
      notes,
    } = req.body;

    if (!mine || !year || targetReductionPercent === undefined) {
      return res.status(400).json({
        message: "mine, year and targetReductionPercent are required",
      });
    }

    const baseline = Number(baselineTonnesCO2e || 0);
    const reduction = Number(targetReductionPercent || 0);

    const target = await CarbonTarget.create({
      mine,
      year,
      baselineTonnesCO2e: baseline,
      targetReductionPercent: reduction,
      targetTonnesCO2e: baseline * (1 - reduction / 100),
      renewableTargetPercent,
      notes,
      createdBy: req.user?._id,
    });

    res.status(201).json(target);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "A target already exists for this mine and year",
      });
    }

    res.status(400).json({
      message: "Failed to create target",
      error: err.message,
    });
  }
};

export const getTargetProgress = async (req, res) => {
  try {
    const target = await CarbonTarget.findById(req.params.id).lean();

    if (!target) {
      return res.status(404).json({ message: "Target not found" });
    }

    const records = await EmissionRecord.find({
      mine: target.mine,
      period: {
        $gte: `${target.year}-01`,
        $lte: `${target.year}-12`,
      },
    }).lean();

    const actual = records.reduce(
      (sum, r) => sum + Number(r.totalTonnesCO2e || 0),
      0
    );

    const targetValue = Number(target.targetTonnesCO2e || 0);
    const progress =
      targetValue <= 0
        ? 0
        : Math.min(100, Math.max(0, (1 - actual / targetValue) * 100));

    res.json({
      target,
      actualTonnesCO2e: Number(actual.toFixed(2)),
      progressPercent: Number(progress.toFixed(2)),
      status: actual <= targetValue ? "on_track" : "off_track",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to calculate target progress",
      error: err.message,
    });
  }
};
