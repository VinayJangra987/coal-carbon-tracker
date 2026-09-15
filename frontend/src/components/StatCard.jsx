// import { TrendingUp, TrendingDown } from "lucide-react";

// export default function StatCard({
//   label,
//   value,
//   unit,
//   accent = "ember",
//   trend, // optional: e.g. 3.2 or -1.8 (percent)
//   sparkline, // optional: array of numbers, e.g. [420, 440, 435, 460, 450]
// }) {
//   const accentColor = accent === "neutral" ? "text-neutral" : "text-ember";
//   const accentStroke = accent === "neutral" ? "#4F9D69" : "#E8964A";
//   const glowColor =
//     accent === "neutral" ? "rgba(79,157,105,0.12)" : "rgba(232,150,74,0.12)";

//   const isUp = typeof trend === "number" && trend >= 0;

//   // Build a simple SVG sparkline path
//   const sparkPath = (() => {
//     if (!sparkline || sparkline.length < 2) return null;
//     const w = 80;
//     const h = 24;
//     const min = Math.min(...sparkline);
//     const max = Math.max(...sparkline);
//     const range = max - min || 1;
//     const step = w / (sparkline.length - 1);
//     const points = sparkline.map((v, i) => {
//       const x = i * step;
//       const y = h - ((v - min) / range) * h;
//       return `${x},${y}`;
//     });
//     return { points: points.join(" "), w, h };
//   })();

//   return (
//     <div
//       className="stat-card relative overflow-hidden rounded-2xl border border-line/60 bg-panel/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line hover:shadow-lg"
//       style={{ "--glow": glowColor }}
//     >
//       <div className="stat-card-glow" />

//       <div className="flex items-start justify-between">
//         <p className="text-xs uppercase tracking-[0.14em] text-ash">{label}</p>

//         {sparkPath && (
//           <svg
//             width={sparkPath.w}
//             height={sparkPath.h}
//             viewBox={`0 0 ${sparkPath.w} ${sparkPath.h}`}
//             className="opacity-70"
//           >
//             <polyline
//               points={sparkPath.points}
//               fill="none"
//               stroke={accentStroke}
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         )}
//       </div>

//       <div className="mt-2 flex items-baseline gap-2">
//         <p className={`font-display text-3xl font-semibold ${accentColor}`}>
//           {value}
//           <span className="ml-1.5 text-sm font-normal text-ash">{unit}</span>
//         </p>
//       </div>

//       {typeof trend === "number" && (
//         <div
//           className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
//             isUp ? "text-red-400" : "text-neutral"
//           }`}
//         >
//           {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
//           {Math.abs(trend)}% vs last period
//         </div>
//       )}
//     </div>
//   );
// }


import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, unit, accent = "ember", trend, sparkline }) {
  const accentColor = accent === "neutral" ? "text-neutral" : "text-ember";
  const accentStroke = accent === "neutral" ? "#4F9D69" : "#E8964A";
  const glowColor = accent === "neutral" ? "rgba(79,157,105,0.12)" : "rgba(232,150,74,0.12)";

  const isUp = typeof trend === "number" && trend >= 0;

  const sparkPath = (() => {
    if (!sparkline || sparkline.length < 2) return null;
    const w = 64;
    const h = 20;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const step = w / (sparkline.length - 1);
    const points = sparkline.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`);
    return { points: points.join(" "), w, h };
  })();

  return (
    <div
      className="stat-card relative overflow-hidden rounded-2xl border border-line/60 bg-panel/70 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line hover:shadow-lg"
      style={{ "--glow": glowColor }}
    >
      <div className="stat-card-glow" />

      {/* label + sparkline stack on very small cards, row on wider ones */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] text-ash leading-tight">
          {label}
        </p>

        {sparkPath && (
          <svg
            width={sparkPath.w}
            height={sparkPath.h}
            viewBox={`0 0 ${sparkPath.w} ${sparkPath.h}`}
            className="opacity-70 shrink-0 mt-0.5"
          >
            <polyline
              points={sparkPath.points}
              fill="none"
              stroke={accentStroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <p className={`mt-2 font-display text-xl sm:text-3xl font-semibold ${accentColor}`}>
        {value}
        <span className="ml-1.5 text-xs sm:text-sm font-normal text-ash">{unit}</span>
      </p>

      {typeof trend === "number" && (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium ${
            isUp ? "text-red-400" : "text-neutral"
          }`}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}% vs last period
        </div>
      )}
    </div>
  );
}