import { useRef, useMemo } from 'react';
import { getTheme } from '../../utils/theme';
import { calculateCompletion } from '../../utils/profileCompletion';

function CompletionCircle({ percentage, color }) {
  const size         = 112;
  const strokeWidth  = 4;
  const radius       = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute -top-2 -left-2"
      style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#e5e5e5" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

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
  const theme = getTheme(profile?.role);

  // useMemo — only recalculates when profile or role changes
  // avoids unnecessary recalculation on every render
  const percentage = useMemo(
    () => calculateCompletion(profile, isCandidate),
    [profile, isCandidate]
  );

  // Use theme.primary instead of hardcoded hex
  // Green only when profile is 80%+ complete
  const circleColor = percentage >= 80 ? '#22c55e' : theme.primary;

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md flex-wrap">

      <div className="flex flex-col items-center gap-1 shrink-0">

        <input
          type="file"
          ref={photoInputRef}
          onChange={onPhotoUpload}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
        />

        {/* Fix 3 — replaced inline style with Tailwind classes */}
        <div className="relative w-24 h-24">

          <CompletionCircle percentage={percentage} color={circleColor} />

          <div
            className="w-24 h-24 rounded-full overflow-hidden cursor-pointer relative"
            onClick={() => photoInputRef.current?.click()}
            title="Click to change profile photo">

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

            <div className="absolute bottom-0 left-0 right-0 h-7 bg-black/50 flex items-center justify-center text-white text-xs rounded-b-full">
              {isUploadingPhoto ? '...' : 'Change'}
            </div>
          </div>

          {/* Percentage badge */}
          <div
            style={{ background: circleColor }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            {percentage}%
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 cursor-pointer">
          {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
        </p>

        {profile?.profilePhoto && (
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => onVisibilityChange('public')}
              className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer ${
                profile?.photoVisibility === 'public' ? theme.button : 'bg-gray-100 text-gray-400'
              }`}>
              Public
            </button>
            <button
              onClick={() => onVisibilityChange('private')}
              className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer ${
                profile?.photoVisibility === 'private' ? theme.button : 'bg-gray-100 text-gray-400'
              }`}>
              Private
            </button>
          </div>
        )}
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