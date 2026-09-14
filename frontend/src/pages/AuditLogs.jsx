import { useEffect, useState } from "react";
import { featureApi } from "../services/featureApi";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    featureApi
      .getAuditLogs()
      .then(setLogs)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Administration
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Audit Logs
        </h1>
        <p className="mt-2 text-sm text-ash">
          Track important changes made to the carbon management system.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-seam text-[11px] uppercase tracking-wider text-ash">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Mine</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t border-line">
                  <td className="p-4 text-xs text-ash">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4 text-chalk">
                    {log.user?.name || log.user?.email || "System"}
                  </td>

                  <td className="p-4 font-medium text-ember">
                    {log.action}
                  </td>

                  <td className="p-4 text-ash">{log.entity}</td>

                  <td className="p-4 text-ash">
                    {log.mine?.name || log.mine || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!logs.length && !error && (
          <p className="p-10 text-center text-sm text-ash">
            No audit logs yet.
          </p>
        )}
      </div>
    </div>
  );
}
