// import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import Sidebar from "../components/Sidebar.jsx";
// import StatCard from "../components/StatCard.jsx";
// import api from "../utils/api";

// const SCOPE_COLORS = ["#E8964A", "#4F9D69", "#8B95A1"];

// export default function Dashboard() {
//   const [summary, setSummary] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     api
//       .get("/dashboard/summary")
//       .then((res) => setSummary(res.data))
//       .catch((err) => setError(err.response?.data?.message || "Failed to load summary"));
//   }, []);

//   const scopeData = summary
//     ? [
//         { name: "Scope 1", value: Math.round(summary.totals.scope1) },
//         { name: "Scope 2", value: Math.round(summary.totals.scope2) },
//         { name: "Scope 3", value: Math.round(summary.totals.scope3) },
//       ]
//     : [];

//   const trendData = summary?.trend.map((t) => ({ period: t._id, total: Math.round(t.total) })) || [];
//   const byMineData = summary?.byMine.slice(0, 8).map((m) => ({
//     name: m.name.length > 14 ? m.name.slice(0, 14) + "…" : m.name,
//     total: Math.round(m.total),
//   })) || [];

//   return (
//     <div className="flex min-h-screen bg-anthracite">
//       <Sidebar />
//       <main className="flex-1 p-8">
//         {/* ---- Hero Banner ---- */}
//         <div className="card-premium relative mb-8 overflow-hidden">
//              <img
//                   src="/images/Coal.jpg"
//                   alt="Coal mining operations"
//                   className="h-56 w-full object-cover md:h-64"
//                 />
//           <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/70 to-anthracite/10" />
//           <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
//             <p className="text-xs uppercase tracking-[0.18em] text-ember">Ministry of Coal</p>
//             <h1 className="mt-2 font-display text-3xl font-semibold text-chalk md:text-4xl">
//               National Overview
//             </h1>
//             <p className="mt-2 text-sm text-ash">
//               Aggregated emissions across{" "}
//               <span className="text-chalk">{summary?.totalMines ?? "—"}</span> tracked mines
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         {summary && (
//           <>
//             <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
//               <StatCard
//                 label="Total Emissions"
//                 value={Math.round(summary.totals.total).toLocaleString()}
//                 unit="t CO2e"
//               />
//               <StatCard
//                 label="Scope 1 (Direct)"
//                 value={Math.round(summary.totals.scope1).toLocaleString()}
//                 unit="t CO2e"
//               />
//               <StatCard
//                 label="Scope 2 (Electricity)"
//                 value={Math.round(summary.totals.scope2).toLocaleString()}
//                 unit="t CO2e"
//               />
//               <StatCard
//                 label="Scope 3 (Transport)"
//                 value={Math.round(summary.totals.scope3).toLocaleString()}
//                 unit="t CO2e"
//                 accent="neutral"
//               />
//             </div>

//             <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
//               <div className="card-premium p-6 lg:col-span-2">
//                 <div className="mb-5 flex items-center justify-between">
//                   <h3 className="font-display text-base text-chalk">Emissions Trend</h3>
//                   <span className="rounded-full border border-line/70 px-2.5 py-1 text-[11px] text-ash">
//                     12 months
//                   </span>
//                 </div>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <LineChart data={trendData}>
//                     <defs>
//                       <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="0%" stopColor="#E8964A" stopOpacity={0.25} />
//                         <stop offset="100%" stopColor="#E8964A" stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" vertical={false} />
//                     <XAxis dataKey="period" stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
//                     <YAxis stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
//                     <Tooltip
//                       contentStyle={{
//                         background: "#1B2126",
//                         border: "1px solid #2A3138",
//                         borderRadius: 12,
//                       }}
//                       labelStyle={{ color: "#EDEFF2" }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="total"
//                       stroke="#E8964A"
//                       strokeWidth={2.5}
//                       dot={false}
//                       activeDot={{ r: 5, fill: "#E8964A" }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="card-premium p-6">
//                 <h3 className="mb-5 font-display text-base text-chalk">Scope Breakdown</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <PieChart>
//                     <Pie
//                       data={scopeData}
//                       dataKey="value"
//                       nameKey="name"
//                       innerRadius={55}
//                       outerRadius={85}
//                       paddingAngle={3}
//                       cornerRadius={6}
//                     >
//                       {scopeData.map((entry, i) => (
//                         <Cell key={entry.name} fill={SCOPE_COLORS[i]} stroke="none" />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 12 }}
//                     />
//                     <Legend
//                       wrapperStyle={{ fontSize: 12, color: "#8B95A1" }}
//                       iconType="circle"
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="card-premium p-6">
//               <h3 className="mb-5 font-display text-base text-chalk">Emissions by Mine</h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={byMineData}>
//                   <defs>
//                     <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#4F9D69" stopOpacity={1} />
//                       <stop offset="100%" stopColor="#3C7B51" stopOpacity={0.7} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="name" stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
//                   <YAxis stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
//                   <Tooltip
//                     contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 12 }}
//                     cursor={{ fill: "rgba(79,157,105,0.06)" }}
//                   />
//                   <Bar dataKey="total" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* ---- Stat Strip / Overview / Insights (GEM-style) ---- */}
//             <div className="mt-8 space-y-8">
//               <div className="card-premium overflow-hidden">
//                 <div className="grid grid-cols-2 divide-x divide-line/60 md:grid-cols-4">
//                   {[
//                     { label: "mines tracked", value: summary.totalMines ?? "—" },
//                     {
//                       label: "states covered",
//                       value: summary.byMine ? new Set(summary.byMine.map((m) => m.state)).size : "—",
//                     },
//                     { label: "t CO2e total", value: Math.round(summary.totals.total).toLocaleString() },
//                     {
//                       label: "avg renewable share",
//                       value: summary.avgRenewableShare != null ? `${summary.avgRenewableShare}%` : "—",
//                     },
//                   ].map((stat) => (
//                     <div key={stat.label} className="p-5">
//                       <p className="font-display text-2xl font-semibold text-ember">{stat.value}</p>
//                       <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ash">{stat.label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="card-premium p-6">
//                 <p className="text-xs uppercase tracking-[0.14em] text-ember">Overview</p>
//                 <h3 className="mt-2 font-display text-xl text-chalk">
//                   Tracking India's path to carbon-neutral coal
//                 </h3>
//                 <p className="mt-3 text-sm leading-relaxed text-ash">
//                   This dashboard consolidates emissions data across tracked coal mines under the
//                   Ministry of Coal, covering direct extraction (Scope 1), grid electricity use
//                   (Scope 2), and transport-linked emissions (Scope 3). Renewable adoption and
//                   afforestation metrics are tracked alongside production volumes to surface each
//                   mine's progress toward its neutrality pathway.
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div className="rounded-2xl border border-ember/30 bg-ember/5 p-5">
//                   <p className="text-xs uppercase tracking-[0.14em] text-ember">Insight</p>
//                   <p className="mt-2 text-sm leading-relaxed text-chalk">
//                     Scope 1 (direct) emissions account for{" "}
//                     <span className="font-semibold text-ember">
//                       {Math.round((summary.totals.scope1 / summary.totals.total) * 100)}%
//                     </span>{" "}
//                     of total output — the largest single lever for near-term reduction.
//                   </p>
//                 </div>
//                 <div className="rounded-2xl border border-neutral/30 bg-neutral/5 p-5">
//                   <p className="text-xs uppercase tracking-[0.14em] text-neutral">Insight</p>
//                   <p className="mt-2 text-sm leading-relaxed text-chalk">
//                     {summary.byMine?.[0]?.name ?? "Top mine"} leads national output —
//                     prioritizing its renewable transition would yield the highest
//                     system-wide impact.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
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

  // sparkline arrays for stat cards (last 6 trend points)
  const trendValues = trendData.map((t) => t.total);
  const spark = (slice) => trendValues.slice(-6).map(slice);

  // simple % change vs previous period for the "Total Emissions" trend arrow
  const totalTrendPct =
    trendValues.length >= 2
      ? Math.round(
          ((trendValues[trendValues.length - 1] - trendValues[trendValues.length - 2]) /
            trendValues[trendValues.length - 2]) *
            1000
        ) / 10
      : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-anthracite">
         <Sidebar />
         <main className="flex-1 p-4 md:p-8">
        {/* ---- Hero Banner ---- */}
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

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {summary && (
          <>
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <StatCard
                label="Total Emissions"
                value={Math.round(summary.totals.total).toLocaleString()}
                unit="t CO2e"
                trend={totalTrendPct}
                sparkline={spark((t) => t)}
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

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                    <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#1B2126",
                        border: "1px solid #2A3138",
                        borderRadius: 12,
                      }}
                      labelStyle={{ color: "#EDEFF2" }}
                    />
                    {/* gradient fill under the line */}
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="none"
                      fill="url(#trendGlow)"
                      isAnimationActive={true}
                    />
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
                        contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: "#8B95A1" }} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* center label overlay */}
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
              <h3 className="mb-5 font-display text-base text-chalk">Emissions by Mine</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byMineData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F9D69" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3C7B51" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B95A1" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 12 }}
                    cursor={{ fill: "rgba(79,157,105,0.06)" }}
                  />
                  <Bar dataKey="total" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ---- Stat Strip / Overview / Insights (GEM-style) ---- */}
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
                    <div key={stat.label} className="p-5">
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
        )}
      </main>
    </div>
  );
}