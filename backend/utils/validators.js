const { z } = require('zod');

// Signup validation
exports.signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['candidate', 'company']).optional()
}).strict();

// Login validation
exports.loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
}).strict();

exports.updateProfileSchema = z.object({
  // .trim() removes spaces before/after text
  bio:            z.string().trim().max(500).optional(),
  location:       z.string().trim().max(100).optional(),
  phone:          z.string().trim().max(15).optional(),

  // Each skill max 50 chars, max 20 skills total
  skills:         z.array(z.string().max(50)).max(20).optional(),

  education:      z.string().trim().max(200).optional(),
  experience:     z.string().trim().max(200).optional(),

  companyName:    z.string().trim().max(100).optional(),
  // .url() checks it is a valid website address
  companyWebsite: z.string().url().max(200).optional(),
  industry:       z.string().trim().max(100).optional(),
}).strict();