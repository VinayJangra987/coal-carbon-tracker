export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line/60 bg-panel/50 p-4 sm:p-5 animate-pulse">
      <div className="h-3 w-2/3 rounded bg-line/60" />
      <div className="mt-3 h-7 w-1/2 rounded bg-line/60" />
      <div className="mt-3 h-3 w-1/3 rounded bg-line/40" />
    </div>
  );
}

export function ChartCardSkeleton({ height = 260 }) {
  return (
    <div className="card-premium p-6 animate-pulse">
      <div className="mb-5 h-4 w-1/3 rounded bg-line/60" />
      <div
        className="w-full rounded-xl bg-line/30"
        style={{ height }}
      />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="card-premium relative mb-8 h-56 overflow-hidden bg-panel/50 animate-pulse md:h-64">
      <div className="absolute bottom-6 left-6 space-y-3 md:bottom-8 md:left-8">
        <div className="h-3 w-32 rounded bg-line/60" />
        <div className="h-8 w-64 rounded bg-line/60" />
        <div className="h-3 w-48 rounded bg-line/40" />
      </div>
    </div>
  );
}