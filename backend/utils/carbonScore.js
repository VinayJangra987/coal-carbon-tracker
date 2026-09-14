export const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number(value) || 0));

export const calculateCarbonScore = ({
  renewablePercent = 0,
  reductionPercent = 0,
  targetAchievementPercent = 0,
  dataCompletenessPercent = 100,
  intensityImprovementPercent = 0,
}) => {
  const renewableScore = clamp(renewablePercent);
  const reductionScore = clamp(reductionPercent * 2);
  const targetScore = clamp(targetAchievementPercent);
  const dataScore = clamp(dataCompletenessPercent);
  const intensityScore = clamp(intensityImprovementPercent * 2);

  const score =
    renewableScore * 0.25 +
    reductionScore * 0.25 +
    targetScore * 0.2 +
    dataScore * 0.15 +
    intensityScore * 0.15;

  const rounded = Math.round(clamp(score));

  let rating = "Needs Improvement";
  if (rounded >= 85) rating = "Excellent";
  else if (rounded >= 70) rating = "Good";
  else if (rounded >= 50) rating = "Moderate";

  return {
    score: rounded,
    rating,
    breakdown: {
      renewableScore: Math.round(renewableScore),
      reductionScore: Math.round(reductionScore),
      targetScore: Math.round(targetScore),
      dataScore: Math.round(dataScore),
      intensityScore: Math.round(intensityScore),
    },
  };
};
