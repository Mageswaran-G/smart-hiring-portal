// PageHeader.jsx
// Reusable page header — replaces the repeated header block everywhere

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({
  title,
  subtitle,
  backRoute,        // optional — shows back arrow if provided
  rightContent,     // optional — any JSX on the right side (button, dropdown etc)
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex items-center gap-4">
        {backRoute && (
          <button
            onClick={() => navigate(backRoute)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <div>
          <h1 className="font-sora text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {rightContent && (
        <div className="shrink-0">
          {rightContent}
        </div>
      )}

    </div>
  );
}