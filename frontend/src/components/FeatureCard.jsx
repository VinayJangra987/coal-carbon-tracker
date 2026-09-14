export default function FeatureCard({
  title,
  value,
  subtitle,
  icon,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-panel border border-line rounded-xl p-5 shadow-sm ${
        onClick
          ? "cursor-pointer transition hover:border-ember/50 hover:bg-seam"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-ash">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold text-chalk">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-ash">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="shrink-0 rounded-lg border border-line bg-seam px-3 py-2 text-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
