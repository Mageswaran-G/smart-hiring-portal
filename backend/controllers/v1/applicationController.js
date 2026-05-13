// applicationController.js
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

    // Step 1 — check job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new AppError('Job not found', 404));
    }
    if (!job.isActive) {
      return next(new AppError('This job is not accepting applications', 400));
    }

    // Step 2 — check not already applied
    const alreadyApplied = await Application.findOne({
      candidate: candidateId,
      job:       jobId,
    });
    if (alreadyApplied) {
      return next(new AppError('You already applied for this job', 400));
    }

    // Step 3 — get resume URL from DB
    // FIXED: User model field is resume.url (nested object), NOT resumeUrl
    // We also check resumes array (multiple resumes) — use the default one first
    const userProfile = await User.findById(candidateId).select('resume resumes');

    const resumeUrl =
      userProfile?.resume?.url ||                                  // single resume
      userProfile?.resumes?.find(r => r.isDefault)?.url ||        // default from multiple
      userProfile?.resumes?.[0]?.url ||                           // first from multiple
      '';                                                          // fallback empty

    // Step 4 — create the application
    const application = await Application.create({
      candidate:   candidateId,
      job:         jobId,
      coverLetter: coverLetter || '',
      resume:      resumeUrl,
    });

    // Step 5 — increment job's application count atomically
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

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
// Candidate views their own applications
// GET /api/v1/applications/my
// ─────────────────────────────────────────────────────
exports.getMyApplications = async (req, res, next) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.find({ candidate: candidateId })
      .populate({
        path:   'job',
        select: 'title location jobType workMode experienceLevel isActive postedBy',
        populate: {
          path:   'postedBy',
          select: 'companyName',
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data:    applications,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────
// Company views all applications for their jobs
// GET /api/v1/applications/company
// ─────────────────────────────────────────────────────
exports.getCompanyApplications = async (req, res, next) => {
  try {
    const companyId = req.user.id;

    // Step 1 — find all jobs posted by this company
    const jobs = await Job.find({ postedBy: companyId }).select('_id title');

    if (!jobs.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const jobIds = jobs.map((j) => j._id);

    // Step 2 — find all applications for those jobs
    // $in = MongoDB "value must be in this array" operator
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job',       'title location jobType workMode')
      .populate('candidate', 'name email profilePhoto headline')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data:    applications,
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

    // Find application and populate job to check ownership
    const application = await Application.findById(applicationId).populate('job');

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    // Security — only the company who owns the job can update
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