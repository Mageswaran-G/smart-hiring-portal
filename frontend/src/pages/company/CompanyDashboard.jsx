import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { API_ENDPOINTS } from '../../constants/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.PROFILE);
        setProfilePhoto(res.data.data?.profilePhoto || null);
      } catch (err) {
        console.error('Could not fetch photo:', err.message);
      }
    };
    fetchPhoto();
  }, []);

  return (
    <DashboardLayout>

      {/* Welcome card */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-4">

          {/* Avatar — photo or first letter */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-900 shrink-0">
            {profilePhoto ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${profilePhoto}`}
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
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900">
              COMPANY
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Manage your company profile and job postings from here.
        </p>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate(ROUTES.PROFILE)}
          className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition border-l-4 border-blue-900">
          <h3 className="font-sora font-bold text-gray-800 mb-1">Company Profile</h3>
          <p className="text-sm text-gray-400">Update company info and details</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <h3 className="font-sora font-bold text-gray-800 mb-1">Post a Job</h3>
          <p className="text-sm text-gray-400">Coming in Module 3</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-200 opacity-60">
          <h3 className="font-sora font-bold text-gray-800 mb-1">View Applicants</h3>
          <p className="text-sm text-gray-400">Coming in Module 4</p>
        </div>
      </div>

    </DashboardLayout>
  );
}