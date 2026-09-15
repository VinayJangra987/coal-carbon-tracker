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
//     <div className="flex bg-anthracite min-h-screen">
//       <Sidebar />
//       <main className="flex-1 p-8">
//         <div className="mb-8">
//           <h1 className="font-display text-2xl font-semibold text-chalk">National Overview</h1>
//           <p className="text-ash text-sm mt-1">
//             Aggregated emissions across {summary?.totalMines ?? "—"} tracked mines
//           </p>
//         </div>

//         {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

//         {summary && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//               <div className="card p-5 lg:col-span-2">
//                 <h3 className="font-display text-base text-chalk mb-4">Emissions Trend</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <LineChart data={trendData}>
//                     <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" />
//                     <XAxis dataKey="period" stroke="#8B95A1" fontSize={12} />
//                     <YAxis stroke="#8B95A1" fontSize={12} />
//                     <Tooltip
//                       contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }}
//                       labelStyle={{ color: "#EDEFF2" }}
//                     />
//                     <Line type="monotone" dataKey="total" stroke="#E8964A" strokeWidth={2.5} dot={false} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="card p-5">
//                 <h3 className="font-display text-base text-chalk mb-4">Scope Breakdown</h3>
//                 <ResponsiveContainer width="100%" height={260}>
//                   <PieChart>
//                     <Pie data={scopeData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
//                       {scopeData.map((entry, i) => (
//                         <Cell key={entry.name} fill={SCOPE_COLORS[i]} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }}
//                     />
//                     <Legend wrapperStyle={{ fontSize: 12, color: "#8B95A1" }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="card p-5">
//               <h3 className="font-display text-base text-chalk mb-4">Emissions by Mine</h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <BarChart data={byMineData}>
//                   <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" />
//                   <XAxis dataKey="name" stroke="#8B95A1" fontSize={12} />
//                   <YAxis stroke="#8B95A1" fontSize={12} />
//                   <Tooltip
//                     contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }}
//                   />
//                   <Bar dataKey="total" fill="#4F9D69" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
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
    <div className="flex min-h-screen bg-anthracite">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ember">Ministry of Coal</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-chalk">
              National Overview
            </h1>
            <p className="mt-1 text-sm text-ash">
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
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
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

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="card-premium p-6 lg:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-display text-base text-chalk">Emissions Trend</h3>
                  <span className="rounded-full border border-line/70 px-2.5 py-1 text-[11px] text-ash">
                    12 months
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendData}>
                    <defs>
                      <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8964A" stopOpacity={0.25} />
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
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#E8964A"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: "#E8964A" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card-premium p-6">
                <h3 className="mb-5 font-display text-base text-chalk">Scope Breakdown</h3>
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
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: "#8B95A1" }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
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
          </>
        )}
      </main>
    </div>
  );
}