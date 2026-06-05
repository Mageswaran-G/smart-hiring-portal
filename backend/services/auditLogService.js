// auditLogService
// Call this from any controller to record admin actions

const AuditLog = require('../models/AuditLog');

/**
 * createAuditLog — saves one audit log entry
 *
 * @param {string} performedBy  — admin user ID
 * @param {string} action       — e.g. 'suspend_user', 'delete_job'
 * @param {string} targetType   — 'user' | 'job' | 'company' | 'application' | 'system'
 * @param {string} targetId     — MongoDB ID of the affected document
 * @param {string} description  — human readable sentence
 * @param {object} meta         — any extra data (optional)
 */
const createAuditLog = async (performedBy, action, targetType, targetId, description, meta = {}) => {
  try {
    await AuditLog.create({ performedBy, action, targetType, targetId, description, meta });
  } catch (err) {
    // Never crash main flow because of audit log failure
    console.error('AuditLog error:', err.message);
  }
};

module.exports = { createAuditLog };
