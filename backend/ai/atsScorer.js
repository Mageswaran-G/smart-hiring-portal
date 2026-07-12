// ATS Resume Scorer
// Scores a resume text out of 100 based on ATS compatibility checks

const { normalizeSkill, getSkillGroup } = require('./normalizeText');
const SKILLS = require('../constants/skills');

// Escape special regex characters — fixes c++, c#, node.js breaking regex
function escapeRegex(str = '') {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

  // Supplement with candidate profile data if resume text is weak
  const profileSkills = [
    ...(candidateData?.parsedSkills || []),
    ...(candidateData?.skills || []),
  ].map(s => (typeof s === 'string' ? s.toLowerCase() : ''));

  const breakdown = [];
  const suggestions = [];
  let totalScore = 0;

  // ── CHECK 1: Skills Keywords (40 points) ──
  const foundSkills = NORMALIZED_SKILLS.filter(({ raw, normalized }) => {
    const escapedNormalized = escapeRegex(normalized);
    const escapedRaw = escapeRegex(raw);

    // Resume text check — word boundary only (no includes fallback)
    const inResume = (
      new RegExp(`\\b${escapedNormalized}\\b`, 'i').test(text) ||
      new RegExp(`\\b${escapedRaw}\\b`, 'i').test(text)
    );

    // Profile skills check — exact match only
    const inProfile = (
      profileSkills.some(s => normalizeSkill(s) === normalized) ||
      profileSkills.some(s => s.toLowerCase() === raw.toLowerCase())
    );

    return inResume || inProfile;
  }).map(({ raw }) => raw);

  // Remove duplicates
  const uniqueFoundSkills = [...new Set(foundSkills)];

  // Anti-keyword spam — count skill frequency in text
  // If any skill appears more than 5 times — likely keyword stuffing
  const spamDetected = uniqueFoundSkills.some(skill => {
    const normalized = normalizeSkill(skill);
    const escaped = escapeRegex(normalized);
    const matches = text.match(new RegExp(`\\b${escaped}\\b`, 'gi'));
    return matches && matches.length > 5;
  });

  // Apply spam penalty — reduce skill score by 30% if spam detected
  const spamPenalty = spamDetected ? 0.7 : 1.0;

  // Weighted skill scoring — same as matchEngine
  let skillWeight = 0;
  uniqueFoundSkills.forEach(skill => {
    const group = getSkillGroup(skill);
    if (group === 'frontend' || group === 'backend' || group === 'ai') skillWeight += 2;
    else if (group === 'database' || group === 'devops') skillWeight += 1.5;
    else skillWeight += 1;
  });
  const skillScore = Math.min(40, Math.round((skillWeight / 16) * 40 * spamPenalty));
  totalScore += skillScore;
  breakdown.push({
    id: 'skills',
    check: 'Skills Keywords',
    score: skillScore,
    maxScore: 40,
    detail: `${uniqueFoundSkills.length} skills found`,
  });
  if (uniqueFoundSkills.length < 5) {
    suggestions.push({ id: 'add-skills', text: 'Add more technical skills to your resume — aim for at least 8 skills.' });
  }

  // ── CHECK 2: Resume Length (20 points) ──
  const wordCount = resumeText.trim().split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 300) lengthScore = 20;
  else if (wordCount >= 150) lengthScore = 12;
  else if (wordCount >= 80) lengthScore = 6;
  totalScore += lengthScore;
  breakdown.push({
    id: 'length',
    check: 'Resume Length',
    score: lengthScore,
    maxScore: 20,
    detail: `${wordCount} words`,
  });
  if (wordCount < 300) {
    suggestions.push({ id: 'resume-length', text: `Resume is too short (${wordCount} words). Aim for at least 300 words.` });
  }

  // ── CHECK 3: Contact Info (15 points) ──
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
  let contactScore = 0;
  if (hasEmail) contactScore += 8;
  if (hasPhone) contactScore += 7;
  totalScore += contactScore;
  breakdown.push({
    id: 'contact',
    check: 'Contact Information',
    score: contactScore,
    maxScore: 15,
    detail: `Email: ${hasEmail ? 'Found' : 'Missing'}, Phone: ${hasPhone ? 'Found' : 'Missing'}`,
  });
  if (!hasEmail) suggestions.push({ id: 'add-email', text: 'Add your email address to your resume.' });
  if (!hasPhone) suggestions.push({ id: 'add-phone', text: 'Add your phone number to your resume.' });

  // ── CHECK 4: Education (15 points) ──
  const educationKeywords = ['education', 'degree', 'bachelor', 'master', 'b.e', 'b.tech',
    'mca', 'bca', 'diploma', 'university', 'college', 'school', 'graduated', 'gpa', 'cgpa'];
  const hasEducation = educationKeywords.some(kw => text.includes(kw));
  const educationScore = hasEducation ? 15 : 0;
  totalScore += educationScore;
  breakdown.push({
    id: 'education',
    check: 'Education Section',
    score: educationScore,
    maxScore: 15,
    detail: hasEducation ? 'Education section found' : 'No education section found',
  });
  if (!hasEducation) suggestions.push({ id: 'add-education', text: 'Add an Education section with your degree and college name.' });

  // ── CHECK 5: Experience (10 points) ──
  const experienceKeywords = ['experience', 'worked', 'internship', 'project', 'developed',
    'built', 'created', 'designed', 'implemented', 'managed', 'led'];
  const expMatches = experienceKeywords.filter(kw => text.includes(kw));
  const experienceScore = expMatches.length >= 3 ? 10 : expMatches.length >= 1 ? 5 : 0;
  totalScore += experienceScore;
  breakdown.push({
    id: 'experience',
    check: 'Experience / Projects',
    score: experienceScore,
    maxScore: 10,
    detail: `${expMatches.length} experience keywords found`,
  });
  if (expMatches.length < 3) {
    suggestions.push({ id: 'add-experience', text: 'Add more details about your work experience or projects (developed, built, implemented).' });
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
    foundSkills: uniqueFoundSkills,
    spamDetected,
    wordCount,
  };
}

module.exports = { scoreATS };
