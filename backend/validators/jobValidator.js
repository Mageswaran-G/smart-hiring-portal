// jobValidator.js
// Runs BEFORE controller
// Checks required fields and validates values

const { JOB_TYPES, WORK_MODES } = require('../utils/constants');

const validateJobInput = (req, res, next) => {
  const { title, description, location, jobType, workMode } = req.body;

  const errors = [];

  // Required field checks
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }

  if (!location || location.trim() === '') {
    errors.push('Location is required');
  }

  if (!jobType) {
    errors.push('Job type is required');
  }

  if (!workMode) {
    errors.push('Work mode is required');
  }

  // Enum validation — using constants (no hardcoded arrays)
  if (jobType && !JOB_TYPES.includes(jobType)) {
    errors.push(`Invalid job type. Allowed: ${JOB_TYPES.join(', ')}`);
  }

  if (workMode && !WORK_MODES.includes(workMode)) {
    errors.push(`Invalid work mode. Allowed: ${WORK_MODES.join(', ')}`);
  }

  // Deadline — cannot be in the past
  const { deadline } = req.body;
  if (deadline) {
    const selectedDate = new Date(deadline);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.push('Deadline cannot be in the past');
    }
  }

  // Salary validation
  if (req.body.salary) {
    const { min, max } = req.body.salary;

    if (min !== undefined && (isNaN(min) || min < 0)) {
      errors.push('Salary min must be a positive number');
    }
    if (max !== undefined && (isNaN(max) || max < 0)) {
      errors.push('Salary max must be a positive number');
    }
    if (min !== undefined && max !== undefined && Number(max) < Number(min)) {
      errors.push('Salary max must be greater than or equal to min');
    }
  }

  // Stop if errors found
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateJobInput };