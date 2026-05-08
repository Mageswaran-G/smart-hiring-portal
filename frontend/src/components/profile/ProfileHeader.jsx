import { getTheme } from '../../utils/theme';
import ProfileAvatar from './ProfileAvatar';
import ProfileVisibilityToggle from './ProfileVisibilityToggle';

// ProfileHeader — name, email, badge, edit button
// Avatar and visibility are handled by child components
export default function ProfileHeader({
  profile,
  isEditing,
  onEdit,
  isCandidate,
  onPhotoUpload,
  isUploadingPhoto,
  onVisibilityChange
}) {
  const theme = getTheme(profile?.role);

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md flex-wrap">

      <div className="flex flex-col items-center gap-1">
        <ProfileAvatar
          profile={profile}
          isCandidate={isCandidate}
          theme={theme}
          onPhotoUpload={onPhotoUpload}
          isUploadingPhoto={isUploadingPhoto}
        />
        <ProfileVisibilityToggle
          profile={profile}
          theme={theme}
          onVisibilityChange={onVisibilityChange}
        />
      </div>

      <div className="flex-1">
        <h1 className="font-sora text-2xl font-bold text-gray-900 mb-1">
          {profile?.name}
        </h1>
        <p className="text-sm text-gray-400 mb-2">{profile?.email}</p>
        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-wide ${theme.badge}`}>
          {profile?.role?.toUpperCase()}
        </span>
      </div>

      {!isEditing && (
        <button
          onClick={onEdit}
          className={`px-5 py-2.5 text-white rounded-xl font-semibold text-sm whitespace-nowrap transition cursor-pointer border-none ${theme.button}`}>
          Edit Profile
        </button>
      )}
    </div>
  );
}