import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function SocialLinksSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    linkedIn:  profile?.linkedIn  || '',
    github:    profile?.github    || '',
    portfolio: profile?.portfolio || '',
  });

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
        <h2 className="font-sora font-bold text-gray-900 text-lg">Social Links</h2>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div className="flex flex-col gap-2">
          {[
            { label: 'LinkedIn',  value: profile?.linkedIn,  href: profile?.linkedIn },
            { label: 'GitHub',    value: profile?.github,    href: profile?.github },
            { label: 'Portfolio', value: profile?.portfolio, href: profile?.portfolio },
          ].map(({ label, value, href }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide w-20">{label}</span>
              {value
                ? <a href={href} target="_blank" rel="noreferrer"
                    className="text-sm truncate" style={{ color: isCandidate ? '#E65C00' : '#1D3557' }}>
                    {value}
                  </a>
                : <em className="text-sm text-gray-300">Not set</em>
              }
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">LinkedIn URL</label>
            <input value={form.linkedIn} onChange={e => setForm({ ...form, linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/yourname" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">GitHub URL</label>
            <input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })}
              placeholder="https://github.com/yourname" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Portfolio URL</label>
            <input value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })}
              placeholder="https://yourportfolio.com" className={inputClass} />
          </div>
          <div className="flex gap-2 justify-end mt-2">
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