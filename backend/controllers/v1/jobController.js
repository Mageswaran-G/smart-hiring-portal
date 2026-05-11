// jobController.js
// All job-related business logic lives here
const mongoose = require('mongoose');
const Job = require('../../models/Job');

// ─────────────────────────────────────────
// CREATE JOB — Company only
// POST /api/v1/jobs
// ─────────────────────────────────────────
const createJob = async (req, res) => {
  try {
    // Whitelist — only safe fields
    const allowedFields = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      jobType: req.body.jobType,
      workMode: req.body.workMode,
      salary: req.body.salary,
      skillsRequired: req.body.skillsRequired,
      experienceLevel: req.body.experienceLevel,
      deadline: req.body.deadline,
      openings: req.body.openings,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      benefits: req.body.benefits,
      status: req.body.status,
    };

    const job = await Job.create({
      ...allowedFields,
      postedBy: req.user.id, // from JWT — cannot be overridden
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// GET ALL JOBS — Public
// GET /api/v1/jobs
// Supports: search, filter, pagination
// ─────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      workMode,
      location,
      experienceLevel,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter — only show public, active, not deleted jobs
    const filter = {
      isDeleted: false,
      isActive: true,
      status: 'published',
    };

    // Text search — uses the index we created
    if (search) {
      filter.$text = { $search: search };
    }

    // Exact match filters
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    // Partial match for location — "Chennai" finds "Chennai, TN"
    if (location) {
    const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.location = new RegExp(escapedLocation, 'i');
    }

    // Pagination math
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Number(limit) || 10, 50);
    const skip = (pageNumber - 1) * limitNumber;
    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate('postedBy', 'companyName profilePhoto') // get company info
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      count: jobs.length,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        hasNext: pageNumber < Math.ceil(total / limitNumber),
      },
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// GET SINGLE JOB — Public
// GET /api/v1/jobs/:id
// ─────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    const job = await Job.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate('postedBy', 'companyName profilePhoto industry companyWebsite');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// UPDATE JOB — Company owner only
// PUT /api/v1/jobs/:id
// ─────────────────────────────────────────
const updateJob = async (req, res) => {
  try {
    // Fix — validate MongoDB ID format first
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }

    // Whitelist — cannot update postedBy, isDeleted, applicationsCount
    const allowedUpdates = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      jobType: req.body.jobType,
      workMode: req.body.workMode,
      salary: req.body.salary,
      skillsRequired: req.body.skillsRequired,
      experienceLevel: req.body.experienceLevel,
      deadline: req.body.deadline,
      openings: req.body.openings,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      benefits: req.body.benefits,
      status: req.body.status,
    };

    // Remove undefined fields — don't overwrite with undefined
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id, isDeleted: false },
      allowedUpdates,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized',
      });
    }

    res.json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// SOFT DELETE JOB — Company owner only
// DELETE /api/v1/jobs/:id
// isDeleted: true — never remove from DB
// ─────────────────────────────────────────
const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// UPDATE JOB STATUS — Company owner only
// PATCH /api/v1/jobs/:id/status
// Body: { isActive: true/false } or { status: 'published' }
// ─────────────────────────────────────────
const updateJobStatus = async (req, res) => {
  try {
    const { isActive, status } = req.body;

    // Build only what was sent
    const updateData = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (status) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Send isActive or status in body',
      });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      updateData,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Job status updated',
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// GET MY JOBS — Company sees only own jobs
// GET /api/v1/jobs/company/my-jobs
// ─────────────────────────────────────────
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 }); // newest first

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export all functions
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyJobs,
};