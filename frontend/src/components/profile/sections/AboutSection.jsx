import { useState, useEffect } from 'react';
import { getTheme } from '../../../utils/theme';
import useAutoSave from '../../../hooks/useAutoSave';

export default function AboutSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const [editing, setEditing] = useState(false);
  const [bio,     setBio]     = useState(profile?.bio || '');
  const [saving,  setSaving]  = useState(false);

  // Auto-save hook — saves bio draft every 1 second while editing
  const { hasDraft, getDraft, clearDraft, savedAt } = useAutoSave(
    'about_bio',
    { bio },
    editing
  );

  // When user opens edit mode — restore draft if one exists
  const handleOpenEdit = () => {
    setEditing(true);
    const draft = getDraft();
    if (draft && draft.bio) {
      setBio(draft.bio);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ bio });
    clearDraft();
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setBio(profile?.bio || '');
    clearDraft();
    setEditing(false);
  };

  const remaining = 1000 - bio.length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">About</h2>
        {!editing && (
          <button
            onClick={handleOpenEdit}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {profile?.bio
              ? profile.bio
              : <em className="text-gray-300">No about section yet. Click Edit to add.</em>
            }
          </p>
          {hasDraft && (
            <p className="text-xs text-amber-500 mt-2">
              You have an unsaved draft. Click Edit to restore it.
            </p>
          )}
        </div>
      ) : (
        <div>
          {hasDraft && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs text-amber-600 font-medium">
                Draft restored — your previous edits are back.
              </p>
            </div>
          )}

          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Write a short summary about yourself..."
            className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none resize-y ${theme.focus}`}
          />

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-2">
              {savedAt && (
                <p className="text-xs text-gray-300">
                  Draft saved at {savedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <p className={`text-xs font-medium ${remaining < 50 ? 'text-red-400' : 'text-gray-300'}`}>
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
