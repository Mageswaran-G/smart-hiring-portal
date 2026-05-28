// Centralized candidate skill extraction
// Used in matching, ranking, recommendations, ATS

function extractCandidateSkills(user) {
  if (!user) return [];
  if (user.parsedSkills?.length) return user.parsedSkills;
  return (user.skills || [])
    .map(s => typeof s === 'string' ? s : s?.name)
    .filter(Boolean);
}

module.exports = extractCandidateSkills;