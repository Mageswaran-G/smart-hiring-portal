// ─────────────────────────────────────────────────────
// ProfileHeader.jsx
// Purpose: Shows the top section of profile page
// Displays: Avatar circle, name, email, role badge, Edit button
// Used in: ProfilePage.jsx
// ─────────────────────────────────────────────────────

// Default export — this component receives data from ProfilePage
// profile     = the user's data from MongoDB
// isEditing   = true when user clicked Edit Profile button
// onEdit      = function to call when Edit button is clicked
// isCandidate = true if user role is 'candidate'
export default function ProfileHeader({ profile, isEditing, onEdit, isCandidate }) {
  return (
    // Outer card — white box with rounded corners and shadow
    <div style={s.headerCard}>

      {/* Avatar circle — shows first letter of name */}
      {/* Example: "Mageswaran G" → shows "M" */}
      <div style={s.avatar}>
        {profile?.name?.charAt(0).toUpperCase()}
      </div>

      {/* Name, email and role badge section */}
      <div style={s.info}>

        {/* Full name — from MongoDB */}
        <h1 style={s.name}>{profile?.name}</h1>

        {/* Email address */}
        <p style={s.email}>{profile?.email}</p>

        {/* Role badge — orange for candidate, blue for company */}
        <span style={{
          ...s.badge,
          background: isCandidate ? '#fff3e8' : '#e8f0ff', // light orange or light blue
          color:      isCandidate ? '#E65C00' : '#1D3557'  // dark orange or dark navy
        }}>
          {/* Shows CANDIDATE or COMPANY in uppercase */}
          {profile?.role?.toUpperCase()}
        </span>

      </div>

      {/* Edit Profile button — only shown in view mode (not while editing) */}
      {!isEditing && (
        <button onClick={onEdit} style={s.editBtn}>
          Edit Profile
        </button>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────
// All styles for this component
// ─────────────────────────────────────────────────────
const s = {
  // Outer white card — flexbox layout, wraps on mobile
  headerCard: {
    background: '#fff',
    borderRadius: 16,
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    flexWrap: 'wrap' // wraps to next line on small screens
  },

  // Orange circle with white letter
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',      // makes it a circle
    background: '#E65C00',    // HirePortal orange
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 800,
    fontFamily: 'Sora, sans-serif',
    flexShrink: 0             // prevents avatar from shrinking on mobile
  },

  // Info section — takes all remaining space
  info: { flex: 1 },

  // Name text — bold and large
  name: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 24,
    fontWeight: 700,
    color: '#0a0a14',
    margin: '0 0 4px'
  },

  // Email text — small and gray
  email: {
    fontSize: 14,
    color: '#888',
    margin: '0 0 8px'
  },

  // Role badge — small pill shape
  badge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.5px'
  },

  // Edit Profile button — orange
  editBtn: {
    background: '#E65C00',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap' // prevents button text from wrapping
  },
};