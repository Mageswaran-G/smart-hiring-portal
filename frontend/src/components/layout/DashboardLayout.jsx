import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

// Role-based nav config — one place to control all nav colors and links
const NAV_CONFIG = {
  candidate: {
    logo:       'bg-orange-500',
    button:     'bg-orange-500 hover:bg-orange-600',
    outline:    'border border-orange-400 text-orange-500 hover:bg-orange-50',
    showProfile: true,
  },
  company: {
    logo:       'bg-blue-900',
    button:     'bg-blue-900 hover:bg-blue-800',
    outline:    'border border-blue-900 text-blue-900 hover:bg-blue-50',
    showProfile: true,
  },
  admin: {
    logo:       'bg-purple-700',
    button:     'bg-purple-700 hover:bg-purple-800',
    outline:    'border border-purple-700 text-purple-700 hover:bg-purple-50',
    showProfile: false,
  },
};

// DashboardLayout wraps all dashboard pages
// children = the page content below the nav
export default function DashboardLayout({ children }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Get nav colors based on current user role
  const config = NAV_CONFIG[user?.role] || NAV_CONFIG.candidate;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky top navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">

        {/* Left — HP logo and brand name */}
        <div className="flex items-center gap-2">
          <span className={`font-sora w-9 h-9 rounded-lg text-white flex items-center justify-center font-extrabold text-base ${config.logo}`}>
            HP
          </span>
          <span className="font-sora font-bold text-lg text-gray-900">
            HirePortal
          </span>
        </div>

        {/* Right — My Profile + Logout buttons */}
        <div className="flex items-center gap-3">

          {/* My Profile button — hidden for admin */}
          {config.showProfile && (
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className={`px-4 py-2 rounded-lg text-sm bg-white cursor-pointer transition ${config.outline}`}>
              My Profile
            </button>
          )}

          {/* Logout button — always shown */}
          <button
            onClick={logoutUser}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white border-none cursor-pointer transition ${config.button}`}>
            Logout
          </button>
        </div>
      </nav>

      {/* Page content — passed from each dashboard */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {children}
      </div>

    </div>
  );
}