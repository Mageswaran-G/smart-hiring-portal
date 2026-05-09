export default function ProfileDetails({ profile, isCandidate, isCompany }) {

  // Extract skill names safely — handles both strings and objects
  const skillNames = Array.isArray(profile?.skills) && profile.skills.length > 0
    ? profile.skills.map(s => typeof s === 'string' ? s : s?.name).filter(Boolean).join(', ')
    : null;

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">

      <h2 className="font-sora font-bold text-gray-900 text-base mb-4 pb-3 border-b border-gray-100">
        Profile Details
      </h2>

      {/* Candidate fields */}
      {isCandidate && (
        <>
          <Field label="Skills" value={skillNames} />
        </>
      )}

      {/* Company fields */}
      {isCompany && (
        <>
          <Field label="Company Name"    value={profile?.companyName} />
          <Field label="Company Website" value={profile?.companyWebsite} />
          <Field label="Industry"        value={profile?.industry} />
        </>
      )}

    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex py-3 border-b border-gray-50 last:border-0">
      <span className="w-36 shrink-0 text-sm font-semibold text-gray-400">{label}</span>
      <span className="flex-1 text-sm text-gray-800 leading-relaxed">
        {value ? value : <em className="text-gray-300">Not set</em>}
      </span>
    </div>
  );
}