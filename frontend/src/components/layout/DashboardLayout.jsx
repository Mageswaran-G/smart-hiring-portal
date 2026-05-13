import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import DashboardSkeleton from '../ui/DashboardSkeleton';

// Role-based navbar configuration
const NAV_CONFIG = {
  candidate: {
    logo: 'bg-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
    outline: 'border border-orange-400 text-orange-500 hover:bg-orange-50',
    showProfile: true,
  },

  company: {
    logo: 'bg-blue-900',
    button: 'bg-blue-900 hover:bg-blue-800',
    outline: 'border border-blue-900 text-blue-900 hover:bg-blue-50',
    showProfile: true,
  },

  admin: {
    logo: 'bg-purple-700',
    button: 'bg-purple-700 hover:bg-purple-800',
    outline: 'border border-purple-700 text-purple-700 hover:bg-purple-50',
    showProfile: false,
  },
};

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const {
    user,
    logoutUser,
    isLoading,
  } = useAuth();

  // Show loading skeleton while auth initializes
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Get dashboard route based on role
  const getHomeRoute = () => {
    if (user?.role === 'company') {
      return ROUTES.COMPANY_DASHBOARD;
    }

    if (user?.role === 'candidate') {
      return ROUTES.CANDIDATE_DASHBOARD;
    }

    if (user?.role === 'admin') {
      return ROUTES.ADMIN_DASHBOARD;
    }

    return ROUTES.LOGIN;
  };

  const config = NAV_CONFIG[user?.role] || NAV_CONFIG.candidate;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 shadow-sm">

        {/* Left side */}
        <div
          onClick={() => navigate(getHomeRoute())}
          className="flex cursor-pointer items-center gap-2"
        >
          <span
            className={`
              ${config.logo}
              font-sora
              flex h-9 w-9 items-center justify-center
              rounded-lg text-base font-extrabold text-white
            `}
          >
            HP
          </span>

          <span className="font-sora text-lg font-bold text-gray-900">
            HirePortal
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Profile button */}
          {config.showProfile && (
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className={`
                ${config.outline}
                rounded-lg px-4 py-2 text-sm transition
              `}
            >
              My Profile
            </button>
          )}

          {/* Logout button */}
          <button
            onClick={logoutUser}
            className={`
              ${config.button}
              rounded-lg border-none px-4 py-2
              text-sm font-semibold text-white transition
            `}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Main page content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {children}
      </main>

    </div>
  );
}