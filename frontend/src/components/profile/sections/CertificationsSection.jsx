import { useState } from 'react';
import { Plus, ExternalLink, Award } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const EMPTY = { name: '', issuer: '', year: '', url: '' };

function CertCard({ cert, theme, onEdit, onRemove }) {
  return (
    <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${theme.badge}`}>
          <Award size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {cert.issuer}{cert.year ? ` · ${cert.year}` : ''}
          </p>
          {cert.url && (
            <a
              href={cert.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-1 font-medium"
              style={{ color: theme.primary }}>
              View Certificate
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0 ml-2">
        <button onClick={onEdit}   className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Edit</button>
        <button onClick={onRemove} className="text-xs text-red-400  hover:text-red-600  cursor-pointer">Remove</button>
      </div>
    </div>
  );
}

export default function CertificationsSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const [list,      setList]      = useState(profile?.certifications || []);
  const [showForm,  setShowForm]  = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  // ✅ Number-only class (hide spinner arrows)
  const numberInputClass = `${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // ✅ Block anything that is not a digit
  const allowNumbersOnly = e => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleAdd  = () => { setForm(EMPTY); setEditIndex(null); setShowForm(true); };

  const handleEdit = (index) => {
    setForm(list[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleRemove = async (index) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    setSaving(true);
    await onSave({ certifications: updated });
    setSaving(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim())   { setError('Certificate name is required.');    return; }
    if (!form.issuer.trim()) { setError('Issuing organization is required.'); return; }

    const updated = editIndex !== null
      ? list.map((item, i) => i === editIndex ? form : item)
      : [...list, form];

    setList(updated);
    setSaving(true);
    await onSave({ certifications: updated });
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(EMPTY);
    setError('');
    setEditIndex(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Certifications</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {list.length} certificate{list.length !== 1 ? 's' : ''} added
          </p>
        </div>
        <button
          onClick={handleAdd}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
          <Plus size={13} />
          Add
        </button>
      </div>

      {list.length === 0 && !showForm ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400">No certifications added yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Add certifications to stand out to recruiters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-3">
          {list.map((cert, index) => (
            <CertCard
              key={index}
              cert={cert}
              theme={theme}
              onEdit={() => handleEdit(index)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            {editIndex !== null ? 'Edit Certificate' : 'Add Certificate'}
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Certificate Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. AWS Certified Developer"
                className={inputClass}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                  Issuing Organization
                </label>
                <input
                  name="issuer"
                  value={form.issuer}
                  onChange={handleChange}
                  placeholder="e.g. Amazon Web Services"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                  Year
                </label>
                {/* ✅ Year field — numbers only */}
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  type="number"
                  onKeyDown={allowNumbersOnly}
                  className={numberInputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Certificate URL
              </label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://credential-link.com"
                className={inputClass}
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
                {saving ? 'Saving...' : editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}