const { getChatResponse } = require('../../ai/chatEngine');
const User = require('../../models/User');
const Job = require('../../models/Job');
const Application = require('../../models/Application');

exports.sendMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user.id;
    const role   = req.user.role;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Build context based on role
    let context = {};

    if (role === 'candidate') {
      const user = await User.findById(userId).select('name skills');
      const apps = await Application.find({ candidate: userId });
      context = {
        name:              user?.name || '',
        skills:            user?.skills || [],
        totalApplications: apps.length,
        shortlisted:       apps.filter(a => a.status === 'shortlisted').length,
        hired:             apps.filter(a => a.status === 'hired').length,
      };
    }

    if (role === 'company') {
      const user = await User.findById(userId).select('companyName');
      const jobs = await Job.find({ postedBy: userId, isDeleted: false });
      const jobIds = jobs.map(j => j._id);
      const apps = await Application.find({ job: { $in: jobIds } });
      context = {
        companyName: user?.companyName || '',
        totalJobs:   jobs.length,
        totalApps:   apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        hired:       apps.filter(a => a.status === 'hired').length,
      };
    }

    if (role === 'admin') {
      const [totalUsers, totalCompanies, totalJobs, totalApplications] = await Promise.all([
        User.countDocuments({ isDeleted: { $ne: true } }),
        User.countDocuments({ role: 'company', isDeleted: { $ne: true } }),
        Job.countDocuments({ isDeleted: false }),
        Application.countDocuments(),
      ]);
      context = { totalUsers, totalCompanies, totalJobs, totalApplications };
    }

    const result = await getChatResponse(message.trim(), role, context, history);

    return res.status(200).json({
      success: true,
      data: { reply: result.reply },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
