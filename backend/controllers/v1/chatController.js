const crypto = require('crypto');
const { getChatResponse } = require('../../ai/chatEngine');
const User = require('../../models/User');
const Job = require('../../models/Job');
const Application = require('../../models/Application');
const { loadHistory, saveMessages, clearHistory } = require('../../services/chatHistoryService');

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    const role   = req.user.role;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message too long. Maximum 1000 characters.' });
    }

    // Load history from DB — last 10 messages only
    const rawHistory = await loadHistory(userId);
    const safeHistory = rawHistory
      .slice(-10)
      .filter(h => ['user', 'bot'].includes(h.role))
      .map(h => ({ role: h.role, text: String(h.text || '').slice(0, 500) }));

    // Build context based on role
    let context = {};

    if (role === 'candidate') {
      const [user, apps] = await Promise.all([
        User.findById(userId).select('name skills'),
        Application.find({ candidate: userId }).select('status'),
      ]);
      context = {
        name:              user?.name || '',
        skills:            (user?.skills || []).map(s => typeof s === 'string' ? s : s?.name || s?.skill || String(s)).filter(Boolean),
        totalApplications: apps.length,
        shortlisted:       apps.filter(a => a.status === 'shortlisted').length,
        hired:             apps.filter(a => a.status === 'hired').length,
      };
    }

    if (role === 'company') {
      const [user, jobs] = await Promise.all([
        User.findById(userId).select('companyName'),
        Job.find({ postedBy: userId, isDeleted: false }).select('_id'),
      ]);
      const jobIds = jobs.map(j => j._id);
      const apps = await Application.find({ job: { $in: jobIds } }).select('status');
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

    const result = await getChatResponse(message.trim(), role, context, safeHistory);

    // Save both user message and bot reply to DB
    await saveMessages(userId, role, [
      { id: crypto.randomUUID(), role: 'user', text: message.trim() },
      { id: crypto.randomUUID(), role: 'bot',  text: result.reply },
    ]);

    return res.status(200).json({
      success: true,
      data: { reply: result.reply },
    });
  } catch (error) {
    console.error('[chatController] sendMessage error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process chat request' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const messages = await loadHistory(req.user.id);
    return res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    console.error('[chatController] getHistory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load chat history' });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await clearHistory(req.user.id);
    return res.status(200).json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('[chatController] clearHistory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear chat history' });
  }
};
