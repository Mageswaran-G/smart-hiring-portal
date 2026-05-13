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
    ],
    default: 'applied',
  },

}, {
  timestamps: true,
});


// Prevent duplicate applications
applicationSchema.index(
  { candidate: 1, job: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'Application',
  applicationSchema
);