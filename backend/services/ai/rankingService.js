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

function buildCandidateSummary(recommendation, result, confidenceLabel, jobTitle) {
  const matched = result.matchedSkills.length;
  const missing = result.missingSkills.length;
  const preferred = result.matchedPreferred?.length || 0;

  const strengthPhrase =
    matched >= 5 ? `Strong technical alignment with ${matched} core skills matched` :
    matched >= 3 ? `Good skill coverage with ${matched} required skills` :
    `Partial skill match — ${matched} of ${matched + missing} skills`;

  const missingPhrase =
    missing === 0 ? 'No skill gaps identified' :
    missing === 1 ? `Missing ${result.missingSkills[0]} — otherwise strong fit` :
    `Missing ${missing} skills including ${result.missingSkills.slice(0, 2).join(', ')}`;

  const preferredPhrase = preferred > 0
    ? `Also has ${preferred} preferred skill${preferred > 1 ? 's' : ''} as bonus.` : '';

  const confidencePhrase = confidenceLabel === 'Low'
    ? 'Limited profile data — verify manually.' : '';

  return `${strengthPhrase}. ${missingPhrase}. ${preferredPhrase} ${confidencePhrase}`.trim().replace(/\s+/g, ' ');
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
    summary: buildCandidateSummary(recommendation, result, confidence.label, job.title),  
  };
}

function rankCandidates(applications, job) {
  return applications
    .map(app => rankCandidate(app, job))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

module.exports = { rankCandidates, rankCandidate };