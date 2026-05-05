// userController.js
// Purpose: Handle HTTP requests for user routes
// Thin layer — only req/res handling
// All logic is in userService.js

const userService            = require('../../services/v1/userService');
const ApiResponse            = require('../../utils/ApiResponse');
const AppError               = require('../../utils/AppError');
const { validateFileSignature } = require('../../middleware/uploadMiddleware');


// GET all users
// Route: GET /api/v1/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(
      new ApiResponse(true, 'Users fetched successfully', users)
    );
  } catch (err) {
    next(err);
  }
};

// GET my profile
// Route: GET /api/v1/users/profile
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json(
      new ApiResponse(true, 'Profile fetched successfully', user)
    );
  } catch (err) {
    next(err);
  }
};

// UPDATE my profile
// Route: PUT /api/v1/users/profile
exports.updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json(
      new ApiResponse(true, 'Profile updated successfully', user)
    );
  } catch (err) {
    next(err);
  }
};

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    // SIGNATURE CHECK — verify actual file content
    const isValidFile = validateFileSignature(req.file.path, req.file.mimetype);
    if (!isValidFile) {
      // Delete the fake file immediately
      const fs = require('fs').promises;
      await fs.unlink(req.file.path).catch(() => {});
      return next(new AppError('Invalid file content. File may be corrupted or unsafe.', 400));
    }

    const { user, fullUrl } = await userService.uploadResume(req.user.id, req.file);

    res.status(200).json(
      new ApiResponse(true, 'Resume uploaded successfully', {
        resume: {
          url:          fullUrl,
          originalName: req.file.originalname,
          size:         req.file.size,
          mimeType:     req.file.mimetype,
          uploadedAt:   new Date()
        }
      })
    );
  } catch (err) {
    next(err);
  }
};