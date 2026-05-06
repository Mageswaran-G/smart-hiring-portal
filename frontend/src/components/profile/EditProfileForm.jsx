// ─────────────────────────────────────────────────────
// EditProfileForm.jsx
// Purpose: Shows all profile fields in EDIT mode
// User can type new values and save or cancel
// Shows different fields based on role:
//   Candidate → skills, education, experience
//   Company   → companyName, companyWebsite, industry
// Used in: ProfilePage.jsx
// ─────────────────────────────────────────────────────

// formData       = current form values (controlled inputs)
// isCandidate    = true if role is 'candidate'
// isCompany      = true if role is 'company'
// isSaving       = true while API call is in progress
// onChange       = handles text field changes
// onSkillsChange = handles skills field (special — comma separated)
// onSave         = called when Save button clicked
// onCancel       = called when Cancel button clicked
export default function EditProfileForm({
  formData,
  isCandidate,
  isCompany,
  isSaving,
  onChange,
  onSkillsChange,
  onSave,
  onCancel
}) {
  return (
    // White card with shadow
    <div style={s.card}>

      {/* Section title */}
      <h2 style={s.title}>Edit Profile</h2>

      {/* Common fields — shown to ALL roles */}
      {/* multiline={true} makes textarea instead of input */}
      <Field
        label="Bio"
        name="bio"
        value={formData.bio || ''}
        onChange={onChange}
        placeholder="Tell us about yourself (max 500 chars)"
        multiline
      />

      <Field
        label="Location"
        name="location"
        value={formData.location || ''}
        onChange={onChange}
        placeholder="City, State"
      />

      <Field
        label="Phone"
        name="phone"
        value={formData.phone || ''}
        onChange={onChange}
        placeholder="+91 9876543210"
      />

      {/* Candidate-only fields */}
      {isCandidate && <>

        {/* Skills field — special handling */}
        {/* Array stored in DB — shown as comma separated text in input */}
        {/* Example: ['React','Node.js'] → 'React, Node.js' in input */}
        <div style={s.group}>
          <label style={s.label}>Skills</label>
          <input
            style={s.input}
            value={Array.isArray(formData.skills)
              ? formData.skills.join(', ')  // array → comma separated string
              : ''}
            onChange={onSkillsChange}       // uses special handler (not onChange)
            placeholder="React, Node.js, MongoDB (comma separated)"
          />
          {/* Helper text below skills input */}
          <p style={s.hint}>Separate each skill with a comma</p>
        </div>

        <Field
          label="Education"
          name="education"
          value={formData.education || ''}
          onChange={onChange}
          placeholder="B.E Computer Science, Anna University 2026"
        />

        <Field
          label="Experience"
          name="experience"
          value={formData.experience || ''}
          onChange={onChange}
          placeholder="6 months intern at XYZ Company"
        />

      </>}

      {/* Company-only fields */}
      {isCompany && <>

        <Field
          label="Company Name"
          name="companyName"
          value={formData.companyName || ''}
          onChange={onChange}
          placeholder="Acme Technologies Pvt Ltd"
        />

        <Field
          label="Company Website"
          name="companyWebsite"
          value={formData.companyWebsite || ''}
          onChange={onChange}
          placeholder="https://yourcompany.com"
        />

        <Field
          label="Industry"
          name="industry"
          value={formData.industry || ''}
          onChange={onChange}
          placeholder="Software, Finance, Healthcare"
        />

      </>}

      {/* Save and Cancel buttons row */}
      <div style={s.btnRow}>

        {/* Cancel — goes back to view mode without saving */}
        <button
          onClick={onCancel}
          style={s.cancelBtn}
          disabled={isSaving}>
          Cancel
        </button>

        {/* Save — sends data to backend API */}
        {/* Shows "Saving..." while API call is running */}
        <button
          onClick={onSave}
          style={s.saveBtn}
          disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Field — reusable input component
// label    = field name shown above input
// name     = HTML name attribute (used by onChange)
// value    = current value (controlled input)
// onChange = updates formData state on every keystroke
// placeholder = gray hint text shown when empty
// multiline = if true, renders textarea instead of input
// ─────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, multiline }) {
  return (
    <div style={s.group}>

      {/* Label above input */}
      <label style={s.label}>{label}</label>

      {/* Textarea for multi-line fields (like Bio) */}
      {/* Regular input for single-line fields */}
      {multiline
        ? <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            style={{ ...s.input, resize: 'vertical' }} // user can resize vertically
          />
        : <input
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={s.input}
          />
      }

    </div>
  );
}

// ─────────────────────────────────────────────────────
// Styles for this component
// ─────────────────────────────────────────────────────
const s = {
  // White card with shadow
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },

  // Section heading — "Edit Profile"
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 17,
    fontWeight: 700,
    color: '#0a0a14',
    margin: '0 0 20px',
    paddingBottom: 12,
    borderBottom: '1px solid #f0f0f0'
  },

  // Each field group — label + input together
  group: { marginBottom: 16 },

  // Label above each input — small uppercase gray text
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  // Input and textarea — same style
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e5e5e5',
    borderRadius: 8,
    fontSize: 14,
    color: '#222',
    outline: 'none',
    boxSizing: 'border-box',   // padding included in width calculation
    fontFamily: 'Inter, sans-serif'
  },

  // Helper text below skills input
  hint: { fontSize: 11, color: '#aaa', marginTop: 4 },

  // Button row — right aligned
  btnRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end', // buttons on right side
    marginTop: 24
  },

  // Cancel button — white with border
  cancelBtn: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#555'
  },

  // Save button — orange
  saveBtn: {
    background: '#E65C00',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600
  },
};