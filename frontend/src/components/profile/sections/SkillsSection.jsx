// SkillsSection.jsx
import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

function SkillTag({ skill, theme, onRemove, removing }) {

  const levelColors = {
    beginner:     'bg-gray-100 text-gray-500',
    intermediate: 'bg-blue-50 text-blue-600',
    advanced:     'bg-orange-50 text-orange-600',
    expert:       'bg-green-50 text-green-600',
  };

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-1.5 shadow-sm">
      <span className="text-sm font-medium text-gray-800">{skill.name}</span>

      {skill.proficiency && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${levelColors[skill.proficiency] || levelColors.beginner}`}>
          {skill.proficiency}
        </span>
      )}

      {/* X button — auto saves on click */}
      <button
        onClick={() => onRemove(skill.name)}
        disabled={removing}
        className="w-4 h-4 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center cursor-pointer border-none transition disabled:opacity-40"
      >
        {removing ? (
          <Loader2 size={9} className="text-gray-400 animate-spin" />
        ) : (
          <X size={10} className="text-gray-400 hover:text-red-500" />
        )}
      </button>
    </div>
  );
}

export default function SkillsSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const initSkills = Array.isArray(profile?.skills)
    ? profile.skills.map(s =>
        typeof s === 'string'
          ? { name: s, proficiency: 'intermediate' }
          : s
      )
    : [];

  const [skills,     setSkills]     = useState(initSkills);
  const [savedSkills,setSavedSkills]= useState(initSkills);
  const [newSkill,   setNewSkill]   = useState('');
  const [newLevel,   setNewLevel]   = useState('intermediate');
  const [saving,     setSaving]     = useState(false);
  const [removing,   setRemoving]   = useState(false);
  const [showInput,  setShowInput]  = useState(false);
  const [error,      setError]      = useState('');

  const handleAdd = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) { setError('Please enter a skill name.'); return; }
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('This skill already exists.');
      return;
    }
    if (skills.length >= 20) { setError('Maximum 20 skills allowed.'); return; }
    setSkills(prev => [...prev, { name: trimmed, proficiency: newLevel }]);
    setNewSkill('');
    setError('');
    setShowInput(false);
  };

  // FIX: auto-save immediately when skill is removed
  const handleRemove = async (name) => {
    const updated = skills.filter(s => s.name !== name);
    setSkills(updated);         // update UI instantly
    setRemoving(true);
    await onSave({ skills: updated });  // save to backend immediately
    setSavedSkills(updated);    // sync saved state
    setRemoving(false);
  };

  // Manual save — only for adding new skills
  const handleSave = async () => {
    setSaving(true);
    await onSave({ skills });
    setSavedSkills([...skills]);
    setSaving(false);
  };

  // Only show Save button when skills are ADDED (not removed — that auto-saves)
  const hasNewSkills = skills.length > savedSkills.length ||
    skills.some((s, i) => savedSkills[i]?.name !== s.name || savedSkills[i]?.proficiency !== s.proficiency);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Skills</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {skills.length} of 20 skills added
          </p>
        </div>
        <button
          onClick={() => setShowInput(true)}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}
        >
          <Plus size={13} />
          Add Skill
        </button>
      </div>

      {/* Skill tags */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map(skill => (
            <SkillTag
              key={skill.name}
              skill={skill}
              theme={theme}
              onRemove={handleRemove}
              removing={removing}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 text-center mb-4">
          <p className="text-sm text-gray-400">No skills added yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Add your top skills to improve profile visibility.
          </p>
        </div>
      )}

      {/* Add skill input */}
      {showInput && (
        <div className="border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Add New Skill
          </p>
          <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => { setNewSkill(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. React, Node.js, Figma"
              className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
              autoFocus
            />
            <select
              value={newLevel}
              onChange={e => setNewLevel(e.target.value)}
              className="px-3 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none cursor-pointer"
            >
              {PROFICIENCY_LEVELS.map(l => (
                <option key={l} value={l} className="capitalize">{l}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setShowInput(false); setNewSkill(''); setError(''); }}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className={`px-3 py-1.5 text-xs text-white rounded-lg border-none cursor-pointer ${theme.button}`}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Save button — for adding new skills */}
      {hasNewSkills && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

    </div>
  );
}