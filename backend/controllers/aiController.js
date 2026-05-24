// AI Controller — Match Score, Recommendations

const calculateMatch = require('../ai/matchEngine');
const extractSkills = require('../ai/skillExtractor');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// POST /api/v1/ai/match/:jobId
const getMatchScore = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const candidateSkills = user.parsedSkills?.length ? user.parsedSkills : (user.skills || []);
    const jobSkills = job.skillsRequired || [];
    const descriptionSkills = extractSkills(job.description || '');
    const allJobSkills = [...new Set([...jobSkills, ...descriptionSkills])];

    const result = calculateMatch(candidateSkills, allJobSkills);

    return res.json({
      success: true,
      data: {
        score: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        totalJobSkills: allJobSkills.length,
      }
    });

  } catch (err) {
    console.error('Match score error:', err);
    return res.status(500).json({ success: false, message: 'Failed to calculate match score' });
  }
};

// GET /api/v1/ai/recommendations
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const candidateSkills = user.parsedSkills?.length ? user.parsedSkills : (user.skills || []);

    // Get jobs candidate already applied to
    const applied = await Application.find({ candidate: userId }).select('job');
    const appliedJobIds = applied.map(a => a.job.toString());

    // Get active jobs excluding already applied
    const jobs = await Job.find({
      isActive: true,
      status: 'published',
      isDeleted: false,
      _id: { $nin: appliedJobIds },
    }).limit(50);

    const scored = jobs.map(job => {
      const jobSkills = job.skillsRequired || [];
      const result = calculateMatch(candidateSkills, jobSkills);
      return { job, score: result.score, matchedSkills: result.matchedSkills, missingSkills: result.missingSkills };
    });

    scored.sort((a, b) => b.score - a.score);

    const recommendations = scored.slice(0, 10).map(item => ({
      ...item.job.toObject(),
      matchScore: item.score,
      matchedSkills: item.matchedSkills,
      missingSkills: item.missingSkills,
    }));

    return res.json({ success: true, data: { recommendations } });

  } catch (err) {
    console.error('Recommendations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get recommendations' });
  }
};

module.exports = { getMatchScore, getRecommendations };
