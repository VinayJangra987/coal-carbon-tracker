import mongoose from "mongoose";

const carbonTargetSchema = new mongoose.Schema(
  {
    mine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
    },
    baselineTonnesCO2e: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetReductionPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    targetTonnesCO2e: {
      type: Number,
      default: 0,
      min: 0,
    },
    renewableTargetPercent: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    notes: {
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

carbonTargetSchema.index({ mine: 1, year: 1 }, { unique: true });

export default mongoose.model("CarbonTarget", carbonTargetSchema);