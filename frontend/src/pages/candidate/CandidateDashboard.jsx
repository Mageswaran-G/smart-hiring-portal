// ─────────────────────────────────────────────────────
// CandidateDashboard.jsx
// Purpose: Dashboard for candidate users
// Now fetches profile photo from backend
// ─────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/authService';

export default function CandidateDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // profilePhoto — fetched from MongoDB
  // null = no photo uploaded yet
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Fetch profile photo when dashboard loads
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await API.get('/users/profile');
        // Save photo URL if exists
        setProfilePhoto(res.data.data?.profilePhoto || null);
      } catch (err) {
        // If fetch fails, just show letter avatar — no crash
        console.error('Could not fetch photo:', err.message);
      }
    };
    fetchPhoto();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── TOP NAV ── */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-sora w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-extrabold text-base">
            HP
          </span>
          <span className="font-sora font-bold text-lg text-gray-900">
            HirePortal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-lg text-sm border border-orange-400 text-orange-500 bg-white hover:bg-orange-50 cursor-pointer transition">
            My Profile
          </button>
          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 border-none cursor-pointer transition">
            Logout
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Welcome card */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">

            {/* Avatar — shows photo if uploaded, else shows letter */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 shrink-0">
              {profilePhoto ? (
                // Show real photo from MongoDB
                <img
                  src={`${import.meta.env.VITE_API_URL}${profilePhoto}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                // No photo — show first letter of name
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

        {/* Quick action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/profile')}
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
      </div>
    </div>
  );
}