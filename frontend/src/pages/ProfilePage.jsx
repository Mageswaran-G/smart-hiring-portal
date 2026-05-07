import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API, getErrorMessage } from '../services/authService';
import { getTheme } from '../utils/theme';
import { API_ENDPOINTS } from '../constants/api';
import { ROUTES } from '../constants/routes';
import ProfileHeader   from '../components/profile/ProfileHeader';
import ProfileDetails  from '../components/profile/ProfileDetails';
import ResumeSection   from '../components/profile/ResumeSection';
import EditProfileForm from '../components/profile/EditProfileForm';

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [profile,          setProfile]          = useState(null);
  const [formData,         setFormData]         = useState({});
  const [isEditing,        setIsEditing]        = useState(false);
  const [isLoading,        setIsLoading]        = useState(true);
  const [isSaving,         setIsSaving]         = useState(false);
  const [isUploading,      setIsUploading]      = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [successMsg,       setSuccessMsg]       = useState('');
  const [errorMsg,         setErrorMsg]         = useState('');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // API_ENDPOINTS.PROFILE = '/users/profile'
      const res = await API.get(API_ENDPOINTS.PROFILE);
      setProfile(res.data.data);
      setFormData(res.data.data);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const allowedFields = [
        'name', 'bio', 'location', 'phone',
        'skills', 'education', 'experience',
        'companyName', 'companyWebsite', 'industry'
      ];

      const payload = {};
      allowedFields.forEach(field => {
        if (formData[field] !== undefined) payload[field] = formData[field];
      });

      // API_ENDPOINTS.PROFILE = '/users/profile'
      const res = await API.put(API_ENDPOINTS.PROFILE, payload);
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

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const formDataObj = new FormData();
      formDataObj.append('resume', file);
      // API_ENDPOINTS.UPLOAD_RESUME = '/users/upload-resume'
      await API.post(API_ENDPOINTS.UPLOAD_RESUME, formDataObj, {
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      setErrorMsg('');
      setSuccessMsg('');
      const formDataObj = new FormData();
      formDataObj.append('photo', file);
      // API_ENDPOINTS.UPLOAD_PHOTO = '/users/upload-photo'
      await API.post(API_ENDPOINTS.UPLOAD_PHOTO, formDataObj, {
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

  const handleVisibilityChange = async (value) => {
    try {
      // API_ENDPOINTS.PROFILE = '/users/profile'
      await API.put(API_ENDPOINTS.PROFILE, { photoVisibility: value });
      await fetchProfile();
      setSuccessMsg(`Photo visibility set to ${value}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  // isCandidate and theme must be defined AFTER the loading check
  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';
  const theme       = getTheme(isCandidate);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      <nav className="flex items-center justify-between bg-white px-4 py-3.5 border-b border-gray-100 sticky top-0 z-10">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            // ROUTES.CANDIDATE_DASHBOARD = '/candidate/dashboard'
            // ROUTES.COMPANY_DASHBOARD   = '/company/dashboard'
            if (user?.role === 'candidate') navigate(ROUTES.CANDIDATE_DASHBOARD);
            else if (user?.role === 'company') navigate(ROUTES.COMPANY_DASHBOARD);
            else navigate(ROUTES.HOME);
          }}>
          <span className={`font-sora w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-base text-white ${theme.logo}`}>
            HP
          </span>
          <span className="font-sora font-bold text-lg text-gray-900">
            HirePortal
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg text-sm border bg-white cursor-pointer ${theme.buttonLight}`}>
            Back
          </button>
          <button
            onClick={logoutUser}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white border-none cursor-pointer ${theme.button}`}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          isCandidate={isCandidate}
          onPhotoUpload={handlePhotoUpload}
          isUploadingPhoto={isUploadingPhoto}
          onVisibilityChange={handleVisibilityChange}
        />

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mt-4 text-sm">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mt-4 text-sm">
            {errorMsg}
          </div>
        )}

        <div className={`grid gap-6 mt-6 items-start ${
          isCandidate ? 'lg:grid-cols-[1fr_340px]' : 'grid-cols-1'
        }`}>

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