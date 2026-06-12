export function SkeletonCard() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-gothic-800 rounded" />
          <div className="h-8 w-16 bg-gothic-800 rounded" />
          <div className="h-2 w-32 bg-gothic-700 rounded" />
        </div>
        <div className="h-10 w-10 bg-gothic-800 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-6 animate-pulse">
      <div className="h-4 w-48 bg-gothic-800 rounded mb-4" />
      <div className="h-2 w-32 bg-gothic-700 rounded mb-6" />
      <div className="h-64 bg-gothic-800/50 rounded" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-6 animate-pulse">
      <div className="h-4 w-48 bg-gothic-800 rounded mb-4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gothic-800/30 rounded" />
        ))}
      </div>
    </div>
  );
}
