import { useState } from 'react';
import { getTheme } from '../../../utils/theme';
import { Lock, Globe } from 'lucide-react';

const OPTIONS = [
  {
    value:       'public',
    label:       'Public',
    description: 'Anyone can view and download your resume',
    icon:        Globe,
    bg:          'bg-green-50',
    border:      'border-green-200',
    text:        'text-green-700',
    dot:         'bg-green-500',
  },
  {
    value:       'private',
    label:       'Private',
    description: 'Only you can see your resume',
    icon:        Lock,
    bg:          'bg-gray-50',
    border:      'border-gray-200',
    text:        'text-gray-500',
    dot:         'bg-gray-400',
  },
];

export default function ResumeVisibilitySection({ profile, isCandidate, onSave }) {
  const theme   = getTheme(isCandidate ? 'candidate' : 'company');
  const [saving, setSaving] = useState(false);

  const current = profile?.resumeVisibility || 'public';

  const handleSelect = async (value) => {
    if (value === current || saving) return;
    setSaving(true);
    await onSave({ resumeVisibility: value });
    setSaving(false);
  };

  // No resume uploaded — nothing to control
  if (!profile?.resume?.url) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-sora font-bold text-gray-900 text-lg mb-2">
          Resume Visibility
        </h2>
        <p className="text-sm text-gray-400">
          Upload a resume first to control its visibility.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="mb-5">
        <h2 className="font-sora font-bold text-gray-900 text-lg mb-1">
          Resume Visibility
        </h2>
        <p className="text-sm text-gray-400">
          Control who can see your uploaded resume.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ value, label, description, icon: Icon, bg, border, text, dot }) => {
          const isSelected = current === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              disabled={saving}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2
                text-left transition cursor-pointer
                ${isSelected
                  ? `${bg} ${border}`
                  : 'bg-white border-gray-100 hover:border-gray-200'
                }
                ${saving ? 'opacity-60 cursor-not-allowed' : ''}
              `}>

              {/* Icon circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${isSelected ? bg : 'bg-gray-50'}
              `}>
                <Icon
                  size={18}
                  className={isSelected ? text : 'text-gray-400'}
                />
              </div>

              {/* Label and description */}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isSelected ? text : 'text-gray-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
              )}
            </button>
          );
        })}
      </div>

      {saving && (
        <p className="text-xs text-gray-400 mt-3 text-center">Saving...</p>
      )}
    </div>
  );
}