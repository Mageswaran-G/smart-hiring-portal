// JobStatusBadge.jsx
// Small colored badge showing job status or work mode

export default function JobStatusBadge({ type, value }) {

  // Status badge colors
  const statusColors = {
    published: 'bg-green-100 text-green-700',
    draft:     'bg-yellow-100 text-yellow-700',
    closed:    'bg-gray-100 text-gray-500',
  };

  // Work mode badge colors
  const workModeColors = {
    remote:  'bg-blue-100 text-blue-700',
    onsite:  'bg-purple-100 text-purple-700',
    hybrid:  'bg-orange-100 text-orange-700',
  };

  // Job type badge colors
  const jobTypeColors = {
    internship: 'bg-pink-100 text-pink-700',
    'full-time': 'bg-indigo-100 text-indigo-700',
    'part-time': 'bg-teal-100 text-teal-700',
    contract:   'bg-red-100 text-red-700',
  };

  // Pick colors based on type
  const colorMap = {
    status:   statusColors,
    workMode: workModeColors,
    jobType:  jobTypeColors,
  };

  const color = colorMap[type]?.[value] || 'bg-gray-100 text-gray-500';
  const label = value?.replace('-', ' ') || '';

  return (
    <span className={`
      inline-block px-2.5 py-0.5 rounded-full
      text-xs font-semibold capitalize
      ${color}
    `}>
      {label}
    </span>
  );
}