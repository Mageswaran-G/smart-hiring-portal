// Used by MatchScoreCard, CandidateRankCard, RecommendationCard, ScoreBadge

export const getScoreMeta = (score) => {
  if (score >= 70) return {
    color: '#16a34a',
    bg: '#dcfce7',
    label: 'Strong match! 🎉'
  };
  if (score >= 40) return {
    color: '#d97706',
    bg: '#fef3c7',
    label: 'Moderate match'
  };
  if (score > 0) return {
    color: '#dc2626',
    bg: '#fef2f2',
    label: 'Weak match — consider upskilling'
  };
  return {
    color: '#dc2626',
    bg: '#fef2f2',
    label: 'No strong skill match found'
  };
};