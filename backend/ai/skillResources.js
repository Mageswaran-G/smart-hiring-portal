// Skill Gap Suggestions — static learning resource mapping
const { normalizeSkill } = require("./normalizeText");

const SKILL_RESOURCES = {
  docker:          ['Docker Basics', 'Container Deployment', 'Docker Compose'],
  kubernetes:      ['Kubernetes Fundamentals', 'K8s Cluster Management'],
  aws:             ['AWS EC2 Fundamentals', 'S3 & Storage Basics', 'AWS IAM'],
  azure:           ['Azure Fundamentals', 'Azure App Service'],
  gcp:             ['Google Cloud Basics', 'GCP Compute Engine'],
  python:          ['Python Basics', 'Python for Backend', 'Python OOP'],
  tensorflow:      ['TensorFlow Basics', 'Neural Networks 101'],
  pytorch:         ['PyTorch Fundamentals', 'Deep Learning Basics'],
  machinelearning: ['ML Fundamentals', 'Supervised Learning', 'scikit-learn'],
  typescript:      ['TypeScript Basics', 'TS with React'],
  graphql:         ['GraphQL Fundamentals', 'Apollo Client'],
  redis:           ['Redis Basics', 'Caching Strategies'],
  postgresql:      ['PostgreSQL Basics', 'SQL Fundamentals'],
  mongodb:         ['MongoDB Basics', 'Mongoose ODM'],
  cicd:            ['CI/CD Fundamentals', 'GitHub Actions', 'Jenkins Basics'],
  terraform:       ['Terraform Basics', 'Infrastructure as Code'],
  ansible:         ['Ansible Fundamentals', 'Automation Basics'],
  flutter:         ['Flutter Basics', 'Dart Language'],
  swift:           ['Swift Basics', 'iOS Development'],
  kotlin:          ['Kotlin Basics', 'Android Development'],
  reactnative:     ['React Native Basics', 'Mobile Development with RN'],
  nextjs:          ['Next.js Fundamentals', 'SSR & SSG Concepts'],
  vue:             ['Vue.js Basics', 'Vue Router & Vuex'],
  angular:         ['Angular Fundamentals', 'RxJS Basics'],
};

const getSuggestions = (missingSkills = []) => {
  return missingSkills
    .map(skill => {
      const normalized = normalizeSkill(skill);
      const resources = SKILL_RESOURCES[normalized];
      if (!resources) return { skill, resources: [`Learn ${skill} Fundamentals`, `${skill} Crash Course`] };
      return { skill, resources: resources.slice(0, 2) };
    })
    .filter(Boolean);
};

module.exports = { SKILL_RESOURCES, getSuggestions };
