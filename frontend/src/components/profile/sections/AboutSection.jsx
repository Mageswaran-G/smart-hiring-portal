import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function AboutSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [editing, setEditing] = useState(false);
  const [bio, setBio]         = useState(profile?.bio || '');
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ bio });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">About</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <p className="text-sm text-gray-600 leading-relaxed">
          {profile?.bio || <em className="text-gray-300">No about section yet. Click Edit to add.</em>}
        </p>
      ) : (
        <>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Write a short summary about yourself..."
            className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none resize-y ${theme.focus}`}
          />
          <p className="text-xs text-gray-300 mt-1">{bio.length}/1000</p>
          <div className="flex gap-2 justify-end mt-3">
            <button onClick={() => { setEditing(false); setBio(profile?.bio || ''); }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}