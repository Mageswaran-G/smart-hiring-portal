import { Eye, EyeOff } from 'lucide-react';

export default function ProfileVisibilityToggle({ profile, theme, onVisibilityChange }) {
  if (!profile?.profilePhoto) return null;
  const isPublic = profile?.photoVisibility !== 'private';
  return (
    <div className="flex items-center gap-0.5 mt-1 bg-gray-100 rounded-full p-0.5">
      <button onClick={() => onVisibilityChange('public')}
        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer border-none transition"
        style={{ background: isPublic ? theme.primary : 'transparent', color: isPublic ? 'white' : '#9ca3af' }}>
        <Eye size={9} /> Public
      </button>
      <button onClick={() => onVisibilityChange('private')}
        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer border-none transition"
        style={{ background: !isPublic ? '#4b5563' : 'transparent', color: !isPublic ? 'white' : '#9ca3af' }}>
        <EyeOff size={9} /> Private
      </button>
    </div>
  );
}