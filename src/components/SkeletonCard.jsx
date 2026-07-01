/* Skeleton loading card for various layouts */
export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-card border border-gray-100 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-100 rounded-lg w-full mb-2" style={{ width: `${60 + Math.random() * 40}%` }} />
      ))}
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="rounded-2xl p-4 bg-gray-100 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-3/4" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-10 bg-gray-50 border-b border-gray-100 flex">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 h-3 bg-gray-200 rounded mx-3 my-3.5" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="h-12 border-b border-gray-50 flex items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="flex-1 h-3 bg-gray-100 rounded mx-3" style={{ width: `${40 + Math.random() * 50}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}
