const { getRecommendation, getExperienceMultiplier } = require('../../ai/thresholds');
const extractCandidateSkills = require('../../utils/extractCandidateSkills');
const calculateMatch     = require('../../ai/matchEngine');
const { getSuggestions } = require('../../ai/skillResources');
const Job         = require('../../models/Job');
const Application = require('../../models/Application');
const User        = require('../../models/User');
const logger      = require('../../utils/logger');
const { getCache, setCache } = require('../../utils/cache');
const { calcCompositeScore, calcConfidenceScore } = require('../../ai/compositeScore');


const generateCandidateSummary = (candidateName, score, matchedSkills, missingSkills, jobTitle) => {
  const matched = matchedSkills.join(', ') || 'general skills';
  const missing = missingSkills.join(', ');
  const label   = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Weak';
  let s = label + ' candidate with experience in ' + matched + '.';
  if (missing) s += ' Missing ' + missing + ' which are required for this ' + jobTitle + ' role.';
  if (score >= 70)      s += ' Recommended for technical screening.';
  else if (score >= 40) s += ' Consider for screening with skill assessment.';
  else                  s += ' May need significant upskilling before this role.';
  return s;
};

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `recommendations:${userId}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached, fromCache: true });
    const user   = await User.findById(userId).select('skills parsedSkills');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const candidateSkills = user.parsedSkills?.length
      ? user.parsedSkills
      : (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    if (!candidateSkills.length)
      return res.json({ success: true, data: { recommendations: [], message: 'Add skills to get recommendations' } });
    const appliedApps   = await Application.find({ candidate: userId }).select('job');
    const appliedJobIds = appliedApps.map(a => a.job?.toString()).filter(Boolean);
    const jobs = await Job.find({ status: 'published', isActive: true, isDeleted: false, _id: { $nin: appliedJobIds } })
      .select('title location jobType workMode experienceLevel skillsRequired preferredSkills postedBy slug')
      .populate('postedBy', 'companyName isVerified').limit(20);
    const scored = jobs.map(job => {
      const jobSkills   = [...new Set(job.skillsRequired || [])];
      const result      = calculateMatch(candidateSkills, jobSkills, { preferredSkills: job.preferredSkills || [] });
      const suggestions = getSuggestions(result.missingSkills);
      return { ...job.toObject(), matchScore: result.score, matchedSkills: result.matchedSkills, missingSkills: result.missingSkills, suggestions };
    }).filter(j => j.matchScore >= 15).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
    const responseData = { recommendations: scored, totalSkills: candidateSkills.length };
    setCache(cacheKey, responseData, 300);
    return res.json({ success: true, data: responseData });
  } catch (err) {
    logger.error('Recommendations error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const rankCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).select('skillsRequired preferredSkills experienceLevel postedBy title');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    const applications = await Application.find({ job: jobId }).populate('candidate', 'name email avatar skills parsedSkills workHistory parsedResumeText bio resume photo profilePhoto headline educationList education phone');
    if (!applications.length) return res.json({ success: true, data: { ranked: [] } });
    const jobSkills = [...new Set(job.skillsRequired || [])];
    const ranked = applications.map(app => {
      const c = app.candidate;
      if (!c) return null;
      const cs = extractCandidateSkills(c);
      const workCount = c.workHistory?.length || 0;
      const candidateLevel = workCount === 0 ? 'fresher' : workCount === 1 ? 'junior' : workCount === 2 ? 'mid' : 'senior';
      const result = calculateMatch(cs, jobSkills, {
        preferredSkills: job.preferredSkills || [],
        jobLevel: job.experienceLevel,
        candidateLevel,
      });
      const composite = calcCompositeScore(c, result.score);
      const confidence = calcConfidenceScore(c, result.score);
      const finalScore = composite.compositeScore;
      const recommendation = getRecommendation(finalScore);
      return {
        applicationId: app._id,
        status: app.status,
        appliedAt: app.createdAt,
        candidate: { id: c._id, name: c.name, email: c.email, avatar: c.avatar },
        score: finalScore,
        skillMatchScore: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        matchedPreferred: result.matchedPreferred || [],
        recommendation,
        compositeBreakdown: composite.breakdown,
        confidence: confidence.label,
        confidenceScore: confidence.score,
        summary: generateCandidateSummary(c.name, finalScore, result.matchedSkills, result.missingSkills, job.title)
      };
    }).filter(Boolean).sort((a, b) => b.score - a.score);
    // Apply filters from query params
    const { minScore, recommendation, confidence, sortBy } = req.query;

    let filtered = ranked;

    // Filter by minimum score
    if (minScore) {
      filtered = filtered.filter(r => r.score >= Number(minScore));
    }

    // Filter by recommendation label
    if (recommendation) {
      filtered = filtered.filter(r =>
        r.recommendation?.toLowerCase() === recommendation.toLowerCase()
      );
    }

    // Filter by confidence level
    if (confidence) {
      filtered = filtered.filter(r =>
        r.confidence?.toLowerCase() === confidence.toLowerCase()
      );
    }

    // Sort options
    if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.candidate.name.localeCompare(b.candidate.name));
    } else if (sortBy === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    }
    // default: already sorted by score

    return res.json({
      success: true,
      data: {
        ranked: filtered,
        total: ranked.length,
        filtered: filtered.length,
        jobTitle: job.title,
        appliedFilters: { minScore, recommendation, confidence, sortBy }
      }
    });
  } catch (err) {
    logger.error('Rank candidates error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecommendations, rankCandidates };