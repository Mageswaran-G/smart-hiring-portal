const Job  = require('../../models/Job');
const User = require('../../models/User');
const { scoreATS } = require('../../ai/atsScorer');
const { getCache, setCache } = require('../../utils/cache');
const { analyzeJD } = require('../../ai/jdAnalyzer');

const generateCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;
    const [user, job] = await Promise.all([
      User.findById(userId).select('name headline bio skills parsedSkills workHistory educationList'),
      Job.findById(jobId).select('title skillsRequired postedBy').populate('postedBy', 'companyName'),
    ]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!job)  return res.status(404).json({ success: false, message: 'Job not found' });
    const skills        = user.parsedSkills?.length ? user.parsedSkills : (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    const jobSkills     = job.skillsRequired || [];
    const matchedSkills = skills.filter(s => jobSkills.map(j => j.toLowerCase()).includes(s.toLowerCase()));
    const companyName   = job.postedBy?.companyName || 'your company';
    const experience    = user.workHistory?.[0]?.role || user.headline || 'software development';
    const degree        = user.educationList?.[0]?.degree || 'Computer Science';
    const coverLetter   = `Dear Hiring Manager at ${companyName},

I am writing to express my strong interest in the ${job.title} position. With hands-on experience in ${matchedSkills.slice(0,3).join(', ') || skills.slice(0,3).join(', ')}, I am confident in my ability to contribute meaningfully to your team.

My background in ${experience} has given me practical exposure to building scalable and efficient solutions. I hold a degree in ${degree} and have continuously updated my skills to stay current with industry demands.

${matchedSkills.length > 0 ? 'I was particularly excited to see that this role requires ' + matchedSkills.join(', ') + ' — areas where I have direct hands-on experience.' : 'I am eager to bring my skills and enthusiasm to ' + companyName + ' and grow alongside your team.'}

I would welcome the opportunity to discuss how my background aligns with your needs. Thank you for considering my application.

Sincerely,
${user.name || 'Candidate'}`;
    return res.json({ success: true, data: { coverLetter } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId is required' });
    const job = await Job.findById(jobId).select('title skillsRequired experienceLevel');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    const skills = job.skillsRequired || [];
    const level  = job.experienceLevel || 'mid';
    const questions = [];
    skills.slice(0, 3).forEach(skill => questions.push({ type: 'Technical', question: 'Can you describe your experience with ' + skill + ' and how you have used it in a real project?' }));
    if (level === 'senior' || level === 'lead') questions.push({ type: 'Leadership', question: 'As a senior ' + job.title + ', how do you approach mentoring junior developers and conducting code reviews?' });
    else if (level === 'mid') questions.push({ type: 'Problem Solving', question: 'Describe a challenging technical problem you faced and how you solved it.' });
    else questions.push({ type: 'Learning', question: 'How do you approach learning a new technology or framework quickly?' });
    if (skills.length > 3) questions.push({ type: 'Technical', question: 'This role requires ' + skills.slice(3).join(', ') + '. How familiar are you with these technologies?' });
    questions.push({ type: 'Behavioural', question: 'Tell me about a time you worked under tight deadlines. How did you manage priorities?' });
    return res.json({ success: true, data: { questions, jobTitle: job.title } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const generateResumeFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const user   = await User.findById(userId).select('name skills parsedSkills resume bio headline educationList workHistory portfolioProjects certifications');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const skills = user.parsedSkills?.length ? user.parsedSkills : (user.skills || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
    const strengths = [], improvements = [], missing = [];
    const hasResume = !!user.resume?.url;
    if (hasResume) strengths.push('Resume uploaded — recruiters can view your CV');
    else missing.push('Upload your resume to increase visibility by 60%');
    if (skills.length >= 5) strengths.push('Strong skill set — ' + skills.length + ' skills listed');
    else if (skills.length > 0) improvements.push('Add more skills — you have ' + skills.length + ', aim for at least 5');
    else missing.push('Add skills to your profile — critical for AI matching');
    if (user.bio && user.bio.length >= 50) strengths.push('Good bio — helps recruiters understand your background');
    else if (user.bio) improvements.push('Expand your bio — aim for at least 50 characters');
    else missing.push('Add a bio — recruiters read this first');
    if (user.headline) strengths.push('Professional headline present');
    else missing.push('Add a headline — e.g. "Full Stack Developer | React | Node.js"');
    if (user.workHistory?.length > 0) strengths.push('Work history added — ' + user.workHistory.length + ' position' + (user.workHistory.length > 1 ? 's' : '') + ' listed');
    else improvements.push('Add work history or internship experience');
    if (user.educationList?.length > 0) strengths.push('Education section complete');
    else missing.push('Add your education details');
    if (user.portfolioProjects?.length > 0) strengths.push(user.portfolioProjects.length + ' portfolio project' + (user.portfolioProjects.length > 1 ? 's' : '') + ' listed — great for freshers');
    else improvements.push('Add portfolio projects — very important for freshers');
    if (user.certifications?.length > 0) strengths.push('Certifications listed — builds recruiter trust');
    let atsScore = 0;
    if (hasResume) atsScore += 25;
    if (skills.length >= 3) atsScore += 20;
    if (user.headline) atsScore += 15;
    if (user.bio) atsScore += 15;
    if (user.educationList?.length > 0) atsScore += 10;
    if (user.workHistory?.length > 0) atsScore += 15;
    return res.json({ success: true, data: { atsScore, strengths, improvements, missing, totalSkills: skills.length, skillsList: skills.slice(0, 8) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getATSScore = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check cache
    const cacheKey = `ats:${userId}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    const user = await User.findById(userId)
      .select('parsedResumeText parsedSkills skills bio');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Use parsedResumeText if available, else use bio + skills
    const resumeText = user.parsedResumeText ||
      `${user.bio || ''} Skills: ${(user.parsedSkills || user.skills || []).join(', ')}`;

    const result = scoreATS(resumeText, user);

    setCache(cacheKey, result, 600);

    return res.json({ success: true, data: result });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const analyzeJobDescription = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || description.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });
    }
    const result = analyzeJD(description);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }
    return res.json({ success: true, data: result });
  } catch (err) {
    logger.error('JD Analyzer error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateCoverLetter, generateInterviewQuestions, generateResumeFeedback, getATSScore, analyzeJobDescription};