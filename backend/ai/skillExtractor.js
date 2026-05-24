// Extract skills from text using tokenization
// Safer than regex — no false positives like java vs javascript

const SKILLS = require('../constants/skills');
const normalizeSkill = require('./normalizeText');

function extractSkills(text = '') {
  if (!text) return [];

  // Tokenize: split by non-alphanumeric chars, normalize each token
  const tokens = text
    .toLowerCase()
    .split(/[^a-zA-Z0-9.#+]+/)
    .map(normalizeSkill)
    .filter(Boolean);

  // Match skills against tokens
  return SKILLS.filter(skill => {
    const normalizedSkill = normalizeSkill(skill);
    return tokens.includes(normalizedSkill);
  });
}

module.exports = extractSkills;
