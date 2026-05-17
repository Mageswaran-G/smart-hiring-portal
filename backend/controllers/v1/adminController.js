// adminController
const User        = require('../../models/User');
const Job         = require('../../models/Job');
const Application = require('../../models/Application');

// GET /api/v1/admin/stats
// Platform-wide analytics for admin dashboard
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
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: 'candidate', isDeleted: false }),
      User.countDocuments({ role: 'company',   isDeleted: false }),
      Job.countDocuments({ isDeleted: false, status: 'published', isActive: true }),
      Application.countDocuments(),

      // Recent 5 signups
      User.find({ isDeleted: false })
        .select('name email role createdAt isVerified')
        .sort({ createdAt: -1 })
        .limit(5),

      // Application status breakdown
      Application.aggregate([
        { $group: {
          _id:         '$status',
          count:       { $sum: 1 },
        }},
      ]),
    ]);

    // Map status counts
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