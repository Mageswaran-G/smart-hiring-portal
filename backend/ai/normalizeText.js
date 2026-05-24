// Normalize skill names for comparison
// react.js === reactjs === react

function normalizeSkill(skill = '') {
  return skill
    .toLowerCase()
    .replace(/\s+/g, '')      // remove spaces
    .replace(/\.js$/g, 'js')  // react.js → reactjs
    .replace(/\./g, '')       // node.js → nodejs
    .replace(/-/g, '');       // next-js → nextjs
}

module.exports = normalizeSkill;
