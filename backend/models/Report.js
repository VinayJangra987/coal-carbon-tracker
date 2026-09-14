import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    mine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
    },
    type: {
      type: String,
      enum: ["monthly", "annual", "esg", "net_zero"],
      default: "monthly",
    },
    periodFrom: String,
    periodTo: String,
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

reportSchema.index({ mine: 1, createdAt: -1 });

export default mongoose.model("Report", reportSchema);
