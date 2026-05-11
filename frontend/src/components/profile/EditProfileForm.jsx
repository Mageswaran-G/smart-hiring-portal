import { getTheme } from '../../utils/theme';

export default function EditProfileForm({
  formData, isCandidate, isCompany,
  isSaving, onChange, onSave, onCancel,
}) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');
  const input = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-current transition`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-sora font-bold text-gray-900 text-base mb-5">Edit Profile</h2>

      <div className="flex flex-col gap-4">

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
          <input name="name" value={formData.name || ''} onChange={onChange}
            placeholder="Enter your full name" className={input} />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bio</label>
          <textarea name="bio" value={formData.bio || ''} onChange={onChange}
            placeholder="Write a short summary about yourself"
            rows={3} className={`${input} resize-y`} />
        </div>

        {/* Company-only fields */}
        {isCompany && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Company Name</label>
              <input name="companyName" value={formData.companyName || ''} onChange={onChange}
                placeholder="Your company name" className={input} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Company Website</label>
              <input name="companyWebsite" value={formData.companyWebsite || ''} onChange={onChange}
                placeholder="https://yourcompany.com" className={input} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Industry</label>
              <input name="industry" value={formData.industry || ''} onChange={onChange}
                placeholder="e.g. Software, Finance, Healthcare" className={input} />
            </div>
          </>
        )}

        <p className="text-xs text-gray-300 italic">
          Edit contact info, skills, education and other details in the sections below.
        </p>

        <div className="flex gap-3 justify-end pt-2 border-t border-gray-50">
          <button onClick={onCancel}
            className="px-5 py-2 text-sm border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition text-gray-600">
            Cancel
          </button>
          <button onClick={onSave} disabled={isSaving}
            className={`px-5 py-2 text-sm text-white font-semibold rounded-xl border-none cursor-pointer transition ${theme.button}`}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}