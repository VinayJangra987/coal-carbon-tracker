export default function StatCard({ label, value, unit, accent = "ember", trend }) {
  const accentColor = accent === "neutral" ? "text-neutral" : "text-ember";

  return (
    <div className="card p-5">
      <div className="label">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`font-display text-3xl font-semibold ${accentColor}`}>{value}</span>
        {unit && <span className="text-ash text-sm">{unit}</span>}
      </div>
      {trend && <div className="text-xs text-ash mt-2">{trend}</div>}
    </div>
  );
}
