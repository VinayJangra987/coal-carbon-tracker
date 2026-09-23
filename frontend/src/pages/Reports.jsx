import { useEffect, useState } from "react";
import { featureApi } from "../services/featureApi";

export default function Reports() {
  const [mine, setMine] = useState("");
  const [mines, setMines] = useState([]);
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    featureApi
      .getMines()
      .then(setMines)
      .catch((err) => setError(err.message));
  }, []);

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
      setError("Enter a Mine Name.");
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

  const exportToExcel = () => {
    if (!mine.trim()) {
      setError("Enter a Mine Name first.");
      return;
    }
    window.open(
      `http://localhost:5001/api/export/mine/${encodeURIComponent(mine.trim())}`,
      "_blank"
    );
  };

  const viewSavedReport = async (id) => {
    try {
      setError("");
      setLoadingReport(true);
      const data = await featureApi.getReport(id);
    
      setReport({
        mine: data.mine,
        generatedAt: data.createdAt,
        totals: data.snapshot?.totals,
        carbonIntensity: data.snapshot?.carbonIntensity,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingReport(false);
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
          placeholder="Mine Name"
          list="mine-history"
          className="flex-1 rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember"
        />
        
        <datalist id="mine-history">
          {mines.map((m) => (
            <option key={m._id} value={m.name} />
          ))}
        </datalist>

        <button
          onClick={generate}
          className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink hover:brightness-110"
        >
          Generate Report
        </button>

        <button
          onClick={exportToExcel}
          className="rounded-lg border border-ember px-5 py-3 text-sm font-semibold text-ember hover:bg-ember/10"
        >
          ⬇ Export Excel
        </button>
      </div>

      {mines.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {mines.map((m) => (
            <button
              key={m._id}
              onClick={() => setMine(m.name)}
              className={`rounded-full border px-3 py-1 text-xs ${
                mine === m.name
                  ? "border-ember bg-ember/10 text-ember"
                  : "border-line bg-seam text-ash hover:text-chalk"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loadingReport && (
        <div className="mb-5 text-sm text-ash">Loading report…</div>
      )}

      {report && (
        <div className="mb-6 rounded-xl border border-line bg-panel p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row">
            <div>
              <p className="text-xs uppercase tracking-wider text-ash">
                Annual Carbon Report
              </p>
              <h2 className="mt-2 text-xl font-semibold text-chalk">
                {report.mine?.name}
              </h2>
            </div>

            <div className="text-xs text-ash">
              {report.generatedAt
                ? new Date(report.generatedAt).toLocaleString()
                : ""}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <Stat label="Scope 1" value={report.totals?.scope1} />
            <Stat label="Scope 2" value={report.totals?.scope2} />
            <Stat label="Scope 3" value={report.totals?.scope3} />
            <Stat label="Total" value={report.totals?.total} accent />
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
          <button
            key={item._id}
            onClick={() => viewSavedReport(item._id)}
            className="flex w-full items-center justify-between gap-4 border-b border-line p-4 text-left last:border-b-0 hover:bg-seam"
          >
            <span className="text-sm font-medium text-chalk">
              {item.type.toUpperCase()} Report
              {item.mine?.name ? ` — ${item.mine.name}` : ""}
            </span>

            <span className="text-xs text-ash">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </button>
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
      <p className="text-xs uppercase tracking-wider text-ash">{label}</p>
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