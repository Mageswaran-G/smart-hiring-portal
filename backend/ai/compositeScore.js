// Composite Candidate Score
// Combines: Skill Match (60%) + ATS Score (25%) + Profile Completeness (15%)

const { scoreATS } = require('./atsScorer');
const { calcProfileCompleteness } = require('../utils/profileCompleteness');

// ATS and profile completeness partially overlap — reduce ATS weight to avoid double counting
const WEIGHTS = {
  skillMatch:          0.65,
  atsScore:            0.20,
  profileCompleteness: 0.15,
};

function calcCompositeScore(user, skillMatchScore) {
  // ATS score from resume text
  const resumeText = user.parsedResumeText ||
    `${user.bio || ''} Skills: ${(user.parsedSkills || user.skills || []).join(', ')}`;
  const atsResult = scoreATS(resumeText, user);
  const atsScore = atsResult.score;

  // Profile completeness
  const profileScore = calcProfileCompleteness(user);

  // Weighted composite
  const composite = Math.round(
    (skillMatchScore  * WEIGHTS.skillMatch) +
    (atsScore         * WEIGHTS.atsScore) +
    (profileScore     * WEIGHTS.profileCompleteness)
  );

  return {
    compositeScore: Math.min(100, composite),
    breakdown: {
      skillMatch:          { score: skillMatchScore, weight: '60%' },
      atsScore:            { score: atsScore,        weight: '25%' },
      profileCompleteness: { score: profileScore,    weight: '15%' },
    }
  };
}

function calcConfidenceScore(user, skillMatchScore) {
  let confidence = 0;
  let reasons = [];

  // Resume quality
  if (user.parsedResumeText?.length > 200) { confidence += 30; reasons.push('Rich resume text'); }
  else if (user.parsedResumeText?.length > 50) { confidence += 15; reasons.push('Basic resume text'); }
  else { reasons.push('No resume text detected'); }

  // Skill data quality
  const skillCount = (user.parsedSkills?.length || 0);
  if (skillCount >= 8)       { confidence += 30; reasons.push(`${skillCount} skills detected`); }
  else if (skillCount >= 4)  { confidence += 20; reasons.push(`${skillCount} skills detected`); }
  else if (skillCount >= 1)  { confidence += 10; reasons.push(`${skillCount} skills detected`); }
  else                       { reasons.push('No parsed skills found'); }

  // Profile completeness
  const profileScore = calcProfileCompleteness(user);
  if (profileScore >= 70)      { confidence += 25; reasons.push('Complete profile'); }
  else if (profileScore >= 40) { confidence += 15; reasons.push('Partial profile'); }
  else                         { reasons.push('Incomplete profile'); }

  // Match score reliability
  if (skillMatchScore >= 60) { confidence += 15; reasons.push('Strong skill alignment'); }
  else if (skillMatchScore >= 30) { confidence += 8; }

  const score = Math.min(100, confidence);
  const label = score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low';

  return { score, label, reasons };
}

module.exports = { calcCompositeScore, calcConfidenceScore, WEIGHTS };