// ProfileVisibilityToggle — Public/Private toggle for profile photo
// Only shown when profile photo exists

export default function ProfileVisibilityToggle({ profile, theme, onVisibilityChange }) {
  if (!profile?.profilePhoto) return null;

  return (
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
  );
}