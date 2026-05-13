import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { getTheme } from '../../utils/theme';
import { Building2, Users, FileSearch } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';

export default function CompanyDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const theme = getTheme(user?.role);

  return (
    <DashboardLayout>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shrink-0 ${theme.border}`}>
            {profile?.profilePhoto ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${profile.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`font-sora w-full h-full text-white text-2xl font-extrabold flex items-center justify-center ${theme.avatar}`}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">
              Company Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
              COMPANY
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Manage your company profile, job postings and applicants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          icon={<Building2 size={24} />}
          title="Company Profile"
          description="Update company info and details"
          onClick={() => navigate(ROUTES.PROFILE)}
          accentColor={theme.primary}
        />
        <DashboardCard
          icon={<FileSearch size={24} />}
          title="Job Postings"
          description="Create and manage your job listings"
          onClick={() => navigate(ROUTES.COMPANY_JOBS)}
          accentColor={theme.primary}
        />
        <DashboardCard
          icon={<Users size={24} />}
          title="Applicants"
          description="Review and manage candidates"
          onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)}
          accentColor={theme.primary}
        />
      </div>

    </DashboardLayout>
  );
}