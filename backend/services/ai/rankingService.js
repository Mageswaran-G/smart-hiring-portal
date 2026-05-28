// AI Ranking Service — orchestrates composite scoring, confidence, recommendations
const calculateMatch = require('../../ai/matchEngine');
const { calcCompositeScore, calcConfidenceScore } = require('../../ai/compositeScore');
const { getRecommendation } = require('../../ai/thresholds');
const extractCandidateSkills = require('../../utils/extractCandidateSkills');


function inferExperienceLevel(user) {
  const workCount = user.workHistory?.length || 0;
  if (workCount === 0) return 'fresher';
  if (workCount === 1) return 'junior';
  if (workCount === 2) return 'mid';
  return 'senior';
}

function rankCandidate(application, job) {
  const c = application.candidate;
  if (!c) return null;

  const cs = extractCandidateSkills(c);
  const candidateLevel = inferExperienceLevel(c);

  const result = calculateMatch(cs, job.skillsRequired || [], {
    preferredSkills: job.preferredSkills || [],
    jobLevel: job.experienceLevel,
    candidateLevel,
  });

  const composite = calcCompositeScore(c, result.score);
  const confidence = calcConfidenceScore(c, result.score);
  const finalScore = composite.compositeScore;
  const recommendation = getRecommendation(finalScore);

  return {
    applicationId: application._id,
    status: application.status,
    appliedAt: application.createdAt,
    candidate: {
      id: c._id,
      name: c.name,
      email: c.email,
      avatar: c.avatar,
    },
    score: finalScore,
    skillMatchScore: result.score,
    matchedSkills: result.matchedSkills,
    missingSkills: result.missingSkills,
    matchedPreferred: result.matchedPreferred || [],
    recommendation,
    confidence: confidence.label,
    confidenceScore: confidence.score,
    compositeBreakdown: composite.breakdown,
    breakdown: result.breakdown,
    summary: `${recommendation} candidate. ${result.matchedSkills.length} skills matched for ${job.title}.`,
  };
}

function rankCandidates(applications, job) {
  return applications
    .map(app => rankCandidate(app, job))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

module.exports = { rankCandidates, rankCandidate };