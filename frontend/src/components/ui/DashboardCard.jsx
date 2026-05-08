// DashboardCard — reusable card for all dashboard pages
// Used in CandidateDashboard, CompanyDashboard, AdminDashboard

export default function DashboardCard({
  icon,         // Lucide icon component
  title,        // card heading
  description,  // card subtext
  onClick,      // click handler — only for active cards
  accentColor,  // left border color
  disabled,     // true = greyed out, not clickable
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 transition
        ${disabled
          ? 'opacity-60 cursor-default'
          : 'cursor-pointer hover:shadow-md'
        }`}
      style={{ borderLeftColor: disabled ? '#e5e5e5' : accentColor }}>

      {/* Icon */}
      <div className="mb-3" style={{ color: disabled ? '#9ca3af' : accentColor }}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-sora font-bold text-gray-800 mb-1 text-sm">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400">
        {description}
      </p>
    </div>
  );
}