const Interview = require('../models/Interview');
const AppError  = require('../utils/AppError');

const scheduleInterview = async ({ candidateId, companyId, jobId, applicationId, scheduledAt, mode, meetingLink, location, notes }) => {
  // Prevent duplicate interview for same application
  const existing = await Interview.findOne({ application: applicationId, status: { $nin: ['cancelled', 'rejected'] } });
  if (existing) throw new AppError('An interview is already scheduled for this application', 400);

  const interview = await Interview.create({
    candidate: candidateId, company: companyId, job: jobId,
    application: applicationId, scheduledAt, mode,
    meetingLink: meetingLink || '', location: location || '', notes: notes || '',
  });
  return interview;
};

const getInterviewsForCandidate = async (candidateId) => {
  return Interview.find({ candidate: candidateId })
    .populate('company', 'companyName profilePhoto')
    .populate('job', 'title')
    .sort({ scheduledAt: -1 })
    .lean();
};

const getInterviewsForCompany = async (companyId) => {
  return Interview.find({ company: companyId })
    .populate('candidate', 'name profilePhoto email')
    .populate('job', 'title')
    .sort({ scheduledAt: -1 })
    .lean();
};

const updateInterviewStatus = async (interviewId, userId, status) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError('Interview not found', 404);

  // Only candidate can accept/reject
  if (['accepted', 'rejected'].includes(status)) {
    if (interview.candidate.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }
  }

  // Only company can complete/cancel
  if (['completed', 'cancelled'].includes(status)) {
    if (interview.company.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }
  }

  interview.status = status;
  await interview.save();
  return interview;
};

const getInterviewById = async (interviewId) => {
  return Interview.findById(interviewId)
    .populate('candidate', 'name email profilePhoto')
    .populate('company',   'companyName profilePhoto')
    .populate('job',       'title')
    .lean();
};

const rescheduleInterview = async (interviewId, companyId, { scheduledAt, meetingLink, location, notes }) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError('Interview not found', 404);
  if (interview.company.toString() !== companyId) throw new AppError('Not authorized', 403);
  if (new Date(scheduledAt) <= new Date()) throw new AppError('Interview time must be a future date', 400);

  interview.scheduledAt = new Date(scheduledAt);
  if (meetingLink !== undefined) interview.meetingLink = meetingLink;
  if (location    !== undefined) interview.location    = location;
  if (notes       !== undefined) interview.notes       = notes;
  interview.status = 'pending';
  await interview.save();
  return interview;
};

module.exports = { scheduleInterview, getInterviewsForCandidate, getInterviewsForCompany, updateInterviewStatus, getInterviewById, rescheduleInterview };
