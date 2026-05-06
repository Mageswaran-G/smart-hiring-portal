// ProfilePage.jsx
// Shows logged-in user profile
// View mode + Edit mode + Resume Upload

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API, getErrorMessage } from '../services/authService';

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // ── State ──
  const [profile,    setProfile]    = useState(null);
  const [formData,   setFormData]   = useState({});
  const [isEditing,  setIsEditing]  = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);
  const [isSaving,   setIsSaving]   = useState(false);
  const [isUploading,setIsUploading]= useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');
  const fileInputRef = useRef(null);

  // ── Load profile on page open ──
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/users/profile');
      setProfile(res.data.data);
      setFormData(res.data.data);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle text field change ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Skills field — array stored as comma separated text ──
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  // ── Save profile ──
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const allowedFields = [
        'bio', 'location', 'phone',
        'skills', 'education', 'experience',
        'companyName', 'companyWebsite', 'industry'
      ];

      const payload = {};
      allowedFields.forEach(field => {
        if (formData[field] !== undefined) {
          payload[field] = formData[field];
        }
      });

      const res = await API.put('/users/profile', payload);
      setProfile(res.data.data);
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrorMsg('');
    setIsEditing(false);
  };

  // ── Resume upload ──
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const formDataObj = new FormData();
      formDataObj.append('resume', file);

      const res = await API.post('/users/upload-resume', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh profile to show new resume
      await fetchProfile();
      setSuccessMsg('Resume uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div style={s.centered}>
        <div style={s.loadingDot}></div>
        <p style={{ color: '#888', marginTop: 16 }}>Loading profile...</p>
      </div>
    );
  }

  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';
  const firstName   = profile?.name?.split(' ')[0] || 'User';

  return (
    <div style={s.page}>

      {/* ── TOP NAV ── */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.logo}>HP</span>
          <span style={s.logoText}>HirePortal</span>
        </div>
        <div style={s.navRight}>
          <button onClick={() => navigate(-1)} style={s.navBtn}>← Back</button>
          <button onClick={logoutUser} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={s.container}>

        {/* ── PROFILE HEADER CARD ── */}
        <div style={s.headerCard}>
          <div style={s.avatarWrap}>
            <div style={s.avatar}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={s.headerInfo}>
            <h1 style={s.name}>{profile?.name}</h1>
            <p style={s.email}>{profile?.email}</p>
            <span style={{
              ...s.badge,
              background: isCandidate ? '#fff3e8' : '#e8f0ff',
              color: isCandidate ? '#E65C00' : '#1D3557'
            }}>
              {profile?.role?.toUpperCase()}
            </span>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={s.editBtn}>
              Edit Profile
            </button>
          )}
        </div>

        {/* ── SUCCESS / ERROR MESSAGES ── */}
        {successMsg && <div style={s.successBox}>{successMsg}</div>}
        {errorMsg   && <div style={s.errorBox}>{errorMsg}</div>}

        <div style={s.grid}>

          {/* ── LEFT COLUMN — PROFILE DETAILS ── */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              {isEditing ? 'Edit Profile' : 'Profile Details'}
            </h2>

            {!isEditing ? (

              /* VIEW MODE */
              <div>
                <Field label="Bio"      value={profile?.bio} />
                <Field label="Location" value={profile?.location} />
                <Field label="Phone"    value={profile?.phone} />

                {isCandidate && <>
                  <Field label="Skills"
                    value={Array.isArray(profile?.skills) && profile.skills.length > 0
                      ? profile.skills.join(', ')
                      : null}
                  />
                  <Field label="Education"  value={profile?.education} />
                  <Field label="Experience" value={profile?.experience} />
                </>}

                {isCompany && <>
                  <Field label="Company Name"    value={profile?.companyName} />
                  <Field label="Company Website" value={profile?.companyWebsite} />
                  <Field label="Industry"        value={profile?.industry} />
                </>}
              </div>

            ) : (

              /* EDIT MODE */
              <div>
                <FormField label="Bio" name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself (max 500 chars)"
                  multiline />

                <FormField label="Location" name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="City, State" />

                <FormField label="Phone" name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+91 9876543210" />

                {isCandidate && <>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Skills</label>
                    <input
                      style={s.input}
                      value={Array.isArray(formData.skills)
                        ? formData.skills.join(', ')
                        : ''}
                      onChange={handleSkillsChange}
                      placeholder="React, Node.js, MongoDB (comma separated)"
                    />
                    <p style={s.hint}>Separate each skill with a comma</p>
                  </div>

                  <FormField label="Education" name="education"
                    value={formData.education || ''}
                    onChange={handleChange}
                    placeholder="B.E Computer Science, Anna University 2026" />

                  <FormField label="Experience" name="experience"
                    value={formData.experience || ''}
                    onChange={handleChange}
                    placeholder="6 months intern at XYZ Company" />
                </>}

                {isCompany && <>
                  <FormField label="Company Name" name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    placeholder="Acme Technologies Pvt Ltd" />

                  <FormField label="Company Website" name="companyWebsite"
                    value={formData.companyWebsite || ''}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com" />

                  <FormField label="Industry" name="industry"
                    value={formData.industry || ''}
                    onChange={handleChange}
                    placeholder="Software, Finance, Healthcare..." />
                </>}

                {/* SAVE / CANCEL BUTTONS */}
                <div style={s.btnRow}>
                  <button
                    onClick={handleCancel}
                    style={s.cancelBtn}
                    disabled={isSaving}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={s.saveBtn}
                    disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN — RESUME (candidates only) ── */}
          {isCandidate && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Resume</h2>

              {/* Show current resume */}
              {profile?.resume?.url ? (
                <div style={s.resumeBox}>
                  <div style={s.resumeIcon}>📄</div>
                  <div style={s.resumeInfo}>
                    <p style={s.resumeName}>
                      {profile.resume.originalName || 'Resume'}
                    </p>
                    <p style={s.resumeMeta}>
                      {profile.resume.mimeType?.includes('pdf') ? 'PDF' : 'Word'} •{' '}
                      {profile.resume.size
                        ? `${(profile.resume.size / 1024).toFixed(0)} KB`
                        : ''}
                    </p>
                    {profile.resume.uploadedAt && (
                      <p style={s.resumeMeta}>
                        Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                  <a
                    href={`http://localhost:8000${profile.resume.url}`}
                    target="_blank"
                    rel="noreferrer"
                    style={s.viewBtn}>
                    View
                  </a>
                </div>
              ) : (
                <div style={s.noResume}>
                  <p style={{ color: '#888', marginBottom: 8 }}>
                    No resume uploaded yet.
                  </p>
                  <p style={{ color: '#aaa', fontSize: 13 }}>
                    Upload your resume to apply for jobs.
                  </p>
                </div>
              )}

              {/* Upload button */}
              <div style={{ marginTop: 20 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={s.uploadBtn}
                  disabled={isUploading}>
                  {isUploading
                    ? 'Uploading...'
                    : profile?.resume?.url
                      ? 'Replace Resume'
                      : 'Upload Resume'}
                </button>
                <p style={s.hint}>PDF, DOC, DOCX • Max 5MB</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Small helper — one field in view mode ──
function Field({ label, value }) {
  return (
    <div style={s.fieldRow}>
      <span style={s.fieldLabel}>{label}</span>
      <span style={s.fieldValue}>
        {value && value.length > 0
          ? value
          : <em style={{ color: '#bbb' }}>Not set</em>}
      </span>
    </div>
  );
}

// ── Small helper — one input in edit mode ──
function FormField({ label, name, value, onChange, placeholder, multiline }) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{label}</label>
      {multiline
        ? <textarea name={name} value={value} onChange={onChange}
            placeholder={placeholder} rows={3}
            style={{ ...s.input, resize: 'vertical' }} />
        : <input name={name} value={value} onChange={onChange}
            placeholder={placeholder} style={s.input} />
      }
    </div>
  );
}

// ── All styles ──
const s = {
  page: { minHeight: '100vh', background: '#f0f0f0', fontFamily: 'Inter, sans-serif' },
  centered: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  loadingDot: { width: 40, height: 40, borderRadius: '50%', border: '3px solid #E65C00', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' },

  // Nav
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '14px 16px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 },
  navLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { width: 36, height: 36, borderRadius: 8, background: '#E65C00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, fontFamily: 'Sora, sans-serif' },
  logoText: { fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, color: '#0a0a14' },
  navRight: { display: 'flex', gap: 10 },
  navBtn: { background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14, color: '#555' },
  logoutBtn: { background: '#E65C00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 },

  // Layout
  container: { maxWidth: 1000, margin: '0 auto', padding: '32px 24px' },
  grid: { display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 340px', gap: 24, marginTop: 24, alignItems: 'start' },
  
  // Header card
  headerCard: { background: '#fff', borderRadius: 16, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flexWrap: 'wrap' },
  avatarWrap: { flexShrink: 0 },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: '#E65C00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, fontFamily: 'Sora, sans-serif' },
  headerInfo: { flex: 1 },
  name: { fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: '#0a0a14', margin: '0 0 4px' },
  email: { fontSize: 14, color: '#888', margin: '0 0 8px' },
  badge: { display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' },
  editBtn: { background: '#E65C00', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' },

  // Messages
  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 10, padding: '12px 16px', marginTop: 16, fontSize: 14 },
  errorBox:   { background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '12px 16px', marginTop: 16, fontSize: 14 },

  // Card
  card: { background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700, color: '#0a0a14', margin: '0 0 20px', paddingBottom: 12, borderBottom: '1px solid #f0f0f0' },

  // View mode fields
  fieldRow: { display: 'flex', padding: '11px 0', borderBottom: '1px solid #f7f7f7' },
  fieldLabel: { width: 130, flexShrink: 0, fontSize: 13, fontWeight: 600, color: '#888' },
  fieldValue: { fontSize: 14, color: '#222', flex: 1, lineHeight: 1.5 },

  // Edit mode fields
  fieldGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, color: '#222', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' },
  hint: { fontSize: 11, color: '#aaa', marginTop: 4 },

  // Edit buttons
  btnRow: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 },
  cancelBtn: { background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14, color: '#555' },
  saveBtn:   { background: '#E65C00', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600 },

  // Resume section
  resumeBox: { display: 'flex', alignItems: 'center', gap: 14, background: '#f9f9f9', borderRadius: 12, padding: '16px' },
  resumeIcon: { fontSize: 32, flexShrink: 0 },
  resumeInfo: { flex: 1 },
  resumeName: { fontSize: 14, fontWeight: 600, color: '#222', margin: '0 0 4px' },
  resumeMeta: { fontSize: 12, color: '#888', margin: 0 },
  viewBtn: { background: '#1D3557', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', flexShrink: 0 },
  noResume: { background: '#f9f9f9', borderRadius: 12, padding: '24px', textAlign: 'center' },
  uploadBtn: { width: '100%', background: '#E65C00', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
};