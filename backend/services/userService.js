// userService.js
// Purpose: Business logic for user operations
// All database queries for users live here

const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// GET ALL USERS
// Hides password and refreshToken from response
exports.getUsers = async () => {
  const users = await User.find()
    .select('-password -refreshToken');
  logger.info('Fetched all users');
  return users;
};

// GET profile — returns full user profile
// Hides password and refreshToken always
exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    '-password -refreshToken'
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// UPDATE profile — whitelist approach
// Only allowed fields can be updated
exports.updateProfile = async (userId, updateData) => {

  const allowedFields = [
    'bio', 'location', 'phone',
    'skills', 'education', 'experience',
    'companyName', 'companyWebsite', 'industry'
  ];

  for (const key of Object.keys(updateData)) {
  if (allowedFields.includes(key)) {
    filteredData[key] = updateData[key];
  }
}

  // Reject empty payload — nothing to update
  if (Object.keys(filteredData).length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};