import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

const EMPTY_EDU = { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '', current: false };

export default function EducationSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [showForm, setShowForm]   = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(EMPTY_EDU);

  const list = profile?.educationList || [];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAdd = () => { setForm(EMPTY_EDU); setEditIndex(null); setShowForm(true); };

  const handleEdit = (index) => { setForm(list[index]); setEditIndex(index); setShowForm(true); };

  const handleDelete = async (index) => {
    const updated = list.filter((_, i) => i !== index);
    await onSave({ educationList: updated });
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

  const inputClass = `w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Education</h2>
        <button onClick={handleAdd}
          className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
          + Add
        </button>
      </div>

      {list.length === 0 && !showForm && (
        <p className="text-sm text-gray-300 italic">No education added yet.</p>
      )}

      {list.map((edu, index) => (
        <div key={index} className="border border-gray-100 rounded-xl p-4 mb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-800 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</p>
              <p className="text-sm text-gray-500">{edu.institution}</p>
              <p className="text-xs text-gray-400 mt-1">
                {edu.startYear} — {edu.current ? 'Present' : edu.endYear}
                {edu.grade && ` · Grade: ${edu.grade}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(index)}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(index)}
                className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {editIndex !== null ? 'Edit Education' : 'Add Education'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange} placeholder="B.E, B.Tech, MBA..." className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Field of Study</label>
              <input name="field" value={form.field} onChange={handleChange} placeholder="Computer Science" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Institution</label>
              <input name="institution" value={form.institution} onChange={handleChange} placeholder="Anna University" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Start Year</label>
              <input name="startYear" value={form.startYear} onChange={handleChange} placeholder="2020" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">End Year</label>
              <input name="endYear" value={form.endYear} onChange={handleChange} placeholder="2024" disabled={form.current} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Grade / CGPA</label>
              <input name="grade" value={form.grade} onChange={handleChange} placeholder="8.5 CGPA" className={inputClass} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" name="current" checked={form.current} onChange={handleChange}
                className="w-4 h-4 cursor-pointer" style={{ accentColor: theme.primary }}/>
              <label className="text-sm text-gray-600">Currently studying here</label>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={() => { setShowForm(false); setForm(EMPTY_EDU); }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}