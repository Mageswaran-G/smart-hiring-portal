import { useRef } from 'react';
import { getTheme } from '../../utils/theme';
import { calculateCompletion } from '../../utils/profileCompletion';

// SVG circle that shows profile completion percentage
// Works like LinkedIn's profile strength circle
function CompletionCircle({ percentage, color }) {
  const size        = 112; // total SVG size in px
  const strokeWidth = 4;   // thickness of the circle line
  const radius      = (size - strokeWidth * 2) / 2; // circle radius
  const circumference = 2 * Math.PI * radius;       // total circle length

  // offset controls how much of the circle is filled
  // offset = 0 means fully filled, offset = circumference means empty
  const offset = circumference - (percentage / 100) * circumference;

  return (
    // rotate(-90deg) makes circle start from top instead of right
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: -8, left: -8, transform: 'rotate(-90deg)' }}>

      {/* Background circle — always shows full grey ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e5e5"
        strokeWidth={strokeWidth}
      />

      {/* Progress circle — colored, fills based on percentage */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
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
  const theme      = getTheme(isCandidate);
  const percentage = calculateCompletion(profile, isCandidate);
  const accent     = isCandidate ? '#E65C00' : '#1D3557';

  // Color changes based on completion level
  const circleColor =
    percentage >= 80 ? '#22c55e' :  // green — almost complete
    percentage >= 50 ? accent :      // brand color — halfway
    '#f97316';                        // orange — needs work

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md flex-wrap">

      {/* Avatar section with completion circle */}
      <div className="flex flex-col items-center gap-1 shrink-0">

        {/* Hidden file input */}
        <input
          type="file"
          ref={photoInputRef}
          onChange={onPhotoUpload}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
        />

        {/* Avatar wrapper — circle sits outside this */}
        <div style={{ position: 'relative', width: 96, height: 96 }}>

          {/* Completion circle SVG — drawn around avatar */}
          <CompletionCircle percentage={percentage} color={circleColor} />

          {/* Clickable avatar */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
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

            {/* Camera overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 flex items-center justify-center text-white text-xs">
              {isUploadingPhoto ? '...' : 'Change'}
            </div>
          </div>

          {/* Percentage badge — shows below the circle */}
          <div
            style={{ background: circleColor }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            {percentage}%
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3 cursor-pointer">
          {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
        </p>

        {/* Visibility toggle — only when photo exists */}
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

      {/* Name, email, role, completion text */}
      <div className="flex-1">
        <h1 className="font-sora text-2xl font-bold text-gray-900 mb-1">
          {profile?.name}
        </h1>
        <p className="text-sm text-gray-400 mb-2">{profile?.email}</p>
        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-wide ${theme.badge}`}>
          {profile?.role?.toUpperCase()}
        </span>

        {/* Profile strength text below role badge */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, background: circleColor }}
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: circleColor }}>
            {percentage < 40  ? 'Just started'  :
             percentage < 70  ? 'Getting there' :
             percentage < 90  ? 'Almost complete' :
             'Profile complete'}
          </span>
        </div>
      </div>

      {/* Edit button */}
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