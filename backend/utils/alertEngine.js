import Alert from "../models/Alert.js";
import CarbonTarget from "../models/CarbonTarget.js";
import EmissionRecord from "../models/EmissionRecord.js";

const percentChange = (current, previous) =>
  previous === 0 ? 0 : ((current - previous) / previous) * 100;

export const generateAlertsForMine = async (mineId) => {
  const records = await EmissionRecord.find({ mine: mineId })
    .sort({ period: -1 })
    .limit(12)
    .lean();

  if (!records.length) return [];

  const current = records[0];
  const previous = records[1];

  const created = [];

  if (previous) {
    const emissionChange = percentChange(
      Number(current.totalTonnesCO2e),
      Number(previous.totalTonnesCO2e)
    );

    if (emissionChange >= 20) {
      created.push({
        mine: mineId,
        type: "emission_spike",
        severity: "high",
        title: "Emission spike detected",
        message: `Total emissions increased ${emissionChange.toFixed(1)}% compared with the previous period.`,
        period: current.period,
        metadata: { emissionChange },
      });
    }

    const dieselChange = percentChange(
      Number(current.dieselLitres),
      Number(previous.dieselLitres)
    );

    if (dieselChange >= 20) {
      created.push({
        mine: mineId,
        type: "diesel_spike",
        severity: "medium",
        title: "Diesel consumption increased",
        message: `Diesel consumption increased ${dieselChange.toFixed(1)}% compared with the previous period.`,
        period: current.period,
        metadata: { dieselChange },
      });
    }
  }

  const target = await CarbonTarget.findOne({
    mine: mineId,
    year: Number(String(current.period).slice(0, 4)),
  }).lean();

  if (target && Number(current.totalTonnesCO2e) > Number(target.targetTonnesCO2e)) {
    created.push({
      mine: mineId,
      type: "target_exceeded",
      severity: "critical",
      title: "Carbon target exceeded",
      message: `Emissions for ${current.period} are above the configured target.`,
      period: current.period,
      metadata: {
        actual: current.totalTonnesCO2e,
        target: target.targetTonnesCO2e,
      },
    });
  }

  if (created.length) {
    for (const alert of created) {
      const exists = await Alert.findOne({
        mine: alert.mine,
        period: alert.period,
        type: alert.type,
      });

      if (!exists) {
        await Alert.create(alert);
      }
    }
  }

  return created;
};
