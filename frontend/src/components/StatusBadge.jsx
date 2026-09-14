export default function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();

  const styles = {
    excellent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    good: "bg-green-500/10 text-green-400 border-green-500/30",
    moderate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "needs improvement":
      "bg-red-500/10 text-red-400 border-red-500/30",

    critical: "bg-red-500/10 text-red-400 border-red-500/30",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-blue-500/10 text-blue-400 border-blue-500/30",

    on_track:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    off_track: "bg-red-500/10 text-red-400 border-red-500/30",

    planned: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    completed:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    paused: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${
        styles[key] || "bg-panel text-ash border-line"
      }`}
    >
      {String(status || "unknown").replaceAll("_", " ")}
    </span>
  );
}
