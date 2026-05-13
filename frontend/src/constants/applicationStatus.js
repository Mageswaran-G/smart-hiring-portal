// applicationStatus.js
// One place for all application status config
// Import this in CompanyApplicationsPage and CandidateApplicationsPage

export const APPLICATION_STATUS = {
  applied:     { label: 'Applied',     color: 'bg-yellow-100 text-yellow-700' },
  reviewing:   { label: 'Reviewing',   color: 'bg-blue-100 text-blue-700'    },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700'},
  rejected:    { label: 'Rejected',    color: 'bg-red-100 text-red-700'      },
  hired:       { label: 'Hired',       color: 'bg-green-100 text-green-700'  },
};

export const APPLICATION_STATUS_OPTIONS = Object.keys(APPLICATION_STATUS);