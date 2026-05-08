import { useAuth } from '../../context/AuthContext';
import { Users, BarChart3, CheckCircle, Shield } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>

      {/* Header card */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-full bg-purple-700 text-white text-2xl font-extrabold font-sora flex items-center justify-center shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
              ADMIN
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Manage users, review job postings and monitor platform analytics.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <Users size={24} className="text-gray-400 mb-3" />
          <h3 className="font-sora font-bold text-gray-800 mb-1">User Management</h3>
          <p className="text-sm text-gray-400">Feature under development</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <BarChart3 size={24} className="text-gray-400 mb-3" />
          <h3 className="font-sora font-bold text-gray-800 mb-1">Analytics</h3>
          <p className="text-sm text-gray-400">Feature under development</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <CheckCircle size={24} className="text-gray-400 mb-3" />
          <h3 className="font-sora font-bold text-gray-800 mb-1">Job Approvals</h3>
          <p className="text-sm text-gray-400">Feature under development</p>
        </div>
      </div>

    </DashboardLayout>
  );
}