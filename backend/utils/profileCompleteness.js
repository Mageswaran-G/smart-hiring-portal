// Backend profile completeness scoring
// Mirrors frontend profileStrength.js logic

const PROFILE_CHECKS = [
  { key: 'photo',       points: 10, check: u => !!(u.photo || u.profilePhoto) },
  { key: 'headline',    points: 10, check: u => !!u.headline },
  { key: 'bio',         points: 10, check: u => !!u.bio },
  { key: 'skills',      points: 15, check: u => (u.skills?.length || 0) >= 3 },
  { key: 'resume',      points: 20, check: u => !!(u.resume?.url || u.resumeUrl) },
  { key: 'education',   points: 10, check: u => (u.educationList?.length || u.education?.length || 0) > 0 },
  { key: 'workHistory', points: 10, check: u => (u.workHistory?.length || 0) > 0 },
  { key: 'parsedSkills',points: 10, check: u => (u.parsedSkills?.length || 0) > 0 },
  { key: 'phone',       points: 5,  check: u => !!u.phone },
];

const MAX_POINTS = PROFILE_CHECKS.reduce((sum, c) => sum + c.points, 0);

function calcProfileCompleteness(user) {
  if (!user) return 0;
  const earned = PROFILE_CHECKS.reduce(
    (sum, c) => sum + (c.check(user) ? c.points : 0), 0
  );
  return Math.round((earned / MAX_POINTS) * 100);
}

module.exports = { calcProfileCompleteness, MAX_POINTS };