import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function CareerPreferencesSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    jobType:        profile?.jobType        || '',
    locationType:   profile?.locationType   || '',
    expectedSalary: profile?.expectedSalary || '',
    noticePeriod:   profile?.noticePeriod   || '',
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
        <h2 className="font-sora font-bold text-gray-900 text-lg">Career Preferences</h2>
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
            { label: 'Job Type',         value: profile?.jobType },
            { label: 'Work Location',    value: profile?.locationType },
            { label: 'Expected Salary',  value: profile?.expectedSalary },
            { label: 'Notice Period',    value: profile?.noticePeriod },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
              <p className="text-sm text-gray-800 mt-0.5 capitalize">
                {value || <em className="text-gray-300">Not set</em>}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Job Type</label>
            <select name="jobType" value={form.jobType} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Work Location</label>
            <select name="locationType" value={form.locationType} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Expected Salary</label>
            <input name="expectedSalary" value={form.expectedSalary} onChange={handleChange}
              placeholder="e.g. 5-8 LPA" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Notice Period</label>
            <input name="noticePeriod" value={form.noticePeriod} onChange={handleChange}
              placeholder="e.g. 30 days" className={inputClass} />
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