// Extract skills from any text (resume, profile, job description)

const SKILLS = require('../constants/skills');
const normalizeSkill = require('./normalizeText');

function extractSkills(text = '') {
  const normalizedText = normalizeSkill(text);
  
  return SKILLS.filter(skill => {
    const normalizedSkill = normalizeSkill(skill);
    return normalizedText.includes(normalizedSkill);
  });
}

module.exports = extractSkills;
