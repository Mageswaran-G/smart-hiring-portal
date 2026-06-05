import { useRef, useMemo } from 'react';
import { Camera } from 'lucide-react';
import { calcProfileStrength as calculateCompletion } from '../../utils/profileStrength';
import SafeAvatar from '../ui/SafeAvatar';
import toast from 'react-hot-toast';

function CompletionRing({ pct, color }) {
  const size = 96, sw = 3, r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size+8} height={size+8} className="absolute -top-1 -left-1 pointer-events-none" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={(size+8)/2} cy={(size+8)/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={sw} />
      <circle cx={(size+8)/2} cy={(size+8)/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

export default function ProfileAvatar({ profile, isCandidate, theme, onPhotoUpload, isUploadingPhoto }) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      e.target.value = '';
      return;
    }
    onPhotoUpload(e);
  };
  const pct = useMemo(() => calculateCompletion(profile, isCandidate), [profile, isCandidate]);
  const ringColor = pct >= 80 ? '#22c55e' : theme.primary;

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <input type="file" ref={fileRef} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.webp" className="hidden" />
      <div className="relative w-24 h-24">
        <CompletionRing pct={pct} color={ringColor} />
        <button type="button" onClick={() => !isUploadingPhoto && fileRef.current?.click()}
          className="group w-24 h-24 rounded-full overflow-hidden cursor-pointer relative">
          <SafeAvatar
            src={profile?.profilePhoto ? `${import.meta.env.VITE_API_URL || ''}${profile.profilePhoto}` : ''}
            name={profile?.name}
            alt="Profile"
            className="w-full h-full object-cover"
            fallbackClassName="w-full h-full flex items-center justify-center font-sora font-extrabold text-white text-3xl"
            fallbackStyle={{ background: theme.primary }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            {isUploadingPhoto ? <span className="text-white text-xs font-medium">...</span> : <Camera size={20} className="text-white" />}
          </div>
        </button>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: ringColor }}>
          {pct}%
        </div>
      </div>
    </div>
  );
}
