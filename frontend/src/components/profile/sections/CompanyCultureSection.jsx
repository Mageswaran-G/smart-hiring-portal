import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function CompanyCultureSection({ profile, onSave }) {
  const theme = getTheme('company');

  const [editing, setEditing] = useState(false);
  const [culture, setCulture] = useState(profile?.companyCulture || '');
  const [saving,  setSaving]  = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ companyCulture: culture });
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setCulture(profile?.companyCulture || '');
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Company Culture</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Share your work environment and values
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          {profile?.companyCulture ? (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {profile.companyCulture}
            </p>
          ) : (
            <p className="text-sm text-gray-300 italic">
              No culture description added yet. Click Edit to add.
            </p>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={culture}
            onChange={e => setCulture(e.target.value)}
            rows={5}
            maxLength={3000}
            placeholder="Describe your company culture, values, work environment, team spirit..."
            className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none resize-y ${theme.focus}`}
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-xs text-gray-300">{culture.length} / 3000</p>
            <div className="flex gap-2">
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
        </div>
      )}
    </div>
  );
}