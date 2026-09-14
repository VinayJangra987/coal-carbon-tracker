import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../utils/api";

const SCOPE_COLORS = ["#E8964A", "#4F9D69", "#8B95A1"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load summary"));
  }, []);

  const scopeData = summary
    ? [
        { name: "Scope 1", value: Math.round(summary.totals.scope1) },
        { name: "Scope 2", value: Math.round(summary.totals.scope2) },
        { name: "Scope 3", value: Math.round(summary.totals.scope3) },
      ]
    : [];

  const trendData = summary?.trend.map((t) => ({ period: t._id, total: Math.round(t.total) })) || [];
  const byMineData = summary?.byMine.slice(0, 8).map((m) => ({
    name: m.name.length > 14 ? m.name.slice(0, 14) + "…" : m.name,
    total: Math.round(m.total),
  })) || [];

  return (
    <div className="flex bg-anthracite min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-chalk">National Overview</h1>
          <p className="text-ash text-sm mt-1">
            Aggregated emissions across {summary?.totalMines ?? "—"} tracked mines
          </p>
        </div>

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        {summary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Emissions"
                value={Math.round(summary.totals.total).toLocaleString()}
                unit="t CO2e"
              />
              <StatCard
                label="Scope 1 (Direct)"
                value={Math.round(summary.totals.scope1).toLocaleString()}
                unit="t CO2e"
              />
              <StatCard
                label="Scope 2 (Electricity)"
                value={Math.round(summary.totals.scope2).toLocaleString()}
                unit="t CO2e"
              />
              <StatCard
                label="Scope 3 (Transport)"
                value={Math.round(summary.totals.scope3).toLocaleString()}
                unit="t CO2e"
                accent="neutral"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="card p-5 lg:col-span-2">
                <h3 className="font-display text-base text-chalk mb-4">Emissions Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" />
                    <XAxis dataKey="period" stroke="#8B95A1" fontSize={12} />
                    <YAxis stroke="#8B95A1" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }}
                      labelStyle={{ color: "#EDEFF2" }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#E8964A" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-5">
                <h3 className="font-display text-base text-chalk mb-4">Scope Breakdown</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={scopeData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                      {scopeData.map((entry, i) => (
                        <Cell key={entry.name} fill={SCOPE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#8B95A1" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display text-base text-chalk mb-4">Emissions by Mine</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byMineData}>
                  <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#8B95A1" fontSize={12} />
                  <YAxis stroke="#8B95A1" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }}
                  />
                  <Bar dataKey="total" fill="#4F9D69" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
