import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function CandidateDashboard() {
  const { user, profile } = useAuth(); // profile comes from global context now
  const navigate = useNavigate();

  return (
    <DashboardLayout>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-4">

          {/* Avatar — uses global profile photo */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 shrink-0">
            {profile?.profilePhoto ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${profile.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="font-sora w-full h-full bg-orange-500 text-white text-2xl font-extrabold flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-500">
              CANDIDATE
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Browse jobs and manage your applications from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate(ROUTES.PROFILE)}
          className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition border-l-4 border-orange-500">
          <h3 className="font-sora font-bold text-gray-800 mb-1">My Profile</h3>
          <p className="text-sm text-gray-400">Update your skills, bio and resume</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <h3 className="font-sora font-bold text-gray-800 mb-1">Browse Jobs</h3>
          <p className="text-sm text-gray-400">Coming in Module 3</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <h3 className="font-sora font-bold text-gray-800 mb-1">My Applications</h3>
          <p className="text-sm text-gray-400">Coming in Module 4</p>
        </div>
      </div>

    </DashboardLayout>
  );
}