// ─────────────────────────────────────────────────────
// ProfileDetails.jsx
// Purpose: Shows all profile fields in VIEW mode
// NOW USING TAILWIND CSS — no inline styles!
// ─────────────────────────────────────────────────────

export default function ProfileDetails({ profile, isCandidate, isCompany }) {
  return (
    // White card with shadow and rounded corners
    <div className="bg-white rounded-2xl p-7 shadow-md">

      {/* Section title with bottom border */}
      <h2 className="font-sora font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100">
        Profile Details
      </h2>

      {/* Common fields — shown to ALL roles */}
      <Field label="Bio"      value={profile?.bio} />
      <Field label="Location" value={profile?.location} />
      <Field label="Phone"    value={profile?.phone} />

      {/* Candidate-only fields */}
      {isCandidate && <>
        <Field
          label="Skills"
          value={
            Array.isArray(profile?.skills) && profile.skills.length > 0
              ? profile.skills.join(', ')
              : null
          }
        />
        <Field label="Education"  value={profile?.education} />
        <Field label="Experience" value={profile?.experience} />
      </>}

      {/* Company-only fields */}
      {isCompany && <>
        <Field label="Company Name"    value={profile?.companyName} />
        <Field label="Company Website" value={profile?.companyWebsite} />
        <Field label="Industry"        value={profile?.industry} />
      </>}

    </div>
  );
}

// ─────────────────────────────────────────────────────
// Field — shows ONE row: label on left, value on right
// ─────────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    // flex = side by side layout
    // py-3 = vertical padding
    // border-b = bottom border line
    // border-gray-50 = very light gray border
    <div className="flex py-3 border-b border-gray-50">

      {/* Label — gray, bold, fixed width */}
      {/* w-32 = fixed 128px width so all labels align */}
      {/* shrink-0 = never shrinks */}
      <span className="w-32 shrink-0 text-sm font-semibold text-gray-400">
        {label}
      </span>

      {/* Value — dark text */}
      {/* flex-1 = takes remaining space */}
      <span className="flex-1 text-sm text-gray-800 leading-relaxed">
        {value && value.length > 0
          ? value
          : <em className="text-gray-300">Not set</em>}
      </span>

    </div>
  );
}