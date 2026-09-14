import { Link } from "react-router-dom";

const features = [
  ["Carbon Targets", "/carbon-targets", "01", "Set reduction and renewable-energy targets."],
  ["Carbon Score", "/carbon-score", "02", "Measure mine carbon performance from 0–100."],
  ["Alerts", "/alerts", "03", "Detect emission spikes and target breaches."],
  ["Emission Forecast", "/forecast", "04", "Project future emissions from historical data."],
  ["Carbon Advisor", "/carbon-advisor", "05", "Get practical carbon-reduction recommendations."],
  ["Carbon Projects", "/carbon-projects", "06", "Track renewable, efficiency and offset projects."],
  ["Reports", "/reports", "07", "Generate structured mine carbon reports."],
  ["Audit Logs", "/audit-logs", "08", "Review important system activity."],
];

export default function FeatureHub() {
  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Carbon Management
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold">
          Carbon Intelligence
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
          Advanced tools for monitoring emissions, setting targets,
          planning reductions and managing mine-level carbon performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map(([title, path, number, description]) => (
          <Link
            key={path}
            to={path}
            className="group rounded-xl border border-line bg-panel p-5 transition hover:border-ember/50 hover:bg-seam"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wider text-ember">
                {number}
              </span>

              <span className="text-ash transition group-hover:text-ember">
                →
              </span>
            </div>

            <h2 className="mt-8 text-base font-semibold text-chalk">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-ash">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
