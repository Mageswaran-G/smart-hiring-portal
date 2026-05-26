
// Shared score metadata — colors, labels, Tailwind classes
// Used by MatchScoreCard, CandidateRankCard, ScoreBadge, RecommendationCard

export const getScoreMeta = (score) => {
  if (score >= 70) return {
    color: '#16a34a',
    bg: '#dcfce7',
    badgeClass: 'bg-green-100 text-green-700',
    circleClass: 'bg-green-600',
    label: 'Strong match'
  };
  if (score >= 40) return {
    color: '#d97706',
    bg: '#fef3c7',
    badgeClass: 'bg-amber-100 text-amber-700',
    circleClass: 'bg-amber-500',
    label: 'Moderate match'
  };
  if (score > 0) return {
    color: '#dc2626',
    bg: '#fef2f2',
    badgeClass: 'bg-red-50 text-red-600',
    circleClass: 'bg-red-500',
    label: 'Weak match'
  };
  return {
    color: '#dc2626',
    bg: '#fef2f2',
    badgeClass: 'bg-red-50 text-red-600',
    circleClass: 'bg-red-500',
    label: 'No match found'
  };
};