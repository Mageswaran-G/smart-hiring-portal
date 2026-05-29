// Smart JD Analyzer
// Extracts skills, experience level, difficulty from job description text

const { normalizeSkill, getSkillGroup } = require('./normalizeText');
const SKILLS = require('../constants/skills');

// Precompute normalized skills once
const NORMALIZED_SKILLS = SKILLS.map(s => ({
  raw: s,
  normalized: normalizeSkill(s)
}));

function escapeRegex(str = '') {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function analyzeJD(description = '') {
  if (!description || description.trim().length < 20) {
    return { error: 'Description too short to analyze' };
  }

  const text = description.toLowerCase();

  // ── Step 1: Extract skills from JD text ──
  const foundSkills = NORMALIZED_SKILLS.filter(({ raw, normalized }) => {
    const escapedNormalized = escapeRegex(normalized);
    const escapedRaw = escapeRegex(raw);
    return (
      new RegExp(`\\b${escapedNormalized}\\b`, 'i').test(text) ||
      new RegExp(`\\b${escapedRaw}\\b`, 'i').test(text)
    );
  }).map(({ raw }) => raw);

  const uniqueSkills = [...new Set(foundSkills)];

  // ── Step 2: Detect experience level ──
  let experienceLevel = 'fresher';
  if (/\b(10\+|10 \+|ten years|lead|principal|staff|architect)\b/i.test(text)) {
    experienceLevel = 'senior';
  } else if (/\b(senior|sr\.|5\+|6\+|7\+|8\+|9\+|5 years|6 years|7 years)\b/i.test(text)) {
    experienceLevel = 'senior';
  } else if (/\b(mid|middle|3\+|4\+|3 years|4 years|intermediate)\b/i.test(text)) {
    experienceLevel = 'mid';
  } else if (/\b(junior|jr\.|1\+|2\+|1 year|2 years|entry.level|entry level)\b/i.test(text)) {
    experienceLevel = 'junior';
  } else if (/\b(fresher|fresh graduate|0.1|0-1|trainee|intern|no experience)\b/i.test(text)) {
    experienceLevel = 'fresher';
  }

  // ── Step 3: Estimate difficulty ──
  const skillGroups = uniqueSkills.map(s => getSkillGroup(normalizeSkill(s)));
  const hasAI = skillGroups.includes('ai');
  const hasDevOps = skillGroups.includes('devops');
  const hasBackend = skillGroups.includes('backend');
  const skillCount = uniqueSkills.length;

  let difficulty = 'Easy';
  if (hasAI || (hasDevOps && hasBackend) || skillCount >= 8) difficulty = 'Hard';
  else if (skillCount >= 5 || hasDevOps || experienceLevel === 'senior') difficulty = 'Medium';

  // ── Step 4: Estimate salary range (INR/year) ──
  const salaryRanges = {
    fresher: { min: 300000,  max: 600000  },
    junior:  { min: 600000,  max: 1200000 },
    mid:     { min: 1200000, max: 2500000 },
    senior:  { min: 2500000, max: 5000000 },
  };

  // Adjust salary if AI/ML or DevOps skills found
  let salary = { ...salaryRanges[experienceLevel] };
  if (hasAI || hasDevOps) {
    salary.min = Math.round(salary.min * 1.2);
    salary.max = Math.round(salary.max * 1.3);
  }

  // ── Step 5: Generate suggestions ──
  const suggestions = [];
  if (uniqueSkills.length === 0) {
    suggestions.push('No skills detected. Try mentioning specific technologies like React, Node.js, Python.');
  }
  if (uniqueSkills.length < 3) {
    suggestions.push('Add more specific technical skills to attract better candidates.');
  }
  if (description.trim().split(/\s+/).length < 50) {
    suggestions.push('Description is short. Add more details about responsibilities and requirements.');
  }

  return {
    extractedSkills: uniqueSkills,
    skillCount: uniqueSkills.length,
    experienceLevel,
    difficulty,
    estimatedSalary: {
      min: salary.min,
      max: salary.max,
      currency: 'INR',
      period: 'year',
    },
    suggestions,
    confidence: uniqueSkills.length >= 5 ? 'High' : uniqueSkills.length >= 3 ? 'Medium' : 'Low',
  };
}

module.exports = { analyzeJD };