const { scheduleInterview, getInterviewsForCandidate, getInterviewsForCompany, updateInterviewStatus, getInterviewById } = require('../../services/interviewService');
const Application = require('../../models/Application');
const { createNotification } = require('../../services/notificationService');
const AppError = require('../../utils/AppError');

// POST /api/v1/interviews — company schedules interview
exports.schedule = async (req, res, next) => {
  try {
    const { applicationId, scheduledAt, mode, meetingLink, location, notes } = req.body;
    const companyId = req.user.id;

    if (!applicationId || !scheduledAt) {
      return next(new AppError('applicationId and scheduledAt are required', 400));
    }

    // Verify application belongs to this company
    const application = await Application.findById(applicationId)
      .populate('job', 'title postedBy')
      .populate('candidate', 'name');
    if (!application) return next(new AppError('Application not found', 404));
    if (application.job.postedBy.toString() !== companyId) {
      return next(new AppError('Not authorized', 403));
    }

    const interview = await scheduleInterview({
      candidateId:   application.candidate._id,
      companyId,
      jobId:         application.job._id,
      applicationId,
      scheduledAt:   new Date(scheduledAt),
      mode, meetingLink, location, notes,
    });

    // Notify candidate
    await createNotification(
      application.candidate._id,
      'interview_scheduled',
      'Interview Scheduled',
      `You have been invited for an interview for ${application.job.title}. Scheduled at ${new Date(scheduledAt).toLocaleString()}`,
      { interviewId: interview._id, jobId: application.job._id }
    );

    return res.status(201).json({ success: true, message: 'Interview scheduled successfully', data: interview });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/interviews/my — candidate views their interviews
exports.getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await getInterviewsForCandidate(req.user.id);
    return res.status(200).json({ success: true, data: { interviews } });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/interviews/company — company views all interviews
exports.getCompanyInterviews = async (req, res, next) => {
  try {
    const interviews = await getInterviewsForCompany(req.user.id);
    return res.status(200).json({ success: true, data: { interviews } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/interviews/:id/status — update interview status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }

    const interview = await updateInterviewStatus(req.params.id, req.user.id, status);

    // Notify company when candidate accepts or rejects
    if (status === 'accepted' || status === 'rejected') {
      const full = await getInterviewById(req.params.id);
      await createNotification(
        interview.company,
        `interview_${status}`,
        `Interview ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `Candidate ${full?.candidate?.name || ''} has ${status} the interview for ${full?.job?.title || ''}`,
        { interviewId: interview._id }
      );
    }

    return res.status(200).json({ success: true, message: `Interview ${status}`, data: interview });
  } catch (error) {
    next(error);
  }
};
