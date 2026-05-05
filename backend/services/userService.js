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

exports.uploadResume = async (userId, filePath) => {
  const fs   = require('fs');
  const path = require('path');

  // Find existing user
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError('User not found', 404);

  // Delete old resume file if exists
  if (existingUser.resumeUrl) {
    // Extract just the filename from URL like /uploads/resumes/file.pdf
    const fileName = path.basename(existingUser.resumeUrl);
    const fullPath = path.join('uploads', 'resumes', fileName);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);  // delete old file from disk
    }
  }

  // Store as public URL — not filesystem path
  // Example: /uploads/resumes/resume-userId-timestamp.pdf
  const fileName  = path.basename(filePath);
  const publicUrl = `/uploads/resumes/${fileName}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { resumeUrl: publicUrl },
    { new: true }
  ).select('-password -refreshToken');

  return user;
};
