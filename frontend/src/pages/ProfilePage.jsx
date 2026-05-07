import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTheme } from '../utils/theme';
import { ROUTES } from '../constants/routes';
import useProfile from '../hooks/useProfile';
import ProfileSkeleton from '../components/ui/ProfileSkeleton';
import ProfileHeader        from '../components/profile/ProfileHeader';
import ProfileDetails       from '../components/profile/ProfileDetails';
import ResumeSection        from '../components/profile/ResumeSection';
import EditProfileForm      from '../components/profile/EditProfileForm';
import AboutSection         from '../components/profile/sections/AboutSection';
import PersonalDetailsSection  from '../components/profile/sections/PersonalDetailsSection';
import EducationSection        from '../components/profile/sections/EducationSection';
import WorkHistorySection      from '../components/profile/sections/WorkHistorySection';
import CareerPreferencesSection from '../components/profile/sections/CareerPreferencesSection';
import SocialLinksSection      from '../components/profile/sections/SocialLinksSection';
import CompanyDetailsSection   from '../components/profile/sections/CompanyDetailsSection';

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

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
    handleSectionSave,
  } = useProfile();

  if (isLoading) return <ProfileSkeleton />;

  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';
  const theme       = getTheme(isCandidate);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Nav */}
      <nav className="flex items-center justify-between bg-white px-4 py-3.5 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(isCandidate ? ROUTES.CANDIDATE_DASHBOARD : ROUTES.COMPANY_DASHBOARD)}>
          <span className={`font-sora w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-base text-white ${theme.logo}`}>
            HP
          </span>
          <span className="font-sora font-bold text-lg text-gray-900">HirePortal</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg text-sm border bg-white cursor-pointer ${theme.buttonLight}`}>
            Back
          </button>
          <button onClick={logoutUser}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white border-none cursor-pointer ${theme.button}`}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">

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

        {/* Messages */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Edit form — shown when editing basic fields */}
        {isEditing && (
          <EditProfileForm
            formData={formData}
            isCandidate={isCandidate}
            isCompany={isCompany}
            isSaving={isSaving}
            onChange={handleChange}
            onSkillsChange={handleSkillsChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* ── CANDIDATE SECTIONS ── */}
        {isCandidate && !isEditing && (
          <>
            <AboutSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <PersonalDetailsSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <div className="grid lg:grid-cols-[1fr_340px] gap-4">
              <ProfileDetails
                profile={profile}
                isCandidate={isCandidate}
                isCompany={isCompany}
              />
              <ResumeSection
                profile={profile}
                isUploading={isUploading}
                onUpload={handleResumeUpload}
                isCandidate={isCandidate}
              />
            </div>
            <EducationSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <WorkHistorySection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <CareerPreferencesSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <SocialLinksSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
          </>
        )}

        {/* ── COMPANY SECTIONS ── */}
        {isCompany && !isEditing && (
          <>
            <AboutSection
              profile={profile}
              isCandidate={false}
              onSave={handleSectionSave}
            />
            <CompanyDetailsSection
              profile={profile}
              onSave={handleSectionSave}
            />
            <SocialLinksSection
              profile={profile}
              isCandidate={false}
              onSave={handleSectionSave}
            />
          </>
        )}

      </div>
    </div>
  );
}