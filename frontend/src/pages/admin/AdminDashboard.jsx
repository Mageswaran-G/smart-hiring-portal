import { useAuth } from '../../context/AuthContext';
import { getTheme } from '../../utils/theme';
import { Users, BarChart3, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';

export default function AdminDashboard() {
  const { user } = useAuth();
  const theme = getTheme(user?.role);

  return (
    <DashboardLayout>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-16 h-16 rounded-full text-white text-2xl font-extrabold font-sora flex items-center justify-center shrink-0 ${theme.avatar}`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
              ADMIN
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Manage users, review job postings and monitor platform analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          icon={<Users size={24} />}
          title="User Management"
          description="Feature under development"
          accentColor={theme.primary}
          disabled
        />
        <DashboardCard
          icon={<BarChart3 size={24} />}
          title="Analytics"
          description="Feature under development"
          accentColor={theme.primary}
          disabled
        />
        <DashboardCard
          icon={<CheckCircle size={24} />}
          title="Job Approvals"
          description="Feature under development"
          accentColor={theme.primary}
          disabled
        />
      </div>

    </DashboardLayout>
  );
}