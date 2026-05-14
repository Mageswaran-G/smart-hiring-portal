// CandidateDashboard

import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../../context/AuthContext';
import DashboardLayout      from '../../components/layout/DashboardLayout';
import { ROUTES }           from '../../constants/routes';
import {
  User, Briefcase, Bookmark,
  FileText, Search, ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function CandidateDashboard() {

  const { user, profile } = useAuth();
  const navigate          = useNavigate();

  const photoUrl = profile?.profilePhoto
    ? `${import.meta.env.VITE_API_URL}${profile.profilePhoto}`
    : null;

  const name     = profile?.name || user?.name || 'Candidate';
  const initial  = name.charAt(0).toUpperCase();
  const headline = profile?.headline || 'Add a headline to your profile';

  // Simple profile completion score
  const completion = calcCompletion(profile);

  return (
    <DashboardLayout>

      {/* ── Hero Welcome Card ── */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 rounded-2xl p-8 mb-6 overflow-hidden shadow-lg">

        {/* Background decoration circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Left — User info */}
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 shadow-md shrink-0">
              {photoUrl ? (
                <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl font-sora">{initial}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-white/70 text-sm font-medium">Welcome back,</p>
              <h1 className="font-sora text-2xl font-bold text-white leading-tight">
                {name}
              </h1>
              <p className="text-white/80 text-sm mt-0.5">{headline}</p>

              {/* Open to work badge */}
              {profile?.openToWork && (
                <span className="inline-flex items-center gap-1 mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <CheckCircle2 size={11} />
                  Open to Work
                </span>
              )}
            </div>

          </div>

          {/* Right — Profile completion + action */}
          <div className="flex items-center gap-6">

            {/* Profile completion ring */}
            <div className="flex flex-col items-center">
              <CompletionRing percent={completion} />
              <p className="text-white/80 text-xs mt-1.5 font-medium">
                Profile Complete
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(ROUTES.PUBLIC_JOBS)}
              className="flex items-center gap-2 bg-white text-orange-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-orange-50 transition shadow-sm"
            >
              <Search size={15} />
              Browse Jobs
              <ArrowRight size={14} />
            </button>

          </div>

        </div>
      </div>

      {/* ── Quick Nav Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <NavCard
          icon={<User size={22} />}
          title="My Profile"
          desc="Update skills and resume"
          onClick={() => navigate(ROUTES.PROFILE)}
          color="orange"
        />
        <NavCard
          icon={<Briefcase size={22} />}
          title="Job Listings"
          desc="Browse open positions"
          onClick={() => navigate(ROUTES.PUBLIC_JOBS)}
          color="orange"
        />
        <NavCard
          icon={<Bookmark size={22} />}
          title="Saved Jobs"
          desc="Bookmarked to apply later"
          onClick={() => navigate(ROUTES.SAVED_JOBS)}
          color="orange"
        />
        <NavCard
          icon={<FileText size={22} />}
          title="Applications"
          desc="Track submitted apps"
          onClick={() => navigate(ROUTES.CANDIDATE_APPLICATIONS)}
          color="orange"
        />

      </div>

    </DashboardLayout>
  );
}

// ── Profile completion ring ───────────────────────────────
function CompletionRing({ percent }) {
  const r           = 24;
  const circ        = 2 * Math.PI * r;
  const filled      = (percent / 100) * circ;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        {/* Track */}
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
        {/* Progress */}
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-white font-bold text-sm">{percent}%</span>
    </div>
  );
}

// ── Nav card ─────────────────────────────────────────────
function NavCard({ icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border-l-4 border-orange-400 shadow-sm hover:shadow-md transition text-left w-full"
    >
      <span className="text-orange-500 mb-3 block">{icon}</span>
      <p className="font-sora font-bold text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </button>
  );
}

// ── Profile completion calculator ────────────────────────
function calcCompletion(profile) {
  if (!profile) return 0;
  const checks = [
    !!profile.name,
    !!profile.headline,
    !!profile.bio,
    !!profile.profilePhoto,
    !!profile.phone,
    !!(profile.skills?.length > 0),
    !!(profile.resume?.url),
    !!profile.linkedin,
    !!(profile.educationList?.length > 0),
    !!(profile.workHistory?.length > 0),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}