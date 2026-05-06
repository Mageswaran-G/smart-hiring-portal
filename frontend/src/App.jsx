// App.jsx
// Role-based routing — Candidate, Company, Admin
// each role sees their own dashboard

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

// ── Protected Route — waits for refresh before deciding ──
const ProtectedRoute = ({ children }) => {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#888' }}>
        Loading...
      </div>
    );
  }

  return accessToken ? children : <Navigate to="/login" />;
};

// ── Role Guard — blocks wrong role from accessing page ──
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

// ── Candidate Dashboard ──
const CandidateDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1 className="font-sora" style={{ color: '#E65C00' }}>
        Welcome, {user?.name}! 
      </h1>
      <p style={{ color: '#666', marginTop: 8 }}>Email: {user?.email}</p>
      <p style={{ color: '#E65C00', fontWeight: 600, marginTop: 4 }}>Role: Candidate</p>
      <p style={{ color: '#888', marginTop: 16, fontSize: 14 }}>
        Browse jobs and manage your applications from here.
      </p>
      
      <button
        onClick={() => navigate('/profile')}
        style={{ marginRight: 12, padding: '8px 18px', borderRadius: 8, border: '1px solid #E65C00', background: '#fff', color: '#E65C00', cursor: 'pointer', fontWeight: 600 }}>
        My Profile
      </button>
      <button onClick={logoutUser} style={logoutStyle}>
        Logout
      </button>
      
    </div>
  );
};

// ── Company Dashboard ──
const CompanyDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1 className="font-sora" style={{ color: '#1D3557' }}>
        Welcome, {user?.name}! 
      </h1>
      <p style={{ color: '#666', marginTop: 8 }}>Email: {user?.email}</p>
      <p style={{ color: '#1D3557', fontWeight: 600, marginTop: 4 }}>Role: Company</p>
      <p style={{ color: '#888', marginTop: 16, fontSize: 14 }}>
        Manage your company profile and job postings from here.
      </p>
      <button
        onClick={() => navigate('/profile')}
        style={{ marginRight: 12, padding: '8px 18px', borderRadius: 8, border: '1px solid #1D3557', background: '#fff', color: '#1D3557', cursor: 'pointer', fontWeight: 600, marginTop: 24 }}>
        My Profile
      </button>
      <button onClick={logoutUser} style={{ ...logoutStyle, background: '#1D3557' }}>
        Logout
      </button>
    </div>
  );
};

// ── Admin Dashboard ──
const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1 className="font-sora" style={{ color: '#6d28d9' }}>
        Admin Panel ⚙️
      </h1>
      <p style={{ color: '#666', marginTop: 8 }}>Email: {user?.email}</p>
      <p style={{ color: '#6d28d9', fontWeight: 600, marginTop: 4 }}>Role: Admin</p>
      <p style={{ color: '#888', marginTop: 16, fontSize: 14 }}>
        Admin dashboard coming Week 5!
      </p>
      <button onClick={logoutUser} style={{ ...logoutStyle, background: '#6d28d9' }}>
        Logout
      </button>
    </div>
  );
};

// ── Shared logout button style ──
const logoutStyle = {
  backgroundColor: '#E65C00',
  color: 'white',
  padding: '10px 28px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '15px',
  marginTop: '24px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
};



// ── Smart redirect — sends user to their dashboard ──
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" />;
  if (user.role === 'company')   return <Navigate to="/company/dashboard" />;
  if (user.role === 'admin')     return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/login" />;
};

// ── Main App ──
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/"       element={<Navigate to="/login" />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* After login — redirect to correct dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />

          {/* Candidate routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Company routes */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

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

export default App;