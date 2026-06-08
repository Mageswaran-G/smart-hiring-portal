const mongoose = require('mongoose');
const { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS, JOB_STATUS } = require('../utils/constants');
const jobSchema = new mongoose.Schema(
  {

    slug: {
      type:      String,
      unique:    true,
      sparse:    true,    // allows null/undefined during creation
      lowercase: true,
      index:     true,    // fast lookup by slug
    },

    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },

    // No companyName. Use populate() instead.
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    jobType: {
      type: String,
      enum: JOB_TYPES,
      required: [true, 'Job type is required'],
      trim: true,
    },

    workMode: {
      type: String,
      enum: WORK_MODES,
      required: [true, 'Work mode is required'],
      trim: true,
    },

    // Structured salary with validation
    salary: {
      min: { type: Number, default: 0 },
      max: {
        type:     Number,
        default:  0,
        validate: {
          validator: function(max) {
            // max must be >= min (or 0 if not set)
            return max === 0 || max >= this.salary.min;
          },
          message: 'Maximum salary must be greater than minimum salary'
        }
      },
      currency:    { type: String, default: 'INR' },
      isDisclosed: { type: Boolean, default: false },
    },

    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      default: 'fresher',
      trim: true,
    },

    //  Default deadline 30 days from now
    deadline: {
      type: Date,
      validate: {
        validator: function(date) {
          // Allow no deadline (undefined/null)
          // If deadline set, it must be in the future
          if (!date) return true;
          return date > new Date();
        },
        message: 'Application deadline must be a future date',
      }
    },

    openings: {
      type: Number,
      default: 1,
      min: [1, 'Openings must be at least 1'],
    },

    // Requirements, Responsibilities, Benefits
    requirements: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: JOB_STATUS,
      default: 'draft',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Count applications without DB query
    applicationsCount: {
      type: Number,
      default: 0,
    },

    // Track how many times job details page was viewed
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text search index — fast search
jobSchema.index({
  title: 'text',
  description: 'text',
  skillsRequired: 'text',
});

//  Compound index — fast company dashboard
jobSchema.index({
  postedBy: 1,
  createdAt: -1,
});

jobSchema.index({ isDeleted: 1, isActive: 1 });
jobSchema.index({ deadline: 1 });

// Fast AI recommendation queries
jobSchema.index({ isDeleted: 1, isActive: 1, status: 1, deadline: 1 });
// Fast experience level filtering
jobSchema.index({ experienceLevel: 1, isActive: 1 });


module.exports = mongoose.model('Job', jobSchema);