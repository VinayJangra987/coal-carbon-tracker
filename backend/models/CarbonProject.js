import mongoose from "mongoose";

const carbonProjectSchema = new mongoose.Schema(
  {
    mine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "renewable_energy",
        "energy_efficiency",
        "electrification",
        "methane_capture",
        "afforestation",
        "transport",
        "other",
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed", "paused"],
      default: "planned",
    },
    startDate: Date,
    targetDate: Date,
    estimatedAnnualReductionTonnesCO2e: {
      type: Number,
      default: 0,
      min: 0,
    },
    actualAnnualReductionTonnesCO2e: {
      type: Number,
      default: 0,
      min: 0,
    },
    investmentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CarbonProject", carbonProjectSchema);
