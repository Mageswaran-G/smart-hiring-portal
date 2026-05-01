import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// ProtectedRoute — waits for refresh check before deciding
const ProtectedRoute = ({ children }) => {
  const { accessToken, isLoading } = useAuth();

  // Still checking refresh token — show loading
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>
        Loading...
      </div>
    );
  }

  // Check done — no token → go to login
  return accessToken ? children : <Navigate to="/login" />;
};

// Dashboard — shown after login
const Dashboard = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome, {user?.name || 'User'}! 🎉</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button
        onClick={logoutUser}
        style={{
          backgroundColor: '#E65C00',
          color: 'white',
          padding: '10px 24px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

// Main App
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;