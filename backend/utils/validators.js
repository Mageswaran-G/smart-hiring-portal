const { z } = require('zod');

// Signup validation
exports.signupSchema = z.object({
  name:     z.string().min(3, 'Name must be at least 3 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role:     z.enum(['candidate', 'company']).optional()
}).strict();

// Login validation
exports.loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
}).strict();

// Profile update validation
// NOTE: .strict() rejects any field not listed here
exports.updateProfileSchema = z.object({

  // Profile header fields
  name:             z.string().trim().min(1).max(100).optional(),
  bio:              z.string().trim().max(1000).optional(),
  headline:         z.string().trim().max(120).optional(),
  openToWork:       z.boolean().optional(),

  // Visibility controls
  profileVisibility: z.enum(['public', 'private']).optional(),
  photoVisibility:   z.enum(['public', 'private']).optional(),
  resumeVisibility:  z.enum(['public', 'private']).optional(),
  contactVisibility: z.enum(['public', 'private']).optional(),

  // Public profile slug
  profileSlug: z.string().trim().max(50).optional(),

  // Contact info
  phone:   z.string().regex(/^[0-9+\-() ]{7,15}$/, 'Enter a valid phone number').optional(),
  city:    z.string().trim().max(100).optional(),
  state:   z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),

  // Personal details
  gender:      z.enum(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
  dateOfBirth: z.string().trim().max(20).optional(),

  // Social links
  linkedIn:  z.string().trim().max(200).optional(),
  github:    z.string().trim().max(200).optional(),
  portfolio: z.string().trim().max(200).optional(),

  // Skills — accepts both plain strings and objects with name + proficiency
  skills: z.array(
    z.union([
      z.string().trim().max(50),
      z.object({
        name:        z.string().trim().max(50),
        proficiency: z.string().trim().max(20).optional(),
      })
    ])
  ).max(20).optional(),

  // Education list
  educationList: z.array(z.object({
    degree:      z.string().trim().max(100).optional(),
    field:       z.string().trim().max(100).optional(),
    institution: z.string().trim().max(200).optional(),
    startYear:   z.string().trim().max(10).optional(),
    endYear:     z.string().trim().max(10).optional(),
    grade:       z.string().trim().max(50).optional(),
    current:     z.boolean().optional(),
  })).optional(),

  // Work history — uses month + year dropdowns
  workHistory: z.array(z.object({
    company:     z.string().trim().max(200).optional(),
    role:        z.string().trim().max(200).optional(),
    type:        z.enum(['full-time', 'part-time', 'internship', 'freelance', '']).optional(),
    startMonth:  z.string().trim().max(5).optional(),
    startYear:   z.string().trim().max(5).optional(),
    endMonth:    z.string().trim().max(5).optional(),
    endYear:     z.string().trim().max(5).optional(),
    startDate:   z.string().trim().max(20).optional(),
    endDate:     z.string().trim().max(20).optional(),
    current:     z.boolean().optional(),
    description: z.string().trim().max(500).optional(),
  })).optional(),

  // Certifications
  certifications: z.array(z.object({
    name:   z.string().trim().max(100).optional(),
    issuer: z.string().trim().max(100).optional(),
    year:   z.string().trim().max(10).optional(),
    url:    z.string().trim().max(200).optional(),
  })).optional(),

  // Languages
  languages: z.array(z.object({
    language:    z.string().trim().max(50).optional(),
    proficiency: z.string().trim().max(20).optional(),
  })).optional(),

  // Portfolio projects
  portfolioProjects: z.array(z.object({
    title:       z.string().trim().max(100).optional(),
    description: z.string().trim().max(500).optional(),
    url:         z.string().trim().max(200).optional(),
    tech:        z.string().trim().max(200).optional(),
  })).optional(),

  // Resumes array — up to 5 resumes with labels
  resumes: z.array(z.object({
    url:          z.string().optional(),
    originalName: z.string().optional(),
    size:         z.number().optional(),
    mimeType:     z.string().optional(),
    uploadedAt:   z.string().optional(),
    label:        z.string().max(100).optional(),
    isDefault:    z.boolean().optional(),
  })).max(5).optional(),

  // Career preferences
  jobType:            z.enum(['full-time', 'part-time', 'internship', 'any', '']).optional(),
  locationType:       z.enum(['remote', 'hybrid', 'onsite', 'any', '']).optional(),
  expectedSalary:     z.string().trim().max(50).optional(),
  noticePeriod:       z.string().trim().max(50).optional(),
  preferredLocations: z.array(z.string().trim().max(100)).optional(),

  // Company extended fields
  coverBanner:      z.string().optional(),
  hiringStatus:     z.boolean().optional(),
  companyCulture:   z.string().trim().max(3000).optional(),
  employeeBenefits: z.array(z.string().trim().max(100)).optional(),
  companyTechStack: z.array(z.string().trim().max(50)).optional(),

  // Company fields
  companyName:        z.string().trim().max(100).optional(),
  companyWebsite:     z.string().max(200).refine(v => !v || v.startsWith('http'), 'Must start with http').optional(),
  industry:           z.string().trim().max(100).optional(),
  companySize:        z.string().trim().max(50).optional(),
  companyDescription: z.string().trim().max(1000).optional(),
  foundedYear:        z.string().trim().max(10).optional(),
  companyCity:        z.string().trim().max(100).optional(),
  companyState:       z.string().trim().max(100).optional(),
  companyCountry:     z.string().trim().max(100).optional(),

}).strict();