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

// Theme helper — centralized colors based on role
// getTheme(isCandidate) returns orange theme or navy theme
import { getTheme } from '../utils/theme';

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
  // profile = data loaded from MongoDB (read only display)
  const [profile,          setProfile]          = useState(null);

  // formData = copy of profile used in edit form
  const [formData,         setFormData]         = useState({});

  // isEditing = true when Edit Profile button is clicked
  const [isEditing,        setIsEditing]        = useState(false);

  // isLoading = true while first profile fetch is running
  const [isLoading,        setIsLoading]        = useState(true);

  // isSaving = true while save API call is running
  const [isSaving,         setIsSaving]         = useState(false);

  // isUploading = true while resume upload is running
  const [isUploading,      setIsUploading]      = useState(false);

  // isUploadingPhoto = true while profile photo is uploading
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // successMsg = green message shown after save or upload
  const [successMsg,       setSuccessMsg]       = useState('');

  // errorMsg = red message shown when API call fails
  const [errorMsg,         setErrorMsg]         = useState('');

  // ── Load profile when page first opens ───────────────
  // [] = runs only ONCE when component mounts
  useEffect(() => { fetchProfile(); }, []);

  // ── Fetch profile from backend ───────────────────────
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // GET /api/v1/users/profile — token auto-added by interceptor
      const res = await API.get('/users/profile');
      setProfile(res.data.data);
      setFormData(res.data.data);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      // Always stop loading even if error happened
      setIsLoading(false);
    }
  };

  // ── Handle text field change ──────────────────────────
  // Called on every keystroke in edit form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Handle skills field change ────────────────────────
  // Skills stored as array in DB, shown as comma text in input
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  // ── Save profile to backend ───────────────────────────
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      // Only send fields the backend allows
      const allowedFields = [
        'name',
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

  // ── Cancel editing ────────────────────────────────────
  const handleCancel = () => {
    setFormData(profile);
    setErrorMsg('');
    setIsEditing(false);
  };

  // ── Handle resume upload ──────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const formDataObj = new FormData();
      formDataObj.append('resume', file);
      await API.post('/users/upload-resume', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      setErrorMsg('');
      setSuccessMsg('');
      const formDataObj = new FormData();
      formDataObj.append('photo', file);
      await API.post('/users/upload-photo', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
  const handleVisibilityChange = async (value) => {
    try {
      await API.put('/users/profile', { photoVisibility: value });
      await fetchProfile();
      setSuccessMsg(`Photo visibility set to ${value}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    }
  };

  // ── Loading screen ────────────────────────────────────
  // IMPORTANT: early return BEFORE defining isCandidate and theme
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  // ── Role checks ───────────────────────────────────────
  // IMPORTANT: isCandidate defined AFTER loading check
  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';

  // ── Theme ─────────────────────────────────────────────
  // IMPORTANT: theme defined AFTER isCandidate is defined
  // This is correct order — no more crash!
  const theme = getTheme(isCandidate);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* ── TOP NAVIGATION BAR ── */}
      <nav className="flex items-center justify-between bg-white px-4 py-3.5 border-b border-gray-100 sticky top-0 z-10">

        {/* Left — HP logo + HirePortal text — clicking goes to dashboard */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (user?.role === 'candidate') navigate('/candidate/dashboard');
            else if (user?.role === 'company') navigate('/company/dashboard');
            else navigate('/');
          }}>

          {/* HP box — color from theme */}
          <span className={`font-sora w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-base text-white ${theme.logo}`}>
            HP
          </span>

          {/* HirePortal text */}
          <span className="font-sora font-bold text-lg text-gray-900">
            HirePortal
          </span>
        </div>

        {/* Right — Back and Logout buttons */}
        <div className="flex gap-2">

          {/* Back button — color from theme */}
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg text-sm border bg-white cursor-pointer ${theme.buttonLight}`}>
            ← Back
          </button>

          {/* Logout button — color from theme */}
          <button
            onClick={logoutUser}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white border-none cursor-pointer ${theme.button}`}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Profile header card */}
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          isCandidate={isCandidate}
          onPhotoUpload={handlePhotoUpload}
          isUploadingPhoto={isUploadingPhoto}
          onVisibilityChange={handleVisibilityChange}
        />

        {/* Success message — green */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mt-4 text-sm">
            {successMsg}
          </div>
        )}

        {/* Error message — red */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mt-4 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Two column grid — right column only for candidates */}
        <div className={`grid gap-6 mt-6 items-start ${
          isCandidate ? 'lg:grid-cols-[1fr_340px]' : 'grid-cols-1'
        }`}>

          {/* LEFT COLUMN — view or edit */}
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

          {/* RIGHT COLUMN — resume (candidates only) */}
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