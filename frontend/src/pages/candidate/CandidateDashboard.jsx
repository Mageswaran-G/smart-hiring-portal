import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { getTheme } from '../../utils/theme';
import { User, Briefcase, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import { Bookmark } from 'lucide-react';

export default function CandidateDashboard() {
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
              Candidate Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
              CANDIDATE
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Manage your profile, browse jobs and track applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <DashboardCard
          icon={<User size={24} />}
          title="My Profile"
          description="Update your skills, bio and resume"
          onClick={() => navigate(ROUTES.PROFILE)}
          accentColor={theme.primary}
        />

        <DashboardCard
          icon={<Briefcase size={24} />}
          title="Job Listings"
          description="Browse and apply for open positions"
          onClick={() => navigate(ROUTES.PUBLIC_JOBS)}
          accentColor={theme.primary}
        />

        <DashboardCard
          icon={<Bookmark size={24} />}
          title="Saved Jobs"
          description="Jobs you bookmarked to apply later"
          onClick={() => navigate(ROUTES.SAVED_JOBS)}
          accentColor={theme.primary}
        />

        <DashboardCard
          icon={<FileText size={24} />}
          title="Applications"
          description="Track your submitted applications"
          onClick={() => navigate(ROUTES.CANDIDATE_APPLICATIONS)}
          accentColor={theme.primary}
        />

      </div>

    </DashboardLayout>
  );
}