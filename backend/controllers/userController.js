// userController.js
// Purpose: Handle HTTP requests for user routes
// Thin layer — only req/res handling
// All logic is in userService.js

const userService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

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

// UPLOAD RESUME
// Route: POST /api/v1/users/upload-resume
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    const user = await userService.uploadResume(req.user.id, req.file.path);

    res.status(200).json(
      new ApiResponse(true, 'Resume uploaded successfully', {
        resumeUrl: user.resumeUrl
      })
    );
  } catch (err) {
    next(err);
  }
};