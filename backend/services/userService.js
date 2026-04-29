const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// GET ALL USERS
exports.getUsers = async () => {
  const users = await User.find();
  logger.info('Fetched all users');
  return users;
};

// GET USER BY ID
exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};