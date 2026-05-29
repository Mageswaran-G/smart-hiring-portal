// Salary ranges by experience level (INR/year)
// Configurable — change here affects entire platform

const SALARY_RANGES = {
  fresher: { min: 300000,  max: 600000  },
  junior:  { min: 600000,  max: 1200000 },
  mid:     { min: 1200000, max: 2500000 },
  senior:  { min: 2500000, max: 5000000 },
};

// Premium multiplier for AI/ML and DevOps skills
const PREMIUM_SKILLS_MULTIPLIER = {
  min: 1.2,
  max: 1.3,
};

module.exports = { SALARY_RANGES, PREMIUM_SKILLS_MULTIPLIER };