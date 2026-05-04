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

// GET USER BY ID
// Used by profile route — hides sensitive fields
exports.getUserById = async (id) => {
  const user = await User.findById(id)
    .select('-password -refreshToken');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
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

// UPDATE profile — saves new profile fields
// allowedFields = whitelist of safe fields only
// Prevents user from updating password/role/refreshToken
exports.updateProfile = async (userId, updateData) => {

  // Only these fields are allowed to be updated
  const allowedFields = [
    'bio', 'location', 'phone',
    'skills', 'education', 'experience',
    'companyName', 'companyWebsite', 'industry'
  ];

  // Filter out any field NOT in allowedFields
  // Even if hacker sends { role: 'admin' } → ignored!
  const filteredData = {};
  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });
  const filteredData = {};
  Object.keys(updateData).forEach((key) => {
  if (allowedFields.includes(key)) {
    filteredData[key] = updateData[key];
  }
});

  // ADD THIS — reject empty payload
  if (Object.keys(filteredData).length === 0) {
  throw new AppError('No valid fields to update', 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    filteredData,    // only safe filtered fields
    {
      new: true,           // return updated user
      runValidators: true, // check mongoose rules
    }
  ).select('-password -refreshToken');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};