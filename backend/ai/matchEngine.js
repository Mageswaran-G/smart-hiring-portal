// Match Engine — Semantic + Weighted + Required/Preferred Skill Matching

const { normalizeSkill, getSkillGroup } = require('./normalizeText');
const { SKILL_WEIGHTS, PARTIAL_CREDIT, getExperienceAdjustment } = require('./thresholds');

function calculateMatch(candidateSkills = [], jobSkills = [], options = {}) {
  const { preferredSkills = [], candidateLevel, jobLevel } = options;

  if (!jobSkills || jobSkills.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: [], matchedPreferred: [] };
  }

  // Normalize all candidate skills
  const normalizedCandidate = candidateSkills.map(normalizeSkill);

  const matchedSkills = [];
  const missingSkills = [];
  const matchedPreferred = [];
  let totalWeight = 0;
  let earnedWeight = 0;

  // Precompute once — not inside loop
  const candidateGroups = normalizedCandidate.map(getSkillGroup);

  // ── Score required skills (higher weight) ──
  jobSkills.forEach(skill => {
    const normalized = normalizeSkill(skill);
    const group = getSkillGroup(normalized);

    // Weight by group
    let weight = SKILL_WEIGHTS.default;
    if (group === 'frontend' || group === 'backend' || group === 'ai') weight = SKILL_WEIGHTS.frontendBackendAI;
    else if (group === 'database' || group === 'devops') weight = SKILL_WEIGHTS.databaseDevops;
    weight = weight * SKILL_WEIGHTS.requiredMultiplier;
    totalWeight += weight;

    if (normalizedCandidate.includes(normalized)) {
      matchedSkills.push(skill);
      earnedWeight += weight;
    } else {
      // Partial group credit — 30%
      
      if (group !== 'other' && candidateGroups.includes(group)) {
        earnedWeight += weight * PARTIAL_CREDIT;
      }
      missingSkills.push(skill);
    }
  });

  // ── Score preferred skills (bonus, lower weight) ──
  preferredSkills.forEach(skill => {
    const normalized = normalizeSkill(skill);
    const group = getSkillGroup(normalized);

    // Preferred skills weight = 0.5x (bonus only)
    let weight = SKILL_WEIGHTS.preferredWeight;
    if (group === 'frontend' || group === 'backend' || group === 'ai') weight = SKILL_WEIGHTS.preferredCoreWeight;
    totalWeight += weight;

    if (normalizedCandidate.includes(normalized)) {
      matchedPreferred.push(skill);
      earnedWeight += weight;
    }
    // No penalty for missing preferred skills
  });

  
  const rawScore = totalWeight > 0
    ? Math.round((earnedWeight / totalWeight) * 100)
    : 0;
  const expAdjustment = getExperienceAdjustment(candidateLevel, jobLevel);
  const score = Math.min(100, Math.max(0, rawScore + expAdjustment));

  return { score, matchedSkills, missingSkills, matchedPreferred };
}

module.exports = calculateMatch;