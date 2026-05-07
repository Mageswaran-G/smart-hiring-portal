import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import ProtectedRoute     from './components/layout/ProtectedRoute';
import RoleRoute          from './components/layout/RoleRoute';
import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ProfilePage        from './pages/ProfilePage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CompanyDashboard   from './pages/company/CompanyDashboard';
import AdminDashboard     from './pages/admin/AdminDashboard';

// Sends user to correct dashboard after login based on role
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.LOGIN} />;
  if (user.role === 'candidate') return <Navigate to={ROUTES.CANDIDATE_DASHBOARD} />;
  if (user.role === 'company')   return <Navigate to={ROUTES.COMPANY_DASHBOARD} />;
  if (user.role === 'admin')     return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
  return <Navigate to={ROUTES.LOGIN} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME}      element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path={ROUTES.LOGIN}     element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP}    element={<SignupPage />} />

          <Route path={ROUTES.DASHBOARD} element={
            <ProtectedRoute><RoleRedirect /></ProtectedRoute>
          } />

          <Route path={ROUTES.CANDIDATE_DASHBOARD} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.COMPANY_DASHBOARD} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.ADMIN_DASHBOARD} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.PROFILE} element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}