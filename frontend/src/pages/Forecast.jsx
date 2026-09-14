import { useState } from "react";
import { featureApi } from "../services/featureApi";

export default function Forecast() {
  const [mineId, setMineId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    if (!mineId.trim()) {
      setError("Enter a Mine ID.");
      return;
    }

    try {
      setError("");
      setData(await featureApi.getForecast(mineId.trim()));
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Analytics
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Emission Forecast
        </h1>
        <p className="mt-2 text-sm text-ash">
          Project future emissions using the mine's historical trend.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 md:flex-row">
        <input
          value={mineId}
          onChange={(e) => setMineId(e.target.value)}
          placeholder="Mine ID"
          className="flex-1 rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember"
        />

        <button
          onClick={load}
          className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink hover:brightness-110"
        >
          Generate Forecast
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Metric
              label="Trend / Period"
              value={`${data.trendPerPeriod} tCO2e`}
            />
            <Metric
              label="Historical Change"
              value={`${data.historicalChangePercent}%`}
            />
            <Metric
              label="Forecast Method"
              value="Linear Trend"
            />
          </div>

          <div className="rounded-xl border border-line bg-panel">
            <div className="border-b border-line p-5">
              <h2 className="font-semibold">Projected Emissions</h2>
            </div>

            <div className="divide-y divide-line">
              {data.forecast.map((item) => (
                <div
                  key={item.step}
                  className="flex items-center justify-between p-4"
                >
                  <span className="text-sm text-ash">
                    Future period {item.step}
                  </span>

                  <strong className="text-sm text-ember">
                    {Number(
                      item.predictedTonnesCO2e
                    ).toLocaleString()}{" "}
                    tCO2e
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <p className="text-xs uppercase tracking-wider text-ash">
        {label}
      </p>
      <p className="mt-3 text-xl font-semibold text-chalk">{value}</p>
    </div>
  );
}
