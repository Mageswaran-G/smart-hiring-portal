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

  bio:      z.string().trim().max(500, 'Bio max 500 characters').optional(),
  location: z.string().trim().max(100, 'Location max 100 characters').optional(),

  // Phone: only numbers, +, -, spaces, brackets allowed
  phone: z.string().trim()
    .regex(/^[0-9+\-() ]{7,15}$/, 'Enter a valid phone number')
    .optional(),

  // Skills: each skill trimmed, max 50 chars, max 20 skills
  skills: z.array(
    z.string().trim().max(50, 'Each skill max 50 characters')
  ).max(20, 'Maximum 20 skills allowed').optional(),

  education:   z.string().trim().max(200).optional(),
  experience:  z.string().trim().max(200).optional(),
  companyName: z.string().trim().max(100).optional(),

  // Website: max BEFORE refine (Zod v3 rule!)
  companyWebsite: z.string().trim().max(200)
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'Website must start with http:// or https://' }
    ).optional(),

  industry: z.string().trim().max(100).optional(),

}).strict();