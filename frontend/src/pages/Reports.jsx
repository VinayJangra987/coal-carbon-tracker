import { useEffect, useState } from "react";
import { featureApi } from "../services/featureApi";

export default function Reports() {
  const [mine, setMine] = useState("");
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setReports(await featureApi.getReports(mine.trim()));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [mine]);

  const generate = async () => {
    if (!mine.trim()) {
      setError("Enter a Mine ID.");
      return;
    }

    try {
      setError("");

      const data = await featureApi.generateReport({
        mine: mine.trim(),
        type: "annual",
        periodFrom: "2025-10",
        periodTo: "2026-09",
        save: true,
      });

      setReport(data.report);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Reporting
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Carbon Reports
        </h1>
        <p className="mt-2 text-sm text-ash">
          Generate structured mine-level carbon performance reports.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 md:flex-row">
        <input
          value={mine}
          onChange={(e) => setMine(e.target.value)}
          placeholder="Mine ID"
          className="flex-1 rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember"
        />

        <button
          onClick={generate}
          className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink hover:brightness-110"
        >
          Generate Report
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {report && (
        <div className="mb-6 rounded-xl border border-line bg-panel p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row">
            <div>
              <p className="text-xs uppercase tracking-wider text-ash">
                Annual Carbon Report
              </p>
              <h2 className="mt-2 text-xl font-semibold text-chalk">
                {report.mine.name}
              </h2>
            </div>

            <div className="text-xs text-ash">
              {new Date(report.generatedAt).toLocaleString()}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <Stat label="Scope 1" value={report.totals.scope1} />
            <Stat label="Scope 2" value={report.totals.scope2} />
            <Stat label="Scope 3" value={report.totals.scope3} />
            <Stat label="Total" value={report.totals.total} accent />
          </div>

          <div className="mt-4 rounded-lg border border-line bg-seam p-4">
            <p className="text-xs uppercase tracking-wider text-ash">
              Carbon Intensity
            </p>
            <p className="mt-2 text-xl font-semibold text-ember">
              {report.carbonIntensity} tCO2e / tonne coal
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="border-b border-line p-5">
          <h2 className="font-semibold">Saved Reports</h2>
        </div>

        {reports.map((item) => (
          <div key={item._id} className="border-b border-line p-4 last:border-b-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-chalk">
                {item.type.toUpperCase()} Report
              </span>

              <span className="text-xs text-ash">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}

        {!reports.length && (
          <p className="p-10 text-center text-sm text-ash">
            No saved reports.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }) {
  return (
    <div className="rounded-lg border border-line bg-seam p-4">
      <p className="text-xs uppercase tracking-wider text-ash">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-semibold ${
          accent ? "text-ember" : "text-chalk"
        }`}
      >
        {Number(value || 0).toLocaleString()}
      </p>
      <p className="text-[11px] text-ash">tCO2e</p>
    </div>
  );
}
