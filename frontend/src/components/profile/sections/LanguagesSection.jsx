import { useState } from 'react';
import { Plus, Languages } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const EMPTY = { language: '', proficiency: 'intermediate' };

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'native'];

const LEVEL_STYLES = {
  beginner:     { bar: 'w-1/4',  color: 'bg-gray-300',   label: 'text-gray-400'   },
  intermediate: { bar: 'w-2/4',  color: 'bg-blue-400',   label: 'text-blue-500'   },
  advanced:     { bar: 'w-3/4',  color: 'bg-orange-400', label: 'text-orange-500' },
  native:       { bar: 'w-full', color: 'bg-green-400',  label: 'text-green-600'  },
};

function LanguageCard({ lang, theme, onEdit, onRemove }) {
  const level = LEVEL_STYLES[lang.proficiency] || LEVEL_STYLES.intermediate;

  return (
  <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition">

    <div className="flex items-start gap-3">

      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${theme.badge}`}>
        <Languages size={16} />
      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">
            {lang.language}
          </p>

          <p className={`text-xs font-medium capitalize ${level.label}`}>
            {lang.proficiency}
          </p>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${level.bar} ${level.color}`}
          />
        </div>

        <div className="mt-3 flex justify-end gap-4">
          <button
            onClick={onEdit}
            className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
          >
            Remove
          </button>
        </div>

      </div>
    </div>

  </div>
);
}

export default function LanguagesSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const [list,      setList]      = useState(profile?.languages || []);
  const [showForm,  setShowForm]  = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

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
    await onSave({ languages: updated });
    setSaving(false);
  };

  const handleSubmit = async () => {
    if (!form.language.trim()) {
      setError('Please enter a language name.');
      return;
    }
    if (list.some((l, i) => l.language.toLowerCase() === form.language.trim().toLowerCase() && i !== editIndex)) {
      setError('This language is already added.');
      return;
    }

    const updated = editIndex !== null
      ? list.map((item, i) => i === editIndex ? { ...form, language: form.language.trim() } : item)
      : [...list, { ...form, language: form.language.trim() }];

    setList(updated);
    setSaving(true);
    await onSave({ languages: updated });
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY);
    setEditIndex(null);
    setError('');
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
          <h2 className="font-sora font-bold text-gray-900 text-lg">Languages</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {list.length} language{list.length !== 1 ? 's' : ''} added
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
          <p className="text-sm text-gray-400">No languages added yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Add languages you speak to strengthen your profile.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-3">
          {list.map((lang, index) => (
            <LanguageCard
              key={index}
              lang={lang}
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
            {editIndex !== null ? 'Edit Language' : 'Add Language'}
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Language
              </label>
              <input
                value={form.language}
                onChange={e => { setForm({ ...form, language: e.target.value }); setError(''); }}
                placeholder="e.g. Tamil, English, Hindi"
                className={inputClass}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                Proficiency Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROFICIENCY_LEVELS.map(level => {
                  const style    = LEVEL_STYLES[level];
                  const selected = form.proficiency === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm({ ...form, proficiency: level })}
                      className={`
                        px-3 py-2 rounded-lg text-xs font-medium capitalize
                        border cursor-pointer transition text-left
                        ${selected
                          ? `${theme.buttonLight} border-current`
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }
                      `}>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-1 rounded-full ${style.color}`} />
                        {level}
                      </div>
                    </button>
                  );
                })}
              </div>
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
