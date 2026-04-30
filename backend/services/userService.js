const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

exports.getUsers = async () => {
  // Select only safe fields — hide password and refreshToken
  const users = await User.find()
    .select('-password -refreshToken');
  logger.info('Fetched all users');
  return users;
};

exports.getUserById = async (id) => {
  // Select only safe fields
  const user = await User.findById(id)
    .select('-password -refreshToken');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

// GET USER BY ID
exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};