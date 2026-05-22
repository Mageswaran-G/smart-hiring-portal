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
      unverifiedCompanies,
      expiredJobs,
      suspendedUsers,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'candidate', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'company',   isDeleted: { $ne: true } }),
      Job.countDocuments({ isDeleted: { $ne: true } }),
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
      User.countDocuments({ role: 'company', isVerified: false, isDeleted: { $ne: true } }),
      Job.countDocuments({ isDeleted: { $ne: true }, isActive: true, deadline: { $lt: new Date() } }),
      User.countDocuments({ isSuspended: true, isDeleted: { $ne: true } }),
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
        unverifiedCompanies,
        expiredJobs,
        suspendedUsers,
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
exports.getAllCompanies = async (req, res) => {
  try {
    const { search = "", filter = "all", page = 1, limit = 10 } = req.query;
    const safePage  = Math.max(1, parseInt(page)  || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    // Build the query object
    const query = { 
      role: "company",
      isDeleted: { $ne: true }
    };

    // Search by company name
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by status
    if (filter === "verified") query.isVerified = true;
    if (filter === "unverified") query.isVerified = false;
    if (filter === "suspended") query.isSuspended = true;

    

    const [companies, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: { companies, total }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    const company = await User.findOne({ _id: id, isDeleted: { $ne: true } }).select('name email companyName isVerified role');

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


// Suspend or Unsuspend a Company
exports.suspendCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the company user in DB
    const company = await User.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Toggle suspend status
    // If isSuspended is true → make it false (unsuspend)
    // If isSuspended is false → make it true (suspend)
    company.isSuspended = !company.isSuspended;

    await company.save();

    res.json({
      success: true,
      message: company.isSuspended ? "Company suspended" : "Company unsuspended",
      data: { isSuspended: company.isSuspended }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users (candidates + companies) with search + filter + pagination
exports.getAllUsers = async (req, res) => {
  try {
    const { search = "", filter = "all", page = 1, limit = 10 } = req.query;
    const safePage  = Math.max(1, parseInt(page)  || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    // Build query — exclude admin accounts
    const query = { 
      role: { $ne: "admin" },
      isDeleted: { $ne: true }  // exclude soft deleted users
    };

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by role or status
    if (filter === "candidates") query.role = "candidate";
    if (filter === "companies")  query.role = "company";
    if (filter === "suspended")  query.isSuspended = true;

    

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(safeLimit)),
      User.countDocuments(query)
    ]);

    res.json({ success: true, data: { users, total } });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user permanently
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot delete admin accounts" });
    }

    // Soft delete — never permanently remove users
    // isDeleted = true means hidden from all queries
    // deletedAt records when it happened
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.refreshToken = null;
    await user.save();

    res.json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suspend or Unsuspend a User
exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot suspend admin" });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      success: true,
      message: user.isSuspended ? "User suspended" : "User unsuspended",
      data: { isSuspended: user.isSuspended }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Restore a soft-deleted user
exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findById directly — deleted users won't show in normal queries
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: "Cannot restore admin accounts" });
    }

    if (!user.isDeleted) {
      return res.status(400).json({ success: false, message: "User is not deleted" });
    }

    user.isDeleted = false;
    user.deletedAt = null;
    user.isSuspended = false; 
    await user.save();

    res.json({ success: true, message: "User restored successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all jobs for admin
exports.getAllJobs = async (req, res) => {
  try {
    const { search = "", filter = "all", page = 1, limit = 10 } = req.query;
    const safePage  = Math.max(1, parseInt(page)  || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const skip = (safePage - 1) * safeLimit;
   

    const query = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "active") {
      query.isActive = true;
      query.deadline = { $gte: new Date() };
    }
    if (filter === "closed")  query.status = "closed";
    if (filter === "expired") {
      query.isActive = false;
      query.deadline = { $lt: new Date() };
    }

    

    const [jobs, total, activeCount, closedCount, expiredCount] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name companyName email isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(safeLimit)),
      Job.countDocuments(query),
      Job.countDocuments({ isDeleted: { $ne: true }, isActive: true, deadline: { $gte: new Date() } }),
      Job.countDocuments({ isDeleted: { $ne: true }, status: 'closed' }),
      Job.countDocuments({ isDeleted: { $ne: true }, isActive: false, deadline: { $lt: new Date() } }),
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        total,
        stats: { active: activeCount, closed: closedCount, expired: expiredCount },
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Close a job (admin force close)
exports.closeJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.isActive = false;
    job.status = "closed";
    await job.save();

    res.json({ success: true, message: "Job closed successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a job (soft delete)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' }
    );
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ANALYTICS ─────────────────────────────────────
exports.getAdminAnalytics = async (req, res) => {
  try {
    // Application funnel breakdown
    const appFunnel = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const funnel = {};
    appFunnel.forEach(a => { funnel[a._id] = a.count; });

    // Users registered per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isDeleted: { $ne: true } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Jobs posted per day (last 7 days)
    const jobGrowth = await Job.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isDeleted: { $ne: true } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const [candidates, companies, totalUsers, totalJobs, activeJobs, closedJobs] =
      await Promise.all([
        User.countDocuments({ role: 'candidate', isDeleted: { $ne: true } }),
        User.countDocuments({ role: 'company',   isDeleted: { $ne: true } }),
        User.countDocuments({ isDeleted: { $ne: true } }),
        Job.countDocuments({ isDeleted: { $ne: true } }),
        Job.countDocuments({ isDeleted: { $ne: true }, isActive: true }),
        Job.countDocuments({ isDeleted: { $ne: true }, isActive: false }),
     ]);

    // Top hiring companies
    const topCompanies = await Application.aggregate([
      { $match: { status: 'hired' } },
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobData' } },
      { $unwind: '$jobData' },
      { $lookup: { from: 'users', localField: 'jobData.postedBy', foreignField: '_id', as: 'company' } },
      { $unwind: '$company' },
      { $group: { _id: '$company._id', name: { $first: '$company.companyName' }, hires: { $sum: 1 } } },
      { $sort: { hires: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        funnel: {
          applied:     funnel.applied     || 0,
          reviewing:   funnel.reviewing   || 0,
          shortlisted: funnel.shortlisted || 0,
          hired:       funnel.hired       || 0,
          rejected:    funnel.rejected    || 0,
        },
        userGrowth,
        jobGrowth,
        users:   { total: totalUsers, candidates, companies },
        jobs:    { total: totalJobs, active: activeJobs, closed: closedJobs },
        topCompanies,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ACTION CENTER — alerts for admin
exports.getActionCenter = async (req, res) => {
  try {
    // 1. Unverified companies (not verified, not suspended, not deleted)
    const unverifiedCompanies = await User.find({
      role: "company",
      isVerified: false,
      isSuspended: { $ne: true },
      isDeleted: { $ne: true },
    })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // 2. Suspended users (any role, not deleted)
    const suspendedUsers = await User.find({
      isSuspended: true,
      isDeleted: { $ne: true },
    })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Expired jobs (status = expired, not deleted)
    const expiredJobs = await Job.find({
      status: "expired",
      isDeleted: { $ne: true },
    })
      .select("title location createdAt")
      .populate("company", "name") // get company name
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Counts for badges
    const unverifiedCount = await User.countDocuments({
      role: "company",
      isVerified: false,
      isSuspended: { $ne: true },
      isDeleted: { $ne: true },
    });

    const suspendedCount = await User.countDocuments({
      isSuspended: true,
      isDeleted: { $ne: true },
    });

    const expiredCount = await Job.countDocuments({
      status: "expired",
      isDeleted: { $ne: true },
    });

    res.status(200).json({
      success: true,
      data: {
        unverifiedCompanies,
        suspendedUsers,
        expiredJobs,
        counts: {
          unverified: unverifiedCount,
          suspended: suspendedCount,
          expired: expiredCount,
          total: unverifiedCount + suspendedCount + expiredCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};