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

// Calculate experience level bonus/penalty
// Returns a multiplier between 0.7 and 1.1
function getExperienceMultiplier(candidateLevel, jobLevel) {
  if (!candidateLevel || !jobLevel) return 1;

  const candidateRank = EXPERIENCE_RANK[candidateLevel.toLowerCase()] ?? 1;
  const jobRank       = EXPERIENCE_RANK[jobLevel.toLowerCase()] ?? 1;
  const diff          = candidateRank - jobRank;

  if (diff === 0)  return 1.1;  // Perfect match — 10% bonus
  if (diff === 1)  return 1.05; // One level above — small bonus
  if (diff === -1) return 0.9;  // One level below — small penalty
  if (diff <= -2)  return 0.75; // Two+ levels below — big penalty
  return 1.0;                   // Overqualified — neutral
}

module.exports = {
  HIRING_THRESHOLDS,
  SKILL_WEIGHTS,
  PARTIAL_CREDIT,
  EXPERIENCE_RANK,
  getRecommendation,
  getExperienceMultiplier
};

