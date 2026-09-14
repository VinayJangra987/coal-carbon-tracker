export default function CarbonScoreCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-panel border border-line rounded-xl p-6 text-sm text-ash">
        Loading carbon score...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-panel border border-line rounded-xl p-6">
        <p className="text-sm text-ash">
          Enter a mine ID to calculate its carbon score.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-line rounded-xl p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-ash">
            Carbon Score
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-5xl font-semibold text-chalk">
              {data.score}
            </span>
            <span className="pb-1 text-sm text-ash">/100</span>
          </div>
        </div>

        <div className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ash">
            Rating
          </p>
          <p className="mt-1 font-medium text-ember">
            {data.rating}
          </p>
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-seam">
        <div
          className="h-full rounded-full bg-ember transition-all"
          style={{ width: `${data.score}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {Object.entries(data.breakdown || {}).map(([key, value]) => (
          <div
            key={key}
            className="rounded-lg border border-line bg-seam p-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-ash">
              {key
                .replace("Score", "")
                .replace(/([A-Z])/g, " $1")
                .trim()}
            </p>

            <p className="mt-1 text-lg font-semibold text-chalk">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
