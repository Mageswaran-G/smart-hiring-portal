import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTheme } from '../utils/theme';
import { ROUTES } from '../constants/routes';
import useProfile from '../hooks/useProfile';
import ProfileSkeleton         from '../components/ui/ProfileSkeleton';
import ProfileHeader           from '../components/profile/ProfileHeader';
import ProfileDetails          from '../components/profile/ProfileDetails';
import EditProfileForm         from '../components/profile/EditProfileForm';
import RichTextAboutSection    from '../components/profile/sections/RichTextAboutSection';
import ContactInfoSection      from '../components/profile/sections/ContactInfoSection';
import PersonalDetailsSection  from '../components/profile/sections/PersonalDetailsSection';
import EducationSection        from '../components/profile/sections/EducationSection';
import WorkHistorySection      from '../components/profile/sections/WorkHistorySection';
import CareerPreferencesSection from '../components/profile/sections/CareerPreferencesSection';
import SocialLinksSection      from '../components/profile/sections/SocialLinksSection';
import CompanyDetailsSection   from '../components/profile/sections/CompanyDetailsSection';
import SkillsSection           from '../components/profile/sections/SkillsSection';
import CertificationsSection   from '../components/profile/sections/CertificationsSection';
import LanguagesSection        from '../components/profile/sections/LanguagesSection';
import PortfolioSection        from '../components/profile/sections/PortfolioSection';
import ProfileSlugSection      from '../components/profile/sections/ProfileSlugSection';
import MultipleResumesSection  from '../components/profile/sections/MultipleResumesSection';
import PrivacyControlsSection  from '../components/profile/sections/PrivacyControlsSection';
import CoverBannerSection from '../components/profile/sections/CoverBannerSection';
import HiringStatusSection from '../components/profile/sections/HiringStatusSection';
import CompanyCultureSection from '../components/profile/sections/CompanyCultureSection';
import EmployeeBenefitsSection from '../components/profile/sections/EmployeeBenefitsSection';
import CompanyTechStackSection from '../components/profile/sections/CompanyTechStackSection';

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const {
    profile,
    formData,
    isEditing,    setIsEditing,
    isLoading,
    isSaving,
    isUploadingPhoto,
    successMsg,
    errorMsg,
    fetchProfile,
    handleChange,
    handleSave,
    handleCancel,
    handlePhotoUpload,
    handleVisibilityChange,
    handleSectionSave,
  } = useProfile();

  if (isLoading) return <ProfileSkeleton />;

  const isCandidate = user?.role === 'candidate';
  const isCompany   = user?.role === 'company';
  const theme       = getTheme(user?.role);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

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

        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          isCandidate={isCandidate}
          onPhotoUpload={handlePhotoUpload}
          isUploadingPhoto={isUploadingPhoto}
          onVisibilityChange={handleVisibilityChange}
          onSave={handleSectionSave}
        />

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

        {isEditing && (
          <EditProfileForm
            formData={formData}
            isCandidate={isCandidate}
            isCompany={isCompany}
            isSaving={isSaving}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* CANDIDATE SECTIONS */}
        {isCandidate && !isEditing && (
          <>
            <RichTextAboutSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <ContactInfoSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <PersonalDetailsSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <ProfileDetails
              profile={profile}
              isCandidate={isCandidate}
              isCompany={isCompany}
            />
            <SkillsSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <MultipleResumesSection
              profile={profile}
              isCandidate={isCandidate}
              onProfileRefresh={fetchProfile}
            />
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
            <CertificationsSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <LanguagesSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <PortfolioSection
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
            <ProfileSlugSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
            <PrivacyControlsSection
              profile={profile}
              isCandidate={isCandidate}
              onSave={handleSectionSave}
            />
          </>
        )}

        {/* COMPANY SECTIONS */}
        {isCompany && !isEditing && (
          <>
            <CoverBannerSection
              profile={profile}
              onProfileRefresh={fetchProfile}
            />
            <HiringStatusSection
              profile={profile}
              onProfileRefresh={fetchProfile}
            />
            <RichTextAboutSection
              profile={profile}
              isCandidate={false}
              onSave={handleSectionSave}
            />
            <ContactInfoSection
              profile={profile}
              isCandidate={false}
              onSave={handleSectionSave}
            />
            <CompanyDetailsSection
              profile={profile}
              onSave={handleSectionSave}
            />
            <CompanyCultureSection
              profile={profile}
              onSave={handleSectionSave}
            />
            <EmployeeBenefitsSection
              profile={profile}
              onSave={handleSectionSave}
            />
            <CompanyTechStackSection
              profile={profile}
              onSave={handleSectionSave}
            />
            <SocialLinksSection
              profile={profile}
              isCandidate={false}
              onSave={handleSectionSave}
            />
            <ProfileSlugSection
              profile={profile}
              onSave={handleSectionSave}
            />
            <PrivacyControlsSection
              profile={profile}
              onSave={handleSectionSave}
            />
          </>
        )}

      </div>
    </div>
  );
}