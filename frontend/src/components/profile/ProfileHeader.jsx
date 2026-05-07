import { useRef } from 'react';
import { getTheme } from '../../utils/theme';

export default function ProfileHeader({
  profile,
  isEditing,
  onEdit,
  isCandidate,
  onPhotoUpload,
  isUploadingPhoto,
  onVisibilityChange
}) {
  const photoInputRef = useRef(null);
  const theme = getTheme(isCandidate);

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md flex-wrap">

      {/* Avatar section */}
      <div className="flex flex-col items-center gap-1 shrink-0">

        {/* Hidden file input — triggered by clicking avatar */}
        <input
          type="file"
          ref={photoInputRef}
          onChange={onPhotoUpload}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
        />

        {/* Clickable avatar circle */}
        <div
          className={`relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-4 ${theme.border}`}
          onClick={() => photoInputRef.current?.click()}
          title="Click to change profile photo">

          {/* Show uploaded photo OR first letter of name */}
          {profile?.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${profile.profilePhoto}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`font-sora w-full h-full text-white text-4xl font-extrabold flex items-center justify-center ${theme.avatar}`}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Camera icon overlay at bottom of avatar */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 flex items-center justify-center text-white text-sm">
            {isUploadingPhoto ? '...' : 'Change'}
          </div>
        </div>

        <p className="text-xs text-gray-400 cursor-pointer">
          {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
        </p>

        {/* Visibility toggle — only shown when photo exists */}
        {profile?.profilePhoto && (
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => onVisibilityChange('public')}
              className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer ${
                profile?.photoVisibility === 'public'
                  ? theme.button
                  : 'bg-gray-100 text-gray-400'
              }`}>
              Public
            </button>
            <button
              onClick={() => onVisibilityChange('private')}
              className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer ${
                profile?.photoVisibility === 'private'
                  ? theme.button
                  : 'bg-gray-100 text-gray-400'
              }`}>
              Private
            </button>
          </div>
        )}
      </div>

      {/* Name, email, role badge */}
      <div className="flex-1">
        <h1 className="font-sora text-2xl font-bold text-gray-900 mb-1">
          {profile?.name}
        </h1>
        <p className="text-sm text-gray-400 mb-2">
          {profile?.email}
        </p>
        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-wide ${theme.badge}`}>
          {profile?.role?.toUpperCase()}
        </span>
      </div>

      {/* Edit Profile button — hidden while editing */}
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