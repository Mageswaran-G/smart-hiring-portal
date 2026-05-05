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
    { returnDocument: 'after', runValidators: true }
  ).select('-password -refreshToken');

  if (!user) throw new AppError('User not found', 404);

  return user;
};

// UPLOAD RESUME
exports.uploadResume = async (userId, filePath) => {

  const user = await User.findByIdAndUpdate(
    userId,
    { resumeUrl: filePath },
    { new: true }
  ).select('-password -refreshToken');

  if (!user) throw new AppError('User not found', 404);

  return user;
};
