import { useEffect, useState } from "react";
import CarbonScoreCard from "../components/CarbonScoreCard.jsx";
import { featureApi } from "../services/featureApi";

export default function CarbonScore() {
  const [mineId, setMineId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!mineId.trim()) {
      setError("Enter a Mine ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setData(await featureApi.getCarbonScore(mineId.trim()));
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mineId.trim()) return;
    load();
  }, [mineId]);

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Performance
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Carbon Score
        </h1>
        <p className="mt-2 text-sm text-ash">
          Measure mine-level carbon performance using emissions,
          renewable energy and data-quality indicators.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 md:flex-row">
        <input
          value={mineId}
          onChange={(e) => setMineId(e.target.value)}
          placeholder="Enter Mine ID"
          className="flex-1 rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember"
        />

        <button
          onClick={load}
          className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
        >
          Calculate Score
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <CarbonScoreCard data={data} loading={loading} />
    </div>
  );
}
