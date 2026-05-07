// ─────────────────────────────────────────────────────
// RoleRoute.jsx
// Purpose: Blocks access if user role is not allowed
// Example: Only 'candidate' can access candidate dashboard
// If wrong role → redirects to login
// ─────────────────────────────────────────────────────

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// allowedRoles = array of roles that can access this page
// Example: allowedRoles={['candidate']}
export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // No user OR role not in allowed list → redirect to login
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  // Role is allowed — show the page
  return children;
}