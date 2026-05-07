// ─────────────────────────────────────────────────────
// AdminDashboard.jsx
// Purpose: Dashboard page for admin role users
// ─────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-sora w-9 h-9 rounded-lg bg-purple-700 text-white flex items-center justify-center font-extrabold text-base">
            HP
          </span>
          <span className="font-sora font-bold text-lg text-gray-900">
            HirePortal
          </span>
        </div>
        <button
          onClick={logoutUser}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 border-none cursor-pointer transition">
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Welcome card */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="font-sora w-16 h-16 rounded-full bg-purple-700 text-white text-2xl font-extrabold flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-sora text-2xl font-bold text-gray-900">
                Admin Panel ⚙️
              </h1>
              <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                ADMIN
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Manage users, job posts and analytics from here.
          </p>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-sora font-bold text-gray-800 mb-1">Manage Users</h3>
            <p className="text-sm text-gray-400">Coming in Module 5</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-sora font-bold text-gray-800 mb-1">Analytics</h3>
            <p className="text-sm text-gray-400">Coming in Module 5</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-sora font-bold text-gray-800 mb-1">Approve Jobs</h3>
            <p className="text-sm text-gray-400">Coming in Module 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}