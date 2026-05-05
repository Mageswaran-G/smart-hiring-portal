const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const { hashToken, compareToken } = require('../../utils/hashToken');
const { generateAccessToken, generateRefreshToken } = require('../../utils/generateToken');
const logger = require('../../utils/logger');

// SIGNUP SERVICE
exports.signup = async ({ name, email, password, role }) => {

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const allowedRoles = ['candidate', 'company'];
  const safeRole = allowedRoles.includes(role) ? role : 'candidate';

  const user = await User.create({
    name, email, password, role: safeRole
  });

  logger.info(`New user registered: ${email} as ${safeRole}`);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

// LOGIN SERVICE
exports.login = async ({ email, password }) => {

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Failed login attempt for: ${email}`);
    throw new AppError('Invalid credentials', 401);
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
  const user = await User.findById(decoded.id);

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
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
    logger.info(`User logged out: ${user.email}`);
  }
  return { message: 'Logged out successfully' };
};