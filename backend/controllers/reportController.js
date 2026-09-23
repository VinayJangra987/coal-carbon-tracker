import Report from "../models/Report.js";
import Mine from "../models/Mine.js";
import { buildMineReport } from "../utils/reportGenerator.js";

export const generateReport = async (req, res) => {
  try {
    const { mine, type, periodFrom, periodTo, save } = req.body;

    if (!mine) {
      return res.status(400).json({ message: "mine is required" });
    }

    const mineDoc = await Mine.findOne({ name: mine });
    if (!mineDoc) {
      return res.status(404).json({ message: "Mine not found" });
    }

    const snapshot = await buildMineReport({
      mineId: mineDoc._id,
      periodFrom,
      periodTo,
    });

    let savedReport = null;

    if (save !== false) {
      savedReport = await Report.create({
        mine: mineDoc._id,
        type: type || "monthly",
        periodFrom,
        periodTo,
        generatedBy: req.user?._id,
        snapshot,
      });
    }

    res.json({
      report: snapshot,
      savedReport,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to generate report",
      error: err.message,
    });
  }
};

export const getReports = async (req, res) => {
  try {
    let filter = {};

    if (req.query.mine) {
      const mineDoc = await Mine.findOne({ name: req.query.mine });
      if (!mineDoc) {
        return res.json([]); 
      }
      filter = { mine: mineDoc._id };
    }

    const reports = await Report.find(filter)
      .populate("mine", "name code")
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error: err.message,
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("mine", "name code state")
      .populate("generatedBy", "name email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch report",
      error: err.message,
    });
  }
};