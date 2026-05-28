// ATS Resume Scorer
// Scores a resume text out of 100 based on ATS compatibility checks

const { normalizeSkill } = require('./normalizeText');
const SKILLS = require('../constants/skills');

// Precompute normalized skills once at module load — not on every request
const NORMALIZED_SKILLS = SKILLS.map(s => ({
  raw: s,
  normalized: normalizeSkill(s)
}));

function scoreATS(resumeText = '', candidateData = {}) {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      score: 0,
      breakdown: [],
      suggestions: ['No resume text found. Please upload your resume.'],
    };
  }

  const text = resumeText.toLowerCase();
  const breakdown = [];
  const suggestions = [];
  let totalScore = 0;

  // ── CHECK 1: Skills Keywords (40 points) ──
  const foundSkills = NORMALIZED_SKILLS.filter(({ raw, normalized }) => {
  return text.includes(normalized) || text.includes(raw);
  }).map(({ raw }) => raw);
  const skillScore = Math.min(40, Math.round((foundSkills.length / 8) * 40));
  totalScore += skillScore;
  breakdown.push({
    check: 'Skills Keywords',
    score: skillScore,
    maxScore: 40,
    detail: `${foundSkills.length} skills found`,
  });
  if (foundSkills.length < 5) {
    suggestions.push('Add more technical skills to your resume — aim for at least 8 skills.');
  }

  // ── CHECK 2: Resume Length (20 points) ──
  const wordCount = resumeText.trim().split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 300) lengthScore = 20;
  else if (wordCount >= 150) lengthScore = 12;
  else if (wordCount >= 80) lengthScore = 6;
  totalScore += lengthScore;
  breakdown.push({
    check: 'Resume Length',
    score: lengthScore,
    maxScore: 20,
    detail: `${wordCount} words`,
  });
  if (wordCount < 300) {
    suggestions.push(`Resume is too short (${wordCount} words). Aim for at least 300 words.`);
  }

  // ── CHECK 3: Contact Info (15 points) ──
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
  let contactScore = 0;
  if (hasEmail) contactScore += 8;
  if (hasPhone) contactScore += 7;
  totalScore += contactScore;
  breakdown.push({
    check: 'Contact Information',
    score: contactScore,
    maxScore: 15,
    detail: `Email: ${hasEmail ? 'Found' : 'Missing'}, Phone: ${hasPhone ? 'Found' : 'Missing'}`,
  });
  if (!hasEmail) suggestions.push('Add your email address to your resume.');
  if (!hasPhone) suggestions.push('Add your phone number to your resume.');

  // ── CHECK 4: Education (15 points) ──
  const educationKeywords = ['education', 'degree', 'bachelor', 'master', 'b.e', 'b.tech',
    'mca', 'bca', 'diploma', 'university', 'college', 'school', 'graduated', 'gpa', 'cgpa'];
  const hasEducation = educationKeywords.some(kw => text.includes(kw));
  const educationScore = hasEducation ? 15 : 0;
  totalScore += educationScore;
  breakdown.push({
    check: 'Education Section',
    score: educationScore,
    maxScore: 15,
    detail: hasEducation ? 'Education section found' : 'No education section found',
  });
  if (!hasEducation) suggestions.push('Add an Education section with your degree and college name.');

  // ── CHECK 5: Experience (10 points) ──
  const experienceKeywords = ['experience', 'worked', 'internship', 'project', 'developed',
    'built', 'created', 'designed', 'implemented', 'managed', 'led'];
  const expMatches = experienceKeywords.filter(kw => text.includes(kw));
  const experienceScore = expMatches.length >= 3 ? 10 : expMatches.length >= 1 ? 5 : 0;
  totalScore += experienceScore;
  breakdown.push({
    check: 'Experience / Projects',
    score: experienceScore,
    maxScore: 10,
    detail: `${expMatches.length} experience keywords found`,
  });
  if (expMatches.length < 3) {
    suggestions.push('Add more details about your work experience or projects (developed, built, implemented).');
  }

  // ── FINAL SCORE ──
  const finalScore = Math.min(100, totalScore);
  let label = 'Poor';
  let color = 'red';
  if (finalScore >= 80) { label = 'Excellent'; color = 'green'; }
  else if (finalScore >= 60) { label = 'Good'; color = 'blue'; }
  else if (finalScore >= 40) { label = 'Average'; color = 'orange'; }

  return {
    score: finalScore,
    label,
    color,
    breakdown,
    suggestions,
    foundSkills,
    wordCount,
  };
}

module.exports = { scoreATS };