export default function ProfileDetails({ profile, isCandidate, isCompany }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-md">

      <h2 className="font-sora font-bold text-gray-900 text-lg mb-5 pb-3 border-b border-gray-100">
        Profile Details
      </h2>

      {/* Common fields — shown to all roles */}
      <Field label="Bio"      value={profile?.bio} />
      <Field label="Location" value={profile?.location} />
      <Field label="Phone"    value={profile?.phone} />

      {/* Candidate only — skills, education, experience */}
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

      {/* Company only — company details */}
      {isCompany && <>
        <Field label="Company Name"    value={profile?.companyName} />
        <Field label="Company Website" value={profile?.companyWebsite} />
        <Field label="Industry"        value={profile?.industry} />
      </>}

    </div>
  );
}

// Single row — label on left, value on right
function Field({ label, value }) {
  return (
    <div className="flex py-3 border-b border-gray-50">
      <span className="w-32 shrink-0 text-sm font-semibold text-gray-400">
        {label}
      </span>
      <span className="flex-1 text-sm text-gray-800 leading-relaxed">
        {value && value.length > 0
          ? value
          : <em className="text-gray-300">Not set</em>}
      </span>
    </div>
  );
}