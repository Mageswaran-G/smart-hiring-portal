const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id:        { type: String, required: true },
  role:      { type: String, enum: ['user', 'bot'], required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role:     { type: String, enum: ['candidate', 'company', 'admin'], required: true },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
