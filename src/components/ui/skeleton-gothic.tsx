export function SkeletonCard() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-5 overflow-hidden relative">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer-gothic pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-gothic-800 rounded" />
          <div className="h-8 w-16 bg-gothic-800 rounded" />
          <div className="h-2 w-32 bg-gothic-700 rounded" />
        </div>
        <div className="h-10 w-10 bg-gothic-800 rounded-lg" />
      </div>
      {/* Bottom accent line */}
      <div className="mt-3 h-0.5 bg-gothic-800 rounded-full" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-6 overflow-hidden relative">
      <div className="absolute inset-0 shimmer-gothic pointer-events-none" />
      <div className="relative">
        <div className="h-4 w-48 bg-gothic-800 rounded mb-3" />
        <div className="h-2 w-32 bg-gothic-700 rounded mb-6" />
        <div className="flex items-end gap-2 h-52">
          {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65].map((h, i) => (
            <div key={i} className="flex-1 bg-gothic-800/60 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-6 overflow-hidden relative">
      <div className="absolute inset-0 shimmer-gothic pointer-events-none" />
      <div className="relative">
        <div className="h-4 w-48 bg-gothic-800 rounded mb-4" />
        {/* Header row */}
        <div className="flex gap-3 mb-3">
          {[40, 60, 50, 55, 45].map((w, i) => (
            <div key={i} className="h-3 bg-gothic-700 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Data rows */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-7 flex-1 bg-gothic-800/40 rounded" />
              <div className="h-7 flex-1 bg-gothic-800/30 rounded" />
              <div className="h-7 flex-1 bg-gothic-800/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonKPICard() {
  return (
    <div className="bg-gothic-900 border border-gothic-700/30 rounded-xl p-5 overflow-hidden relative">
      <div className="absolute inset-0 shimmer-gothic pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-2.5 w-20 bg-gothic-800 rounded" />
          <div className="h-7 w-14 bg-gothic-800 rounded" />
          <div className="h-2 w-28 bg-gothic-700 rounded" />
        </div>
        <div className="h-10 w-10 bg-gothic-800 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonKPICard key={i} />)}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      {/* Table */}
      <SkeletonTable />
    </div>
  );
}
