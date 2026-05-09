export default function ProfileDetails({ profile, isCandidate, isCompany }) {

  const skillNames = Array.isArray(profile?.skills) && profile.skills.length > 0
    ? profile.skills.map(s => typeof s === 'string' ? s : s?.name).filter(Boolean).join(', ')
    : null;

  const location = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ');

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">

      <h2 className="font-sora font-bold text-gray-900 text-base mb-4 pb-3 border-b border-gray-100">
        Profile Details
      </h2>

      {/* Common fields */}
      <Field label="Bio"      value={profile?.bio} />
      <Field label="Location" value={location || null} />
      <Field label="Phone"    value={profile?.phone} />

      {/* Candidate only */}
      {isCandidate && (
        <>
          <Field label="Date of Birth" value={profile?.dateOfBirth} />
          <Field label="Gender"        value={profile?.gender?.replace('_', ' ')} />
          <Field label="Skills"        value={skillNames} />
          <Field label="Job Type"      value={profile?.jobType} />
          <Field label="Work Location" value={profile?.locationType} />
          <Field label="Expected Salary" value={profile?.expectedSalary} />
          <Field label="Notice Period"   value={profile?.noticePeriod} />
          <Field label="LinkedIn"  value={profile?.linkedIn} link />
          <Field label="GitHub"    value={profile?.github}   link />
          <Field label="Portfolio" value={profile?.portfolio} link />
        </>
      )}

      {/* Company only */}
      {isCompany && (
        <>
          <Field label="Company Name"    value={profile?.companyName} />
          <Field label="Company Website" value={profile?.companyWebsite} link />
          <Field label="Industry"        value={profile?.industry} />
          <Field label="Company Size"    value={profile?.companySize} />
        </>
      )}

    </div>
  );
}

function Field({ label, value, link }) {
  if (!value) return null;

  return (
    <div className="flex py-3 border-b border-gray-50 last:border-0">
      <span className="w-36 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wide pt-0.5">
        {label}
      </span>
      <span className="flex-1 text-sm text-gray-800 leading-relaxed capitalize-first break-all">
        {link
          ? <a href={value} target="_blank" rel="noreferrer"
              className="text-orange-500 hover:underline">{value}</a>
          : value
        }
      </span>
    </div>
  );
}