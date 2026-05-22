import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CompanyJobsPage from './pages/company/CompanyJobsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import ProtectedRoute         from './components/layout/ProtectedRoute';
import RoleRoute              from './components/layout/RoleRoute';
import LoginPage              from './pages/LoginPage';
import SignupPage             from './pages/SignupPage';
import ProfilePage            from './pages/ProfilePage';
import CandidateDashboard     from './pages/candidate/CandidateDashboard';
import CandidateApplicationsPage from './pages/candidate/CandidateApplicationsPage'; // ← ADD
import CompanyDashboard       from './pages/company/CompanyDashboard';
import AdminDashboard         from './pages/admin/AdminDashboard';
import ErrorBoundary          from './components/layout/ErrorBoundary';
import PublicProfilePage      from './pages/PublicProfilePage';
import CreateJobPage          from './pages/company/CreateJobPage';
import EditJobPage            from './pages/company/EditJobPage';
import PublicJobsPage         from './pages/jobs/PublicJobsPage';
import JobDetailsPage         from './pages/jobs/JobDetailsPage';
import CompanyApplicationsPage from './pages/company/CompanyApplicationsPage';
import SavedJobsPage from './pages/candidate/SavedJobsPage'; 
import { Toaster } from 'react-hot-toast';
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

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
    <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME}      element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path={ROUTES.LOGIN}     element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP}    element={<SignupPage />} />
          <Route path="/p/:slug"         element={<PublicProfilePage />} />
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

          {/* ← ADD THIS ROUTE */}
          <Route path={ROUTES.CANDIDATE_APPLICATIONS} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['candidate']}>
                <CandidateApplicationsPage />
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
          <Route path={ROUTES.COMPANY_JOBS} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['company']}>
                <CompanyJobsPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.COMPANY_JOB_CREATE} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['company']}>
                <CreateJobPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.COMPANY_JOB_EDIT} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['company']}>
                <EditJobPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.COMPANY_APPLICATIONS} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['company']}>
                <CompanyApplicationsPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.SAVED_JOBS} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['candidate']}>
                <SavedJobsPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path={ROUTES.PUBLIC_JOBS}  element={<PublicJobsPage />} />
          <Route path={ROUTES.JOB_DETAILS}  element={<JobDetailsPage />} />

          <Route path="/admin/companies" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminCompaniesPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin/jobs" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminJobsPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminAnalyticsPage />
              </RoleRoute>
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
               
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
              },
              error: {
                style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
              },
            }}
          />
    </BrowserRouter>
    </ErrorBoundary>
  );
}