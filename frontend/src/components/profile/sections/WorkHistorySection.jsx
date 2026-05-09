import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

const EMPTY_WORK = { company: '', role: '', type: '', startDate: '', endDate: '', current: false, description: '' };

export default function WorkHistorySection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [showForm, setShowForm]   = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(EMPTY_WORK);

  const list = profile?.workHistory || [];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAdd  = () => { setForm(EMPTY_WORK); setEditIndex(null); setShowForm(true); };
  const handleEdit = (i) => { setForm(list[i]); setEditIndex(i); setShowForm(true); };
  const handleDelete = async (i) => {
    await onSave({ workHistory: list.filter((_, idx) => idx !== i) });
  };
  const handleSave = async () => {
    setSaving(true);
    const updated = editIndex !== null
      ? list.map((item, i) => i === editIndex ? form : item)
      : [...list, form];
    await onSave({ workHistory: updated });
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY_WORK);
    setEditIndex(null);
  };

  const inputClass = `w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Work Experience</h2>
        <button onClick={handleAdd}
          className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
          + Add
        </button>
      </div>

      {list.length === 0 && !showForm && (
        <p className="text-sm text-gray-300 italic">No work experience added yet.</p>
      )}

      {list.map((work, index) => (
        <div key={index} className="border border-gray-100 rounded-xl p-4 mb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-800 text-sm">{work.role}</p>
              <p className="text-sm text-gray-500">{work.company} · {work.type}</p>
              <p className="text-xs text-gray-400 mt-1">
                {work.startDate} — {work.current ? 'Present' : work.endDate}
              </p>
              {work.description && <p className="text-xs text-gray-500 mt-1">{work.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(index)} className="text-xs text-gray-400 cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-xs text-red-400 cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {editIndex !== null ? 'Edit Experience' : 'Add Experience'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Job Title / Role</label>
              <input name="role" value={form.role} onChange={handleChange} placeholder="Frontend Developer" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google, Amazon" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Employment Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option value="">Select type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Start Date</label>
              <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Jan 2024" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">End Date</label>
              <input name="endDate" value={form.endDate} onChange={handleChange} placeholder="Dec 2024" disabled={form.current} className={inputClass} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" name="current" checked={form.current} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
              <label className="text-sm text-gray-600">Currently working here</label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={2} placeholder="Brief description of your role..." className={`${inputClass} resize-y`} />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button onClick={() => { setShowForm(false); setForm(EMPTY_WORK); }}
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