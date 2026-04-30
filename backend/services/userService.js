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