import { useState, useEffect } from 'react';
import { API, getErrorMessage } from '../services/authService';
import { API_ENDPOINTS } from '../constants/api';
import { useAuth } from '../context/AuthContext';

// useProfile — custom hook that handles all profile logic
// ProfilePage.jsx uses this hook instead of managing everything itself
export default function useProfile() {
  const { fetchProfile: refreshGlobalProfile } = useAuth();
  const [profile,          setProfile]          = useState(null);
  const [formData,         setFormData]         = useState({});
  const [isEditing,        setIsEditing]        = useState(false);
  const [isLoading,        setIsLoading]        = useState(true);
  const [isSaving,         setIsSaving]         = useState(false);
  const [isUploading,      setIsUploading]      = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [successMsg,       setSuccessMsg]       = useState('');
  const [errorMsg,         setErrorMsg]         = useState('');
  
  // Auto-clear messages after 3 seconds
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (err) => {
    setErrorMsg(getErrorMessage(err));
  };

  // Fetch profile from backend
  const fetchProfile = async () => {
  try {
    setIsLoading(true);
    const res = await API.get(API_ENDPOINTS.PROFILE);
    setProfile(res.data.data);
    setFormData(res.data.data);
    // Also update global profile in AuthContext
    // So dashboard shows updated photo/name immediately
    refreshGlobalProfile();
  } catch (err) {
    showError(err);
  } finally {
    setIsLoading(false);
  }
  };

  // Load profile on first render
  useEffect(() => { fetchProfile(); }, []);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle skills — stored as array, shown as comma text
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  // Save profile to backend
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');

      const allowedFields = [
        'name', 'bio', 'location', 'phone',
        'skills', 'education', 'experience',
        'companyName', 'companyWebsite', 'industry'
      ];

      const payload = {};
      allowedFields.forEach(field => {
        if (formData[field] !== undefined) payload[field] = formData[field];
      });

      const res = await API.put(API_ENDPOINTS.PROFILE, payload);
      setProfile(res.data.data);
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel edit — restore original data
  const handleCancel = () => {
    setFormData(profile);
    setErrorMsg('');
    setIsEditing(false);
  };

  // Save a specific section — used by individual section components
  // payload = only the fields that section cares about
  const handleSectionSave = async (payload) => {
    try {
      const res = await API.put(API_ENDPOINTS.PROFILE, payload);
      setProfile(res.data.data);
      setFormData(res.data.data);
      refreshGlobalProfile();
      showSuccess('Saved successfully!');
    } catch (err) {
      showError(err);
    }
  };

  // Upload resume
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setErrorMsg('');
      const formDataObj = new FormData();
      formDataObj.append('resume', file);
      await API.post(API_ENDPOINTS.UPLOAD_RESUME, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchProfile();
      showSuccess('Resume uploaded successfully!');
    } catch (err) {
      showError(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Upload profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      setErrorMsg('');
      const formDataObj = new FormData();
      formDataObj.append('photo', file);
      await API.post(API_ENDPOINTS.UPLOAD_PHOTO, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchProfile();
      showSuccess('Profile photo updated!');
    } catch (err) {
      showError(err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Change photo visibility — public or private
  const handleVisibilityChange = async (value) => {
    try {
      await API.put(API_ENDPOINTS.PROFILE, { photoVisibility: value });
      await fetchProfile();
      showSuccess(`Photo visibility set to ${value}`);
    } catch (err) {
      showError(err);
    }
  };

  // Return everything ProfilePage needs
  return {
    profile,
    formData,
    isEditing,    setIsEditing,
    isLoading,
    isSaving,
    isUploading,
    isUploadingPhoto,
    successMsg,
    errorMsg,
    handleChange,
    handleSkillsChange,
    handleSave,
    handleCancel,
    handleResumeUpload,
    handlePhotoUpload,
    handleVisibilityChange,
    handleSectionSave
  };
}