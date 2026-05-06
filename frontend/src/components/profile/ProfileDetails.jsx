// ─────────────────────────────────────────────────────
// ProfileDetails.jsx
// Purpose: Shows all profile fields in VIEW mode (read only)
// Shows different fields based on role:
//   Candidate → skills, education, experience
//   Company   → companyName, companyWebsite, industry
// Used in: ProfilePage.jsx
// ─────────────────────────────────────────────────────

// profile     = user data from MongoDB
// isCandidate = true if role is 'candidate'
// isCompany   = true if role is 'company'
export default function ProfileDetails({ profile, isCandidate, isCompany }) {
  return (
    // White card with shadow
    <div style={s.card}>

      {/* Section title */}
      <h2 style={s.title}>Profile Details</h2>

      {/* Common fields — shown to ALL roles */}
      <Field label="Bio"      value={profile?.bio} />
      <Field label="Location" value={profile?.location} />
      <Field label="Phone"    value={profile?.phone} />

      {/* Candidate-only fields */}
      {/* Only shown when role is 'candidate' */}
      {isCandidate && <>
        {/* Skills array — joined with comma for display */}
        {/* Example: ['React', 'Node.js'] → 'React, Node.js' */}
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
      {/* Only shown when role is 'company' */}
      {isCompany && <>
        <Field label="Company Name"    value={profile?.companyName} />
        <Field label="Company Website" value={profile?.companyWebsite} />
        <Field label="Industry"        value={profile?.industry} />
      </>}

    </div>
  );
}

// ─────────────────────────────────────────────────────
// Field — small helper component
// Shows ONE row: label on left, value on right
// If value is empty → shows "Not set" in gray italic
// ─────────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div style={s.row}>
      {/* Label — gray, bold, left side */}
      <span style={s.label}>{label}</span>

      {/* Value — dark, right side */}
      {/* If no value → shows "Not set" in light gray */}
      <span style={s.value}>
        {value && value.length > 0
          ? value
          : <em style={{ color: '#bbb' }}>Not set</em>}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Styles for this component
// ─────────────────────────────────────────────────────
const s = {
  // White card with rounded corners and shadow
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },

  // Section heading — "Profile Details"
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 17,
    fontWeight: 700,
    color: '#0a0a14',
    margin: '0 0 20px',
    paddingBottom: 12,
    borderBottom: '1px solid #f0f0f0' // thin line below title
  },

  // One field row — flex layout, label + value side by side
  row: {
    display: 'flex',
    padding: '11px 0',
    borderBottom: '1px solid #f7f7f7' // very light separator line
  },

  // Label text — "Bio", "Location" etc
  label: {
    width: 130,        // fixed width so all labels align
    flexShrink: 0,     // label never shrinks
    fontSize: 13,
    fontWeight: 600,
    color: '#888'      // gray color
  },

  // Value text — actual content
  value: {
    fontSize: 14,
    color: '#222',
    flex: 1,           // takes remaining space
    lineHeight: 1.5
  },
};