const { getRecommendation } = require('../../ai/thresholds');
const extractCandidateSkills = require('../../utils/extractCandidateSkills');
const calculateMatch     = require('../../ai/matchEngine');
const { getSuggestions } = require('../../ai/skillResources');
const Job         = require('../../models/Job');
const Application = require('../../models/Application');
const User        = require('../../models/User');
const logger      = require('../../utils/logger');

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
    return res.json({ success: true, data: { recommendations: scored, totalSkills: candidateSkills.length } });
  } catch (err) {
    logger.error('Recommendations error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const rankCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).select('skillsRequired preferredSkills postedBy title');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    const applications = await Application.find({ job: jobId }).populate('candidate', 'name email avatar skills parsedSkills');
    if (!applications.length) return res.json({ success: true, data: { ranked: [] } });
    const jobSkills = [...new Set(job.skillsRequired || [])];
    const ranked = applications.map(app => {
      const c = app.candidate;
      if (!c) return null;
      const cs = extractCandidateSkills(c);
      const result = calculateMatch(cs, jobSkills, { preferredSkills: job.preferredSkills || [] });
      const recommendation = getRecommendation(result.score);
      return {
        applicationId: app._id,
        status: app.status,
        appliedAt: app.createdAt,
        candidate: { id: c._id, name: c.name, email: c.email, avatar: c.avatar },
        score: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        matchedPreferred: result.matchedPreferred || [],
        recommendation,
        summary: generateCandidateSummary(c.name, result.score, result.matchedSkills, result.missingSkills, job.title)
      };
    }).filter(Boolean).sort((a, b) => b.score - a.score);
    return res.json({ success: true, data: { ranked, jobTitle: job.title } });
  } catch (err) {
    logger.error('Rank candidates error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecommendations, rankCandidates };