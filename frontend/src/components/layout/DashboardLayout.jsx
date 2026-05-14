// DashboardLayout.jsx 

import { useNavigate }  from 'react-router-dom';
import { useAuth }      from '../../context/AuthContext';
import { ROUTES }       from '../../constants/routes';
import { LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }) {

  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Avatar — show photo if exists, else show initial
  const initial      = user?.name?.charAt(0)?.toUpperCase() || '?';
  const profilePhoto = user?.profilePhoto;

  // Role colors
  const roleConfig = {
    candidate: { label: 'Candidate', dot: 'bg-orange-400', badge: 'text-orange-600 bg-orange-50 border-orange-100' },
    company:   { label: 'Company',   dot: 'bg-blue-400',   badge: 'text-blue-600   bg-blue-50   border-blue-100'   },
    admin:     { label: 'Admin',     dot: 'bg-red-400',    badge: 'text-red-600    bg-red-50     border-red-100'    },
  };
  const role = roleConfig[user?.role] || roleConfig.candidate;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Nav Bar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Left — Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-sora">HP</span>
            </div>
            <span className="font-sora font-bold text-gray-900 text-lg">
              HirePortal
            </span>
          </div>

          {/* Right — User Info + Actions */}
          <div className="flex items-center gap-3">

            {/* User name + role — hidden on small screens */}
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name || 'User'}
              </p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${role.badge}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${role.dot}`} />
                {role.label}
              </span>
            </div>

            {/* Avatar */}
            <div
              onClick={() => navigate(ROUTES.PROFILE)}
              className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-blue-300 transition shrink-0"
              title="My Profile"
            >
              {profilePhoto ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${profilePhoto}`}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white font-bold text-sm
                  ${user?.role === 'company' ? 'bg-blue-600' : user?.role === 'admin' ? 'bg-red-600' : 'bg-orange-500'}`}
                >
                  {initial}
                </div>
              )}
            </div>

            {/* My Profile button */}
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-xl transition"
            >
              <User size={14} />
              My Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-xl transition
                ${user?.role === 'company' ? 'bg-blue-600 hover:bg-blue-700' : user?.role === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Logout</span>
            </button>

          </div>

        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

    </div>
  );
}