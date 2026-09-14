export const generateRecommendations = ({
  renewablePercent = 0,
  dieselLitres = 0,
  gridElectricityKWh = 0,
  transportTonneKm = 0,
  carbonIntensity = 0,
  targetReductionPercent = null,
} = {}) => {
  const recommendations = [];

  if (renewablePercent < 25) {
    recommendations.push({
      priority: "high",
      category: "renewable_energy",
      title: "Increase renewable electricity",
      action:
        "Increase renewable electricity procurement or onsite generation and reduce dependence on grid electricity.",
    });
  } else if (renewablePercent < 50) {
    recommendations.push({
      priority: "medium",
      category: "renewable_energy",
      title: "Expand renewable share",
      action:
        "Evaluate additional solar, renewable PPAs, or storage to move renewable electricity toward 50% or higher.",
    });
  }

  if (dieselLitres > 0) {
    recommendations.push({
      priority: "high",
      category: "electrification",
      title: "Reduce diesel dependency",
      action:
        "Optimize haul routes, equipment utilization, idle time, and evaluate electric or hybrid equipment.",
    });
  }

  if (gridElectricityKWh > 0) {
    recommendations.push({
      priority: "medium",
      category: "energy_efficiency",
      title: "Improve electricity efficiency",
      action:
        "Audit high-consumption equipment such as conveyors, pumps, crushers, and ventilation systems.",
    });
  }

  if (transportTonneKm > 0) {
    recommendations.push({
      priority: "medium",
      category: "transport",
      title: "Optimize coal transportation",
      action:
        "Reduce unnecessary haulage distance, improve payload utilization, and evaluate lower-carbon transport options.",
    });
  }

  if (carbonIntensity > 0) {
    recommendations.push({
      priority: "medium",
      category: "carbon_intensity",
      title: "Track emissions per tonne",
      action:
        "Use tonnes CO2e per tonne of coal as a core KPI and compare monthly performance against the mine baseline.",
    });
  }

  if (targetReductionPercent !== null && targetReductionPercent < 10) {
    recommendations.push({
      priority: "high",
      category: "net_zero",
      title: "Strengthen the reduction target",
      action:
        "Set a measurable annual reduction pathway and assign specific carbon-reduction projects to the target.",
    });
  }

  return recommendations;
};
