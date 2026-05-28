import React from 'react';
import { clampPercent, getBarColor } from '../../../utils/scoreColors';

const ATSBreakdown = ({ breakdown }) => (
  <div className="mb-5">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
      Score Breakdown
    </p>
    <div className="space-y-2">
      {breakdown?.map((item) => {
        const progress = item.maxScore
          ? clampPercent((item.score / item.maxScore) * 100)
          : 0;
        const barColor = getBarColor(progress);
        return (
          <div key={item.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600 font-medium">{item.check}</span>
              <span className="text-xs font-bold text-gray-700">{item.score}/{item.maxScore}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${barColor}`}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.check} score`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default React.memo(ATSBreakdown);