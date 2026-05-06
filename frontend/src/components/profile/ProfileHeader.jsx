// ─────────────────────────────────────────────────────
// ProfileHeader.jsx
// Purpose: Shows avatar/photo, name, email, role badge
// NOW USING TAILWIND CSS — no more inline style objects!
// ─────────────────────────────────────────────────────

import { useRef } from 'react';

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

  return (
    // Outer white card
    // bg-white = white background
    // rounded-2xl = rounded corners
    // p-5 = padding 20px
    // flex = flexbox layout
    // items-center = vertically centered
    // gap-4 = space between items
    // shadow-md = drop shadow
    // flex-wrap = wraps on mobile
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md flex-wrap">

      {/* ── AVATAR SECTION ── */}
      {/* flex-col = stack items vertically */}
      {/* items-center = center horizontally */}
      {/* gap-1 = small gap between avatar and text */}
      {/* shrink-0 = never shrink on mobile */}
      <div className="flex flex-col items-center gap-1 shrink-0">

        {/* Hidden file input — only accepts image files */}
        <input
          type="file"
          ref={photoInputRef}
          onChange={onPhotoUpload}
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
        />

        {/* Clickable avatar — opens file picker on click */}
        {/* relative = needed for camera overlay positioning */}
        {/* w-24 h-24 = 96px width and height */}
        {/* rounded-full = perfect circle */}
        {/* overflow-hidden = keeps content inside circle */}
        {/* cursor-pointer = shows hand cursor on hover */}
        {/* border-4 border-orange-500 = orange border around circle */}
        <div
          className={`relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-4 ${
            isCandidate ? 'border-orange-500' : 'border-blue-900'
          }`}
          onClick={() => photoInputRef.current?.click()}
          title="Click to change profile photo">

          {/* Show uploaded photo OR first letter of name */}
          {profile?.profilePhoto ? (
            // Profile photo — fills the circle
            // object-cover = crops image to fill without stretching
            <img
              src={`${import.meta.env.VITE_API_URL}${profile.profilePhoto}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            // Letter avatar — shown when no photo uploaded
            // bg-orange-500 = orange background
            // text-white = white text
            // text-4xl = large font size
            // font-extrabold = very bold
            // flex items-center justify-center = center the letter
            <div className={`w-full h-full text-white text-4xl font-extrabold flex items-center justify-center ${
                isCandidate ? 'bg-orange-500' : 'bg-blue-900'
              }`}
              style={{ fontFamily: 'Sora, sans-serif' }}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Camera overlay — dark strip at bottom of avatar */}
          {/* absolute = positioned relative to parent */}
          {/* bottom-0 left-0 right-0 = sticks to bottom */}
          {/* h-8 = height of overlay strip */}
          {/* bg-black/50 = black with 50% transparency */}
          {/* flex items-center justify-center = center the icon */}
          {/* text-white text-sm = white small text */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/50 flex items-center justify-center text-white text-sm">
            {isUploadingPhoto ? '...' : '📷'}
          </div>

        </div>

        {/* Change photo text below avatar */}
        {/* text-xs = very small text */}
        {/* text-gray-400 = light gray color */}
        {/* cursor-pointer = hand cursor */}
        <p className="text-xs text-gray-400 cursor-pointer">
          {isUploadingPhoto ? 'Uploading...' : 'Change photo'}
        </p>

        {/* Visibility toggle — only shown when photo exists */}
        {profile?.profilePhoto && (
          // flex gap-1 = row layout with small gap
          <div className="flex gap-1 mt-1">

            {/* Public button */}
            {/* Filled orange if selected, gray if not */}
            <button
              onClick={() => onVisibilityChange('public')}
              className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer
                ${profile?.photoVisibility === 'public'
                  ? 'bg-orange-500 text-white'      // selected = orange
                  : 'bg-gray-100 text-gray-400'}`}  // not selected = gray
            >
              🌐 Public
            </button>

            {/* Private button */}
            {/* Filled navy if selected, gray if not */}
            <button
              onClick={() => onVisibilityChange('private')}
              className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer
                ${profile?.photoVisibility === 'private'
                  ? 'bg-blue-900 text-white'         // selected = dark navy
                  : 'bg-gray-100 text-gray-400'}`}   // not selected = gray
            >
              🔒 Private
            </button>

          </div>
        )}

      </div>

      {/* ── NAME, EMAIL, ROLE BADGE ── */}
      {/* flex-1 = takes all remaining space */}
      <div className="flex-1">

        {/* Full name — large bold text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {profile?.name}
        </h1>

        {/* Email — small gray text */}
        <p className="text-sm text-gray-400 mb-2">
          {profile?.email}
        </p>

        {/* Role badge — pill shape */}
        {/* inline-block = fits content width */}
        {/* px-3 py-0.5 = horizontal and vertical padding */}
        {/* rounded-full = pill shape */}
        {/* text-xs font-bold = small bold text */}
        {/* Role text — CANDIDATE or COMPANY */}
          <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-wide ${
            isCandidate
              ? 'bg-orange-50 text-orange-500'
              : 'bg-blue-50 text-blue-900'
          }`}>
            {profile?.role?.toUpperCase()}
          </span>

      </div>

      {/* Edit Profile button — only shown in view mode */}
      {!isEditing && (
        // px-5 py-2.5 = padding
        // bg-orange-500 = orange background
        // text-white = white text
        // rounded-xl = rounded corners
        // font-semibold = semi bold
        // whitespace-nowrap = text never wraps
        // hover:bg-orange-600 = darker on hover
        // transition = smooth color change
        <button
          onClick={onEdit}
          className={`px-5 py-2.5 text-white rounded-xl font-semibold text-sm whitespace-nowrap transition cursor-pointer border-none ${
            isCandidate
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-blue-900 hover:bg-blue-800'
          }`}>
          Edit Profile
        </button>
      )}

    </div>
  );
}
// Note: No more 'const s = {}' style object at the bottom!
// All styles are now Tailwind classes directly on elements