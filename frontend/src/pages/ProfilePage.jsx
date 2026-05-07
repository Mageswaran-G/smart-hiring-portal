import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTheme } from '../utils/theme';
import { ROUTES } from '../constants/routes';
import useProfile from '../hooks/useProfile';
import ProfileHeader   from '../components/profile/ProfileHeader';
import ProfileDetails  from '../components/profile/ProfileDetails';
import ResumeSection   from '../components/profile/ResumeSection';
import EditProfileForm from '../components/profile/EditProfileForm';
import ProfileSkeleton from '../components/ui/ProfileSkeleton';

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // All profile logic comes from the custom hook
  const {
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
  } = useProfile();

  // Show skeleton while profile data is loading
    if (isLoading) {
      return <ProfileSkeleton />;
    }

  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';
  const theme       = getTheme(isCandidate);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      <nav className="flex items-center justify-between bg-white px-4 py-3.5 border-b border-gray-100 sticky top-0 z-10">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
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