const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({

  // Who performed the action
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Action type — e.g. 'suspend_user', 'delete_job'
  action: {
    type: String,
    required: true,
    trim: true,
  },

  // Target entity type — 'user', 'job', 'company'
  targetType: {
    type: String,
    enum: ['user', 'job', 'company', 'application', 'system'],
    required: true,
  },

  // Target entity ID
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  // Human readable description
  description: {
    type: String,
    required: true,
    trim: true,
  },

  // Extra data — flexible object
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

}, {
  timestamps: true,
});

// Fast admin log queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ targetType: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
