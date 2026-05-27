const SKILLS = require('../constants/skills');
const { normalizeSkill } = require('./normalizeText');

// Pre-process multi-word skills before tokenizing
function preprocessText(text) {
  return text
    .replace(/machine\s+learning/gi, 'machinelearning')
    .replace(/deep\s+learning/gi, 'deeplearning')
    .replace(/react\s+native/gi, 'reactnative')
    .replace(/node\s+js/gi, 'nodejs')
    .replace(/mongo\s+db/gi, 'mongodb')
    .replace(/tailwind\s+css/gi, 'tailwind')
    .replace(/next\s+js/gi, 'nextjs')
    .replace(/ci\s*\/\s*cd/gi, 'cicd')
    .replace(/rest\s+apis?/gi, 'restapi');
}

function extractSkills(text = '') {
  if (!text) return [];

  const processed = preprocessText(text);

  const tokens = processed
    .toLowerCase()
    .split(/[^a-zA-Z0-9.#+]+/)
    .map(normalizeSkill)
    .filter(Boolean);

  return SKILLS.filter(skill => {
    return tokens.includes(normalizeSkill(skill));
  });
}

module.exports = extractSkills;
