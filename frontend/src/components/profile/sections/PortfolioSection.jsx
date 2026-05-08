import { useState } from 'react';
import { Plus, ExternalLink, FolderGit2 } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

const EMPTY = { title: '', description: '', url: '', tech: '' };

function ProjectCard({ project, theme, onEdit, onRemove }) {
  const techList = project.tech
    ? project.tech.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme.badge}`}>
            <FolderGit2 size={15} />
          </div>
          <p className="text-sm font-semibold text-gray-800">{project.title}</p>
        </div>

        <div className="flex gap-2 ml-2 shrink-0">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium"
              style={{ color: theme.primary }}>
              View
              <ExternalLink size={10} />
            </a>
          )}
          <button onClick={onEdit}   className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Edit</button>
          <button onClick={onRemove} className="text-xs text-red-400  hover:text-red-600  cursor-pointer">Remove</button>
        </div>
      </div>

      {project.description && (
        <p className="text-xs text-gray-500 mb-3 leading-relaxed pl-10">
          {project.description}
        </p>
      )}

      {techList.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-10">
          {techList.map(tech => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortfolioSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const [list,      setList]      = useState(profile?.portfolioProjects || []);
  const [showForm,  setShowForm]  = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
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
    await onSave({ portfolioProjects: updated });
    setSaving(false);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Project title is required.');
      return;
    }

    const updated = editIndex !== null
      ? list.map((item, i) => i === editIndex ? form : item)
      : [...list, form];

    setList(updated);
    setSaving(true);
    await onSave({ portfolioProjects: updated });
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
          <h2 className="font-sora font-bold text-gray-900 text-lg">Portfolio Projects</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {list.length} project{list.length !== 1 ? 's' : ''} added
          </p>
        </div>
        <button
          onClick={handleAdd}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
          <Plus size={13} />
          Add Project
        </button>
      </div>

      {list.length === 0 && !showForm ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400">No projects added yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Showcase your work to stand out from other candidates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-3">
          {list.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
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
            {editIndex !== null ? 'Edit Project' : 'Add Project'}
          </p>

          <div className="flex flex-col gap-3">

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Project Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Smart Hiring Portal"
                className={inputClass}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description of what this project does..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Project URL
              </label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://github.com/yourname/project"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                Tech Stack
              </label>
              <input
                name="tech"
                value={form.tech}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB (comma separated)"
                className={inputClass}
              />
              <p className="text-xs text-gray-300 mt-1">Separate each technology with a comma</p>
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
