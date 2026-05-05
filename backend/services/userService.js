// userService.js
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// GET ALL USERS
exports.getUsers = async () => {
  const users = await User.find().select('-password -refreshToken');
  logger.info('Fetched all users');
  return users;
};

// GET PROFILE BY ID
exports.getProfile = async (userId) => {
  const user = await User.findById(userId)
    .select('-password -refreshToken');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// UPDATE PROFILE
exports.updateProfile = async (userId, updateData) => {

  // Only these fields allowed to update
  const allowedFields = [
    'bio', 'location', 'phone',
    'skills', 'education', 'experience',
    'companyName', 'companyWebsite', 'industry'
  ];

  // Build safe object — only allowed fields
  const filteredData = {};
  for (const key of Object.keys(updateData)) {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  }

  // Reject empty payload
  if (Object.keys(filteredData).length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) throw new AppError('User not found', 404);

  return user;
};

// UPLOAD RESUME
exports.uploadResume = async (userId, filePath) => {
  const fs   = require('fs').promises;  // async version — no event loop blocking
  const path = require('path');

  // Find existing user
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError('User not found', 404);

  // Delete old resume if exists
  if (existingUser.resumeUrl) {
    const fileName = path.basename(existingUser.resumeUrl);

    // PATH TRAVERSAL PROTECTION
    // Prevents: ../../../../etc/passwd type attacks
    const allowedDir      = path.resolve('uploads/resumes');
    const resolvedPath    = path.resolve(path.join('uploads', 'resumes', fileName));

    // If resolved path tries to go outside uploads/resumes → block it
    if (!resolvedPath.startsWith(allowedDir)) {
      throw new AppError('Invalid file path', 400);
    }

    // Delete old file safely (async — non-blocking)
    await fs.unlink(resolvedPath).catch(() => {});
    // .catch(() => {}) means: if file already missing, ignore error
  }

  // Store as public URL path
  const fileName  = path.basename(filePath);
  const publicUrl = `/uploads/resumes/${fileName}`;

  // Full URL for frontend to use directly
  const fullUrl = `${process.env.BASE_URL || 'http://localhost:8000'}${publicUrl}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { resumeUrl: publicUrl },     // store short URL in DB
    { new: true }
  ).select('-password -refreshToken');

  // Return full URL in response so frontend can use it directly
  return { user, fullUrl };
};
