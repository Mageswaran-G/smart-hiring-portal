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
exports.updateProfileSchema = z.object({

  // New fields to add inside updateProfileSchema
  headline:         z.string().trim().max(120).optional(),
  openToWork:       z.boolean().optional(),
  resumeVisibility: z.enum(['public', 'private']).optional(),
  profileSlug:      z.string().trim().max(50).optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),

  certifications: z.array(z.object({
    name:   z.string().trim().max(100).optional(),
    issuer: z.string().trim().max(100).optional(),
    year:   z.string().trim().max(10).optional(),
    url:    z.string().trim().max(200).optional(),
  })).optional(),

  languages: z.array(z.object({
    language:    z.string().trim().max(50).optional(),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native', '']).optional(),
  })).optional(),

  portfolioProjects: z.array(z.object({
    title:       z.string().trim().max(100).optional(),
    description: z.string().trim().max(500).optional(),
    url:         z.string().trim().max(200).optional(),
    tech:        z.string().trim().max(200).optional(),
  })).optional(),

  // Common fields
  name:        z.string().trim().min(3).max(100).optional(),
  bio:         z.string().trim().max(1000).optional(),
  phone:       z.string().regex(/^[0-9+\-() ]{7,15}$/, 'Enter a valid phone number').optional(),
  city:        z.string().trim().max(100).optional(),
  state:       z.string().trim().max(100).optional(),
  country:     z.string().trim().max(100).optional(),
  gender:      z.enum(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
  dateOfBirth: z.string().trim().max(20).optional(),

  // Social links
  linkedIn:  z.string().trim().max(200).optional(),
  github:    z.string().trim().max(200).optional(),
  portfolio: z.string().trim().max(200).optional(),

  // Candidate fields
  skills: z.array(z.string().trim().max(50)).max(20).optional(),

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

  // Work history
  workHistory: z.array(z.object({
    company:     z.string().trim().max(200).optional(),
    role:        z.string().trim().max(200).optional(),
    type:        z.enum(['full-time', 'part-time', 'internship', 'freelance', '']).optional(),
    startDate:   z.string().trim().max(20).optional(),
    endDate:     z.string().trim().max(20).optional(),
    current:     z.boolean().optional(),
    description: z.string().trim().max(500).optional(),
  })).optional(),

  // Career preferences
  jobType:            z.enum(['full-time', 'part-time', 'internship', 'any', '']).optional(),
  locationType:       z.enum(['remote', 'hybrid', 'onsite', 'any', '']).optional(),
  expectedSalary:     z.string().trim().max(50).optional(),
  noticePeriod:       z.string().trim().max(50).optional(),
  preferredLocations: z.array(z.string().trim().max(100)).optional(),

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

  // Photo visibility
  photoVisibility: z.enum(['public', 'private']).optional(),

}).strict();