import { useRef } from 'react';
import { getTheme } from '../../utils/theme';

export default function ResumeSection({ profile, isUploading, onUpload, isCandidate }) {
  const fileInputRef = useRef(null);
  const theme = getTheme(isCandidate);

  return (
    <div className="bg-white rounded-2xl p-7 shadow-md">

      <h2 className="font-sora font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100">
        Resume
      </h2>

      {/* Show resume info if uploaded */}
      {profile?.resume?.url ? (
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <span className="text-3xl shrink-0">PDF</span>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              {profile.resume.originalName || 'Resume'}
            </p>
            <p className="text-xs text-gray-400">
              {profile.resume.mimeType?.includes('pdf') ? 'PDF' : 'Word'} &bull;{' '}
              {profile.resume.size
                ? `${(profile.resume.size / 1024).toFixed(0)} KB`
                : ''}
            </p>
            {profile.resume.uploadedAt && (
              <p className="text-xs text-gray-400">
                Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>

          {/* View button opens resume in new tab */}
          <a
            href={`${import.meta.env.VITE_API_URL}${profile.resume.url}`}
            target="_blank"
            rel="noreferrer"
            className={`shrink-0 px-4 py-1.5 text-white text-sm font-semibold rounded-lg no-underline ${theme.avatar}`}>
            View
          </a>
        </div>

      ) : (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-1">No resume uploaded yet.</p>
          <p className="text-gray-300 text-xs">Upload your resume to apply for jobs.</p>
        </div>
      )}

      {/* Upload section */}
      <div className="mt-5">
        {/* Hidden file input — triggered by button click */}
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

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full py-3 text-white font-semibold rounded-xl cursor-pointer border-none transition text-sm ${theme.button}`}>
          {isUploading
            ? 'Uploading...'
            : profile?.resume?.url
              ? 'Replace Resume'
              : 'Upload Resume'}
        </button>

        <p className="text-xs text-gray-300 mt-2 text-center">
          PDF, DOC, DOCX — Max 5MB
        </p>
      </div>
    </div>
  );
}