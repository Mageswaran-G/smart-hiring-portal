import { useRef, useMemo } from 'react';
import { calculateCompletion } from '../../utils/profileCompletion';

// SVG circle around avatar — shows profile completion
function CompletionRing({ percentage, color }) {
  const size        = 112;
  const stroke      = 4;
  const radius      = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute -top-2 -left-2"
      style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e5e5" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

// ProfileAvatar — avatar circle with completion ring + percentage badge
export default function ProfileAvatar({ profile, isCandidate, theme, onPhotoUpload, isUploadingPhoto }) {
  const fileRef   = useRef(null);

  const percentage = useMemo(
    () => calculateCompletion(profile, isCandidate),
    [profile, isCandidate]
  );

  const ringColor = percentage >= 80 ? '#22c55e' : theme.primary;

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">

      <input
        type="file"
        ref={fileRef}
        onChange={onPhotoUpload}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      <div className="relative w-24 h-24">
        <CompletionRing percentage={percentage} color={ringColor} />

        <div
          className="w-24 h-24 rounded-full overflow-hidden cursor-pointer relative"
          onClick={() => fileRef.current?.click()}
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
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: ringColor }}>
          {percentage}%
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 cursor-pointer">
        {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
      </p>
    </div>
  );
}