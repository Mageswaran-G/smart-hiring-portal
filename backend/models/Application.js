const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

  // Candidate who applied
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Job applied to
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },

  // Optional cover letter
  coverLetter: {
    type: String,
    trim: true,
    maxlength: 2000,
  },

  // Resume used at apply time
  resume: {
    type: String,
    default: '',
  },

  // Application status
  status: {
    type: String,
    enum: [
      'applied',
      'reviewing',
      'shortlisted',
      'rejected',
      'hired',
      'withdrawn',
    ],
    default: 'applied',
  },

  // Set when candidate withdraws
  withdrawnAt: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true,
});


// Prevent duplicate active applications
// Allow reapply after withdraw
applicationSchema.index(
  { candidate: 1, job: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: 'withdrawn' } },
  }
);

applicationSchema.index({ status: 1 });
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ job: 1 });

// Fast candidate application history
applicationSchema.index({ candidate: 1, createdAt: -1 });
// Fast job applicants sorted by date
applicationSchema.index({ job: 1, createdAt: -1 });
// Fast status filtering per job
applicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model(
  'Application',
  applicationSchema
);