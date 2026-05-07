// ─────────────────────────────────────────────────────
// ProtectedRoute.jsx
// Purpose: Blocks access to pages if user is not logged in
// If loading → shows Loading screen
// If no token → redirects to /login
// If token exists → shows the page
// ─────────────────────────────────────────────────────

// Navigate — redirects to another page
import { Navigate } from 'react-router-dom';

// useAuth — gets token and loading state from context
import { useAuth } from '../../context/AuthContext';

// children = the page component to show if logged in
export default function ProtectedRoute({ children }) {
  const { accessToken, isLoading } = useAuth();

  // Still checking if user is logged in — wait
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  // Not logged in — send to login page
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // Logged in — show the page
  return children;
}