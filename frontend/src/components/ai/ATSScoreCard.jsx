import React from 'react';
import { FileText, Lightbulb } from 'lucide-react';

const COLOR_MAP = {
  green:  { bg: 'bg-green-50',  ring: 'text-green-600',  badge: 'bg-green-100 text-green-700',  bar: 'bg-green-500'  },
  blue:   { bg: 'bg-blue-50',   ring: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-500'   },
  orange: { bg: 'bg-orange-50', ring: 'text-orange-600', badge: 'bg-orange-100 text-orange-700',bar: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',    ring: 'text-red-600',    badge: 'bg-red-100 text-red-700',      bar: 'bg-red-500'    },
};

// Each bar gets its own color based on individual progress
const getBarColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 40) return 'bg-orange-500';
  return 'bg-red-400';
};

const ATSScoreCard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (!data) return null;

  const colors = COLOR_MAP[data.color] || COLOR_MAP.orange;

  return (
    <div className={`rounded-2xl p-6 border border-gray-100 shadow-sm ${colors.bg}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">ATS Resume Score</h3>
            <p className="text-xs text-gray-500">How ATS-friendly is your resume?</p>
          </div>
        </div>
        {/* Big Score */}
        <div className="text-right">
          <p className={`text-4xl font-black ${colors.ring}`}>
            {Math.min(100, Math.max(0, data.score))}
          </p>
          <p className="text-xs text-gray-400">out of 100</p>
        </div>
      </div>

      {/* Label Badge */}
      <div className="mb-5">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
          {data.label}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          Resume length: {data.wordCount} words
        </span>
      </div>

      {/* Score Breakdown */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Score Breakdown
        </p>
        <div className="space-y-2">
          {data.breakdown?.map((item) => {
            // Safe division — prevent divide by zero
            const progress = item.maxScore
              ? Math.min(100, Math.max(0, (item.score / item.maxScore) * 100))
              : 0;
            const barColor = getBarColor(progress);
            return (
              <div key={item.check}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600 font-medium">{item.check}</span>
                  <span className="text-xs font-bold text-gray-700">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                {/* Progress bar — color matches score */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${barColor}`}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.check} score`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      {data.suggestions?.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={14} className="text-amber-700" />
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
              How to Improve
            </p>
          </div>
          <ul className="space-y-1">
            {data.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-800">• {s}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default React.memo(ATSScoreCard);