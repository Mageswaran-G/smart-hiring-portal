import React from 'react';

// Color map for score label
const COLOR_MAP = {
  green:  { bg: 'bg-green-50',  ring: 'text-green-600',  badge: 'bg-green-100 text-green-700' },
  blue:   { bg: 'bg-blue-50',   ring: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700' },
  orange: { bg: 'bg-orange-50', ring: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  red:    { bg: 'bg-red-50',    ring: 'text-red-600',    badge: 'bg-red-100 text-red-700' },
};

export default function ATSScoreCard({ data, loading }) {
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
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <span className="text-xl">📄</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">ATS Resume Score</h3>
            <p className="text-xs text-gray-500">How ATS-friendly is your resume?</p>
          </div>
        </div>
        {/* Big Score */}
        <div className="text-right">
          <p className={`text-4xl font-black ${colors.ring}`}>{data.score}</p>
          <p className="text-xs text-gray-400">out of 100</p>
        </div>
      </div>

      {/* Label Badge */}
      <div className="mb-5">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
          {data.label}
        </span>
        <span className="text-xs text-gray-400 ml-2">{data.wordCount} words in resume</span>
      </div>

      {/* Score Breakdown */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Score Breakdown
        </p>
        <div className="space-y-2">
          {data.breakdown?.map((item) => (
            <div key={item.check}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 font-medium">{item.check}</span>
                <span className="text-xs font-bold text-gray-700">
                  {item.score}/{item.maxScore}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-indigo-500"
                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {data.suggestions?.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
            💡 How to Improve
          </p>
          <ul className="space-y-1">
            {data.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-800">• {s}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}