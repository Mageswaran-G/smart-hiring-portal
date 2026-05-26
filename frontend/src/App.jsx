import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/layout/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';
import { Toaster } from 'react-hot-toast';

// Lazy loaded pages — load only when user navigates to that page
const LoginPage                = lazy(() => import('./pages/LoginPage'));
const SignupPage               = lazy(() => import('./pages/SignupPage'));
const ProfilePage              = lazy(() => import('./pages/ProfilePage'));
const PublicProfilePage        = lazy(() => import('./pages/PublicProfilePage'));
const CandidateDashboard       = lazy(() => import('./pages/candidate/CandidateDashboard'));
const CandidateApplicationsPage= lazy(() => import('./pages/candidate/CandidateApplicationsPage'));
const SavedJobsPage            = lazy(() => import('./pages/candidate/SavedJobsPage'));
const RecommendationsPage      = lazy(() => import('./pages/candidate/RecommendationsPage'));
const CompanyDashboard         = lazy(() => import('./pages/company/CompanyDashboard'));
const CompanyJobsPage          = lazy(() => import('./pages/company/CompanyJobsPage'));
const CompanyApplicationsPage  = lazy(() => import('./pages/company/CompanyApplicationsPage'));
const CreateJobPage            = lazy(() => import('./pages/company/CreateJobPage'));
const EditJobPage              = lazy(() => import('./pages/company/EditJobPage'));
const AdminDashboard           = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCompaniesPage       = lazy(() => import('./pages/admin/AdminCompaniesPage'));
const AdminUsersPage           = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminJobsPage            = lazy(() => import('./pages/admin/AdminJobsPage'));
const AdminAnalyticsPage       = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const PublicJobsPage           = lazy(() => import('./pages/jobs/PublicJobsPage'));
const JobDetailsPage           = lazy(() => import('./pages/jobs/JobDetailsPage'));

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.LOGIN} />;
  if (user.role === 'candidate') return <Navigate to={ROUTES.CANDIDATE_DASHBOARD} />;
  if (user.role === 'company')   return <Navigate to={ROUTES.COMPANY_DASHBOARD} />;
  if (user.role === 'admin')     return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
  return <Navigate to={ROUTES.LOGIN} />;
};

// Loading spinner shown while lazy page is loading
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
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
          <Route path={ROUTES.RECOMMENDATIONS} element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["candidate"]}>
                <RecommendationsPage />
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
        </Suspense>
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