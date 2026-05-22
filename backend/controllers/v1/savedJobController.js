const SavedJob = require('../../models/SavedJob');
const Job      = require('../../models/Job');
const AppError = require('../../utils/AppError');


// Save a job
exports.saveJob = async (req, res, next) => {
  try {

    const candidateId = req.user.id;
    const { jobId }   = req.params;

    // Check job exists
    const job = await Job.findById(jobId);
    if (!job) return next(new AppError('Job not found', 404));

    // Save (ignore if already saved — upsert)
    await SavedJob.findOneAndUpdate(
      { candidate: candidateId, job: jobId },
      { candidate: candidateId, job: jobId },
      { upsert: true, returnDocument: 'after' }
    );

    return res.status(200).json({
      success: true,
      message: 'Job saved',
    });

  } catch (error) {
    next(error);
  }
};


// Unsave a job
exports.unsaveJob = async (req, res, next) => {
  try {

    const candidateId = req.user.id;
    const { jobId }   = req.params;

    await SavedJob.findOneAndDelete({
      candidate: candidateId,
      job: jobId,
    });

    return res.status(200).json({
      success: true,
      message: 'Job removed from saved',
    });

  } catch (error) {
    next(error);
  }
};


// Get all saved jobs for candidate
exports.getSavedJobs = async (req, res, next) => {
  try {

    const candidateId = req.user.id;

    const saved = await SavedJob.find({ candidate: candidateId })
      .populate({
        path: 'job',
        select: 'title location jobType workMode experienceLevel openings isActive postedBy',
        populate: { path: 'postedBy', select: 'companyName' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: saved,
    });

  } catch (error) {
    next(error);
  }
};


// Get only saved job IDs — lightweight, used by job listing page
exports.getSavedJobIds = async (req, res, next) => {
  try {

    const candidateId = req.user.id;

    const saved = await SavedJob.find({ candidate: candidateId }).select('job');
    const ids   = saved.map((s) => s.job.toString());

    return res.status(200).json({
      success: true,
      data: ids,
    });

  } catch (error) {
    next(error);
  }
};