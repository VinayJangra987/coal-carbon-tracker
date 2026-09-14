import mongoose from "mongoose";

const mineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true }, // e.g. CIL-ECL-001
    state: { type: String, required: true },
    district: { type: String },
    coalfield: { type: String },
    type: {
      type: String,
      enum: ["opencast", "underground", "mixed"],
      default: "opencast",
    },
    annualProductionMT: { type: Number, default: 0 }, // million tonnes/year
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    renewableSharePercent: { type: Number, default: 0 }, // current % of energy from renewables
    afforestationAreaHectares: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "closed", "under_reclamation"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mine", mineSchema);
