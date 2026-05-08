// Calculates how complete a profile is
// Returns a number from 0 to 100

export function calculateCompletion(profile, isCandidate) {
  if (!profile) return 0;

  // Each field has a weight (how important it is)
  // All weights add up to 100
  const candidateFields = [
    { key: 'name',           weight: 10 },
    { key: 'bio',            weight: 10 },
    { key: 'phone',          weight: 5  },
    { key: 'city',           weight: 5  },
    { key: 'profilePhoto',   weight: 10 },
    { key: 'skills',         weight: 10, isArray: true },
    { key: 'educationList',  weight: 10, isArray: true },
    { key: 'workHistory',    weight: 10, isArray: true },
    { key: 'jobType',        weight: 5  },
    { key: 'expectedSalary', weight: 5  },
    { key: 'linkedIn',       weight: 5  },
    { key: 'resume',         weight: 15, isResume: true },
  ];

  const companyFields = [
    { key: 'name',               weight: 10 },
    { key: 'bio',                weight: 10 },
    { key: 'phone',              weight: 5  },
    { key: 'profilePhoto',       weight: 10 },
    { key: 'companyName',        weight: 15 },
    { key: 'companyWebsite',     weight: 10 },
    { key: 'industry',           weight: 10 },
    { key: 'companySize',        weight: 10 },
    { key: 'companyDescription', weight: 10 },
    { key: 'linkedIn',           weight: 5  },
    { key: 'companyCity',        weight: 5  },
  ];

  const fields = isCandidate ? candidateFields : companyFields;
  let total = 0;

  fields.forEach(({ key, weight, isArray, isResume }) => {
    if (isResume) {
      // Resume is complete only if URL exists
      if (profile.resume?.url) total += weight;
    } else if (isArray) {
      // Array is complete if it has at least one entry
      if (Array.isArray(profile[key]) && profile[key].length > 0) total += weight;
    } else {
      // Normal field — complete if not empty
      if (profile[key] && profile[key].toString().trim() !== '') total += weight;
    }
  });

  return Math.min(100, total); // max 100
}