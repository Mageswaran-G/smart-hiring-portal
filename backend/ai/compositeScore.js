// Composite Candidate Score
// Combines: Skill Match (60%) + ATS Score (25%) + Profile Completeness (15%)

const { scoreATS } = require('./atsScorer');
const { calcProfileCompleteness } = require('../utils/profileCompleteness');

const WEIGHTS = {
  skillMatch:          0.60,
  atsScore:            0.25,
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

module.exports = { calcCompositeScore, WEIGHTS };