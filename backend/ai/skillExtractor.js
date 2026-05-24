// Extract skills from any text using word boundaries
// Fixes: "java" should NOT match "javascript"

const SKILLS = require('../constants/skills');
const normalizeSkill = require('./normalizeText');

function extractSkills(text = '') {
  if (!text) return [];

  return SKILLS.filter(skill => {
    const normalizedSkill = normalizeSkill(skill);
    // Word boundary check — java won't match javascript
    const regex = new RegExp(`(?<![a-z])${normalizedSkill}(?![a-z])`, 'i');
    return regex.test(normalizeSkill(text));
  });
}

module.exports = extractSkills;
