import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>

      {/* Welcome card */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="font-sora w-16 h-16 rounded-full bg-purple-700 text-white text-2xl font-extrabold flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">Admin Panel</h1>
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
          <h3 className="font-sora font-bold text-gray-800 mb-1">Manage Users</h3>
          <p className="text-sm text-gray-400">Coming in Module 5</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <h3 className="font-sora font-bold text-gray-800 mb-1">Analytics</h3>
          <p className="text-sm text-gray-400">Coming in Module 5</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <h3 className="font-sora font-bold text-gray-800 mb-1">Approve Jobs</h3>
          <p className="text-sm text-gray-400">Coming in Module 5</p>
        </div>
      </div>

    </DashboardLayout>
  );
}