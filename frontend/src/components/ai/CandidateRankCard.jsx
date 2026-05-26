// Reusable AI candidate ranking panel for company — Tailwind version

import { useState } from 'react';
import ScoreBadge from './ScoreBadge';
import SkillChip from './SkillChip';

function ExpandableRow({ r, i, initials }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">

      {/* Main row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3">

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

        {/* Score + expand button */}
        <div className="w-full sm:w-auto text-left sm:text-right shrink-0">
          <ScoreBadge score={r.score} />
          <p className="text-[11px] text-gray-500 mt-0.5 mb-0">
            {r.matchedSkills?.length || 0} skills matched
          </p>
          <button
            onClick={() => setExpanded(prev => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide AI candidate details' : 'View AI candidate details'}
            className="mt-1 text-[11px] text-violet-600 hover:text-violet-800 font-semibold underline"
          >
            {expanded ? 'Hide Details' : 'View AI Details'}
          </button>
        </div>

      </div>

      {/* Expanded AI breakdown */}
      {expanded && (
        <div className="px-5 pb-4 bg-violet-50 border-t border-violet-100">

          {/* Matched Skills */}
          {r.matchedSkills?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1.5">
                Matched Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {r.matchedSkills.map((s, j) => (
                  <SkillChip key={j} label={s} type="matched" />
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {r.missingSkills?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1.5">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {r.missingSkills.map((s, j) => (
                  <SkillChip key={j} label={s} type="missing" />
                ))}
              </div>
            </div>
          )}

          {/* No skills case */}
          {!r.matchedSkills?.length && !r.missingSkills?.length && (
            <p className="mt-3 text-xs text-gray-400">
              No skill data available for this candidate.
            </p>
          )}

        </div>
      )}

    </div>
  );
}

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
          <ExpandableRow key={r.applicationId} r={r} i={i} initials={initials} />
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