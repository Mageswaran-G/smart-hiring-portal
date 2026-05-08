import { useState, useRef } from 'react';
import { Plus, Star, Trash2, FileText, ExternalLink } from 'lucide-react';
import { getTheme } from '../../../utils/theme';
import { API } from '../../../services/authService';
import { API_ENDPOINTS } from '../../../constants/api';

function ResumeCard({ resume, index, theme, isDefault, onSetDefault, onDelete }) {
  const sizeKB  = resume.size ? `${(resume.size / 1024).toFixed(0)} KB` : '';
  const fileUrl = `${import.meta.env.VITE_API_URL}${resume.url}`;

  return (
    <div className={`p-4 border-2 rounded-xl transition ${isDefault ? 'border-opacity-100' : 'border-gray-100 hover:border-gray-200'}`}
      style={{ borderColor: isDefault ? theme.primary : undefined }}>

      <div className="flex items-start gap-3">

        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${theme.badge}`}>
          <FileText size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {resume.label || resume.originalName || 'Resume'}
            </p>
            {isDefault && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                style={{ background: `${theme.primary}15`, color: theme.primary }}>
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {resume.mimeType?.includes('pdf') ? 'PDF' : 'Word'}
            {sizeKB ? ` · ${sizeKB}` : ''}
            {resume.uploadedAt
              ? ` · ${new Date(resume.uploadedAt).toLocaleDateString('en-IN')}`
              : ''}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition no-underline">
            <ExternalLink size={14} className="text-gray-400" />
          </a>
          {!isDefault && (
            <button
              onClick={() => onSetDefault(index)}
              title="Set as default"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-yellow-50 transition cursor-pointer border-none">
              <Star size={14} className="text-gray-400" />
            </button>
          )}
          <button
            onClick={() => onDelete(index)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-red-50 transition cursor-pointer border-none">
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MultipleResumesSection({ profile, isCandidate, onProfileRefresh }) {
  const theme      = getTheme(isCandidate ? 'candidate' : 'company');
  const fileRef    = useRef(null);

  const [resumes,    setResumes]    = useState(profile?.resumes || []);
  const [label,      setLabel]      = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const showMsg = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
    else                    { setError(msg);   setTimeout(() => setError(''), 4000);   }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!label.trim()) { showMsg('error', 'Please enter a label before uploading.'); return; }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('label', label.trim());

      const res = await API.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newResume = {
        ...res.data.data.resume,
        label:     label.trim(),
        isDefault: resumes.length === 0,
      };

      const updated = [...resumes, newResume];
      setResumes(updated);
      setLabel('');
      setShowForm(false);
      showMsg('success', 'Resume uploaded successfully.');

      if (onProfileRefresh) onProfileRefresh();

    } catch (err) {
      showMsg('error', err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSetDefault = async (index) => {
    const updated = resumes.map((r, i) => ({ ...r, isDefault: i === index }));
    setResumes(updated);
    setSaving(true);
    try {
      await API.put('/users/profile', { resumes: updated });
      showMsg('success', 'Default resume updated.');
    } catch {
      showMsg('error', 'Could not update default resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index) => {
    const updated  = resumes.filter((_, i) => i !== index);
    const hasDefault = updated.some(r => r.isDefault);
    if (!hasDefault && updated.length > 0) updated[0].isDefault = true;
    setResumes(updated);
    setSaving(true);
    try {
      await API.put('/users/profile', { resumes: updated });
      showMsg('success', 'Resume removed.');
    } catch {
      showMsg('error', 'Could not remove resume.');
    } finally {
      setSaving(false);
    }
  };

  const defaultIndex = resumes.findIndex(r => r.isDefault);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Resumes</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded · Max 5
          </p>
        </div>
        {resumes.length < 5 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            <Plus size={13} />
            Upload Resume
          </button>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm mb-4">
          {error}
        </div>
      )}

      {resumes.length === 0 && !showForm ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400">No resumes uploaded yet.</p>
          <p className="text-xs text-gray-300 mt-1">
            Upload different resumes for different job types.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-3">
          {resumes.map((resume, index) => (
            <ResumeCard
              key={index}
              resume={resume}
              index={index}
              theme={theme}
              isDefault={index === defaultIndex}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Upload New Resume
          </p>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
              Resume Label
            </label>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Frontend Developer Resume"
              className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
              autoFocus
            />
            <p className="text-xs text-gray-300 mt-1">
              Give a clear name so you know which resume this is.
            </p>
          </div>

          <input
            type="file"
            ref={fileRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setLabel(''); setError(''); }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => { if (!label.trim()) { showMsg('error', 'Enter a label first.'); return; } fileRef.current?.click(); }}
              disabled={uploading}
              className={`flex-1 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {uploading ? 'Uploading...' : 'Choose File and Upload'}
            </button>
          </div>

          <p className="text-xs text-gray-300 mt-2 text-center">PDF, DOC, DOCX — Max 5MB</p>
        </div>
      )}

      {resumes.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-400">
            The resume marked as <span className="font-semibold text-gray-600">Default</span> will be sent to recruiters automatically.
            Click the star icon on any resume to set it as default.
          </p>
        </div>
      )}
    </div>
  );
}