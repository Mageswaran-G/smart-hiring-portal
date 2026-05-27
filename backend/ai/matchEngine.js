// Match Engine — Semantic + Weighted Skill Matching
const { normalizeSkill, getSkillGroup } = require('./normalizeText');

function calculateMatch(candidateSkills = [], jobSkills = [], options = {}) {
  if (!jobSkills || jobSkills.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }

  // Normalize all candidate skills
  const normalizedCandidate = candidateSkills.map(normalizeSkill);

  const matchedSkills = [];
  const missingSkills = [];
  let totalWeight = 0;
  let earnedWeight = 0;

  jobSkills.forEach(skill => {
    const normalized = normalizeSkill(skill);
    const group = getSkillGroup(normalized);

    // Weight by skill group importance
    // Core technical skills worth more
    let weight = 1;
    if (group === 'frontend' || group === 'backend') weight = 2;
    if (group === 'database') weight = 1.5;
    if (group === 'devops') weight = 1.5;
    if (group === 'ai') weight = 2;

    totalWeight += weight;

    if (normalizedCandidate.includes(normalized)) {
      matchedSkills.push(skill);
      earnedWeight += weight;
    } else {
      // Check partial group match — same group = partial credit
      const candidateGroups = normalizedCandidate.map(getSkillGroup);
      if (group !== 'other' && candidateGroups.includes(group)) {
        earnedWeight += weight * 0.3; // 30% partial credit
      }
      missingSkills.push(skill);
    }
  });

  // Calculate weighted score
  const score = totalWeight > 0
    ? Math.min(100, Math.round((earnedWeight / totalWeight) * 100))
    : 0;

  return { score, matchedSkills, missingSkills };
}

module.exports = calculateMatch;