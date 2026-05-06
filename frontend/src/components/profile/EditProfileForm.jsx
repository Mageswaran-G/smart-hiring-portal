// ─────────────────────────────────────────────────────
// EditProfileForm.jsx
// Purpose: Shows all profile fields in EDIT mode
// User types new values and saves or cancels
// NOW USING TAILWIND CSS — no inline styles!
// ─────────────────────────────────────────────────────

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
    <div className="bg-white rounded-2xl p-7 shadow-md">

      {/* Section title */}
      <h2
        className="font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100"
        style={{ fontFamily: 'Sora, sans-serif' }}>
        Edit Profile
      </h2>

      {/* Full Name — shown to ALL roles */}
      <Field
        label="Full Name"
        name="name"
        value={formData.name || ''}
        onChange={onChange}
        placeholder="Enter your full name"
        isCandidate={isCandidate}
      />

      {/* Bio — shown to ALL roles */}
      {/* multiline = textarea instead of input */}
      <Field
        label="Bio"
        name="bio"
        value={formData.bio || ''}
        onChange={onChange}
        placeholder="Tell us about yourself (max 500 chars)"
        multiline
        isCandidate={isCandidate}
      />

      {/* Location — shown to ALL roles */}
      <Field
        label="Location"
        name="location"
        value={formData.location || ''}
        onChange={onChange}
        placeholder="City, State"
        isCandidate={isCandidate}
      />

      {/* Phone — shown to ALL roles */}
      <Field
        label="Phone"
        name="phone"
        value={formData.phone || ''}
        onChange={onChange}
        placeholder="+91 9876543210"
        isCandidate={isCandidate}
      />

      {/* ── CANDIDATE ONLY FIELDS ── */}
      {isCandidate && <>

        {/* Skills — special handling */}
        {/* Array in DB shown as comma text in input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Skills
          </label>
          <input
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
            value={Array.isArray(formData.skills)
              ? formData.skills.join(', ')
              : ''}
            onChange={onSkillsChange}
            placeholder="React, Node.js, MongoDB (comma separated)"
          />
          {/* Helper text below skills */}
          <p className="text-xs text-gray-300 mt-1">
            Separate each skill with a comma
          </p>
        </div>

        <Field
          label="Education"
          name="education"
          value={formData.education || ''}
          onChange={onChange}
          placeholder="B.E Computer Science, Anna University 2026"
          isCandidate={isCandidate}
        />

        <Field
          label="Experience"
          name="experience"
          value={formData.experience || ''}
          onChange={onChange}
          placeholder="6 months intern at XYZ Company"
          isCandidate={isCandidate}
        />

      </>}

      {/* ── COMPANY ONLY FIELDS ── */}
      {isCompany && <>

        <Field
          label="Company Name"
          name="companyName"
          value={formData.companyName || ''}
          onChange={onChange}
          placeholder="Acme Technologies Pvt Ltd"
          isCandidate={false}
        />

        <Field
          label="Company Website"
          name="companyWebsite"
          value={formData.companyWebsite || ''}
          onChange={onChange}
          placeholder="https://yourcompany.com"
          isCandidate={false}
        />

        <Field
          label="Industry"
          name="industry"
          value={formData.industry || ''}
          onChange={onChange}
          placeholder="Software, Finance, Healthcare"
          isCandidate={false}
        />

      </>}

      {/* ── SAVE AND CANCEL BUTTONS ── */}
      {/* justify-end = buttons on right side */}
      <div className="flex gap-3 justify-end mt-6">

        {/* Cancel button — white with border */}
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition">
          Cancel
        </button>

        {/* Save button — color based on role */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`px-6 py-2.5 text-white rounded-lg text-sm font-semibold border-none cursor-pointer transition ${
            isCandidate
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-blue-900 hover:bg-blue-800'
          }`}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Field — reusable input component
// label      = field name above input
// name       = HTML name (used by onChange)
// value      = current value
// onChange   = updates state on keystroke
// placeholder = hint text when empty
// multiline  = textarea if true, input if false
// isCandidate = changes focus color based on role
// ─────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, multiline, isCandidate }) {

  // Focus ring color — orange for candidate, navy for company
  const focusClass = isCandidate
    ? 'focus:border-orange-400 focus:ring-1 focus:ring-orange-100'
    : 'focus:border-blue-800 focus:ring-1 focus:ring-blue-100';

  // Base input classes — same for all fields
  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${focusClass}`;

  return (
    // Each field group — label + input
    <div className="mb-4">

      {/* Label above input — small uppercase gray */}
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>

      {/* Textarea for multiline fields like Bio */}
      {/* Regular input for single line fields */}
      {multiline
        ? <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        : <input
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClass}
          />
      }

    </div>
  );
}