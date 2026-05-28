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

module.exports = { HIRING_THRESHOLDS, SKILL_WEIGHTS, PARTIAL_CREDIT, getRecommendation };