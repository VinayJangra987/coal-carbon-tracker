import Mine from "../models/Mine.js";
import EmissionRecord from "../models/EmissionRecord.js";
export const getSummary = async (req, res) => {
  try {
    const totalMines = await Mine.countDocuments();

    const totals = await EmissionRecord.aggregate([
      {
        $group: {
          _id: null,
          scope1: { $sum: "$scope1TonnesCO2e" },
          scope2: { $sum: "$scope2TonnesCO2e" },
          scope3: { $sum: "$scope3TonnesCO2e" },
          total: { $sum: "$totalTonnesCO2e" },
        },
      },
    ]);

    const byMine = await EmissionRecord.aggregate([
      {
        $group: {
          _id: "$mine",
          total: { $sum: "$totalTonnesCO2e" },
        },
      },
      {
        $lookup: {
          from: "mines",
          localField: "_id",
          foreignField: "_id",
          as: "mine",
        },
      },
      {
        $unwind: "$mine",
      },
      {
        $project: {
          name: "$mine.name",
          state: "$mine.state",
          total: 1,
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    const trend = await EmissionRecord.aggregate([
      {
        $group: {
          _id: "$period",
          total: { $sum: "$totalTonnesCO2e" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json({
      totalMines,
      totals:
        totals[0] || {
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        },
      byMine,
      trend,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to build dashboard summary",
      error: err.message,
    });
  }
};