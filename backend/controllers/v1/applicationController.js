// applicationController
// All application-related business logic

const Application = require('../../models/Application');
const Job         = require('../../models/Job');
const User        = require('../../models/User');
const AppError    = require('../../utils/AppError');


// ─────────────────────────────────────────────────────
// Candidate applies for a job
// POST /api/v1/applications/:jobId/apply
// ─────────────────────────────────────────────────────
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId }       = req.params;
    const { coverLetter } = req.body;
    const candidateId     = req.user.id;

    // Check job exists and is active
    const job = await Job.findById(jobId);
    if (!job) return next(new AppError('Job not found', 404));

    if (!job.isActive)
      return next(new AppError('This job is not accepting applications', 400));

    if (job.status !== 'published')
      return next(new AppError('This job is no longer accepting applications', 400));

    if (job.deadline && new Date(job.deadline) < new Date())
      return next(new AppError('Application deadline has passed', 400));

    // Check not already applied
    const alreadyApplied = await Application.findOne({
      candidate: candidateId,
      job:       jobId,
    });
    if (alreadyApplied)
      return next(new AppError('You already applied for this job', 400));

    // Get resume URL from candidate profile
    const userProfile = await User.findById(candidateId).select('resume resumes');
    const resumeUrl =
      userProfile?.resume?.url ||
      userProfile?.resumes?.find(r => r.isDefault)?.url ||
      userProfile?.resumes?.[0]?.url ||
      '';

    // Create the application
    const application = await Application.create({
      candidate:   candidateId,
      job:         jobId,
      coverLetter: coverLetter || '',
      resume:      resumeUrl,
    });

    // Increment job's application count atomically
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data:    application,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────
// Candidate views their own applications — WITH PAGINATION
// GET /api/v1/applications/my?page=1&limit=10
//
// How pagination works:
//   page 1, limit 10 → skip 0,  show items 1–10
//   page 2, limit 10 → skip 10, show items 11–20
//   page 3, limit 10 → skip 20, show items 21–30
// ─────────────────────────────────────────────────────
exports.getMyApplications = async (req, res, next) => {
  try {
    const candidateId = req.user.id;

    // Parse page + limit from URL query params
    // Example: /applications/my?page=2&limit=10
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // Run count + fetch together for speed (Promise.all = parallel)
    const [applications, total] = await Promise.all([
      Application.find({ candidate: candidateId })
        .populate({
          path:   'job',
          select: 'title location jobType workMode experienceLevel isActive postedBy',
          populate: {
            path:   'postedBy',
            select: 'companyName',
          },
        })
        .sort({ createdAt: -1 })  // newest first
        .skip(skip)               // skip items from previous pages
        .limit(limit),            // only return this page

      Application.countDocuments({ candidate: candidateId }),
    ]);

    // hasMore = true means there are more pages after this one
    const hasMore = skip + applications.length < total;

    return res.status(200).json({
      success: true,
      data:    applications,
      pagination: {
        total,    // total applications count
        page,     // current page
        limit,    // items per page
        hasMore,  // whether a next page exists
      },
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────
// Company views all applications for their jobs — WITH PAGINATION
// GET /api/v1/applications/company?page=1&limit=10
// ─────────────────────────────────────────────────────
exports.getCompanyApplications = async (req, res, next) => {
  try {
    const companyId = req.user.id;

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // Find all jobs posted by this company
    const jobs = await Job.find({ postedBy: companyId }).select('_id title');

    if (!jobs.length) {
      return res.status(200).json({
        success: true,
        data:    [],
        pagination: { total: 0, page, limit, hasMore: false },
      });
    }

    const jobIds = jobs.map((j) => j._id);

    // Count + fetch together for speed
    const [applications, total] = await Promise.all([
      Application.find({ job: { $in: jobIds } })
        .populate('job',       'title location jobType workMode')
        .populate('candidate', 'name email profilePhoto headline')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Application.countDocuments({ job: { $in: jobIds } }),
    ]);

    const hasMore = skip + applications.length < total;

    return res.status(200).json({
      success: true,
      data:    applications,
      pagination: {
        total,
        page,
        limit,
        hasMore,
      },
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────
// Company updates application status
// PATCH /api/v1/applications/:applicationId/status
// ─────────────────────────────────────────────────────
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status }        = req.body;
    const companyId         = req.user.id;

    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'];

    if (!validStatuses.includes(status)) {
      return next(
        new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400)
      );
    }

    const application = await Application.findById(applicationId).populate('job');

    if (!application) return next(new AppError('Application not found', 404));

    // Security — only the company that owns the job can update
    if (application.job.postedBy.toString() !== companyId) {
      return next(new AppError('Not authorized to update this application', 403));
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data:    application,
    });

  } catch (error) {
    next(error);
  }
};