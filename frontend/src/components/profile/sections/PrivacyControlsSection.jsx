import { useState } from 'react';
import { Shield, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const OPTIONS = [
  {
    value:       'public',
    label:       'Public Profile',
    description: 'Your profile is visible to everyone including recruiters and public search.',
    icon:        Globe,
    bg:          'bg-green-50',
    border:      'border-green-200',
    text:        'text-green-700',
    dot:         'bg-green-500',
  },
  {
    value:       'private',
    label:       'Private Profile',
    description: 'Your profile is hidden from public search. Only you can see it.',
    icon:        Lock,
    bg:          'bg-gray-50',
    border:      'border-gray-200',
    text:        'text-gray-500',
    dot:         'bg-gray-400',
  },
];

export default function PrivacyControlsSection({ profile, isCandidate, onSave }) {
  const theme   = getTheme(isCandidate ? 'candidate' : 'company');
  const [saving, setSaving] = useState(false);

  const current = profile?.profileVisibility || 'public';

  const handleSelect = async (value) => {
    if (value === current || saving) return;
    setSaving(true);
    await onSave({ profileVisibility: value });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center gap-2 mb-2">
        <Shield size={18} className="text-gray-400" />
        <h2 className="font-sora font-bold text-gray-900 text-lg">Privacy Controls</h2>
      </div>

      <p className="text-sm text-gray-400 mb-5">
        Control who can see your profile on HirePortal.
      </p>

      <div className="flex flex-col gap-3 mb-5">
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

              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? bg : 'bg-gray-50'}`}>
                <Icon size={18} className={isSelected ? text : 'text-gray-400'} />
              </div>

              <div className="flex-1">
                <p className={`text-sm font-semibold ${isSelected ? text : 'text-gray-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
              </div>

              {isSelected && (
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Section-level controls */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Section Visibility
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">Profile Photo</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
              profile?.photoVisibility === 'private'
                ? 'bg-gray-100 text-gray-400'
                : 'bg-green-50 text-green-600'
            }`}>
              {profile?.photoVisibility || 'public'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">Resume</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
              profile?.resumeVisibility === 'private'
                ? 'bg-gray-100 text-gray-400'
                : 'bg-green-50 text-green-600'
            }`}>
              {profile?.resumeVisibility || 'public'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">Public Profile URL</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
              current === 'private'
                ? 'bg-gray-100 text-gray-400'
                : 'bg-green-50 text-green-600'
            }`}>
              {current === 'private' ? 'hidden' : 'visible'}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-300 mt-3">
          Change photo and resume visibility in their respective sections above.
        </p>
      </div>

      {saving && (
        <p className="text-xs text-gray-400 mt-3 text-center">Saving...</p>
      )}
    </div>
  );
}