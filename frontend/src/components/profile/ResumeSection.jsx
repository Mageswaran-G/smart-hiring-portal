// ─────────────────────────────────────────────────────
// ResumeSection.jsx
// Purpose: Shows resume info and upload/replace button
// Only shown to CANDIDATE role users
// NOW USING TAILWIND CSS — no inline styles!
// ─────────────────────────────────────────────────────

import { useRef } from 'react';

export default function ResumeSection({ profile, isUploading, onUpload, isCandidate }) {

  // fileInputRef — points to hidden file input element
  const fileInputRef = useRef(null);

  return (
    // White card with shadow
    <div className="bg-white rounded-2xl p-7 shadow-md">

      {/* Section title */}
      <h2 className="font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100"
        style={{ fontFamily: 'Sora, sans-serif' }}>
        Resume
      </h2>

      {/* Show resume info if resume exists */}
      {profile?.resume?.url ? (

        // Resume box — light gray background
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">

          {/* PDF icon */}
          <span className="text-3xl shrink-0">📄</span>

          {/* Resume details */}
          <div className="flex-1">

            {/* Original filename */}
            <p className="text-sm font-semibold text-gray-800 mb-1">
              {profile.resume.originalName || 'Resume'}
            </p>

            {/* File type and size */}
            <p className="text-xs text-gray-400">
              {profile.resume.mimeType?.includes('pdf') ? 'PDF' : 'Word'} •{' '}
              {profile.resume.size
                ? `${(profile.resume.size / 1024).toFixed(0)} KB`
                : ''}
            </p>

            {/* Upload date */}
            {profile.resume.uploadedAt && (
              <p className="text-xs text-gray-400">
                Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString('en-IN')}
              </p>
            )}

          </div>

          {/* View button — opens resume in new tab */}
          <a
            href={`${import.meta.env.VITE_API_URL}${profile.resume.url}`}
            target="_blank"
            rel="noreferrer"
            className={`shrink-0 px-4 py-1.5 text-white text-sm font-semibold rounded-lg no-underline ${
              isCandidate ? 'bg-orange-500' : 'bg-blue-900'
            }`}>
            View
          </a>

        </div>

      ) : (

        // Empty state — no resume yet
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-1">No resume uploaded yet.</p>
          <p className="text-gray-300 text-xs">Upload your resume to apply for jobs.</p>
        </div>

      )}

      {/* Upload section */}
      <div className="mt-5">

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            onUpload(e);
            fileInputRef.current.value = '';
          }}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />

        {/* Upload button — full width orange */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full py-3 text-white font-semibold rounded-xl cursor-pointer border-none transition text-sm ${
            isCandidate
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-blue-900 hover:bg-blue-800'
          }`}>
          {isUploading
            ? 'Uploading...'
            : profile?.resume?.url
              ? 'Replace Resume'
              : 'Upload Resume'}
        </button>

        {/* Helper text */}
        <p className="text-xs text-gray-300 mt-2 text-center">
          PDF, DOC, DOCX • Max 5MB
        </p>

      </div>
    </div>
  );
}