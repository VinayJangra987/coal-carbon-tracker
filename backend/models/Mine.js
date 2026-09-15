import mongoose from "mongoose";

const mineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true }, 
    state: { type: String, required: true },
    district: { type: String },
    coalfield: { type: String },
    type: {
      type: String,
      enum: ["opencast", "underground", "mixed"],
      default: "opencast",
    },
    annualProductionMT: { type: Number, default: 0 },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    renewableSharePercent: { type: Number, default: 0 }, 
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
