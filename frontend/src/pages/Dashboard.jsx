import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  ComposedChart,
  Area,
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
import { Bell, AlertTriangle, Search, Sun, Moon } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import { StatCardSkeleton, ChartCardSkeleton, HeroSkeleton } from "../components/Skeleton.jsx";
import api from "../utils/api";

const SCOPE_COLORS = ["#E8964A", "#4F9D69", "#8B95A1"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [lastSynced, setLastSynced] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) => {
        setSummary(res.data);
        setLastSynced(new Date());
      })
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

  const filteredMines = searchQuery.trim()
    ? summary?.byMine.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ) || []
    : summary?.byMine || [];

  const byMineData =
    filteredMines.slice(0, 8).map((m) => ({
      name: m.name.length > 14 ? m.name.slice(0, 14) + "…" : m.name,
      total: Math.round(m.total),
    })) || [];

  const trendValues = trendData.map((t) => t.total);
  const spark = (slice) => trendValues.slice(-6).map(slice);

  const totalTrendPct =
    trendValues.length >= 2
      ? Math.round(
          ((trendValues[trendValues.length - 1] - trendValues[trendValues.length - 2]) /
            trendValues[trendValues.length - 2]) *
            1000
        ) / 10
      : null;

  const activeAlerts = summary?.activeAlerts ?? summary?.alertsCount ?? 0;
  const recentAlerts = summary?.recentAlerts ?? summary?.alerts ?? [];

  const timeAgo = (date) => {
    if (!date) return "";
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  };

  // theme-aware chart colors
  const chartColors =
    theme === "dark"
      ? {
          grid: "#2A3138",
          axis: "#8B95A1",
          tooltipBg: "#1B2126",
          tooltipBorder: "#2A3138",
          tooltipLabel: "#EDEFF2",
        }
      : {
          grid: "#DDE1E6",
          axis: "#5C6672",
          tooltipBg: "#FFFFFF",
          tooltipBorder: "#DDE1E6",
          tooltipLabel: "#14181C",
        };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-anthracite">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        {/* ---- Utility bar: last synced, search, theme, export, notifications ---- */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ash">
            {summary ? `Last synced: ${timeAgo(lastSynced)}` : "Syncing…"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mines…"
                className="w-40 rounded-lg border border-line bg-seam py-2 pl-8 pr-3 text-xs text-chalk outline-none placeholder:text-ash focus:border-ember sm:w-56"
              />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-line p-2 text-ash hover:bg-panel hover:text-chalk transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Export button */}
            <button
              onClick={() =>
                window.open(`${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/export/all`, "_blank")
              }
              className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-chalk hover:bg-panel transition-colors"
            >
              ⬇ Export All Report
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-lg text-ash hover:bg-panel hover:text-chalk transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {activeAlerts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {activeAlerts > 9 ? "9+" : activeAlerts}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-line bg-seam shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                      <p className="text-sm font-medium text-chalk">Notifications</p>
                      {activeAlerts > 0 && (
                        <span className="text-[10px] text-ash">{activeAlerts} active</span>
                      )}
                    </div>

                    {recentAlerts.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-ash">
                        No new alerts
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto divide-y divide-line/60">
                        {recentAlerts.slice(0, 4).map((alert, i) => (
                          <div key={alert._id || i} className="flex gap-3 px-4 py-3 hover:bg-panel/50">
                            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-ember" />
                            <div className="min-w-0">
                              <p className="text-xs text-chalk truncate">
                                {alert.message || alert.title || "New alert"}
                              </p>
                              <p className="mt-0.5 text-[10px] text-ash truncate">
                                {alert.mineName || alert.createdAt || ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        navigate("/alerts");
                      }}
                      className="w-full px-4 py-2.5 text-xs font-medium text-ember hover:bg-panel/50 border-t border-line"
                    >
                      View all alerts
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---- Hero Banner ---- */}
        {!summary && !error ? (
          <HeroSkeleton />
        ) : (
          <div className="card-premium relative mb-8 overflow-hidden">
            <img
              src="/images/Coal.jpg"
              alt="Coal mining operations"
              className="h-56 w-full object-cover md:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/70 to-anthracite/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-ember">Ministry of Coal</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-chalk md:text-4xl">
                National Overview
              </h1>
              <p className="mt-2 text-sm text-ash">
                Aggregated emissions across{" "}
                <span className="text-chalk">{summary?.totalMines ?? "—"}</span> tracked mines
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-medium underline decoration-red-400/50 hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* ---- Stat cards ---- */}
        {!summary && !error ? (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          summary && (
            <>
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                <StatCard
                  label="Total Emissions"
                  rawValue={Math.round(summary.totals.total)}
                  unit="t CO2e"
                  trend={totalTrendPct}
                  sparkline={spark((t) => t)}
                />
                <StatCard
                  label="Scope 1 (Direct)"
                  rawValue={Math.round(summary.totals.scope1)}
                  unit="t CO2e"
                />
                <StatCard
                  label="Scope 2 (Electricity)"
                  rawValue={Math.round(summary.totals.scope2)}
                  unit="t CO2e"
                />
                <StatCard
                  label="Scope 3 (Transport)"
                  rawValue={Math.round(summary.totals.scope3)}
                  unit="t CO2e"
                  accent="neutral"
                />
              </div>

              {/* ---- Charts row ---- */}
              <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="card-premium p-6 lg:col-span-2">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-display text-base text-chalk">Emissions Trend</h3>
                    <span className="rounded-full border border-line/70 px-2.5 py-1 text-[11px] text-ash">
                      12 months
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E8964A" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#E8964A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="period" stroke={chartColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={chartColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: 12,
                        }}
                        labelStyle={{ color: chartColors.tooltipLabel }}
                      />
                      <Area type="monotone" dataKey="total" stroke="none" fill="url(#trendGlow)" isAnimationActive />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#E8964A"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: "#E8964A" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-premium p-6">
                  <h3 className="mb-5 font-display text-base text-chalk">Scope Breakdown</h3>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={scopeData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          cornerRadius={6}
                        >
                          {scopeData.map((entry, i) => (
                            <Cell key={entry.name} fill={SCOPE_COLORS[i]} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: chartColors.tooltipBg,
                            border: `1px solid ${chartColors.tooltipBorder}`,
                            borderRadius: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: chartColors.axis }} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                      <p className="font-display text-lg font-semibold text-chalk">
                        {Math.round(summary.totals.total / 1000).toLocaleString()}k
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-ash">t CO2e total</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <h3 className="mb-5 font-display text-base text-chalk">
                  Emissions by Mine
                  {searchQuery.trim() && (
                    <span className="ml-2 text-xs font-normal text-ash">
                      (showing results for "{searchQuery}")
                    </span>
                  )}
                </h3>
                {byMineData.length === 0 ? (
                  <p className="text-sm text-ash">No mines found matching "{searchQuery}".</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={byMineData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F9D69" stopOpacity={1} />
                          <stop offset="100%" stopColor="#3C7B51" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke={chartColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={chartColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: 12,
                        }}
                        cursor={{ fill: "rgba(79,157,105,0.06)" }}
                      />
                      <Bar dataKey="total" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* ---- Stat Strip / Overview / Insights ---- */}
              <div className="mt-8 space-y-8">
                <div className="card-premium overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-line/60 md:grid-cols-4">
                    {[
                      { label: "mines tracked", value: summary.totalMines ?? "—" },
                      {
                        label: "states covered",
                        value: summary.byMine ? new Set(summary.byMine.map((m) => m.state)).size : "—",
                      },
                      { label: "t CO2e total", value: Math.round(summary.totals.total).toLocaleString() },
                      {
                        label: "avg renewable share",
                        value: summary.avgRenewableShare != null ? `${summary.avgRenewableShare}%` : "—",
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 sm:p-5">
                        <p className="font-display text-2xl font-semibold text-ember">{stat.value}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ash">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-ember">Overview</p>
                  <h3 className="mt-2 font-display text-xl text-chalk">
                    Tracking India's path to carbon-neutral coal
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">
                    This dashboard consolidates emissions data across tracked coal mines under the
                    Ministry of Coal, covering direct extraction (Scope 1), grid electricity use
                    (Scope 2), and transport-linked emissions (Scope 3). Renewable adoption and
                    afforestation metrics are tracked alongside production volumes to surface each
                    mine's progress toward its neutrality pathway.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-ember/30 bg-ember/5 p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-ember">Insight</p>
                    <p className="mt-2 text-sm leading-relaxed text-chalk">
                      Scope 1 (direct) emissions account for{" "}
                      <span className="font-semibold text-ember">
                        {Math.round((summary.totals.scope1 / summary.totals.total) * 100)}%
                      </span>{" "}
                      of total output — the largest single lever for near-term reduction.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral/30 bg-neutral/5 p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-neutral">Insight</p>
                    <p className="mt-2 text-sm leading-relaxed text-chalk">
                      {summary.byMine?.[0]?.name ?? "Top mine"} leads national output —
                      prioritizing its renewable transition would yield the highest
                      system-wide impact.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )
        )}

        {/* charts skeleton while loading (only if no summary and no error yet) */}
        {!summary && !error && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-2">
              <ChartCardSkeleton />
            </div>
            <ChartCardSkeleton />
          </div>
        )}
      </main>
    </div>
  );
}