const ChatHistory = require('../models/ChatHistory');

// Load chat history for a user
const loadHistory = async (userId) => {
  const record = await ChatHistory.findOne({ user: userId }).select('messages').lean();
  return record?.messages || [];
};

// Save a new message to history
const saveMessages = async (userId, role, newMessages) => {
  await ChatHistory.findOneAndUpdate(
    { user: userId },
    {
      $set:  { role },
      $push: { messages: { $each: newMessages, $slice: -100 } },
    },
    { upsert: true, new: true }
  );
};

// Clear all chat history for a user
const clearHistory = async (userId) => {
  await ChatHistory.findOneAndUpdate(
    { user: userId },
    { $set: { messages: [] } },
    { upsert: true }
  );
};

module.exports = { loadHistory, saveMessages, clearHistory };
