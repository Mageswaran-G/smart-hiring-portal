
// Shared profile strength calculation — used in dashboard and ProfileStrengthCard

export const PROFILE_CHECKS = [
  { key: 'photo',       label: 'Profile photo',      points: 10, check: p => !!p?.photo },
  { key: 'headline',    label: 'Headline',            points: 10, check: p => !!p?.headline },
  { key: 'bio',         label: 'Bio / About',         points: 10, check: p => !!p?.bio },
  { key: 'skills',      label: 'At least 3 skills',   points: 15, check: p => (p?.skills?.length || 0) >= 3 },
  { key: 'resume',      label: 'Resume uploaded',     points: 20, check: p => !!p?.resumeUrl },
  { key: 'education',   label: 'Education added',     points: 10, check: p => (p?.education?.length || 0) > 0 },
  { key: 'workHistory', label: 'Work history added',  points: 10, check: p => (p?.workHistory?.length || 0) > 0 },
  { key: 'linkedin',    label: 'LinkedIn linked',     points: 10, check: p => !!p?.linkedin },
  { key: 'github',      label: 'GitHub profile',      points: 10, check: p => !!p?.github },
  { key: 'phone',       label: 'Phone number',        points: 5,  check: p => !!p?.phone },
];

export const calcProfileStrength = (profile) => {
  if (!profile) return 0;
  const total = PROFILE_CHECKS.reduce(
    (sum, c) => sum + (c.check(profile) ? c.points : 0), 0
  );
  const maxPoints = PROFILE_CHECKS.reduce(
    (sum, c) => sum + c.points, 0
  );
  return Math.round((total / maxPoints) * 100);
};