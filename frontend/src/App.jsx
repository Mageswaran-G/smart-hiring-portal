// App.jsx
// Purpose: Main file that connects all pages together
// Handles routing (which URL shows which page)
// Wraps everything with AuthProvider (shared memory)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

// Dashboard: simple page shown after successful login
// Shows user's name, email, role
// Has a logout button
function Dashboard() {

  // Get user info and logout function from shared memory
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">

        {/* Welcome message with user's name */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}! 🎉
        </h1>

        {/* Show user details */}
        <p className="text-gray-600 mb-1">Email: {user?.email}</p>
        <p className="text-gray-600 mb-6">Role: {user?.role}</p>

        {/* Logout button - clears token and user from memory */}
        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

// ProtectedRoute: guards pages from non-logged-in users
// If user has token → show the page
// If no token → send to login page
function ProtectedRoute({ children }) {

  // Read accessToken from shared memory
  const { accessToken } = useAuth();

  // If token exists → show children (Dashboard)
  // If no token → redirect to /login
  return accessToken ? children : <Navigate to="/login" />;
}

// App: main component
// Sets up all routes (URL → page mapping)
function App() {
  return (

    // AuthProvider: wraps everything so all pages share token
    <AuthProvider>

      {/* BrowserRouter: enables page navigation */}
      <BrowserRouter>
        <Routes>

          {/* / → automatically goes to /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* /signup → shows SignupPage */}
          <Route path="/signup" element={<SignupPage />} />

          {/* /login → shows LoginPage */}
          <Route path="/login" element={<LoginPage />} />

          {/* /dashboard → protected, only logged in users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;