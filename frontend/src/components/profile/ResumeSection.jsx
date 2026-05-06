// ─────────────────────────────────────────────────────
// ResumeSection.jsx
// Purpose: Shows resume info and upload/replace button
// Only shown to CANDIDATE role users
// Features:
//   - Shows current resume (filename, size, date, View button)
//   - If no resume → shows empty state message
//   - Upload / Replace Resume button
//   - Hidden file input (triggered by button click)
// Used in: ProfilePage.jsx
// ─────────────────────────────────────────────────────

// useRef — used to access the hidden file input element
import { useRef } from 'react';

// profile     = user data from MongoDB (contains resume object)
// isUploading = true while file is being uploaded to server
// onUpload    = function called when user selects a file
export default function ResumeSection({ profile, isUploading, onUpload }) {

  // fileInputRef — points to the hidden <input type="file"> element
  // We use this to trigger file picker when button is clicked
  const fileInputRef = useRef(null);

  return (
    // White card with shadow
    <div style={s.card}>

      {/* Section title */}
      <h2 style={s.title}>Resume</h2>

      {/* Show resume info if resume exists in DB */}
      {/* profile.resume.url is set after first upload */}
      {profile?.resume?.url ? (

        // Resume exists — show file info box
        <div style={s.resumeBox}>

          {/* PDF icon emoji */}
          <div style={s.icon}>📄</div>

          {/* Resume metadata — filename, size, upload date */}
          <div style={s.info}>
            {/* Original filename user uploaded */}
            <p style={s.filename}>
              {profile.resume.originalName || 'Resume'}
            </p>

            {/* File type and size */}
            {/* mimeType 'application/pdf' → shows 'PDF' */}
            {/* size in bytes → converted to KB */}
            <p style={s.meta}>
              {profile.resume.mimeType?.includes('pdf') ? 'PDF' : 'Word'} •{' '}
              {profile.resume.size
                ? `${(profile.resume.size / 1024).toFixed(0)} KB`
                : ''}
            </p>

            {/* Upload date — formatted for Indian locale */}
            {/* Example: 5/5/2026 */}
            {profile.resume.uploadedAt && (
              <p style={s.meta}>
                Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>

          {/* View button — opens resume in new tab */}
          {/* Full URL: http://localhost:8000 + /uploads/resumes/filename.pdf */}
          <a
            href={`http://localhost:8000${profile.resume.url}`}
            target="_blank"
            rel="noreferrer"
            style={s.viewBtn}>
            View
          </a>

        </div>

      ) : (

        // No resume yet — show empty state
        <div style={s.empty}>
          <p style={{ color: '#888', marginBottom: 8 }}>
            No resume uploaded yet.
          </p>
          <p style={{ color: '#aaa', fontSize: 13 }}>
            Upload your resume to apply for jobs.
          </p>
        </div>

      )}

      {/* Upload section — always visible */}
      <div style={{ marginTop: 20 }}>

        {/* Hidden file input — not visible to user */}
        {/* Only accepts PDF, DOC, DOCX files */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            onUpload(e);                    // call parent's upload function
            fileInputRef.current.value = ''; // reset input so same file can be re-uploaded
          }}
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}       // hidden — button below triggers it
        />

        {/* Upload button — clicking this opens the file picker */}
        {/* Shows "Uploading..." while upload is in progress */}
        {/* Shows "Replace Resume" if resume already exists */}
        {/* Shows "Upload Resume" if no resume yet */}
        <button
          onClick={() => fileInputRef.current?.click()} // trigger hidden file input
          style={s.uploadBtn}
          disabled={isUploading}>
          {isUploading
            ? 'Uploading...'
            : profile?.resume?.url
              ? 'Replace Resume'
              : 'Upload Resume'}
        </button>

        {/* Helper text below button */}
        <p style={s.hint}>PDF, DOC, DOCX • Max 5MB</p>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Styles for this component
// ─────────────────────────────────────────────────────
const s = {
  // White card with shadow
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },

  // Section heading — "Resume"
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 17,
    fontWeight: 700,
    color: '#0a0a14',
    margin: '0 0 20px',
    paddingBottom: 12,
    borderBottom: '1px solid #f0f0f0'
  },

  // Resume info box — light gray background
  resumeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: '#f9f9f9',
    borderRadius: 12,
    padding: '16px'
  },

  // PDF emoji icon
  icon: { fontSize: 32, flexShrink: 0 },

  // Info section — takes remaining space
  info: { flex: 1 },

  // Filename text — bold
  filename: { fontSize: 14, fontWeight: 600, color: '#222', margin: '0 0 4px' },

  // Meta text — size and date
  meta: { fontSize: 12, color: '#888', margin: 0 },

  // View button — dark navy, link styled as button
  viewBtn: {
    background: '#1D3557',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none', // removes underline from <a> tag
    flexShrink: 0
  },

  // Empty state box — when no resume
  empty: {
    background: '#f9f9f9',
    borderRadius: 12,
    padding: '24px',
    textAlign: 'center'
  },

  // Upload button — full width orange button
  uploadBtn: {
    width: '100%',
    background: '#E65C00',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600
  },

  // Helper text below button
  hint: { fontSize: 11, color: '#aaa', marginTop: 4 },
};