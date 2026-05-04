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

// Profile update validation
exports.updateProfileSchema = z.object({
  bio:            z.string().max(500).optional(),
  location:       z.string().max(100).optional(),
  phone:          z.string().max(15).optional(),
  // Max 20 skills, each skill max 50 characters
  skills: z.array(z.string().max(50)).max(20).optional(),
  education:      z.string().max(200).optional(),
  experience:     z.string().max(200).optional(),
  companyName:    z.string().max(100).optional(),
  companyWebsite: z.string().max(200).optional(),
  industry:       z.string().max(100).optional(),
}).strict();