// Normalize skill names using alias mapping

const aliases = {
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'next.js': 'nextjs',
  'vue.js': 'vue',
  'nuxt.js': 'nuxt',
  'express.js': 'express',
  'tailwindcss': 'tailwind',
  'postgresql': 'postgresql',
  'mongo': 'mongodb',
  'ts': 'typescript',
  'js': 'javascript',
};

function normalizeSkill(skill = '') {
  const lower = skill.toLowerCase().trim();
  return aliases[lower] || lower
    .replace(/\s+/g, '')
    .replace(/-/g, '');
}

module.exports = normalizeSkill;
