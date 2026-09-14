import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import { featureApi } from "../services/featureApi";

export default function Alerts() {
  const [mineId, setMineId] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setAlerts(
        await featureApi.getAlerts(
          mineId.trim() ? `mine=${mineId.trim()}` : ""
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    if (!mineId.trim()) {
      setError("Enter a Mine ID first.");
      return;
    }

    try {
      setError("");
      await featureApi.generateAlerts(mineId.trim());
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const acknowledge = async (id) => {
    try {
      await featureApi.acknowledgeAlert(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <Header />

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 md:flex-row">
        <input
          value={mineId}
          onChange={(e) => setMineId(e.target.value)}
          placeholder="Mine ID"
          className="flex-1 rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember"
        />

        <button
          onClick={generate}
          className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink hover:brightness-110"
        >
          Scan Mine
        </button>

        <button
          onClick={load}
          className="rounded-lg border border-line bg-seam px-5 py-3 text-sm font-medium text-chalk hover:border-ember/50"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className="rounded-xl border border-line bg-panel p-5"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold text-chalk">
                    {alert.title}
                  </h2>
                  <StatusBadge status={alert.severity} />
                </div>

                <p className="mt-2 text-sm leading-6 text-ash">
                  {alert.message}
                </p>

                <p className="mt-3 text-xs text-ash">
                  {alert.mine?.name || alert.mine || "Unknown mine"}
                  {" · "}
                  {alert.period || "No period"}
                </p>
              </div>

              {!alert.acknowledged && (
                <button
                  onClick={() => acknowledge(alert._id)}
                  className="self-start rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}

        {!alerts.length && (
          <div className="rounded-xl border border-dashed border-line bg-panel p-10 text-center text-sm text-ash">
            No alerts found.
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.18em] text-ember">
        Monitoring
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Alerts</h1>
      <p className="mt-2 text-sm text-ash">
        Monitor emission spikes and carbon target breaches.
      </p>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
      {message}
    </div>
  );
}
