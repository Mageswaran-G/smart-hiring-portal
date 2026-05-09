import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { API } from '../../../services/authService';

export default function HiringStatusSection({ profile, onProfileRefresh }) {
  const [hiring,  setHiring]  = useState(profile?.hiringStatus || false);
  const [saving,  setSaving]  = useState(false);

  const handleToggle = async () => {
    const next = !hiring;
    setHiring(next);
    setSaving(true);
    try {
      await API.put('/users/profile', { hiringStatus: next });
      if (onProfileRefresh) onProfileRefresh();
    } catch {
      setHiring(!next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            hiring ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
          }`}>
            <Briefcase size={18} />
          </div>
          <div>
            <h2 className="font-sora font-bold text-gray-900 text-base">Hiring Status</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {hiring ? 'Visible to candidates — We are Hiring!' : 'Not currently hiring'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={saving}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer ${
            hiring ? 'bg-green-500' : 'bg-gray-200'
          }`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            hiring ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {hiring && (
        <div className="mt-4 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-xs font-semibold text-green-700">
            ✓ Candidates can see you are actively hiring
          </p>
        </div>
      )}
    </div>
  );
}