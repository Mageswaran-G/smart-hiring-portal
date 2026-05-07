// DashboardSkeleton.jsx
// Shows shimmer placeholders while dashboard is loading
// Used in CandidateDashboard and CompanyDashboard

import Skeleton from './Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Nav skeleton */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-24 h-5" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-24 h-9 rounded-lg" />
          <Skeleton className="w-20 h-9 rounded-lg" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Welcome card skeleton */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-36 h-4" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
          </div>
          <Skeleton className="w-64 h-4" />
        </div>

        {/* Action cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <Skeleton className="w-32 h-5 mb-2" />
              <Skeleton className="w-48 h-4" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}