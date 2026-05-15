const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },

}, { timestamps: true });

// Prevent saving same job twice
savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

SavedJobSchema.index(
  { user: 1, job: 1 },
  { unique: true }   // one user can only save a job once
);

module.exports = mongoose.model('SavedJob', savedJobSchema);