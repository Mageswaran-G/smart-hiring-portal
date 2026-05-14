import { useState, useRef } from 'react';
import { Plus, Star, Trash2, FileText, ExternalLink } from 'lucide-react';
import { getTheme } from '../../../utils/theme';
import { API } from '../../../services/authService';

// Fix URL — resume.url may already be full URL or just a path
function buildUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL}${url}`;
}

function ResumeCard({ resume, theme, isDefault, onSetDefault, onDelete }) {
  const sizeKB     = resume.size ? `${(resume.size / 1024).toFixed(0)} KB` : '';
  const fileUrl    = buildUrl(resume.url);
  const fileType   = resume.mimeType?.includes('pdf') ? 'PDF'
    : resume.mimeType?.includes('word') || resume.mimeType?.includes('document') ? 'Word'
    : 'File';
  const uploadDate = resume.uploadedAt
    ? new Date(resume.uploadedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : '';

  return (
    <div
      className="p-4 rounded-xl border-2 transition"
      style={{ borderColor: isDefault ? theme.primary : '#f3f4f6' }}
    >

      {/* Top row — icon + name + default badge */}
      <div className="flex items-start gap-3">

        {/* File icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${theme.primary}15`, color: theme.primary }}
        >
          <FileText size={18} />
        </div>

        {/* Info — takes all remaining width */}
        <div className="flex-1 min-w-0">

          {/* Name + DEFAULT badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-800 break-words">
              {resume.label || resume.originalName || 'Resume'}
            </p>
            {isDefault && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                style={{ background: `${theme.primary}20`, color: theme.primary }}
              >
                DEFAULT
              </span>
            )}
          </div>

          {/* File info — type · size · date */}
          <p className="text-xs text-gray-400 mt-0.5">
            {[fileType, sizeKB, uploadDate].filter(Boolean).join(' · ')}
          </p>

          {/* Action buttons — below info on mobile */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">

            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition no-underline text-gray-600"
              >
                <ExternalLink size={11} />
                View
              </a>
            )}

            {!isDefault && (
              <button
                onClick={() => onSetDefault(resume.url)}
                title="Set as default"
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-yellow-50 transition cursor-pointer border-none"
              >
                <Star size={14} className="text-gray-400 hover:text-yellow-500" />
              </button>
            )}

            <button
              onClick={() => onDelete(resume.url)}
              title="Remove resume"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-red-50 transition cursor-pointer border-none"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function MultipleResumesSection({ profile, isCandidate, onProfileRefresh }) {
  const theme   = getTheme(isCandidate ? 'candidate' : 'company');
  const fileRef = useRef(null);

  const currentResumes = profile?.resumes || [];

  const [label,     setLabel]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');

  const showMsg = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
    else                    { setError(msg);   setTimeout(() => setError(''), 4000);   }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!label.trim()) { showMsg('error', 'Please enter a label first.'); return; }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('label', label.trim());
      const res = await API.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = res.data.data.resume;
      const newResume = {
        url:          uploaded.url          || '',
        originalName: uploaded.originalName || file.name,
        size:         uploaded.size         || file.size,
        mimeType:     uploaded.mimeType     || file.type,
        uploadedAt:   uploaded.uploadedAt   || new Date().toISOString(),
        label:        label.trim(),
        isDefault:    currentResumes.length === 0,
      };

      const updatedResumes = [...currentResumes, newResume];
      await API.put('/users/profile', { resumes: updatedResumes });

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

  // Uses url to find the correct resume — not index
  const handleSetDefault = async (url) => {
    const updated = currentResumes.map((r) => ({ ...r, isDefault: r.url === url }));
    setSaving(true);
    try {
      await API.put('/users/profile', { resumes: updated });
      showMsg('success', 'Default resume updated.');
      if (onProfileRefresh) onProfileRefresh();
    } catch {
      showMsg('error', 'Could not update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Uses url to find the correct resume — not index
  const handleDelete = async (url) => {
    const deletedResume = currentResumes.find((r) => r.url === url);
    const updated = currentResumes.filter((r) => r.url !== url);

    // If deleted resume was default, make the first one default
    if (deletedResume?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setSaving(true);
    try {
      await API.put('/users/profile', { resumes: updated });
      showMsg('success', 'Resume removed.');
      if (onProfileRefresh) onProfileRefresh();
    } catch {
      showMsg('error', 'Could not remove. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Sort by upload date — keeps order stable always
  const sortedResumes = [...currentResumes].sort(
    (a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Resume</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {currentResumes.length} of 5 uploaded
          </p>
        </div>
        {currentResumes.length < 5 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition"
            style={{ borderColor: theme.primary, color: theme.primary }}>
            <Plus size={13} />
            Upload Resume
          </button>
        )}
      </div>

      {/* Messages */}
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

      {/* Empty state */}
      {currentResumes.length === 0 && !showForm && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-400">No resume uploaded yet</p>
          <p className="text-xs text-gray-300 mt-1">
            Upload your resume so recruiters can find you
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg text-white cursor-pointer border-none"
            style={{ background: theme.primary }}>
            <Plus size={13} />
            Upload Resume
          </button>
        </div>
      )}

      {/* Resume list */}
      {sortedResumes.length > 0 && (
        <div className="flex flex-col gap-3">
          {sortedResumes.map((resume) => (
            <ResumeCard
              key={resume.url}
              resume={resume}
              theme={theme}
              isDefault={resume.isDefault}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
          <p className="text-xs text-gray-300 mt-1">
            The <span className="font-semibold text-gray-400">Default</span> resume is sent to recruiters automatically.
            Click the star to change default.
          </p>
        </div>
      )}

      {/* Upload form */}
      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 mt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            New Resume
          </p>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              Label
            </label>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Full Stack Resume, Frontend Resume"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none"
              autoFocus
            />
            <p className="text-xs text-gray-300 mt-1">
              Name this resume so you can identify it easily
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
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-600">
              Cancel
            </button>
            <button
              onClick={() => {
                if (!label.trim()) { showMsg('error', 'Enter a label first.'); return; }
                fileRef.current?.click();
              }}
              disabled={uploading}
              className="flex-1 py-2 text-sm text-white rounded-lg border-none cursor-pointer font-semibold"
              style={{ background: uploading ? '#d1d5db' : theme.primary }}>
              {uploading ? 'Uploading...' : 'Choose File & Upload'}
            </button>
          </div>
          <p className="text-xs text-gray-300 mt-2 text-center">
            PDF, DOC, DOCX — Max 5MB
          </p>
        </div>
      )}
    </div>
  );
}