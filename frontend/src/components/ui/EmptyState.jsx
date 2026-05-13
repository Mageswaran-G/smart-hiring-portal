// EmptyState.jsx — updated with variant support

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = 'candidate',  // 'candidate' | 'company' | 'admin'
}) {

  const buttonColors = {
    candidate: 'bg-orange-500 hover:bg-orange-600',
    company:   'bg-blue-600   hover:bg-blue-700',
    admin:     'bg-gray-800   hover:bg-gray-900',
  };

  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">

      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
            {icon}
          </div>
        </div>
      )}

      <p className="font-sora font-bold text-gray-700 text-lg mb-1">
        {title}
      </p>

      {subtitle && (
        <p className="text-gray-400 text-sm mb-5">
          {subtitle}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`${buttonColors[variant]} text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm`}
        >
          {actionLabel}
        </button>
      )}

    </div>
  );
}