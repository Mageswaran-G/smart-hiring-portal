import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function OpenToWorkSection({ profile, isCandidate, onSave }) {
  const theme  = getTheme(isCandidate ? 'candidate' : 'company');
  const [saving, setSaving] = useState(false);

  // Toggle directly — no edit mode needed for a simple boolean
  const handleToggle = async () => {
    setSaving(true);
    await onSave({ openToWork: !profile?.openToWork });
    setSaving(false);
  };

  const isOpen = profile?.openToWork === true;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg mb-1">
            Open to Work
          </h2>
          <p className="text-sm text-gray-400">
            {isOpen
              ? 'You are visible to recruiters as available.'
              : 'Turn this on to let recruiters know you are looking.'
            }
          </p>
        </div>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`
            relative w-12 h-6 rounded-full border-none cursor-pointer
            transition-colors duration-300
            ${isOpen ? 'bg-green-500' : 'bg-gray-200'}
            ${saving ? 'opacity-60 cursor-not-allowed' : ''}
          `}>
          <span className={`
            absolute top-0.5 left-0.5
            w-5 h-5 rounded-full bg-white shadow-sm
            transition-transform duration-300
            ${isOpen ? 'translate-x-6' : 'translate-x-0'}
          `} />
        </button>
      </div>

      {/* Status badge — shows when open to work */}
      {isOpen && (
        <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Your profile is marked as Open to Work
          </p>
        </div>
      )}

      {!isOpen && (
        <div className="mt-4 flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
          <p className="text-sm text-gray-400">
            Not visible to recruiters currently
          </p>
        </div>
      )}

    </div>
  );
}