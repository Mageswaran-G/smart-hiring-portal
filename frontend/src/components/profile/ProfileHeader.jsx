import { useRef } from 'react';
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
      style={{ position: 'absolute', top: -8, left: -8, transform: 'rotate(-90deg)' }}>
      {/* Grey background ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#e5e5e5" strokeWidth={strokeWidth}
      />
      {/* Colored progress ring */}
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
  const theme      = getTheme(isCandidate);
  const percentage = calculateCompletion(profile, isCandidate);

  // Fix 2 — use brand accent color always, green only when 80%+ complete
  // Candidate = orange, Company = navy, Both = green when complete
  const accent     = isCandidate ? '#E65C00' : '#1D3557';
  const circleColor = percentage >= 80 ? '#22c55e' : accent;

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md flex-wrap">

      <div className="flex flex-col items-center gap-1 shrink-0">

        {/* Hidden file input */}
        <input
          type="file"
          ref={photoInputRef}
          onChange={onPhotoUpload}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
        />

        {/* Outer wrapper — gives space for the SVG circle */}
        <div style={{ position: 'relative', width: 96, height: 96 }}>

          {/* SVG completion ring around avatar */}
          <CompletionCircle percentage={percentage} color={circleColor} />

          {/* Fix 1 — added relative here so overlay clips inside the circle */}
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

            {/* Fix 1 — overlay now clips inside circle because parent has relative */}
            <div className="absolute bottom-0 left-0 right-0 h-7 bg-black/50 flex items-center justify-center text-white text-xs rounded-b-full">
              {isUploadingPhoto ? '...' : 'Change'}
            </div>
          </div>

          {/* Percentage badge below circle */}
          <div
            style={{ background: circleColor }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            {percentage}%
          </div>
        </div>

        {/* Fix 3 — removed progress bar and strength text completely */}
        {/* Only keeping the small text below */}
        <p className="text-xs text-gray-400 mt-4 cursor-pointer">
          {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
        </p>

        {/* Visibility toggle — only when photo exists */}
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
        <p className="text-sm text-gray-400 mb-2">{profile?.email}</p>
        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-wide ${theme.badge}`}>
          {profile?.role?.toUpperCase()}
        </span>
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