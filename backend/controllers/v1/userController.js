// userController.js
// Purpose: Handle HTTP requests for user routes
// Thin layer — only req/res handling
// All logic is in userService.js

const userService            = require('../../services/v1/userService');
const ApiResponse            = require('../../utils/ApiResponse');
const AppError               = require('../../utils/AppError');
const { validateFileSignature } = require('../../middleware/uploadMiddleware');
// asyncHandler — removes need for try/catch in every function
const asyncHandler = require('../../utils/asyncHandler');


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

// GET profile — no more try/catch needed!
exports.getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(true, 'Profile fetched', user));
});

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

// ── UPLOAD PROFILE PHOTO ──────────────────────────────
// Route: POST /api/v1/users/upload-photo
exports.uploadCoverBanner = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload an image', 400));

    const isValid = validateFileSignature(req.file.path, req.file.mimetype);
    if (!isValid) {
      const fs = require("fs").promises;
      await fs.unlink(req.file.path).catch(() => {});
      return next(new AppError('Invalid image file', 400));
    }

    const { user, publicUrl } = await userService.uploadCoverBanner(req.user.id, req.file.path);
    const fullUrl = `${process.env.BASE_URL || "http://localhost:8000"}${publicUrl}`;

    res.status(200).json(
      new ApiResponse(true, "Cover banner updated successfully", { bannerUrl: fullUrl })
    );
  } catch (err) {
    next(err);
  }
};

exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    // Check file was sent
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    // Verify file signature (anti-spoof check)
    const isValid = validateFileSignature(req.file.path, req.file.mimetype);
    if (!isValid) {
      const fs = require('fs').promises;
      await fs.unlink(req.file.path).catch(() => {});
      return next(new AppError('Invalid image file', 400));
    }

    // Save to DB and get public URL
    const { user, publicUrl } = await userService.uploadProfilePhoto(
      req.user.id,
      req.file.path
    );

    // Return full URL for frontend to display
    const fullUrl = `${process.env.BASE_URL || 'http://localhost:8000'}${publicUrl}`;

    res.status(200).json(
      new ApiResponse(true, 'Profile photo updated successfully', {
        photoUrl: fullUrl
      })
    );
  } catch (err) {
    next(err);
  }
};