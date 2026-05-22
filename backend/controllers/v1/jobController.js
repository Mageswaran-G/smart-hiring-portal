// jobController
const mongoose    = require('mongoose');
const Job         = require('../../models/Job');
const Application = require('../../models/Application');
const sanitizeHtml = require('sanitize-html');
const sanitizeDescription = (html) => sanitizeHtml(html || '', {
  allowedTags: [
    'p', 'strong', 'em', 'h2', 'h3',
    'ul', 'ol', 'li', 'br', 'hr',
    'blockquote', 'code', 'pre', 'a',
  ],
  allowedAttributes: {
    'a': ['href'],  
  },
  // Force rel="noopener noreferrer" on ALL links — prevents tabnabbing
  transformTags: {
    'a': (tagName, attribs) => ({
      tagName: 'a',
      attribs: {
        ...attribs,
        target: '_blank',
        rel:    'noopener noreferrer',
      },
    }),
  },
});

// ─────────────────────────────────────────
// CREATE JOB — Company only
// ─────────────────────────────────────────
const generateSlug = require('../../utils/generateSlug'); 
const createJob = async (req, res) => {
  try {
    const allowedFields = {
      title:            req.body.title,
      description:      sanitizeDescription(req.body.description), 
      location:         req.body.location,
      jobType:          req.body.jobType,
      workMode:         req.body.workMode,
      salary:           req.body.salary,
      skillsRequired:   req.body.skillsRequired,
      experienceLevel:  req.body.experienceLevel,
      deadline:         req.body.deadline,
      openings:         req.body.openings,
      requirements:     req.body.requirements,
      responsibilities: req.body.responsibilities,
      benefits:         req.body.benefits,
      status:           req.body.status,
    };

    const job = await Job.create({
      ...allowedFields,
      postedBy: req.user.id,
    });

    job.slug = generateSlug(job.title, job.location, job._id);
    await job.save();

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
// ─────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const {
      search, jobType, workMode,
      location, experienceLevel,
      cursor,               // ← NEW: last job _id from previous page
      limit = 9,            // ← default 9 per load
    } = req.query;

    const filter = {
      isDeleted: false,
      isActive:  true,
      status:    'published',
    };

    if (search)          filter.$text           = { $search: search };
    if (jobType)         filter.jobType         = jobType;
    if (workMode)        filter.workMode        = workMode;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) {
      const escaped = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.location = new RegExp(escaped, 'i');
    }

    // Cursor: only fetch jobs OLDER than the cursor _id
    // MongoDB _id contains timestamp — newest first means _id < cursor
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const limitNumber = Math.min(Number(limit) || 9, 50);

    // Fetch one extra to know if there are more jobs
    const jobs = await Job.find(filter)
      .populate('postedBy', 'companyName profilePhoto isVerified')
      .sort({ _id: -1 })         // newest first using _id (no separate createdAt needed)
      .limit(limitNumber + 1)    // fetch +1 to check hasMore
      .lean();                   // .lean() for performance — returns plain JS object

    // Check if more jobs exist
    const hasMore   = jobs.length > limitNumber;
    const result    = hasMore ? jobs.slice(0, limitNumber) : jobs;

    // Next cursor = last job's _id in current result
    const nextCursor = hasMore ? result[result.length - 1]._id : null;

    // Total count (for display — "X jobs found")
    const total = await Job.countDocuments({
      isDeleted: false,
      isActive:  true,
      status:    'published',
      ...(search ? { $text: { $search: search } } : {}),
      ...(jobType ? { jobType } : {}),
      ...(workMode ? { workMode } : {}),
      ...(experienceLevel ? { experienceLevel } : {}),
      ...(location ? { location: new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } : {}),
    });

    res.json({
      success: true,
      count:   result.length,
      pagination: {
        total,
        hasMore,
        nextCursor,         // frontend sends this on next "Load More" click
      },
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// GET SINGLE JOB — Public
// ─────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    const job = await Job.findOne({
      _id:       req.params.id,
      isDeleted: false,
      isActive:  true,         
      status:    'published', 
    }).populate('postedBy', 'companyName profilePhoto industry companyWebsite isVerified');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// UPDATE JOB — Company owner only
