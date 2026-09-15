export default function StatCard({ label, value, unit, accent = "ember" }) {
  const accentColor = accent === "neutral" ? "text-neutral" : "text-ember";
  const glowColor =
    accent === "neutral" ? "rgba(79,157,105,0.12)" : "rgba(232,150,74,0.12)";

  return (
    <div
      className="stat-card relative overflow-hidden rounded-2xl border border-line/60 bg-panel/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line hover:shadow-lg"
      style={{ "--glow": glowColor }}
    >
      <div className="stat-card-glow" />
      <p className="text-xs uppercase tracking-[0.14em] text-ash">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accentColor}`}>
        {value}
        <span className="ml-1.5 text-sm font-normal text-ash">{unit}</span>
      </p>
    </div>
  );
}