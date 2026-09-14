import EmissionRecord from "../models/EmissionRecord.js";
import Mine from "../models/Mine.js";
import { calculateEmissions } from "../utils/emissionCalculator.js";

// GET /api/emissions?mine=<id>
export const getEmissions = async (req, res) => {
  try {
    const filter = {};

    if (req.query.mine) {
      filter.mine = req.query.mine;
    }

    const records = await EmissionRecord.find(filter)
      .populate("mine", "name code state type")
      .sort({ period: 1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch emission records",
      error: err.message,
    });
  }
};

// POST /api/emissions
export const createEmission = async (req, res) => {
  try {
    const mine = await Mine.findById(req.body.mine);

    if (!mine) {
      return res.status(404).json({
        message: "Mine not found",
      });
    }

    const computed = calculateEmissions(req.body, mine.type);

    const record = await EmissionRecord.create({
      ...req.body,
      ...computed,
      submittedBy: req.user?._id,
    });

    res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "A record for this mine and period already exists",
      });
    }

    res.status(400).json({
      message: "Failed to create emission record",
      error: err.message,
    });
  }
};

// PUT /api/emissions/:id
export const updateEmission = async (req, res) => {
  try {
    const existing = await EmissionRecord.findById(req.params.id)
      .populate("mine");

    if (!existing) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    const merged = {
      ...existing.toObject(),
      ...req.body,
    };

    const computed = calculateEmissions(
      merged,
      existing.mine.type
    );

    Object.assign(existing, req.body, computed);

    await existing.save();

    res.json(existing);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update record",
      error: err.message,
    });
  }
};

// DELETE /api/emissions/:id
export const deleteEmission = async (req, res) => {
  try {
    const record = await EmissionRecord.findByIdAndDelete(
      req.params.id
    );

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.json({
      message: "Record deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete record",
      error: err.message,
    });
  }
};