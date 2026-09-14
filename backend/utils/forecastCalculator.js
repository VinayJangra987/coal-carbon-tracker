const linearRegression = (values) => {
  const n = values.length;
  if (!n) return { slope: 0, intercept: 0 };

  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  values.forEach((y, x) => {
    numerator += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
};

export const forecastEmissions = (records = [], forecastPeriods = 6) => {
  const sorted = [...records]
    .filter((r) => Number.isFinite(Number(r.totalTonnesCO2e)))
    .sort((a, b) => String(a.period).localeCompare(String(b.period)));

  const values = sorted.map((r) => Number(r.totalTonnesCO2e));
  const { slope, intercept } = linearRegression(values);

  const last = values.length ? values[values.length - 1] : 0;
  const first = values.length ? values[0] : 0;
  const changePercent =
    first === 0 ? 0 : ((last - first) / first) * 100;

  const forecast = [];

  for (let i = 1; i <= forecastPeriods; i++) {
    const predicted = Math.max(
      0,
      intercept + slope * (values.length - 1 + i)
    );

    forecast.push({
      step: i,
      predictedTonnesCO2e: Number(predicted.toFixed(2)),
    });
  }

  return {
    method: "linear_trend",
    historicalPeriods: sorted.map((r) => r.period),
    historicalValues: values,
    trendPerPeriod: Number(slope.toFixed(2)),
    historicalChangePercent: Number(changePercent.toFixed(2)),
    forecast,
  };
};
