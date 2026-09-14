import EmissionRecord from "../models/EmissionRecord.js";
import Mine from "../models/Mine.js";
import CarbonTarget from "../models/CarbonTarget.js";
import CarbonProject from "../models/CarbonProject.js";
import { calculateCarbonScore } from "./carbonScore.js";

export const buildMineReport = async ({
  mineId,
  periodFrom,
  periodTo,
}) => {
  const mine = await Mine.findById(mineId).lean();

  if (!mine) {
    throw new Error("Mine not found");
  }

  const filter = { mine: mineId };

  if (periodFrom || periodTo) {
    filter.period = {};
    if (periodFrom) filter.period.$gte = periodFrom;
    if (periodTo) filter.period.$lte = periodTo;
  }

  const records = await EmissionRecord.find(filter)
    .sort({ period: 1 })
    .lean();

  const totals = records.reduce(
    (acc, r) => {
      acc.scope1 += Number(r.scope1TonnesCO2e || 0);
      acc.scope2 += Number(r.scope2TonnesCO2e || 0);
      acc.scope3 += Number(r.scope3TonnesCO2e || 0);
      acc.total += Number(r.totalTonnesCO2e || 0);
      acc.production += Number(r.coalProductionTonnes || 0);
      return acc;
    },
    { scope1: 0, scope2: 0, scope3: 0, total: 0, production: 0 }
  );

  const carbonIntensity =
    totals.production > 0
      ? totals.total / totals.production
      : 0;

  const latest = records[records.length - 1];
  const earliest = records[0];

  const reductionPercent =
    earliest && Number(earliest.totalTonnesCO2e) > 0 && latest
      ? Math.max(
          0,
          ((Number(earliest.totalTonnesCO2e) -
            Number(latest.totalTonnesCO2e)) /
            Number(earliest.totalTonnesCO2e)) *
            100
        )
      : 0;

  const score = calculateCarbonScore({
    renewablePercent: mine.renewableSharePercent,
    reductionPercent,
    targetAchievementPercent:
      latest && totals.total > 0
        ? 100
        : 0,
    dataCompletenessPercent:
      records.length >= 12 ? 100 : Math.min(100, records.length * (100 / 12)),
    intensityImprovementPercent: reductionPercent,
  });

  const targets = await CarbonTarget.find({ mine: mineId })
    .sort({ year: 1 })
    .lean();

  const projects = await CarbonProject.find({ mine: mineId })
    .sort({ createdAt: -1 })
    .lean();

  return {
    generatedAt: new Date().toISOString(),
    mine,
    period: {
      from: periodFrom || records[0]?.period || null,
      to: periodTo || records[records.length - 1]?.period || null,
    },
    totals,
    carbonIntensity: Number(carbonIntensity.toFixed(6)),
    carbonScore: score,
    records,
    targets,
    projects,
  };
};
