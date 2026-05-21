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
exports.getAllCompanies = async (req, res) => {
  try {
    const { search = "", filter = "all", page = 1, limit = 10 } = req.query;

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

    const skip = (Number(page) - 1) * Number(limit);

    const [companies, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
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

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
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

    const query = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    if (filter === "active")  query.isActive = true;
    if (filter === "closed")  query.isActive = false;
    if (filter === "expired") {
      query.deadline = { $lt: new Date() };
      query.isActive = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name companyName email isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query)
    ]);

    res.json({ success: true, data: { jobs, total } });

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