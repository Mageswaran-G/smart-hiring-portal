// Shared score metadata — Tailwind classes and labels only
// Used by MatchScoreCard, CandidateRankCard, ScoreBadge, RecommendationCard

export const getScoreMeta = (score) => {
  if (score >= 70) return {
    badgeClass: 'bg-green-100 text-green-700',
    circleClass: 'bg-green-600',
    label: 'Strong match'
  };
  if (score >= 40) return {
    badgeClass: 'bg-amber-100 text-amber-700',
    circleClass: 'bg-amber-500',
    label: 'Moderate match'
  };
  if (score > 0) return {
    badgeClass: 'bg-red-50 text-red-600',
    circleClass: 'bg-red-500',
    label: 'Weak match'
  };
  return {
    badgeClass: 'bg-red-50 text-red-600',
    circleClass: 'bg-red-500',
    label: 'No match found'
  };
};