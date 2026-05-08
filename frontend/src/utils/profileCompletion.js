// Config-driven profile completion calculator
// Each field has a type — text, array, or file
// Adding new field type = just add a new case in checkField()
// No if/else chains anywhere

// Supported types:
// 'text'  = normal string field — complete if not empty
// 'array' = array field — complete if has at least one item
// 'file'  = nested object field — complete if url exists inside

const CANDIDATE_FIELDS = [
  { key: 'name',              weight: 8,  type: 'text'  },
  { key: 'headline',          weight: 7,  type: 'text'  },
  { key: 'bio',               weight: 8,  type: 'text'  },
  { key: 'phone',             weight: 5,  type: 'text'  },
  { key: 'city',              weight: 5,  type: 'text'  },
  { key: 'profilePhoto',      weight: 8,  type: 'text'  },
  { key: 'skills',            weight: 8,  type: 'array' },
  { key: 'educationList',     weight: 10, type: 'array' },
  { key: 'workHistory',       weight: 10, type: 'array' },
  { key: 'certifications',    weight: 7,  type: 'array' },
  { key: 'languages',         weight: 5,  type: 'array' },
  { key: 'portfolioProjects', weight: 7,  type: 'array' },
  { key: 'jobType',           weight: 5,  type: 'text'  },
  { key: 'expectedSalary',    weight: 5,  type: 'text'  },
  { key: 'linkedIn',          weight: 4,  type: 'text'  },
  { key: 'resume',            weight: 8,  type: 'file'  },
];

const COMPANY_FIELDS = [
  { key: 'name',               weight: 10, type: 'text'  },
  { key: 'headline',           weight: 8,  type: 'text'  },
  { key: 'bio',                weight: 10, type: 'text'  },
  { key: 'phone',              weight: 5,  type: 'text'  },
  { key: 'profilePhoto',       weight: 10, type: 'text'  },
  { key: 'companyName',        weight: 15, type: 'text'  },
  { key: 'companyWebsite',     weight: 10, type: 'text'  },
  { key: 'industry',           weight: 10, type: 'text'  },
  { key: 'companySize',        weight: 8,  type: 'text'  },
  { key: 'companyDescription', weight: 9,  type: 'text'  },
  { key: 'linkedIn',           weight: 5,  type: 'text'  },
];

// Checks if a single field is complete based on its type
// Clean switch — easy to add new types later
function checkField(profile, key, type) {
  switch (type) {
    case 'text':
      // Complete if field exists and is not empty string
      return !!(profile[key] && profile[key].toString().trim() !== '');

    case 'array':
      // Complete if array exists and has at least one item
      return Array.isArray(profile[key]) && profile[key].length > 0;

    case 'file':
      // Complete if nested url field exists
      // Example: resume.url
      return !!(profile[key]?.url);

    default:
      return false;
  }
}

// Main function — calculates total completion percentage
export function calculateCompletion(profile, isCandidate) {
  if (!profile) return 0;

  const fields = isCandidate ? CANDIDATE_FIELDS : COMPANY_FIELDS;

  const total = fields.reduce((sum, { key, weight, type }) => {
    // checkField returns true or false
    // true  = field is complete = add its weight
    // false = field is empty   = add 0
    return sum + (checkField(profile, key, type) ? weight : 0);
  }, 0);

  // Cap at 100 in case weights add up slightly over
  return Math.min(100, total);
}