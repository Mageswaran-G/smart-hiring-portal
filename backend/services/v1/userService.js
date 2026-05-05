// userService.js

const User     = require('../../models/User');
const AppError = require('../../utils/AppError');
const logger   = require('../../utils/logger');

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

exports.uploadResume = async (userId, file) => {
  const fs   = require('fs').promises;
  const path = require('path');

  // Step 1 — Find user
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError('User not found', 404);

  // Step 2 — Upload new file first (already done by Multer)
  const fileName  = path.basename(file.path);
  const publicUrl = `/uploads/resumes/${fileName}`;
  const fullUrl   = `${process.env.BASE_URL || 'http://localhost:8000'}${publicUrl}`;

  // Step 3 — Update DB with full metadata
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      resume: {
        url:          publicUrl,
        originalName: file.originalname,
        size:         file.size,
        mimeType:     file.mimetype,
        uploadedAt:   new Date()
      }
    },
    { new: true }
  ).select('-password -refreshToken');

  // Step 4 — ONLY delete old file AFTER DB update succeeds
  if (existingUser.resume?.url) {
    const oldFileName    = path.basename(existingUser.resume.url);
    const allowedDir     = path.resolve('uploads/resumes');
    const resolvedPath   = path.resolve(path.join('uploads', 'resumes', oldFileName));

    if (resolvedPath.startsWith(allowedDir)) {
      await fs.unlink(resolvedPath).catch(() => {});
    }
  }

  return { user: updatedUser, fullUrl };
};