// AI Controller — Match Score, Recommendations

const calculateMatch = require("../ai/matchEngine");
const { getSuggestions } = require("../ai/skillResources");
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
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const candidateSkills = user.parsedSkills?.length ? user.parsedSkills : (user.skills || []);

    if (!candidateSkills.length) {
      return res.json({ success: true, data: { score: 0, matchedSkills: [], missingSkills: [], message: "Add skills or upload resume to calculate match score" } });
    }
    const jobSkills = [...new Set(job.skillsRequired || [])];
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
        suggestions: getSuggestions(result.missingSkills),
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

    if (!candidateSkills.length) {
      return res.json({ success: true, data: { score: 0, matchedSkills: [], missingSkills: [], message: "Add skills or upload resume to calculate match score" } });
    }

    // Get jobs candidate already applied to
    const applied = await Application.find({ candidate: userId }).select('job');
    const appliedJobIds = applied.map(a => a.job.toString());

    // Get active jobs excluding already applied
    const jobs = await Job.find({
      isActive: true,
      status: 'published',
      isDeleted: false,
      _id: { $nin: appliedJobIds },
      deadline: { $gte: new Date() },
    }).limit(50);

    const scored = jobs.map(job => {
      const jobSkills = [...new Set(job.skillsRequired || [])];
      const result = calculateMatch(candidateSkills, jobSkills);
      return { job, score: result.score, matchedSkills: result.matchedSkills, missingSkills: result.missingSkills };
    });

    const filteredScored = scored.filter(item => item.score >= 25);
    filteredScored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.job.createdAt) - new Date(a.job.createdAt);
    });

    const recommendations = filteredScored.slice(0, 10).map(item => ({
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


// GET /api/v1/ai/rank/:jobId
// Company sees applicants ranked by AI match score
const rankCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get the job
    const job = await Job.findById(jobId).select('title postedBy skillsRequired');
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Security: company can only rank candidates for their own jobs
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied — not your job" });
    }


    // Get all applications for this job
    
    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email avatar parsedSkills skills')
      .lean();

    const jobSkills = [...new Set(job.skillsRequired || [])];

    // Score each candidate
    const ranked = applications.map(app => {
      const candidate = app.candidate;
      const candidateSkills = candidate?.parsedSkills?.length
        ? candidate.parsedSkills
        : (candidate?.skills?.map(s => typeof s === 'string' ? s : s.name) || []);

      const result = calculateMatch(candidateSkills, jobSkills);

      return {
        applicationId: app._id,
        status: app.status,
        appliedAt: app.createdAt,
        candidate: {
          id: candidate?._id,
          name: candidate?.name,
          email: candidate?.email,
          avatar: candidate?.avatar,
        },
        score: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
      };
    });

    // Sort by score descending
    ranked.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.appliedAt) - new Date(b.appliedAt);
    });

    return res.json({ success: true, data: { ranked, jobTitle: job.title, totalApplicants: ranked.length } });

  } catch (err) {
    console.error('Rank candidates error:', err);
    return res.status(500).json({ success: false, message: 'Failed to rank candidates' });
  }
};

module.exports = { getMatchScore, getRecommendations, rankCandidates };
