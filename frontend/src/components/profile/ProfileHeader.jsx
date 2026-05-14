import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { getTheme } from '../../utils/theme';
import ProfileAvatar from './ProfileAvatar';
import ProfileVisibilityToggle from './ProfileVisibilityToggle';

export default function ProfileHeader({
  profile, isEditing, onEdit, isCandidate,
  onPhotoUpload, isUploadingPhoto, onVisibilityChange, onSave,
}) {
  const theme = getTheme(profile?.role);

  const [editingHeadline, setEditingHeadline] = useState(false);
  const [headline,        setHeadline]        = useState(profile?.headline || '');
  const [savingHeadline,  setSavingHeadline]  = useState(false);
  const [openToWork,      setOpenToWork]      = useState(profile?.openToWork || false);
  const [savingOTW,       setSavingOTW]       = useState(false);

  const handleHeadlineSave = async () => {
    setSavingHeadline(true);
    await onSave({ headline: headline.trim() });
    setSavingHeadline(false);
    setEditingHeadline(false);
  };

  const handleHeadlineCancel = () => {
    setHeadline(profile?.headline || '');
    setEditingHeadline(false);
  };

  const handleToggleOTW = async () => {
    const next = !openToWork;
    setOpenToWork(next);
    setSavingOTW(true);
    await onSave({ openToWork: next });
    setSavingOTW(false);
  };

  const location = [profile?.city, profile?.country].filter(Boolean).join(', ');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Accent strip top */}
      <div className="h-1.5 w-full" style={{ background: theme.primary }} />

      <div className="p-6 flex items-start gap-5">

        {/* Left - avatar */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
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

        {/* Right - info */}
        <div className="flex-1 min-w-0 pt-1">

          {/* Name row + pencil button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">

              {/* Name */}
              <h1 className="font-sora text-xl font-bold text-gray-900 leading-tight">
                {profile?.name || 'Your Name'}
              </h1>

              {/* Headline - inline editable */}
              {editingHeadline ? (
              <div className="mt-1.5 flex flex-col gap-2">

                {/* Input — full width */}
                <input
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  maxLength={100}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleHeadlineSave();
                    if (e.key === 'Escape') handleHeadlineCancel();
                  }}
                  className="w-full text-sm border rounded-lg px-3 py-2 outline-none text-gray-700 bg-white"
                  style={{ borderColor: theme.primary }}
                />

                {/* Save + Cancel — full visible buttons below input */}
                <div className="flex gap-2">
                  <button
                    onClick={handleHeadlineSave}
                    disabled={savingHeadline}
                    className="flex-1 text-xs font-semibold text-white py-2 rounded-lg border-none cursor-pointer"
                    style={{ background: theme.primary }}
                  >
                    {savingHeadline ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleHeadlineCancel}
                    className="flex-1 text-xs font-semibold text-gray-600 py-2 rounded-lg border border-gray-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </div>
              ) : (
                <button onClick={() => setEditingHeadline(true)}
                  className="block text-left mt-1 cursor-pointer border-none bg-transparent p-0 group">
                  {profile?.headline
                    ? 
                      <p className="text-sm text-gray-500 break-words leading-snug">
                        {profile.headline}
                        <span className="text-[10px] text-orange-300 ml-1.5">✎</span>
                      </p>
                    : <p className="text-xs text-orange-400 font-medium">
                        + Tap to add headline
                      </p>
                  }
                </button>
              )}
            </div>

            {/* Pencil button */}
            {!isEditing && (
              <button onClick={onEdit} title="Edit profile"
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border transition shrink-0 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50 border-gray-200">
                <Pencil size={14} />
              </button>
            )}
          </div>

          {/* Email + location */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-gray-400">{profile?.email}</span>
            {location && (
              <><span className="text-gray-200 text-xs">·</span>
              <span className="text-xs text-gray-400">{location}</span></>
            )}
          </div>

          {/* Role badge + OTW */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${theme.badge}`}>
              {profile?.role}
            </span>

            {isCandidate && (
              <button onClick={handleToggleOTW} disabled={savingOTW}
                className="inline-flex items-center gap-1.5 cursor-pointer border-none bg-transparent p-0">
                {openToWork
                  ? <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      <span className="text-[10px] font-semibold text-green-700">Ready to Work</span>
                    </span>
                  : <span className="inline-flex items-center gap-1.5 border border-dashed border-gray-200 rounded-full px-2.5 py-0.5 hover:border-gray-300 transition">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
                      <span className="text-[10px] text-gray-400">Ready to Work</span>
                    </span>
                }
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}