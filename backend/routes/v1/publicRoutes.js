const express = require('express');
const router  = express.Router();
const asyncHandler = require('../../utils/asyncHandler');
const User         = require('../../models/User');
const AppError     = require('../../utils/AppError');

// GET /api/v1/public/profile/:slug
// Public route — no auth required
// Returns only safe public fields
router.get('/profile/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const user = await User.findOne({ profileSlug: slug.toLowerCase() })
    .select('-password -refreshToken -resumeVisibility -photoVisibility -openToWork');

  if (!user) {
    throw new AppError('Profile not found.', 404);
  }

  // Only return public fields — never return sensitive data
  const publicProfile = {
    name:              user.name,
    headline:          user.headline,
    bio:               user.bio,
    profilePhoto:      user.profilePhoto,
    role:              user.role,
    city:              user.city,
    state:             user.state,
    country:           user.country,
    skills:            user.skills,
    educationList:     user.educationList,
    workHistory:       user.workHistory,
    certifications:    user.certifications,
    languages:         user.languages,
    portfolioProjects: user.portfolioProjects,
    linkedIn:          user.linkedIn,
    github:            user.github,
    portfolio:         user.portfolio,
    jobType:           user.jobType,
    locationType:      user.locationType,
    companyName:       user.companyName,
    industry:          user.industry,
    companyWebsite:    user.companyWebsite,
    profileSlug:       user.profileSlug,
  };

  res.status(200).json({
    success: true,
    message: 'Public profile fetched successfully.',
    data:    publicProfile,
  });
}));

// GET /api/v1/public/check-slug/:slug
// Check if a slug is available before user sets it
router.get('/check-slug/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const existing = await User.findOne({ profileSlug: slug.toLowerCase() });

  res.status(200).json({
    success:   true,
    available: !existing,
    message:   existing ? 'This URL is already taken.' : 'This URL is available.',
  });
}));

module.exports = router;
