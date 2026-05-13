// jobConstants.js
// Frontend version of backend constants
// Must match backend/utils/constants.js exactly

export const JOB_TYPES = [
  { value: 'internship',  label: 'Internship' },
  { value: 'full-time',   label: 'Full Time' },
  { value: 'part-time',   label: 'Part Time' },
  { value: 'contract',    label: 'Contract' },
];

export const WORK_MODES = [
  { value: 'remote',  label: 'Remote' },
  { value: 'onsite',  label: 'Onsite' },
  { value: 'hybrid',  label: 'Hybrid' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher' },
  { value: 'junior',  label: 'Junior' },
  { value: 'mid',     label: 'Mid Level' },
  { value: 'senior',  label: 'Senior' },
];

export const JOB_STATUS = [
  { value: 'draft',     label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed',    label: 'Closed' },
];