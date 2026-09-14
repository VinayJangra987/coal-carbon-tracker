import mongoose from "mongoose";

const emissionRecordSchema = new mongoose.Schema(
  {
    mine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
      required: true,
    },

    period: {
      type: String,
      required: true,
    }, // e.g. "2026-08" (YYYY-MM)

    // --- Raw activity data (inputs) ---
    dieselLitres: {
      type: Number,
      default: 0,
    },

    explosivesKg: {
      type: Number,
      default: 0,
    },

    coalProductionTonnes: {
      type: Number,
      default: 0,
    },

    gridElectricityKWh: {
      type: Number,
      default: 0,
    },

    renewableElectricityKWh: {
      type: Number,
      default: 0,
    },

    coalTransportedTonneKm: {
      type: Number,
      default: 0,
    }, // tonnes * km for Scope 3

    // --- Computed outputs (filled by emissionCalculator before save) ---
    scope1TonnesCO2e: {
      type: Number,
      default: 0,
    },

    scope2TonnesCO2e: {
      type: Number,
      default: 0,
    },

    scope3TonnesCO2e: {
      type: Number,
      default: 0,
    },

    totalTonnesCO2e: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      trim: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

emissionRecordSchema.index(
  { mine: 1, period: 1 },
  { unique: true }
);

export default mongoose.model("EmissionRecord", emissionRecordSchema);
