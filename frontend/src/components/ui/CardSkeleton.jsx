import React from 'react';
const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
const subWidths = ['w-2/3', 'w-1/2', 'w-3/5', 'w-5/6', 'w-3/4'];
const VARIANTS = {
  default: { lines: 3, showHeader: true },
  analytics: { lines: 5, showHeader: true },
  chart: { lines: 2, showHeader: true },
  table: { lines: 6, showHeader: false },
};

const CardSkeleton = ({ lines, variant = 'default', showHeader }) => {
  const config = VARIANTS[variant] || VARIANTS.default;
  const lineCount = lines ?? config.lines;
  const header = showHeader ?? config.showHeader;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
      {header && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-2 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      )}
      {Array.from({ length: lineCount }).map((_, i) => {
      
      return (
        <div key={i} className="mb-3">
          <div className={`h-3 bg-gray-200 rounded ${widths[i % widths.length]} mb-1`} />
          <div className={`h-2 bg-gray-200 rounded ${subWidths[i % subWidths.length]}`} />
        </div>
      );
    })}
    </div>
  );
};

export default React.memo(CardSkeleton);