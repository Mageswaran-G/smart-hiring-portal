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
  const theme = getTheme(isCandidate);

  return (
    <div className="bg-white rounded-2xl p-7 shadow-md">

      <h2 className="font-sora font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100">
        Edit Profile
      </h2>

      {/* Common fields — all roles */}
      <Field label="Full Name"  name="name"     value={formData.name || ''}     onChange={onChange} placeholder="Enter your full name"              isCandidate={isCandidate} />
      <Field label="Bio"        name="bio"      value={formData.bio || ''}      onChange={onChange} placeholder="Tell us about yourself"            isCandidate={isCandidate} multiline />
      <Field label="Location"   name="location" value={formData.location || ''} onChange={onChange} placeholder="City, State"                       isCandidate={isCandidate} />
      <Field label="Phone"      name="phone"    value={formData.phone || ''}    onChange={onChange} placeholder="+91 9876543210"                    isCandidate={isCandidate} />

      {/* Candidate only fields */}
      {isCandidate && <>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Skills
          </label>
          <input
            className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`}
            value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
            onChange={onSkillsChange}
            placeholder="React, Node.js, MongoDB (comma separated)"
          />
          <p className="text-xs text-gray-300 mt-1">Separate each skill with a comma</p>
        </div>
        <Field label="Education"  name="education"  value={formData.education || ''}  onChange={onChange} placeholder="B.E Computer Science, Anna University 2026" isCandidate={isCandidate} />
        <Field label="Experience" name="experience" value={formData.experience || ''} onChange={onChange} placeholder="6 months intern at XYZ Company"            isCandidate={isCandidate} />
      </>}

      {/* Company only fields */}
      {isCompany && <>
        <Field label="Company Name"    name="companyName"    value={formData.companyName || ''}    onChange={onChange} placeholder="Acme Technologies Pvt Ltd" isCandidate={false} />
        <Field label="Company Website" name="companyWebsite" value={formData.companyWebsite || ''} onChange={onChange} placeholder="https://yourcompany.com"    isCandidate={false} />
        <Field label="Industry"        name="industry"       value={formData.industry || ''}       onChange={onChange} placeholder="Software, Finance, Healthcare" isCandidate={false} />
      </>}

      {/* Action buttons */}
      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition">
          Cancel
        </button>
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

// Reusable field — handles both input and textarea
function Field({ label, name, value, onChange, placeholder, multiline, isCandidate }) {
  const theme = getTheme(isCandidate);
  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {multiline
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className={`${inputClass} resize-y`} />
        : <input    name={name} value={value} onChange={onChange} placeholder={placeholder}           className={inputClass} />
      }
    </div>
  );
}