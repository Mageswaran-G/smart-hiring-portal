const calculateMatch = require('../../ai/matchEngine');
const Job  = require('../../models/Job');
const User = require('../../models/User');
const logger = require('../../utils/logger');

const getMatchScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    const [user, job] = await Promise.all([
      User.findById(userId).select('skills parsedSkills'),
      Job.findById(jobId).select('skillsRequired postedBy title'),
    ]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!job)  return res.status(404).json({ success: false, message: 'Job not found' });
    const candidateSkills = user.parsedSkills?.length
      ? user.parsedSkills
      : (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    const jobSkills = [...new Set(job.skillsRequired || [])];
    const result    = calculateMatch(candidateSkills, jobSkills);
    return res.json({ success: true, data: { score: result.score, matchedSkills: result.matchedSkills, missingSkills: result.missingSkills, totalJobSkills: jobSkills.length } });
  } catch (err) {
    logger.error('Match score error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMatchScoreBatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobIds } = req.body;
    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0)
      return res.status(400).json({ success: false, message: 'jobIds array is required' });
    const limitedIds = jobIds.slice(0, 20);
    const user = await User.findById(userId).select('skills parsedSkills');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const candidateSkills = user.parsedSkills?.length
      ? user.parsedSkills
      : (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    if (!candidateSkills.length) {
      const scores = {};
      limitedIds.forEach(id => { scores[id] = 0; });
      return res.json({ success: true, data: { scores } });
    }
    const jobs = await Job.find({ _id: { $in: limitedIds } }).select('skillsRequired');
    const scores = {};
    jobs.forEach(job => {
      const jobSkills = [...new Set(job.skillsRequired || [])];
      scores[job._id.toString()] = calculateMatch(candidateSkills, jobSkills).score;
    });
    return res.json({ success: true, data: { scores } });
  } catch (err) {
    logger.error('Batch match error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get batch match scores' });
  }
};

module.exports = { getMatchScore, getMatchScoreBatch };