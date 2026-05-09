import { useState } from 'react';
import { Plus, X, Code2 } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'MongoDB',
  'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Redis',
  'Vue.js', 'Angular', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter',
];

export default function CompanyTechStackSection({ profile, onSave }) {
  const theme = getTheme('company');

  const [stack,  setStack]  = useState(profile?.companyTechStack || []);
  const [input,  setInput]  = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (value) => {
    const trimmed = (value || input).trim();
    if (!trimmed) return;
    if (stack.includes(trimmed)) return;
    if (stack.length >= 30) return;

    const updated = [...stack, trimmed];
    setStack(updated);
    setInput('');
    setSaving(true);
    await onSave({ companyTechStack: updated });
    setSaving(false);
  };

  const handleRemove = async (item) => {
    const updated = stack.filter(s => s !== item);
    setStack(updated);
    setSaving(true);
    await onSave({ companyTechStack: updated });
    setSaving(false);
  };

  const suggestions = SUGGESTIONS.filter(s => !stack.includes(s));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

      <div className="flex items-center gap-2 mb-5">
        <Code2 size={18} className="text-blue-900" />
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Tech Stack</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Technologies your company works with
          </p>
        </div>
      </div>

      {/* Current stack */}
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {stack.map(tech => (
            <div key={tech}
              className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-2 py-1.5">
              <span className="text-sm font-medium text-gray-700">{tech}</span>
              <button
                onClick={() => handleRemove(tech)}
                className="w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center cursor-pointer border-none transition">
                <X size={10} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {stack.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-5 text-center mb-4">
          <Code2 size={24} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No technologies added yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Add your tech stack to attract the right candidates.
          </p>
        </div>
      )}

      {/* Custom add */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. Next.js, Django, MySQL..."
          className={`flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
        />
        <button
          onClick={() => handleAdd()}
          disabled={!input.trim() || saving}
          className={`px-4 py-2.5 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
          <Plus size={16} />
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Popular Technologies
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 10).map(s => (
              <button
                key={s}
                onClick={() => handleAdd(s)}
                className="text-xs px-3 py-1.5 border border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-700 cursor-pointer bg-transparent transition">
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