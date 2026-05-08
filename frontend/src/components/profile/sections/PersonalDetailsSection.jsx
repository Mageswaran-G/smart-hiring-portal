import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function PersonalDetailsSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    dateOfBirth: profile?.dateOfBirth || '',
    gender:      profile?.gender      || '',
    city:        profile?.city        || '',
    state:       profile?.state       || '',
    country:     profile?.country     || 'India',
    phone:       profile?.phone       || '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setEditing(false);
  };

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Personal Details</h2>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Date of Birth', value: profile?.dateOfBirth },
            { label: 'Gender',        value: profile?.gender?.replace('_', ' ') },
            { label: 'Phone',         value: profile?.phone },
            { label: 'City',          value: profile?.city },
            { label: 'State',         value: profile?.state },
            { label: 'Country',       value: profile?.country },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
              <p className="text-sm text-gray-800 mt-0.5">
                {value || <em className="text-gray-300">Not set</em>}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">City</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Chennai" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">State</label>
            <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="Tamil Nadu" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Country</label>
            <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="India" className={inputClass} />
          </div>

          <div className="col-span-2 flex gap-2 justify-end mt-2">
            <button onClick={() => setEditing(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}