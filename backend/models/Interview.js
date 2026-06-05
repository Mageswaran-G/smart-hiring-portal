const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',        required: true },
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',        required: true },
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job',         required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  scheduledAt: { type: Date,   required: true },
  mode:        { type: String, enum: ['online', 'in-person', 'phone'], default: 'online' },
  meetingLink: { type: String, default: '' },
  location:    { type: String, default: '' },
  notes:       { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

interviewSchema.index({ candidate: 1, scheduledAt: -1 });
interviewSchema.index({ company: 1,   scheduledAt: -1 });
interviewSchema.index({ application: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
