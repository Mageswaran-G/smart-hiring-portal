const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const { hashToken, compareToken } = require('../../utils/hashToken');
const { generateAccessToken, generateRefreshToken } = require('../../utils/generateToken');
const logger = require('../../utils/logger');
const { createNotification } = require('../notificationService');

// SIGNUP SERVICE
exports.signup = async ({ name, email, password, role }) => {

  const allowedRoles = ['candidate', 'company'];
  const safeRole = allowedRoles.includes(role) ? role : 'candidate';

  // Check if a deleted account exists with same email
  // If yes — reuse it instead of creating duplicate
  const deletedUser = await User.findOne({ email, isDeleted: true });

  if (deletedUser) {
    // Reactivate the deleted account with new details
    deletedUser.name        = name;
    deletedUser.password    = password;
    deletedUser.role        = safeRole;
    deletedUser.isDeleted   = false;
    deletedUser.deletedAt   = null;
    deletedUser.isSuspended = false;
    deletedUser.refreshToken = null;
    await deletedUser.save();

    logger.info(`Deleted account reactivated: ${email} as ${safeRole}`);

    return {
      id:    deletedUser._id,
      name:  deletedUser.name,
      email: deletedUser.email,
      role:  deletedUser.role
    };
  }

  // Check if active account already exists
  const existingUser = await User.findOne({ 
    email, 
    isDeleted: { $ne: true }
  });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Create brand new account
  const user = await User.create({
    name, email, password, role: safeRole
  });

  logger.info(`New user registered: ${email} as ${safeRole}`);

  // Notify admins when a company or candidate registers
  if (safeRole === 'company' || safeRole === 'candidate') {

    const admins = await User.find({
      role: 'admin',
      isDeleted: { $ne: true }
    }).select('_id').lean();

    const notification = safeRole === 'company'
      ? {
          type: 'new_company',
          title: 'New Company Registered',
          message: `A new company "${name}" has registered on the platform.`,
          metadata: { companyEmail: email }
        }
      : {
          type: 'new_candidate',
          title: 'New Candidate Registered',
          message: `A new candidate "${name}" has joined the platform.`,
          metadata: { candidateEmail: email }
        };

    await Promise.all(
      admins.map(admin =>
        createNotification(
          admin._id,
          notification.type,
          notification.title,
          notification.message,
          notification.metadata
        )
      )
    );
  }

  return {
    id:    user._id,
    name:  user.name,
    email: user.email,
    role:  user.role
  };
};

// LOGIN SERVICE
exports.login = async ({ email, password }) => {

  const user = await User.findOne({ 
    email,
    isDeleted: { $ne: true }
  });
  if (!user) {
    logger.warn(`Failed login attempt for: ${email}`);
    throw new AppError('Invalid credentials', 401);
  }

  // Block suspended accounts from logging in
  if (user.isSuspended) {
    throw new AppError('Your account has been suspended. Please contact support.', 403);
  }

  

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    logger.warn(`Wrong password for: ${email}`);
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
    email: user.email
  });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = await hashToken(refreshToken);
  await user.save();

  logger.info(`User logged in: ${email}`);

  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: '15m',
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// REFRESH TOKEN SERVICE
exports.refresh = async ({ refreshToken }) => {

  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Find user — only ONE const user declaration!
  const user = await User.findOne({
    _id: decoded.id,
    isDeleted: { $ne: true }
  });

  // Check user exists BEFORE touching user.refreshToken
  if (!user) {
    throw new AppError('Session expired. Please login again', 401);
  }

  

  // Now safe to check refreshToken
  if (!user.refreshToken) {
    throw new AppError('Session expired. Please login again', 401);
  }

  const isValid = await compareToken(refreshToken, user.refreshToken);

  if (!isValid) {
    user.refreshToken = null;
    await user.save();
    throw new AppError('Invalid refresh token', 401);
  }

  const newAccessToken = generateAccessToken({
    id: user._id,
    role: user.role,
    email: user.email
  });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = await hashToken(newRefreshToken);
  await user.save();

  logger.info(`Token refreshed for user: ${user.email}`);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// LOGOUT SERVICE
exports.logout = async (userId) => {
  const user = await User.findOne({ 
    _id: userId, 
    isDeleted: { $ne: true } 
  });
  if (user) {
    user.refreshToken = null;
    await user.save();
    logger.info(`User logged out: ${user.email}`);
  }
  return { message: 'Logged out successfully' };
};