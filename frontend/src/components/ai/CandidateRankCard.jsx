
// Reusable AI candidate ranking panel for company — Tailwind version

import ScoreBadge from './ScoreBadge';

export default function CandidateRankCard({ ranking, loading }) {
  return (
    <div className="mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-violet-700 to-purple-500">
        <p className="font-extrabold text-sm text-white mb-0">AI Candidate Ranking</p>
        <p className="text-xs text-white/80 mb-0">Sorted by skill match score</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-5 text-center text-gray-500 text-sm">
          Calculating rankings...
        </div>
      )}

      {/* Candidate rows */}
      {!loading && ranking.map((r, i) => {
        const initials = r.candidate.name
          ?.split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || '?';
        return (
          <div
            key={r.applicationId}
            className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-b-0"
          >
            {/* Rank number */}
            <span className="font-extrabold text-sm text-violet-700 min-w-[24px]">
              #{i + 1}
            </span>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-700 text-sm shrink-0">
              {initials}
            </div>

            {/* Name + email */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 mb-0">{r.candidate.name}</p>
              <p className="text-xs text-gray-500 truncate mb-0">{r.candidate.email}</p>
            </div>

            {/* Score badge */}
            <div className="w-full sm:w-auto text-left sm:text-right shrink-0">
              <ScoreBadge score={r.score} />
              <p className="text-[11px] text-gray-500 mt-0.5 mb-0">
                {r.matchedSkills?.length || 0} skills matched
              </p>
            </div>

          </div>
        );
      })}

      {/* Empty state */}
      {!loading && ranking.length === 0 && (
        <div className="py-5 text-center text-gray-500 text-sm">
          No applicants yet
        </div>
      )}

    </div>
  );
}