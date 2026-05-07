// ─────────────────────────────────────────────────────
// App.jsx
// Purpose: Main router — defines all page routes
// Now very small — all components moved to their own files
// ─────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth provider — shares token and user across all pages
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout components
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute      from './components/layout/RoleRoute';

// Auth pages
import LoginPage  from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Profile page — shared by candidate and company
import ProfilePage from './pages/ProfilePage';

// Dashboard pages — each role has its own file
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CompanyDashboard   from './pages/company/CompanyDashboard';
import AdminDashboard     from './pages/admin/AdminDashboard';

// ── RoleRedirect ──────────────────────────────────────
// After login, sends user to their correct dashboard
// Based on their role stored in JWT token
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" />;
  if (user.role === 'company')   return <Navigate to="/company/dashboard" />;
  if (user.role === 'admin')     return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/login" />;
};

// ── Main App ──────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes — no login needed */}
          <Route path="/"       element={<Navigate to="/login" />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* After login — redirect to correct dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          } />

          {/* Candidate routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* Company routes */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          {/* Profile page — candidate and company */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}