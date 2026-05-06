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
  // isUploadingPhoto = true while profile photo is uploading
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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
        'name', 
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

  // ── Handle profile photo upload ───────────────────────
    // Called when user selects a photo by clicking avatar
    const handlePhotoUpload = async (e) => {
      const file = e.target.files[0]; // get selected image file
      if (!file) return;

      try {
        setIsUploadingPhoto(true);
        setErrorMsg('');
        setSuccessMsg('');

        // FormData required for file upload
        const formDataObj = new FormData();
        formDataObj.append('photo', file); // 'photo' matches backend field name

        // POST /api/v1/users/upload-photo
        await API.post('/users/upload-photo', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Refresh profile to show new photo
        await fetchProfile();
        setSuccessMsg('Profile photo updated!');
        setTimeout(() => setSuccessMsg(''), 3000);

      } catch (err) {
        setErrorMsg(getErrorMessage(err));
      } finally {
        setIsUploadingPhoto(false);
      }
    };

    // ── Handle photo visibility change ────────────────────
    // Called when user clicks Public or Private button
    // value = 'public' or 'private'
    const handleVisibilityChange = async (value) => {
      try {
        await API.put('/users/profile', { photoVisibility: value });
        // Refresh profile to show updated visibility
        await fetchProfile();
        setSuccessMsg(`Photo visibility set to ${value}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        setErrorMsg(getErrorMessage(err));
      }
    };

  // ── Loading screen ────────────────────────────────────
  // Shown while first profile fetch is running
    if (isLoading) {
    return (
      // Full screen centered loading
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading profile...</p>
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
  

  return (
    // Full page — light gray background
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* ── TOP NAVIGATION BAR ── */}
      {/* Top navigation bar */}
      {/* sticky top-0 = stays at top while scrolling */}
      {/* z-10 = stays above all other content */}
      <nav className="flex items-center justify-between bg-white px-4 py-3.5 border-b border-gray-100 sticky top-0 z-10">

        {/* Left side — HP logo + HirePortal text */}
        {/* Clicking goes to dashboard */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (user?.role === 'candidate') navigate('/candidate/dashboard');
            else if (user?.role === 'company') navigate('/company/dashboard');
            else navigate('/');
          }}>

          {/* HP box — color changes based on role */}
          <span className={`font-sora w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-base text-white ${
              isCandidate ? 'bg-orange-500' : 'bg-blue-900'
            }`}>
            HP
          </span>

          {/* HirePortal text */}
          <span className="font-sora font-bold text-lg text-gray-900">
            HirePortal
          </span>

        </div>

        {/* Right side — Back and Logout buttons */}
        <div className="flex gap-2">

          {/* Back button — color changes based on role */}
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg text-sm border bg-white cursor-pointer ${
              isCandidate
                ? 'border-orange-400 text-orange-500 hover:bg-orange-50'
                : 'border-blue-900 text-blue-900 hover:bg-blue-50'
            }`}>
            ← Back
          </button>

          {/* Logout button — color changes based on role */}
          <button
            onClick={logoutUser}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white border-none cursor-pointer ${
              isCandidate
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-blue-900 hover:bg-blue-800'
            }`}>
            Logout
          </button>

        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      {/* Main content — centered with max width */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Profile header — avatar, name, email, role badge */}
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          isCandidate={isCandidate}
          onPhotoUpload={handlePhotoUpload}
          isUploadingPhoto={isUploadingPhoto}
          onVisibilityChange={handleVisibilityChange} 
        />

        {/* Green success message */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mt-4 text-sm">
              {successMsg}
            </div>
          )}

          {/* Red error message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mt-4 text-sm">
              {errorMsg}
            </div>
          )}

        
        {/* Two column grid — stacks on mobile */}
          <div className={`grid gap-6 mt-6 items-start ${
            isCandidate ? 'lg:grid-cols-[1fr_340px]' : 'grid-cols-1'
          }`}>

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
              isCandidate={isCandidate}
            />
          )}

        </div>
      </div>
    </div>
  );
}

