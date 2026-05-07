// ─────────────────────────────────────────────────────
// EditProfileForm.jsx
// Purpose: Shows all profile fields in EDIT mode
// User types new values and saves or cancels
// NOW USING TAILWIND CSS — no inline styles!
// ─────────────────────────────────────────────────────

// getTheme — returns orange or navy colors based on role
import { getTheme } from '../../utils/theme';

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
  // ── Theme — MUST be defined inside component, AFTER props ──
  // isCandidate comes from props — available here
  const theme = getTheme(isCandidate);

  return (
    // White card with shadow
    <div className="bg-white rounded-2xl p-7 shadow-md">

      {/* Section title */}
      <h2 className="font-sora font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100">
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

      {/* Bio — multiline textarea */}
      <Field
        label="Bio"
        name="bio"
        value={formData.bio || ''}
        onChange={onChange}
        placeholder="Tell us about yourself (max 500 chars)"
        multiline
        isCandidate={isCandidate}
      />

      {/* Location */}
      <Field
        label="Location"
        name="location"
        value={formData.location || ''}
        onChange={onChange}
        placeholder="City, State"
        isCandidate={isCandidate}
      />

      {/* Phone */}
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

        {/* Skills — comma separated, stored as array in DB */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Skills
          </label>
          <input
            className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
            value={Array.isArray(formData.skills)
              ? formData.skills.join(', ')
              : ''}
            onChange={onSkillsChange}
            placeholder="React, Node.js, MongoDB (comma separated)"
          />
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
          placeholder="Technologies Pvt Ltd"
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
      <div className="flex gap-3 justify-end mt-6">

        {/* Cancel — goes back to view mode */}
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition">
          Cancel
        </button>

        {/* Save — sends data to backend */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`px-6 py-2.5 text-white rounded-lg text-sm font-semibold border-none cursor-pointer transition ${theme.button}`}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Field — reusable input component inside this file
// label       = text shown above input
// name        = HTML name attribute
// value       = current value (controlled input)
// onChange    = updates formData on every keystroke
// placeholder = gray hint text when field is empty
// multiline   = if true, renders textarea instead of input
// isCandidate = changes focus ring color based on role
// ─────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, multiline, isCandidate }) {

  // Get theme for this field's focus color
  const theme = getTheme(isCandidate);

  // Input classes — base styles + focus ring from theme
  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="mb-4">

      {/* Label — small uppercase gray text above input */}
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>

      {/* Textarea for Bio, regular input for everything else */}
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