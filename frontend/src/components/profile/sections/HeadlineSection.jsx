import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function HeadlineSection({ profile, isCandidate, onSave }) {
  const theme    = getTheme(isCandidate ? 'candidate' : 'company');
  const [editing, setEditing]   = useState(false);
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [saving,   setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ headline });
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setHeadline(profile?.headline || '');
    setEditing(false);
  };

  const remaining = 120 - headline.length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Headline</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <p className="text-sm text-gray-700 leading-relaxed">
          {profile?.headline
            ? profile.headline
            : <em className="text-gray-300">No headline yet. Click Edit to add.</em>
          }
        </p>
      ) : (
        <div>
          <input
            type="text"
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            maxLength={120}
            placeholder="Full Stack Developer | React | Node.js | MongoDB"
            className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
          />

          <div className="flex items-center justify-between mt-1.5">
            <p className="text-xs text-gray-300">
              Keep it short — your role, skills, or goal
            </p>
            <p className={`text-xs font-medium ${remaining < 20 ? 'text-red-400' : 'text-gray-300'}`}>
              {remaining} left
            </p>
          </div>

          <div className="flex gap-2 justify-end mt-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}