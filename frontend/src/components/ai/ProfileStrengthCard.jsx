// ProfileStrengthCard.jsx
// Shows candidate profile strength with missing items

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { PROFILE_CHECKS, calcProfileStrength } from '../../utils/profileStrength';

const PROFILE_CHECKS = [
  { key: 'photo',       label: 'Profile photo',      points: 10, check: p => !!p?.photo },
  { key: 'headline',    label: 'Headline',            points: 10, check: p => !!p?.headline },
  { key: 'bio',         label: 'Bio / About',         points: 10, check: p => !!p?.bio },
  { key: 'skills',      label: 'At least 3 skills',   points: 15, check: p => (p?.skills?.length || 0) >= 3 },
  { key: 'resume',      label: 'Resume uploaded',     points: 20, check: p => !!p?.resumeUrl },
  { key: 'education',   label: 'Education added',     points: 10, check: p => (p?.education?.length || 0) > 0 },
  { key: 'workHistory', label: 'Work history added',  points: 10, check: p => (p?.workHistory?.length || 0) > 0 },
  { key: 'linkedin',    label: 'LinkedIn linked',     points: 10, check: p => !!p?.linkedin },
  { key: 'phone',       label: 'Phone number',        points: 5,  check: p => !!p?.phone },
  { key: 'github', label: 'GitHub profile', points: 10, check: p => !!p?.github },
];

export function calcProfileStrength(profile) {
  if (!profile) return 0;
  return PROFILE_CHECKS.reduce((sum, c) => sum + (c.check(profile) ? c.points : 0), 0);
}

export default function ProfileStrengthCard({ profile }) {
  const navigate = useNavigate();
  const score = Math.min(calcProfileStrength(profile), 100);
  const missing = PROFILE_CHECKS.filter(c => !c.check(profile));

  const color = score >= 80 ? 'bg-green-500' :
                score >= 50 ? 'bg-amber-500' : 'bg-red-400';

  const label = score >= 80 ? 'Strong Profile' :
                score >= 50 ? 'Good Progress' : 'Needs Improvement';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-gray-900">Profile Strength</h3>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
        <div className="text-2xl font-black text-gray-900">{score}%</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Missing items */}
      {missing.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Complete to improve
          </p>
          <div className="flex flex-col gap-1.5">
            {missing.slice(0, 4).map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
                <span className="text-xs font-bold text-green-600">+{item.points}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete profile button */}
      {score < 100 && (
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROFILE)}
          className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-xl text-sm transition"
        >
          Complete Profile
        </button>
      )}

      {/* Complete state */}
      {score === 100 && (
        <div className="mt-3 text-center text-sm font-bold text-green-600">
          Profile is complete!
        </div>
      )}

    </div>
  );
}