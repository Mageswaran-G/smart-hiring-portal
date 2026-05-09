const express = require('express');
const router  = express.Router();
const asyncHandler = require('../../utils/asyncHandler');
const User         = require('../../models/User');
const AppError     = require('../../utils/AppError');

router.get('/profile/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const user = await User.findOne({ profileSlug: slug.toLowerCase() })
    .select('-password -refreshToken');

  if (!user) {
    throw new AppError('Profile not found.', 404);
  }

  // If user has made profile private — do not show it publicly
  if (user.profileVisibility === 'private') {
    throw new AppError('This profile is not available.', 403);
  }

  // Only include photo if photoVisibility is public
  const photo = user.photoVisibility !== 'private' ? user.profilePhoto : null;

  // Only include contact info if contactVisibility is public
  const contactFields = user.contactVisibility !== 'private'
    ? { phone: user.phone, city: user.city, state: user.state, country: user.country }
    : {};

  const publicProfile = {
    // Always shown
    name:              user.name,
    headline:          user.headline,
    bio:               user.bio,
    role:              user.role,
    profileSlug:       user.profileSlug,
    profilePhoto:      photo,

    // Contact info — shown only if contactVisibility is public
    ...contactFields,

    // Career info — always shown
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

    // Company info — always shown
    companyName:       user.companyName,
    industry:          user.industry,
    companyWebsite:    user.companyWebsite,
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