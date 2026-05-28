import { getScoreMeta } from '../../utils/matchScore';

export default function MatchScoreCard({ matchScore, loading }) {

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-gray-400 text-sm">Calculating match score...</span>
      </div>
    );
  }

  if (!matchScore) return null;

  const { circleClass, label: scoreLabel } = getScoreMeta(matchScore.score);
  const matched     = matchScore.matchedSkills  || [];
  const missing     = matchScore.missingSkills  || [];
  const suggestions = matchScore.suggestions    || [];
  const total       = matchScore.totalJobSkills || (matched.length + missing.length);
  

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center gap-4 border-b border-gray-50">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${circleClass}`}>
          <span className="text-white font-black text-lg">{matchScore.score}%</span>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">AI Match Score</p>
          <p className="text-xl font-black text-gray-900">{scoreLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5">Based on {total} required skills</p>
        </div>

        
      </div>

      {/* Why this score — clean summary */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Why this score?</p>
        <div className="flex flex-col gap-1">
          {matched.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-green-600 text-[10px] font-black">+</span>
              </div>
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-800">{matched.length} skill{matched.length > 1 ? 's' : ''} matched</span>
                {matched.length > 0 && <span className="text-gray-400"> — {matched.slice(0, 2).join(', ')}{matched.length > 2 ? ` +${matched.length - 2}` : ''}</span>}
              </p>
            </div>
          )}
          {missing.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-red-500 text-[10px] font-black">−</span>
              </div>
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-800">{missing.length} skill{missing.length > 1 ? 's' : ''} missing</span>
                {missing.length > 0 && <span className="text-gray-400"> — {missing.slice(0, 2).join(', ')}{missing.length > 2 ? ` +${missing.length - 2}` : ''}</span>}
              </p>
            </div>
          )}
        </div>
        
      </div>

          

      {/* Score Breakdown */}
      {matchScore.breakdown && (
        <div className="px-6 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Score Breakdown</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="text-sm font-black text-gray-900">{matchScore.breakdown.requiredScore}%</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Required</p>
              <p className="text-[10px] text-gray-300">{matchScore.breakdown.requiredMatched}/{matchScore.breakdown.requiredTotal}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="text-sm font-black text-gray-900">{matchScore.breakdown.preferredScore}%</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Preferred</p>
              <p className="text-[10px] text-gray-300">{matchScore.breakdown.preferredMatched}/{matchScore.breakdown.preferredTotal}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="text-[10px] font-black text-gray-900 leading-tight">{matchScore.breakdown.experienceLabel}</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Experience</p>
              <p className={`text-[10px] font-bold ${matchScore.breakdown.experienceAdjustment >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                {matchScore.breakdown.experienceAdjustment >= 0 ? '+' : ''}{matchScore.breakdown.experienceAdjustment}pts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skills section */}
      <div className="px-6 py-4 flex flex-col gap-4">

        {matched.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">Matched</p>
            <div className="flex flex-wrap gap-1.5">
              {matched.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {missing.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Missing</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="border border-amber-100 rounded-xl overflow-hidden">
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-100">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Learning Path</p>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2.5">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide">
                    {s.skill}
                  </span>
                  {s.resources.map((r, j) => (
                    <span key={j} className="text-[11px] text-amber-800 bg-white border border-amber-200 px-2 py-0.5 rounded-md font-medium hover:bg-amber-50 transition cursor-pointer">
                      {r}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}