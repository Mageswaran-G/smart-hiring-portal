const calculateMatch = require('../../ai/matchEngine');
const Job  = require('../../models/Job');
const User = require('../../models/User');
const logger = require('../../utils/logger');
const extractCandidateSkills = require('../../utils/extractCandidateSkills');
const { SCORING_VERSION } = require('../../ai/thresholds');

// Infer candidate experience level from work history
function inferExperienceLevel(user) {
  const workCount = user.workHistory?.length || 0;
  if (workCount === 0) return 'fresher';
  if (workCount === 1) return 'junior';
  if (workCount === 2) return 'mid';
  return 'senior';
}

const getMatchScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    const [user, job] = await Promise.all([
      User.findById(userId).select('skills parsedSkills workHistory'),
      Job.findById(jobId).select('skillsRequired preferredSkills experienceLevel postedBy title'),
    ]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!job)  return res.status(404).json({ success: false, message: 'Job not found' });
    const candidateSkills = extractCandidateSkills(user);
    const jobSkills = [...new Set(job.skillsRequired || [])];
    const result = calculateMatch(candidateSkills, jobSkills, {
      preferredSkills: job.preferredSkills || [],
      jobLevel: job.experienceLevel,
      candidateLevel: inferExperienceLevel(user),
    });
    return res.json({ success: true, data: {
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      matchedPreferred: result.matchedPreferred || [],
      totalJobSkills: jobSkills.length,
      breakdown: result.breakdown,
      scoringVersion: SCORING_VERSION,
      generatedAt: new Date().toISOString(),
    }});
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
    const candidateSkills = extractCandidateSkills(user);
    if (!candidateSkills.length) {
      const scores = {};
      limitedIds.forEach(id => { scores[id] = 0; });
      return res.json({ success: true, data: { scores } });
    }
    const jobs = await Job.find({ _id: { $in: limitedIds } }).select('skillsRequired preferredSkills');
    const scores = {};
    jobs.forEach(job => {
      const jobSkills = [...new Set(job.skillsRequired || [])];
      scores[job._id.toString()] = calculateMatch(candidateSkills, jobSkills, { preferredSkills: job.preferredSkills || [] }).score;
    });
    return res.json({ success: true, data: { scores } });
  } catch (err) {
    logger.error('Batch match error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get batch match scores' });
  }
};

// GET /api/v1/ai/job-ats/:jobId
// Compare candidate resume against specific job requirements
const getJobATSMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    const { getCache, setCache } = require('../../utils/cache');
    const { scoreATS } = require('../../ai/atsScorer');

    // Check cache first
    const cacheKey = `jobats:${userId}:${jobId}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    // Fetch user and job together
    const [user, job] = await Promise.all([
      User.findById(userId).select('parsedResumeText parsedSkills skills bio'),
      Job.findById(jobId).select('title skillsRequired preferredSkills experienceLevel companyName')
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Get resume text
    const resumeText = user.parsedResumeText ||
      `${user.bio || ''} Skills: ${(user.parsedSkills || user.skills || []).join(', ')}`;

    // Get ATS score against this specific job
    const atsResult = scoreATS(resumeText, user);

    // Get skill match against job requirements
    const matchResult = calculateMatch(
      extractCandidateSkills(user),
      job.skillsRequired || [],
      { preferredSkills: job.preferredSkills || [] }
    );

    // Build response
    const result = {
      jobId,
      jobTitle: job.title,
      overallATSScore: atsResult.score,
      atsLabel: atsResult.label,
      skillMatchScore: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      totalJobSkills: (job.skillsRequired || []).length,
      resumeWordCount: atsResult.wordCount,
      suggestions: atsResult.suggestions,
      breakdown: atsResult.breakdown,
    };

    // Cache for 10 minutes
    setCache(cacheKey, result, 600);

    return res.json({ success: true, data: result });

  } catch (err) {
    logger.error('Job ATS match error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMatchScore, getMatchScoreBatch, getJobATSMatch };