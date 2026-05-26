
// Reusable AI match score card for candidates — Tailwind version

import { getScoreMeta } from '../../utils/matchScore';
import SkillChip from './SkillChip';

export default function MatchScoreCard({ matchScore, loading }) {

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-200 px-7 py-5 flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-[3px] border-green-600 border-t-transparent animate-spin" />
        <span className="text-gray-500 text-sm">Calculating your match score...</span>
      </div>
    );
  }

  if (!matchScore) return null;

  const { color: scoreColor, label: scoreLabel } = getScoreMeta(matchScore.score);

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 px-7 py-6">

      {/* Score circle + label */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ background: scoreColor }}
        >
          <span className="text-white font-black text-sm">{matchScore.score}%</span>
        </div>
        <div>
          <p className="font-extrabold text-base text-gray-900 mb-0.5">Your Match Score</p>
          <p className="text-sm text-gray-500">{scoreLabel}</p>
        </div>
      </div>

      {/* Matched Skills */}
      {matchScore.matchedSkills?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1.5">
            Matched Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchScore.matchedSkills.map((s, i) => (
              <SkillChip key={i} label={s} type="matched" />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {matchScore.missingSkills?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1.5">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchScore.missingSkills.map((s, i) => (
              <SkillChip key={i} label={s} type="missing" />
            ))}
          </div>
        </div>
      )}

      {/* Skill Gap Suggestions */}
      {matchScore.suggestions?.length > 0 && (
        <div className="mt-3 bg-amber-50 rounded-xl border border-amber-200 px-4 py-3">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">
            Skill Gap — Suggested Learning
          </p>
          {matchScore.suggestions.map((s, i) => (
            <div key={i} className="mb-1.5">
              <p className="text-xs font-bold text-amber-700 mb-1">Learn {s.skill}:</p>
              <div className="flex flex-wrap gap-1">
                {s.resources.map((r, j) => (
                  <SkillChip key={j} label={r} type="suggestion" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}