// ─────────────────────────────────────────
const updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }

    const allowedUpdates = {
      title:            req.body.title,
      description:      sanitizeDescription(req.body.description),
      location:         req.body.location,
      jobType:          req.body.jobType,
      workMode:         req.body.workMode,
      salary:           req.body.salary,
      skillsRequired:   req.body.skillsRequired,
      experienceLevel:  req.body.experienceLevel,
      deadline:         req.body.deadline,
      openings:         req.body.openings,
      requirements:     req.body.requirements,
      responsibilities: req.body.responsibilities,
      benefits:         req.body.benefits,
      status:           req.body.status,
    };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id, isDeleted: false },
      allowedUpdates,
      { returnDocument: 'after', runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized',
      });
    }

    // ── ADD: Regenerate slug if title or location changed ──
    if (req.body.title || req.body.location) {
      job.slug = generateSlug(job.title, job.location, job._id);
      await job.save();
    }
    // ── END ADD ──

    res.json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// SOFT DELETE JOB — Company owner only
// ─────────────────────────────────────────
const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { isDeleted: true },
      { returnDocument: 'after' }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized',
      });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// UPDATE JOB STATUS — Company owner only
// ─────────────────────────────────────────
const updateJobStatus = async (req, res) => {
  try {
    const { isActive, status } = req.body;
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
      { returnDocument: 'after' }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you are not authorized',
      });
    }

    res.json({ success: true, message: 'Job status updated', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// GET MY JOBS — Company sees only own jobs
// ─────────────────────────────────────────
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy:  req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// COMPANY DASHBOARD STATS
// GET /api/v1/jobs/company/dashboard-stats
// ─────────────────────────────────────────
const getCompanyDashboardStats = async (req, res, next) => {
  try {
    const companyId = req.user.id;

    const jobs = await Job.find({
      postedBy:  companyId,
      isDeleted: false,
    }).select('isActive status applicationsCount');

    const jobIds = jobs.map(j => j._id);

    const [appStats] = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id:         null,
          total:       { $sum: 1 },
          applied:     { $sum: { $cond: [{ $eq: ['$status', 'applied']     }, 1, 0] } },
          reviewing:   { $sum: { $cond: [{ $eq: ['$status', 'reviewing']   }, 1, 0] } },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
          rejected:    { $sum: { $cond: [{ $eq: ['$status', 'rejected']    }, 1, 0] } },
          hired:       { $sum: { $cond: [{ $eq: ['$status', 'hired']       }, 1, 0] } },
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalJobs:     jobs.length,
        activeJobs:    jobs.filter(j => j.isActive).length,
        draftJobs:     jobs.filter(j => j.status === 'draft').length,
        publishedJobs: jobs.filter(j => j.status === 'published').length,
        totalApps:     appStats?.total       || 0,
        applied:       appStats?.applied     || 0,
        reviewing:     appStats?.reviewing   || 0,
        shortlisted:   appStats?.shortlisted || 0,
        rejected:      appStats?.rejected    || 0,
        hired:         appStats?.hired       || 0,
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/jobs/slug/:slug
// Public route — find job by SEO slug
const getJobBySlug = async (req, res) => {
  try {
    const param = req.params.slug;

    let job = await Job.findOne({
      slug:      param,
      isDeleted: false,
      isActive:  true,          
      status:    'published',    
    }).populate('postedBy', 'companyName profilePhoto industry companyWebsite isVerified');

    // Fallback for old jobs without slug
    if (!job && mongoose.Types.ObjectId.isValid(param)) {
      job = await Job.findOne({
        _id:       param,
        isDeleted: false,
        isActive:  true,        
        status:    'published',  
      }).populate('postedBy', 'companyName profilePhoto industry companyWebsite isVerified');
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer available',
      });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// EXPORTS — all functions declared above
// ─────────────────────────────────────────
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobBySlug, 
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyJobs,
  getCompanyDashboardStats,   // ← works now because const declared above
};