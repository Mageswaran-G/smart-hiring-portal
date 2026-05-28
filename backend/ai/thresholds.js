
// Scoring version — increment when algorithm changes significantly
const SCORING_VERSION = '2.0.0';
// v1.0.0 — basic keyword matching
// v2.0.0 — weighted groups, experience level, preferred skills, composite scoring
// Centralized AI scoring thresholds and weights
// Change here — affects entire platform

const HIRING_THRESHOLDS = {
  strongHire: 80,
  hire: 65,
  consider: 50,
};

const SKILL_WEIGHTS = {
  frontendBackendAI: 2,
  databaseDevops: 1.5,
  default: 1,
  requiredMultiplier: 1.5,
  preferredWeight: 0.5,
  preferredCoreWeight: 1,
};

const PARTIAL_CREDIT = 0.3;

function getRecommendation(score) {
  if (score >= HIRING_THRESHOLDS.strongHire) return 'Strong Hire';
  if (score >= HIRING_THRESHOLDS.hire) return 'Hire';
  if (score >= HIRING_THRESHOLDS.consider) return 'Consider';
  return 'Reject';
}

// Experience level mapping — numeric rank
const EXPERIENCE_RANK = {
  fresher: 0,
  junior:  1,
  mid:     2,
  senior:  3,
};

// Experience adjustment — additive (not multiplicative)
// Returns points to ADD to raw score (-15 to +8)
function getExperienceAdjustment(candidateLevel, jobLevel) {
  if (!candidateLevel || !jobLevel) return 0;

  const candidateRank = EXPERIENCE_RANK[candidateLevel.toLowerCase()] ?? 1;
  const jobRank       = EXPERIENCE_RANK[jobLevel.toLowerCase()] ?? 1;
  const diff          = candidateRank - jobRank;

  if (diff === 0)  return 8;   // Perfect match — +8 points
  if (diff === 1)  return 4;   // One level above — +4 points
  if (diff === -1) return -5;  // One level below — -5 points
  if (diff <= -2)  return -15; // Two+ below — -15 points
  if (diff >= 2)   return -3;  // Overqualified — mild -3 penalty
  return 0;
}

module.exports = {
  HIRING_THRESHOLDS,
  SKILL_WEIGHTS,
  PARTIAL_CREDIT,
  EXPERIENCE_RANK,
  SCORING_VERSION,
  getRecommendation,
  getExperienceAdjustment
};
