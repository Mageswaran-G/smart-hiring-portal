import { useState } from 'react';
import { Plus, X, Gift } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const SUGGESTIONS = [
  'Health Insurance', 'Remote Work', 'Flexible Hours', 'Annual Bonus',
  'Paid Leave', 'Learning Budget', 'Stock Options', 'Gym Membership',
  'Team Outings', 'Free Meals', 'Work from Home', 'Maternity Leave',
];

export default function EmployeeBenefitsSection({ profile, onSave }) {
  const theme = getTheme('company');

  const [benefits, setBenefits] = useState(profile?.employeeBenefits || []);
  const [input,    setInput]    = useState('');
  const [saving,   setSaving]   = useState(false);

  const handleAdd = async (value) => {
    const trimmed = (value || input).trim();
    if (!trimmed) return;
    if (benefits.includes(trimmed)) return;
    if (benefits.length >= 20) return;

    const updated = [...benefits, trimmed];
    setBenefits(updated);
    setInput('');
    setSaving(true);
    await onSave({ employeeBenefits: updated });
    setSaving(false);
  };

  const handleRemove = async (item) => {
    const updated = benefits.filter(b => b !== item);
    setBenefits(updated);
    setSaving(true);
    await onSave({ employeeBenefits: updated });
    setSaving(false);
  };

  const suggestions = SUGGESTIONS.filter(s => !benefits.includes(s));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <Gift size={18} className="text-blue-900" />
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Employee Benefits</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {benefits.length} benefit{benefits.length !== 1 ? 's' : ''} added
          </p>
        </div>
      </div>

      {/* Current benefits */}
      {benefits.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {benefits.map(benefit => (
            <div key={benefit}
              className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full pl-3 pr-2 py-1.5">
              <span className="text-sm font-medium text-blue-900">{benefit}</span>
              <button
                onClick={() => handleRemove(benefit)}
                className="w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center cursor-pointer border-none transition">
                <X size={10} className="text-blue-700" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom benefit */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a benefit..."
          className={`flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
        />
        <button
          onClick={() => handleAdd()}
          disabled={!input.trim() || saving}
          className={`px-4 py-2.5 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
          <Plus size={16} />
        </button>
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Quick Add
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 8).map(s => (
              <button
                key={s}
                onClick={() => handleAdd(s)}
                className="text-xs px-3 py-1.5 border border-dashed border-gray-200 rounded-full text-gray-500 hover:border-blue-300 hover:text-blue-700 cursor-pointer bg-transparent transition">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {saving && (
        <p className="text-xs text-gray-400 mt-3">Saving...</p>
      )}
    </div>
  );
}