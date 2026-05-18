// adminController
const User        = require('../../models/User');
const Job         = require('../../models/Job');
const Application = require('../../models/Application');
const AppError    = require('../../utils/AppError');


// ─────────────────────────────────────────────────────
// GET /api/v1/admin/stats
// Platform-wide analytics for admin dashboard
// ─────────────────────────────────────────────────────
exports.getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalJobs,
      totalApplications,
      recentUsers,
      appStatusCounts,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'candidate', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'company',   isDeleted: { $ne: true } }),
      Job.countDocuments({ isDeleted: { $ne: true }, status: 'published', isActive: true }),
      Application.countDocuments(),

      // Recent 5 signups
      User.find({ isDeleted: { $ne: true } })
        .select('name email role createdAt isVerified')
        .sort({ createdAt: -1 })
        .limit(5),

      // Application status breakdown
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const statusMap = {};
    appStatusCounts.forEach(s => { statusMap[s._id] = s.count; });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCandidates,
        totalCompanies,
        totalJobs,
        totalApplications,
        hired:       statusMap.hired       || 0,
        shortlisted: statusMap.shortlisted || 0,
        reviewing:   statusMap.reviewing   || 0,
        recentUsers,
      }
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────
// GET /api/v1/admin/companies
// Get all company accounts for admin to manage
// ─────────────────────────────────────────────────────
exports.getAllCompanies = async (req, res, next) => {
  try {
    // Find all users whose role is 'company'
    // Select only the fields admin needs to see
    const companies = await User.find({
      role:      'company',
      isDeleted: { $ne: true },
    })
      .select('name email companyName industry companySize isVerified createdAt profilePhoto')
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      data:    companies,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────
// PATCH /api/v1/admin/companies/:id/verify
// Toggle isVerified for a company — true becomes false, false becomes true
//
// Simple explanation:
//   Admin sees company in list → clicks Verify button
//   This function runs → finds that company in DB
//   Flips isVerified (like a light switch)
//   Returns updated company so frontend can update UI instantly
// ─────────────────────────────────────────────────────
exports.verifyCompany = async (req, res, next) => {
  try {
    const { id } = req.params; // company user ID from URL

    // Step 1 — find the user
    const company = await User.findById(id).select('name email companyName isVerified role');

    // Step 2 — check user exists
    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    // Step 3 — only companies can be verified
    // Candidate accounts should never be verified this way
    if (company.role !== 'company') {
      return next(new AppError('Only company accounts can be verified', 400));
    }

    // Step 4 — toggle isVerified
    // If currently true  → set to false (unverify)
    // If currently false → set to true  (verify)
    company.isVerified = !company.isVerified;
    await company.save();

    // Step 5 — send back the updated company
    const action = company.isVerified ? 'verified' : 'unverified';

    return res.status(200).json({
      success: true,
      message: `${company.companyName || company.name} has been ${action}`,
      data: {
        _id:         company._id,
        name:        company.name,
        companyName: company.companyName,
        email:       company.email,
        isVerified:  company.isVerified,
      },
    });

  } catch (error) {
    next(error);
  }
};