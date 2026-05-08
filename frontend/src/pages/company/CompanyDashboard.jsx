import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Building2, Users, FileSearch } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function CompanyDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>

      {/* Welcome card */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-900 shrink-0">
            {profile?.profilePhoto ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${profile.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="font-sora w-full h-full bg-blue-900 text-white text-2xl font-extrabold flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">
              Company Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900">
              COMPANY
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Manage your company profile, job postings and applicants.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate(ROUTES.PROFILE)}
          className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition border-l-4 border-blue-900">
          <Building2 size={24} className="text-blue-900 mb-3" />
          <h3 className="font-sora font-bold text-gray-800 mb-1">Company Profile</h3>
          <p className="text-sm text-gray-400">Update company info and details</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <FileSearch size={24} className="text-gray-400 mb-3" />
          <h3 className="font-sora font-bold text-gray-800 mb-1">Job Postings</h3>
          <p className="text-sm text-gray-400">Feature under development</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <Users size={24} className="text-gray-400 mb-3" />
          <h3 className="font-sora font-bold text-gray-800 mb-1">Applicants</h3>
          <p className="text-sm text-gray-400">Feature under development</p>
        </div>
      </div>

    </DashboardLayout>
  );
}