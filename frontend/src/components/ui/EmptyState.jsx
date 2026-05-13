// EmptyState.jsx
// Reusable empty state component
// Use this everywhere instead of repeating icon + title + subtitle + button

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">

      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <p className="font-sora font-bold text-gray-700 text-lg mb-1">
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-400 text-sm mb-5">
          {subtitle}
        </p>
      )}

      {/* Action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          {actionLabel}
        </button>
      )}

    </div>
  );
}