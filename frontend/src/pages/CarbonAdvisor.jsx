import { useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import { featureApi } from "../services/featureApi";

export default function CarbonAdvisor() {
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
      setData(await featureApi.getRecommendations(mineId.trim()));
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Decision Support
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Carbon Advisor
        </h1>
        <p className="mt-2 text-sm text-ash">
          Practical reduction recommendations based on current mine data.
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
          Analyze Mine
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-3">
          <div className="mb-4 rounded-xl border border-line bg-panel p-5">
            <p className="text-xs uppercase tracking-wider text-ash">
              Analysis Period
            </p>
            <p className="mt-2 font-medium text-chalk">
              {data.basedOnPeriod || "No emission data"}
            </p>
          </div>

          {data.recommendations.map((item, index) => (
            <div
              key={`${item.category}-${index}`}
              className="rounded-xl border border-line bg-panel p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-semibold text-chalk">
                  {item.title}
                </h2>
                <StatusBadge status={item.priority} />
              </div>

              <p className="mt-3 text-sm leading-6 text-ash">
                {item.action}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
