// Calculate match score between candidate skills and job skills

const normalizeSkill = require('./normalizeText');

function calculateMatch(candidateSkills = [], jobSkills = []) {
  if (!jobSkills || jobSkills.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }

  const normalizedCandidate = candidateSkills.map(normalizeSkill);

  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach(skill => {
    const normalized = normalizeSkill(skill);
    if (normalizedCandidate.includes(normalized)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const score = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return { score, matchedSkills, missingSkills };
}

module.exports = calculateMatch;
