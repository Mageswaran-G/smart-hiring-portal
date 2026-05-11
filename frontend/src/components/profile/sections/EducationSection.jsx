import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

const EMPTY_EDU = {
  degree: '', field: '', institution: '',
  startYear: '', endYear: '', grade: '', current: false
};

function EduCard({ edu, onEdit, onDelete, theme }) {
  const yearRange = edu.current
    ? `${edu.startYear} — Present`
    : `${edu.startYear}${edu.endYear ? ` — ${edu.endYear}` : ''}`;

  return (
    <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">
          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{edu.institution}</p>
        <p className="text-xs text-gray-400 mt-1">
          {yearRange}{edu.grade ? ` · ${edu.grade}` : ''}
        </p>
        {edu.current && (
          <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${theme.primary}15`, color: theme.primary }}>
            Currently Studying
          </span>
        )}
      </div>
      <div className="flex gap-2 ml-3 shrink-0">
        <button onClick={onEdit} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Edit</button>
        <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
      </div>
    </div>
  );
}

export default function EducationSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [showForm,  setShowForm]  = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState(EMPTY_EDU);

  const list = profile?.educationList || [];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (name === 'current') {
      // When checking "currently studying" — clear end year automatically
      setForm(prev => ({ ...prev, current: checked, endYear: checked ? '' : prev.endYear }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleAdd    = () => { setForm(EMPTY_EDU); setEditIndex(null); setShowForm(true); };
  const handleEdit   = (i) => { setForm(list[i]);  setEditIndex(i);   setShowForm(true); };
  const handleDelete = async (i) => {
    await onSave({ educationList: list.filter((_, idx) => idx !== i) });
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = editIndex !== null
      ? list.map((item, i) => i === editIndex ? form : item)
      : [...list, form];
    await onSave({ educationList: updated });
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY_EDU);
    setEditIndex(null);
  };

  const inputClass = `w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Education</h2>
        <button onClick={handleAdd}
          className="text-xs px-3 py-1.5 rounded-lg border cursor-pointer"
          style={{ borderColor: theme.primary, color: theme.primary }}>
          + Add
        </button>
      </div>

      {list.length === 0 && !showForm && (
        <p className="text-sm text-gray-300 italic">No education added yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {list.map((edu, index) => (
          <EduCard
            key={index}
            edu={edu}
            theme={theme}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {editIndex !== null ? 'Edit Education' : 'Add Education'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange}
                placeholder="e.g. B.Tech, MBA, B.Sc" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Field of Study</label>
              <input name="field" value={form.field} onChange={handleChange}
                placeholder="e.g. Computer Science" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Institution</label>
              <input name="institution" value={form.institution} onChange={handleChange}
                placeholder="e.g. University name" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Start Year</label>
              <input
                type="number"
                name="startYear"
                value={form.startYear}
                onChange={handleChange}
                min="1950"
                max={currentYear}
                placeholder="e.g. 2020"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">
                End Year {form.current && <span className="text-gray-300 font-normal normal-case">(cleared — currently studying)</span>}
              </label>
              <input
                type="number"
                name="endYear"
                value={form.endYear}
                onChange={handleChange}
                min="1950"
                max={currentYear + 10}
                placeholder="e.g. 2024"
                disabled={form.current}
                className={`${inputClass} ${form.current ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''}`}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Grade / CGPA</label>
              <input name="grade" value={form.grade} onChange={handleChange}
                placeholder="e.g. 8.5 CGPA" className={inputClass} />
            </div>

            {/* Currently studying checkbox */}
            <div className="flex items-center">
              <label className="flex items-center gap-2.5 cursor-pointer w-fit mt-4">
                <input
                  type="checkbox"
                  name="current"
                  checked={form.current}
                  onChange={handleChange}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: theme.primary }}
                />
                <span className="text-sm text-gray-700">Currently studying here</span>
              </label>
            </div>

            {form.current && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 ml-6">
                  End year has been cleared automatically.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button onClick={() => { setShowForm(false); setForm(EMPTY_EDU); }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer"
              style={{ background: theme.primary }}>
              {saving ? 'Saving...' : editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}