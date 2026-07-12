// userService.js

const User     = require('../../models/User');
const AppError = require('../../utils/AppError');
const logger   = require('../../utils/logger');
const invalidateAICache = require('../../utils/invalidateAICache');

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
  // Common
  'name', 'bio', 'phone', 'city', 'state', 'country', 'gender', 'dateOfBirth',
  // Social
  'linkedIn', 'github', 'portfolio',
  // Candidate
  'skills', 'educationList', 'workHistory',
  'jobType', 'locationType', 'expectedSalary', 'noticePeriod', 'preferredLocations',
  // Company
  'companyName', 'companyWebsite', 'industry', 'companySize',
  'companyDescription', 'foundedYear', 'companyCity', 'companyState', 'companyCountry',
  'coverBanner', 'hiringStatus', 'companyCulture', 'employeeBenefits', 'companyTechStack',
  // Photo
  'photoVisibility',
    'contactVisibility',

  'headline', 'openToWork', 'resumeVisibility', 'profileSlug',
  'certifications', 'languages', 'portfolioProjects', 'profileVisibility',
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
    { returnDocument: "after", runValidators: true }
  ).select('-password -refreshToken');

  if (!user) throw new AppError('User not found', 404);

  invalidateAICache(userId);

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
    { returnDocument: "after" }
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

  invalidateAICache(userId);

  return { user: updatedUser, fullUrl };
};

// ── UPLOAD PROFILE PHOTO ──────────────────────────────
// Saves profile photo path to MongoDB
// Deletes old photo from disk if exists
exports.uploadCoverBanner = async (userId, filePath) => {
  const fs   = require('fs').promises;
  const path = require('path');

  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError('User not found', 404);

  const fileName  = path.basename(filePath);
  const publicUrl = `/uploads/profiles/${fileName}`;

  // Delete old banner if exists
  if (existingUser.coverBanner) {
    const oldFileName  = path.basename(existingUser.coverBanner);
    const allowedDir   = path.resolve('uploads/profiles');
    const resolvedPath = path.resolve(path.join('uploads', 'profiles', oldFileName));
    if (resolvedPath.startsWith(allowedDir)) {
      await fs.unlink(resolvedPath).catch(() => {});
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { coverBanner: publicUrl },
    { returnDocument: "after" }
  ).select('-password -refreshToken');

  invalidateAICache(userId);

  return { user, publicUrl };
};

exports.uploadProfilePhoto = async (userId, filePath) => {
  const fs   = require('fs').promises;
  const path = require('path');

  // Find existing user
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError('User not found', 404);

  // Build public URL for the new photo
  const fileName  = path.basename(filePath);
  const publicUrl = `/uploads/profiles/${fileName}`;

  // Delete old profile photo if exists
  if (existingUser.profilePhoto) {
    const oldFileName  = path.basename(existingUser.profilePhoto);
    const allowedDir   = path.resolve('uploads/profiles');
    const resolvedPath = path.resolve(path.join('uploads', 'profiles', oldFileName));

    // Path traversal protection
    if (resolvedPath.startsWith(allowedDir)) {
      await fs.unlink(resolvedPath).catch(() => {});
    }
  }

  // Save new photo URL to MongoDB
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePhoto: publicUrl },
    { returnDocument: "after" }
  ).select('-password -refreshToken');

  return { user, publicUrl };
};

exports.deleteResume = async (userId) => {
  const fs = require('fs').promises;
  const path = require('path');

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  if (user.resume?.url) {
    const fileName = path.basename(user.resume.url);
    const allowedDir = path.resolve('uploads/resumes');
    const filePath = path.resolve(path.join('uploads', 'resumes', fileName));

    if (filePath.startsWith(allowedDir)) {
      await fs.unlink(filePath).catch(() => {});
    }
  }

  user.resume = {
    url: '',
    originalName: '',
    size: 0,
    mimeType: '',
    uploadedAt: null
  };

  user.parsedResumeText = '';
  user.parsedSkills = [];
  user.lastResumeParsedAt = null;
  user.resumeParseConfidence = 'low';

  await user.save();

  try {
    invalidateAICache(userId);
  } catch (err) {
    logger.warn('Failed to invalidate AI cache:', err.message);
  }

  return user;
};

