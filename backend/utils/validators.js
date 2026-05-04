exports.updateProfileSchema = z.object({

  // Common fields — both candidate and company
  // .trim() removes spaces before and after
  bio: z.string()
    .trim()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),

  location: z.string()
    .trim()
    .max(100, 'Location cannot exceed 100 characters')
    .optional(),

  // Our unique phone validation
  // Allows: +91 9876543210, 9876543210, +1-800-555-0199
  phone: z.string()
    .trim()
    .regex(
      /^[0-9+\-() ]{7,15}$/,
      'Enter a valid phone number (7-15 digits, + and - allowed)'
    )
    .optional(),

  // Candidate only fields
  // .trim() on each skill removes "  React  " → "React"
  skills: z.array(
    z.string().trim().max(50, 'Each skill max 50 characters')
  ).max(20, 'Maximum 20 skills allowed').optional(),

  education: z.string()
    .trim()
    .max(200, 'Education cannot exceed 200 characters')
    .optional(),

  experience: z.string()
    .trim()
    .max(200, 'Experience cannot exceed 200 characters')
    .optional(),

  // Company only fields
  companyName: z.string()
    .trim()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional(),

  // Our unique website validation
  // Must start with http:// or https://
  companyWebsite: z.string()
    .trim()
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'Website must start with http:// or https://' }
    )
    .max(200, 'Website URL cannot exceed 200 characters')
    .optional(),

  industry: z.string()
    .trim()
    .max(100, 'Industry cannot exceed 100 characters')
    .optional(),

}).strict();