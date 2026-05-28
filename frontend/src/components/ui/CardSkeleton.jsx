import React from 'react';

// Reusable skeleton loader for all AI dashboard cards
const CardSkeleton = ({ lines = 3 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-3">
          <div className="h-3 bg-gray-200 rounded w-full mb-1" />
          <div className="h-2 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;