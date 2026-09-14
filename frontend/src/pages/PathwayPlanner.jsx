import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../utils/api";

export default function PathwayPlanner() {
  const [mines, setMines] = useState([]);
  const [selectedMine, setSelectedMine] = useState("");
  const [params, setParams] = useState({
    targetRenewablePercent: 80,
    renewableRampYears: 10,
    afforestationHectares: 100,
    annualEfficiencyGainPercent: 1.5,
    years: 15,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/mines").then((res) => {
      setMines(res.data);
      if (res.data.length > 0) setSelectedMine(res.data[0]._id);
    });
  }, []);

  const runProjection = async () => {
    if (!selectedMine) return;
    setError("");
    try {
      const res = await api.post(`/pathway/${selectedMine}`, params);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to compute pathway");
      setResult(null);
    }
  };

  useEffect(() => {
    if (selectedMine) runProjection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMine]);

  const update = (field) => (e) => setParams({ ...params, [field]: Number(e.target.value) });

  const chartData = result?.timeline.map((t) => ({
    year: `Y${t.year}`,
    Net: t.netEmissionsTonnesCO2e,
    Offset: t.offsetTonnesCO2e,
  }));

  return (
    <div className="flex bg-anthracite min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-chalk">Neutrality Pathway Planner</h1>
          <p className="text-ash text-sm mt-1">Model what-if scenarios toward net-zero emissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 space-y-5">
            <div>
              <label className="label">Mine</label>
              <select className="input-field" value={selectedMine} onChange={(e) => setSelectedMine(e.target.value)}>
                {mines.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Target renewable share: {params.targetRenewablePercent}%</label>
              <input
                type="range"
                min="10"
                max="100"
                value={params.targetRenewablePercent}
                onChange={update("targetRenewablePercent")}
                className="w-full accent-ember"
              />
            </div>

            <div>
              <label className="label">Renewable ramp-up: {params.renewableRampYears} years</label>
              <input
                type="range"
                min="2"
                max="20"
                value={params.renewableRampYears}
                onChange={update("renewableRampYears")}
                className="w-full accent-ember"
              />
            </div>

            <div>
              <label className="label">Afforestation area: {params.afforestationHectares} ha</label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={params.afforestationHectares}
                onChange={update("afforestationHectares")}
                className="w-full accent-neutral"
              />
            </div>

            <div>
              <label className="label">Annual efficiency gain: {params.annualEfficiencyGainPercent}%</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={params.annualEfficiencyGainPercent}
                onChange={update("annualEfficiencyGainPercent")}
                className="w-full accent-neutral"
              />
            </div>

            <button className="btn-primary w-full" onClick={runProjection}>
              Recalculate
            </button>

            {error && <div className="text-sm text-red-400">{error}</div>}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Baseline (annualized)"
                value={result ? Math.round(result.baselineTonnesCO2e).toLocaleString() : "—"}
                unit="t CO2e"
              />
              <StatCard
                label="Est. neutrality year"
                value={result?.estimatedNeutralityYear ? `Year ${result.estimatedNeutralityYear}` : "Beyond horizon"}
                accent="neutral"
              />
            </div>

            <div className="card p-5">
              <h3 className="font-display text-base text-chalk mb-4">Projected Net Emissions</h3>
              {chartData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8964A" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#E8964A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" />
                    <XAxis dataKey="year" stroke="#8B95A1" fontSize={12} />
                    <YAxis stroke="#8B95A1" fontSize={12} />
                    <Tooltip contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }} />
                    <Area type="monotone" dataKey="Net" stroke="#E8964A" fill="url(#netGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-ash text-sm py-12 text-center">
                  Add emission records for this mine to generate a projection.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
