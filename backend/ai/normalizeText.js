// Semantic Skill Normalization — maps all variants to one standard name

const aliases = {
  // React
  'react.js': 'react',
  'reactjs': 'react',
  'react js': 'react',

  // Node
  'node.js': 'nodejs',
  'node js': 'nodejs',
  'node': 'nodejs',

  // Next
  'next.js': 'nextjs',
  'next js': 'nextjs',

  // Vue
  'vue.js': 'vue',
  'vuejs': 'vue',
  'vue js': 'vue',

  // Express
  'express.js': 'express',
  'expressjs': 'express',
  'express js': 'express',

  // Tailwind
  'tailwindcss': 'tailwind',
  'tailwind css': 'tailwind',

  // MongoDB
  'mongo': 'mongodb',
  'mongo db': 'mongodb',

  // PostgreSQL
  'postgresql': 'postgres',
  'postgre sql': 'postgres',
  'psql': 'postgres',
  'pg': 'postgres',

  // JavaScript
  'js': 'javascript',
  'java script': 'javascript',
  'es6': 'javascript',
  'es2015': 'javascript',
  'vanilla js': 'javascript',
  'vanillajs': 'javascript',

  // TypeScript
  'ts': 'typescript',
  'type script': 'typescript',

  // Python
  'py': 'python',
  'python3': 'python',
  'python 3': 'python',

  // CSS
  'css3': 'css',
  'css 3': 'css',
  'cascading style sheets': 'css',

  // HTML
  'html5': 'html',
  'html 5': 'html',

  // React Native
  'react-native': 'reactnative',
  'react native': 'reactnative',

  // Next.js
  'nuxt.js': 'nuxt',
  'nuxt js': 'nuxt',

  // C languages
  'c++': 'cpp',
  'cplusplus': 'cpp',
  'c plus plus': 'cpp',
  'c#': 'csharp',
  'c sharp': 'csharp',

  // Java
  'java ee': 'java',
  'java se': 'java',

  // Cloud
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  'microsoft azure': 'azure',

  // DevOps
  'docker container': 'docker',
  'kubernetes': 'k8s',
  'k8': 'k8s',

  // DB
  'mysql': 'mysql',
  'my sql': 'mysql',
  'ms sql': 'mssql',
  'microsoft sql server': 'mssql',
  'redis cache': 'redis',

  // Git
  'git hub': 'github',
  'git lab': 'gitlab',

  // AI/ML
  'machine learning': 'ml',
  'deep learning': 'dl',
  'artificial intelligence': 'ai',
  'natural language processing': 'nlp',

  // Mobile
  'flutter dart': 'flutter',
  'react-native': 'reactnative',

  // Others
  'rest api': 'restapi',
  'rest apis': 'restapi',
  'restful': 'restapi',
  'restful api': 'restapi',
  'graphql api': 'graphql',
  'socket.io': 'socketio',
  'socket io': 'socketio',
};

function normalizeSkill(skill = '') {
  // Step 1 — lowercase and trim
  const lower = skill.toLowerCase().trim();

  // Step 2 — check alias map first
  if (aliases[lower]) return aliases[lower];

  // Step 3 — remove dots, dashes, spaces
  const cleaned = lower
    .replace(/\./g, '')   // react.js → reactjs
    .replace(/-/g, '')    // react-native → reactnative
    .replace(/\s+/g, ''); // node js → nodejs

  // Step 4 — check cleaned version in alias map
  if (aliases[cleaned]) return aliases[cleaned];

  // Step 5 — return cleaned version
  return cleaned;
}

module.exports = normalizeSkill;