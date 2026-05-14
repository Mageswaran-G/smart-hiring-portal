// DashboardLayout

import { useNavigate }  from 'react-router-dom';
import { useAuth }      from '../../context/AuthContext';
import { ROUTES }       from '../../constants/routes';
import DashboardSkeleton from '../ui/DashboardSkeleton';
import { LogOut, User } from 'lucide-react';

// Role-based color config
const NAV_CONFIG = {
  candidate: {
    logo:    'bg-orange-500',
    button:  'bg-orange-500 hover:bg-orange-600',
    outline: 'border border-orange-400 text-orange-500 hover:bg-orange-50',
    dot:     'bg-orange-400',
    badge:   'text-orange-600 bg-orange-50 border-orange-100',
    label:   'Candidate',
  },
  company: {
    logo:    'bg-blue-900',
    button:  'bg-blue-900 hover:bg-blue-800',
    outline: 'border border-blue-900 text-blue-900 hover:bg-blue-50',
    dot:     'bg-blue-400',
    badge:   'text-blue-600 bg-blue-50 border-blue-100',
    label:   'Company',
  },
  admin: {
    logo:    'bg-purple-700',
    button:  'bg-purple-700 hover:bg-purple-800',
    outline: 'border border-purple-700 text-purple-700 hover:bg-purple-50',
    dot:     'bg-purple-400',
    badge:   'text-purple-600 bg-purple-50 border-purple-100',
    label:   'Admin',
  },
};

export default function DashboardLayout({ children }) {

  const navigate = useNavigate();

  // FIX: use logoutUser — NOT logout (AuthContext exports logoutUser)
  const { user, logoutUser, profile, isLoading } = useAuth();

  if (isLoading) return <DashboardSkeleton />;

  // FIX: role-based home route — same as original smart logic
  const getHomeRoute = () => {
    if (user?.role === 'candidate') return ROUTES.CANDIDATE_DASHBOARD;
    if (user?.role === 'company')   return ROUTES.COMPANY_DASHBOARD;
    if (user?.role === 'admin')     return ROUTES.ADMIN_DASHBOARD;
    return ROUTES.LOGIN;
  };

  // FIX: await logout then navigate to login
  const handleLogout = async () => {
    await logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const config  = NAV_CONFIG[user?.role] || NAV_CONFIG.candidate;
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  // Profile photo — use global profile if available
  const photoUrl = profile?.profilePhoto
    ? `${import.meta.env.VITE_API_URL}${profile.profilePhoto}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Nav Bar ── */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 shadow-sm">

        {/* Left — Logo (goes to correct dashboard per role) */}
        <div
          onClick={() => navigate(getHomeRoute())}
          className="flex cursor-pointer items-center gap-2"
        >
          <span className={`${config.logo} font-sora flex h-9 w-9 items-center justify-center rounded-lg text-base font-extrabold text-white`}>
            HP
          </span>
          <span className="font-sora text-lg font-bold text-gray-900">
            HirePortal
          </span>
        </div>

        {/* Right — User info + buttons */}
        <div className="flex items-center gap-3">

          {/* Name + role badge — desktop only */}
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name || 'User'}
            </p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.badge}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${config.dot}`} />
              {config.label}
            </span>
          </div>

          {/* Avatar — click to profile (admin skips profile) */}
          {user?.role !== 'admin' && (
            <div
              onClick={() => navigate(ROUTES.PROFILE)}
              className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-blue-300 transition shrink-0"
              title="My Profile"
            >
              {photoUrl ? (
                <img src={photoUrl} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white font-bold text-sm ${config.logo}`}>
                  {initial}
                </div>
              )}
            </div>
          )}

          {/* Admin avatar — not clickable, no profile page */}
          {user?.role === 'admin' && (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${config.logo}`}>
              {initial}
            </div>
          )}

          {/* My Profile button — not for admin */}
          {user?.role !== 'admin' && (
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className={`hidden md:flex items-center gap-1.5 text-sm rounded-lg px-4 py-2 transition ${config.outline}`}
            >
              <User size={14} />
              My Profile
            </button>
          )}

          {/* Logout button — FIX: calls handleLogout which awaits + navigates */}
          <button
            onClick={handleLogout}
            className={`${config.button} flex items-center gap-1.5 rounded-lg border-none px-4 py-2 text-sm font-semibold text-white transition`}
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Logout</span>
          </button>

        </div>
      </nav>

      {/* ── Page Content ── */}
      <main className="mx-auto max-w-5xl px-4 md:px-6 py-6 md:py-10">
        {children}
      </main>

    </div>
  );
}