import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

const EMPTY_WORK = {
  company: '', role: '', type: '',
  startMonth: '', startYear: '',
  endMonth: '',   endYear: '',
  current: false, description: ''
};

const MONTHS = [
  { v: '', l: 'Month' },
  { v: '01', l: 'January' },  { v: '02', l: 'February' },
  { v: '03', l: 'March' },    { v: '04', l: 'April' },
  { v: '05', l: 'May' },      { v: '06', l: 'June' },
  { v: '07', l: 'July' },     { v: '08', l: 'August' },
  { v: '09', l: 'September' },{ v: '10', l: 'October' },
  { v: '11', l: 'November' }, { v: '12', l: 'December' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR + 5 - i);

function DateSelect({ monthName, yearName, monthVal, yearVal, onChange, disabled, theme }) {
  const sel = `w-full px-2.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none bg-white ${
    disabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : theme.focus
  }`;
  return (
    <div className="grid grid-cols-2 gap-2">
      <select name={monthName} value={monthVal} onChange={onChange} disabled={disabled} className={sel}>
        {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
      </select>
      <select name={yearName} value={yearVal} onChange={onChange} disabled={disabled} className={sel}>
        <option value="">Year</option>
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

function formatDate(month, year) {
  if (!month && !year) return '';
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = month ? monthNames[parseInt(month) - 1] : '';
  return [m, year].filter(Boolean).join(' ');
}

function WorkCard({ work, onEdit, onDelete, theme }) {
  const start = formatDate(work.startMonth, work.startYear);
  const end   = work.current ? 'Present' : formatDate(work.endMonth, work.endYear);
  const range = [start, end].filter(Boolean).join(' — ');

  return (
    <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{work.role || 'Untitled Role'}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {work.company}{work.type ? ` · ${work.type}` : ''}
        </p>
        {range && <p className="text-xs text-gray-400 mt-1">{range}</p>}
        {work.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{work.description}</p>}
        {work.current && (
          <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${theme.primary}15`, color: theme.primary }}>
            Currently Working
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

export default function WorkHistorySection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const [showForm,  setShowForm]  = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState(EMPTY_WORK);

  const list = profile?.workHistory || [];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'current') {
      setForm(prev => ({ ...prev, current: checked, endMonth: checked ? '' : prev.endMonth, endYear: checked ? '' : prev.endYear }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleAdd    = () => { setForm(EMPTY_WORK); setEditIndex(null); setShowForm(true); };
  const handleEdit   = (i) => { setForm(list[i]);   setEditIndex(i);   setShowForm(true); };
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

  const inputClass = `w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Work Experience</h2>
        <button onClick={handleAdd}
          className="text-xs px-3 py-1.5 rounded-lg border cursor-pointer"
          style={{ borderColor: theme.primary, color: theme.primary }}>
          + Add
        </button>
      </div>

      {list.length === 0 && !showForm && (
        <p className="text-sm text-gray-300 italic">No work experience added yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {list.map((work, index) => (
          <WorkCard key={index} work={work} theme={theme}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)} />
        ))}
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {editIndex !== null ? 'Edit Experience' : 'Add Experience'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Job Title</label>
              <input name="role" value={form.role} onChange={handleChange}
                placeholder="e.g. Frontend Developer" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Company</label>
              <input name="company" value={form.company} onChange={handleChange}
                placeholder="e.g. Google, Microsoft" className={inputClass} />
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
            <div />

            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Start Date</label>
              <DateSelect
                monthName="startMonth" yearName="startYear"
                monthVal={form.startMonth} yearVal={form.startYear}
                onChange={handleChange} disabled={false} theme={theme} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">
                End Date
                {form.current && <span className="text-gray-300 font-normal normal-case ml-1">(cleared)</span>}
              </label>
              <DateSelect
                monthName="endMonth" yearName="endYear"
                monthVal={form.endMonth} yearVal={form.endYear}
                onChange={handleChange} disabled={form.current} theme={theme} />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                <input type="checkbox" name="current" checked={form.current} onChange={handleChange}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: theme.primary }} />
                <span className="text-sm text-gray-700">Currently working here</span>
              </label>
              {form.current && (
                <p className="text-xs text-gray-400 mt-1 ml-6">End date cleared automatically.</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={2} placeholder="Brief description of your role and responsibilities"
                className={`${inputClass} resize-y`} />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button onClick={() => { setShowForm(false); setForm(EMPTY_WORK); }}
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