// ProfileSkeleton.jsx
// Shows shimmer placeholders while profile page is loading
// Matches the exact layout of the real profile page

import Skeleton from './Skeleton';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Nav skeleton */}
      <div className="bg-white px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-24 h-5" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-16 h-8 rounded-lg" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header card skeleton */}
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md mb-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-36 h-4" />
            <Skeleton className="w-24 h-5 rounded-full" />
          </div>
          <Skeleton className="w-28 h-10 rounded-xl" />
        </div>

        {/* Two column grid skeleton */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">

          {/* Profile details card skeleton */}
          <div className="bg-white rounded-2xl p-7 shadow-md">
            <Skeleton className="w-36 h-5 mb-5" />
            {/* Field rows */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex py-3 border-b border-gray-50 gap-4">
                <Skeleton className="w-28 h-4" />
                <Skeleton className="flex-1 h-4" />
              </div>
            ))}
          </div>

          {/* Resume card skeleton */}
          <div className="bg-white rounded-2xl p-7 shadow-md">
            <Skeleton className="w-24 h-5 mb-5" />
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-5">
              <Skeleton className="w-10 h-10 rounded" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-3" />
              </div>
              <Skeleton className="w-14 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>

        </div>
      </div>
    </div>
  );
}