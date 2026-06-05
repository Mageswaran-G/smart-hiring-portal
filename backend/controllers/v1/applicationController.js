// applicationController
// All application-related business logic

const Application    = require("../../models/Application");
const mongoose       = require("mongoose");
const Job            = require('../../models/Job');
const User           = require('../../models/User');
const AppError       = require('../../utils/AppError');
const { sendStatusEmail } = require('../../utils/emailService');
const { createNotification } = require('../../services/notificationService');


// POST /api/v1/applications/:jobId/apply
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId }       = req.params;
    const { coverLetter } = req.body;
    const candidateId     = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return next(new AppError('Job not found', 404));
    if (!job.isActive) return next(new AppError('This job is not accepting applications', 400));
    if (job.status !== 'published') return next(new AppError('This job is no longer accepting applications', 400));
    if (job.deadline && new Date(job.deadline) < new Date()) return next(new AppError('Application deadline has passed', 400));

    const alreadyApplied = await Application.findOne({ candidate: candidateId, job: jobId });
    if (alreadyApplied) return next(new AppError('You already applied for this job', 400));

    const userProfile = await User.findById(candidateId).select('resume resumes');
    const resumeUrl = userProfile?.resume?.url || userProfile?.resumes?.find(r => r.isDefault)?.url || userProfile?.resumes?.[0]?.url || '';

    const application = await Application.create({
      candidate:     candidateId,
      job:           jobId,
      coverLetter:   coverLetter || '',
      resume:        resumeUrl,
      statusHistory: [{ status: 'applied', changedAt: new Date(), changedBy: candidateId }],
    });
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    // Notify company — new application received
    await createNotification(
      job.postedBy,
      'new_application',
      'New Application Received',
      `A candidate applied for your job: ${job.title}`,
      { jobId: job._id, applicationId: application._id }
    );

    return res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (error) { next(error); }
};


// GET /api/v1/applications/my?page=1&limit=10
exports.getMyApplications = async (req, res, next) => {
  try {
    const candidateId = req.user.id;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ candidate: candidateId })
        .populate({ path: 'job', select: 'title location jobType workMode experienceLevel isActive postedBy', populate: { path: 'postedBy', select: 'companyName' } })
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments({ candidate: candidateId }),
    ]);

    return res.status(200).json({ success: true, data: applications, pagination: { total, page, limit, hasMore: skip + applications.length < total } });
  } catch (error) { next(error); }
};


// GET /api/v1/applications/company?page=1&limit=10
exports.getCompanyApplications = async (req, res, next) => {
  try {
    const companyId = req.user.id;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const jobs = await Job.find({ postedBy: companyId }).select('_id title');
    if (!jobs.length) return res.status(200).json({ success: true, data: [], pagination: { total: 0, page, limit, hasMore: false } });

    const jobIds = jobs.map(j => j._id);
    const [applications, total] = await Promise.all([
      Application.find({ job: { $in: jobIds } })
        .populate('job', 'title location jobType workMode')
        .populate('candidate', 'name email profilePhoto headline')
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments({ job: { $in: jobIds } }),
    ]);

    return res.status(200).json({ success: true, data: applications, pagination: { total, page, limit, hasMore: skip + applications.length < total } });
  } catch (error) { next(error); }
};


// PATCH /api/v1/applications/:applicationId/status
// Saves new status + sends email notification to candidate
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status }        = req.body;
    const companyId         = req.user.id;

    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));

    // Populate candidate (for email) + job + job.postedBy (for ownership check)
    const application = await Application.findById(applicationId)
      .populate('candidate', 'name email')
      .populate({ path: 'job', select: 'title postedBy', populate: { path: 'postedBy', select: 'companyName' } });

    if (!application) return next(new AppError('Application not found', 404));

    // Prevent duplicate status
    if (application.status === status)
      return next(new AppError(`Application already has status: ${status}`, 400));

    // Security — only the company that owns the job can update
    if (application.job.postedBy._id.toString() !== companyId)
      return next(new AppError('Not authorized to update this application', 403));

    // Save the new status + push to history
    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: companyId,
    });
    await application.save();

    // Send email AFTER save — status update always succeeds even if email fails
    // sendStatusEmail never throws — catches its own errors
    await sendStatusEmail({
      to:            application.candidate.email,
      candidateName: application.candidate.name,
      jobTitle:      application.job.title,
      companyName:   application.job.postedBy.companyName,
      status,
    });

    // Notify candidate — application status changed
    const statusMessages = {
      reviewing:   'Your application is being reviewed',
      shortlisted: 'Congratulations! You have been shortlisted',
      rejected:    'Your application was not selected this time',
      hired:       'Congratulations! You have been hired',
    };
    if (statusMessages[status]) {
      await createNotification(
        application.candidate._id,
        `application_${status}`,
        `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `${statusMessages[status]} for ${application.job.title} at ${application.job.postedBy.companyName}`,
        { jobId: application.job._id, applicationId: application._id }
      );
    }

    return res.status(200).json({ success: true, message: `Status updated to ${status}`, data: application });
  } catch (error) { next(error); }
};

// GET /api/v1/applications/my/trend
// Returns candidate's daily application counts for last 7 days
exports.getMyApplicationTrend = async (req, res, next) => {
  try {
    const candidateId = req.user.id;

    // Build last 7 days date array
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const weekAgo = days[0];

    // Count applications per day for last 7 days
    const dailyRaw = await Application.aggregate([
      {
        $match: {
          candidate: new mongoose.Types.ObjectId(candidateId),
          createdAt: { $gte: weekAgo },
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
        }
      }
    ]);

    // Map to 7-slot array — 0 if no applications that day
    const dailyMap = {};
    dailyRaw.forEach(d => { dailyMap[d._id] = d.count; });
    const trend = days.map(d => {
      const key = d.toISOString().slice(0, 10);
      return dailyMap[key] || 0;
    });

    return res.status(200).json({ success: true, data: { trend } });
  } catch (error) { next(error); }
};


// DELETE /api/v1/applications/:applicationId/withdraw
// Candidate withdraws their own application
exports.withdrawApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const candidateId       = req.user.id;

    const application = await Application.findById(applicationId)
      .populate({ path: 'job', select: 'title postedBy' });

    if (!application) return next(new AppError('Application not found', 404));

    // Security — only the candidate who applied can withdraw
    if (application.candidate.toString() !== candidateId)
      return next(new AppError('Not authorized to withdraw this application', 403));

    // Cannot withdraw if already hired, rejected, or withdrawn
    if (['hired', 'rejected', 'withdrawn'].includes(application.status))
      return next(new AppError(`Cannot withdraw a ${application.status} application`, 400));

    // Soft delete — keep history, just mark as withdrawn
    application.status = 'withdrawn';
    application.withdrawnAt = new Date();
    application.statusHistory.push({
      status:    'withdrawn',
      changedAt: new Date(),
      changedBy: candidateId,
    });
    await application.save();

    // Decrement job applicationsCount
    await Job.findByIdAndUpdate(application.job._id, { $inc: { applicationsCount: -1 } });

    // Notify company — candidate withdrew
    await createNotification(
      application.job.postedBy,
      'application_withdrawn',
      'Application Withdrawn',
      `A candidate withdrew their application for: ${application.job.title}`,
      { jobId: application.job._id, applicationId: application._id }
    );

    return res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) { next(error); }
};
