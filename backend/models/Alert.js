import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    mine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "target_exceeded",
        "emission_spike",
        "diesel_spike",
        "renewable_drop",
        "missing_data",
        "high_intensity",
        "general",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    period: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    acknowledgedAt: Date,
  },
  { timestamps: true }
);

alertSchema.index({ mine: 1, period: 1, type: 1 });

export default mongoose.model("Alert", alertSchema);
