// ─────────────────────────────────────────────────────
// ProfilePage.jsx
// Purpose: Main profile page — coordinates all sub-components
// This file only handles:
//   1. Fetching profile data from API
//   2. Managing state (loading, editing, saving, uploading)
//   3. Passing data down to child components
// All UI is handled by components/profile/ files
// ─────────────────────────────────────────────────────

// React hooks
import { useState, useEffect } from 'react';

// React Router — for navigation
import { useNavigate } from 'react-router-dom';

// Auth context — to get current user info and logout function
import { useAuth } from '../context/AuthContext';

// API instance and error helper
import { API, getErrorMessage } from '../services/authService';

// Profile sub-components — each handles one section of the page
import ProfileHeader   from '../components/profile/ProfileHeader';
import ProfileDetails  from '../components/profile/ProfileDetails';
import ResumeSection   from '../components/profile/ResumeSection';
import EditProfileForm from '../components/profile/EditProfileForm';

export default function ProfilePage() {
  // Get current logged-in user and logout function from context
  const { user, logoutUser } = useAuth();

  // useNavigate — for Back button and role-based redirects
  const navigate = useNavigate();

  // ── State variables ──────────────────────────────────
  // profile    = data loaded from MongoDB (read only display)
  const [profile,     setProfile]     = useState(null);

  // formData   = copy of profile used in edit form (changes as user types)
  const [formData,    setFormData]    = useState({});

  // isEditing  = true when Edit Profile button is clicked
  const [isEditing,   setIsEditing]   = useState(false);

  // isLoading  = true while first profile fetch is running
  const [isLoading,   setIsLoading]   = useState(true);

  // isSaving   = true while save API call is running
  const [isSaving,    setIsSaving]    = useState(false);

  // isUploading = true while resume upload is running
  const [isUploading, setIsUploading] = useState(false);

  // successMsg = green message shown after save or upload
  const [successMsg,  setSuccessMsg]  = useState('');

  // errorMsg   = red message shown when API call fails
  const [errorMsg,    setErrorMsg]    = useState('');

  // ── Load profile when page first opens ───────────────
  // Empty dependency array [] means runs ONCE on mount
  useEffect(() => { fetchProfile(); }, []);

  // ── Fetch profile from backend ───────────────────────
  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      // GET /api/v1/users/profile — requires Bearer token (added by interceptor)
      const res = await API.get('/users/profile');

      // Save profile to state for display
      setProfile(res.data.data);

      // Also copy to formData so edit form has current values
      setFormData(res.data.data);

    } catch (err) {
      // getErrorMessage extracts readable message from axios error
      setErrorMsg(getErrorMessage(err));
    } finally {
      // Always stop loading — even if error happened
      setIsLoading(false);
    }
  };

  // ── Handle regular field change (text inputs) ─────────
  // Called on every keystroke in edit form
  // e.target.name  = field name (e.g. "bio", "location")
  // e.target.value = new value typed by user
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update only the changed field, keep all others same
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Handle skills field change ────────────────────────
  // Skills is stored as array in DB but shown as comma text in input
  // Example: user types "React, Node.js" → stored as ['React', 'Node.js']
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(',')           // split by comma
      .map(s => s.trim())   // remove spaces around each skill
      .filter(s => s);      // remove empty strings
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  // ── Save profile to backend ───────────────────────────
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      // Only send fields the backend allows
      // This prevents role/password injection from frontend
      const allowedFields = [
        'bio', 'location', 'phone',
        'skills', 'education', 'experience',
        'companyName', 'companyWebsite', 'industry'
      ];

      // Build payload — only include allowed fields that exist in formData
      const payload = {};
      allowedFields.forEach(field => {
        if (formData[field] !== undefined) {
          payload[field] = formData[field];
        }
      });

      // PUT /api/v1/users/profile — update profile in MongoDB
      const res = await API.put('/users/profile', payload);

      // Update displayed profile with new data from server
      setProfile(res.data.data);

      // Show success message and go back to view mode
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);

      // Auto hide success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  // ── Cancel editing ────────────────────────────────────
  // Restores form to original profile values (discards changes)
  const handleCancel = () => {
    setFormData(profile); // reset form back to saved profile
    setErrorMsg('');
    setIsEditing(false);
  };

  // ── Handle resume upload ──────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]; // get selected file
    if (!file) return;              // do nothing if no file selected

    try {
      setIsUploading(true);
      setErrorMsg('');
      setSuccessMsg('');

      // FormData is required for file upload — not JSON
      const formDataObj = new FormData();
      formDataObj.append('resume', file); // 'resume' must match backend field name

      // POST /api/v1/users/upload-resume — multipart/form-data
      await API.post('/users/upload-resume', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh profile to show new resume info
      await fetchProfile();

      setSuccessMsg('Resume uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  // ── Loading screen ────────────────────────────────────
  // Shown while first profile fetch is running
  if (isLoading) {
    return (
      <div style={s.centered}>
        <p style={{ color: '#888' }}>Loading profile...</p>
      </div>
    );
  }

  // ── Role checks ───────────────────────────────────────
  // Used to show/hide candidate or company specific sections
  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';

  // ── Responsive grid ───────────────────────────────────
  // Desktop: side by side (profile details + resume)
  // Mobile:  stacked vertically (one column)
  const gridColumns = window.innerWidth < 768 ? '1fr' : '1fr 340px';

  return (
    <div style={s.page}>

      {/* ── TOP NAVIGATION BAR ── */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          {/* HirePortal logo */}
          <span style={s.logo}>HP</span>
          <span style={s.logoText}>HirePortal</span>
        </div>
        <div style={s.navRight}>
          {/* Back button — goes to previous page */}
          <button onClick={() => navigate(-1)} style={s.navBtn}>← Back</button>
          {/* Logout button — clears token and redirects to login */}
          <button onClick={logoutUser} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <div style={s.container}>

        {/* Profile header — avatar, name, email, role badge */}
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          isCandidate={isCandidate}
        />

        {/* Success message — green box */}
        {successMsg && <div style={s.successBox}>{successMsg}</div>}

        {/* Error message — red box */}
        {errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

        {/* Two column grid — profile details + resume */}
        <div style={{ ...s.grid, gridTemplateColumns: gridColumns }}>

          {/* LEFT COLUMN */}
          {/* View mode — ProfileDetails */}
          {/* Edit mode — EditProfileForm */}
          {!isEditing
            ? <ProfileDetails
                profile={profile}
                isCandidate={isCandidate}
                isCompany={isCompany}
              />
            : <EditProfileForm
                formData={formData}
                isCandidate={isCandidate}
                isCompany={isCompany}
                isSaving={isSaving}
                onChange={handleChange}
                onSkillsChange={handleSkillsChange}
                onSave={handleSave}
                onCancel={handleCancel}
              />
          }

          {/* RIGHT COLUMN — Resume section */}
          {/* Only shown to candidates */}
          {isCandidate && (
            <ResumeSection
              profile={profile}
              isUploading={isUploading}
              onUpload={handleResumeUpload}
            />
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Styles for ProfilePage layout only
// Component-specific styles are in each component file
// ─────────────────────────────────────────────────────
const s = {
  // Full page background — light gray
  page: {
    minHeight: '100vh',
    background: '#f0f0f0',
    fontFamily: 'Inter, sans-serif'
  },

  // Centered loading screen
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },

  // Sticky top navigation bar
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    padding: '14px 16px',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 10  // stays above all other content
  },

  // Left side of nav — logo area
  navLeft: { display: 'flex', alignItems: 'center', gap: 10 },

  // HP logo square
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: '#E65C00',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 16,
    fontFamily: 'Sora, sans-serif'
  },

  // HirePortal text next to logo
  logoText: {
    fontFamily: 'Sora, sans-serif',
    fontWeight: 700,
    fontSize: 18,
    color: '#0a0a14'
  },

  // Right side of nav — Back and Logout buttons
  navRight: { display: 'flex', gap: 10 },

  // Back button — transparent with border
  navBtn: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#555'
  },

  // Logout button — orange
  logoutBtn: {
    background: '#E65C00',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600
  },

  // Main content area — centered with max width
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '32px 24px'
  },

  // Two column grid layout
  grid: {
    display: 'grid',
    gap: 24,
    marginTop: 24,
    alignItems: 'start'  // cards align to top, not stretched
  },

  // Green success message box
  successBox: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    borderRadius: 10,
    padding: '12px 16px',
    marginTop: 16,
    fontSize: 14
  },

  // Red error message box
  errorBox: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#be123c',
    borderRadius: 10,
    padding: '12px 16px',
    marginTop: 16,
    fontSize: 14
  },
};