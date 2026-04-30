// LoginPage.jsx
// Purpose: Login form UI for existing users
// Collects email and password
// On success: saves token to memory, goes to dashboard

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function LoginPage() {

  // formData: stores email and password typed by user
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // error: shows backend error message in red box
  const [error, setError] = useState('');

  // loading: true while waiting for backend reply
  const [loading, setLoading] = useState(false);

  // navigate: used to go to dashboard after login
  const navigate = useNavigate();

  // loginUser: function from AuthContext
  // Saves token and user info into shared memory
  const { loginUser } = useAuth();

  // handleChange: updates formData when user types
  // Works for both email and password fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleSubmit: runs when user clicks Login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page refresh
    setError('');        // clear old errors
    setLoading(true);    // show loading state

    try {
      // Call backend login API with email and password
      const result = await login(formData);

      // Save accessToken and user info to context memory
      // result.data contains { accessToken, user }
      loginUser(result.data.accessToken, result.data.user);

      // Go to dashboard on success
      navigate('/dashboard');

    } catch (err) {
      // Show backend error message (e.g. "Invalid credentials")
      const message = err.response?.data?.message || 'Login failed';
      setError(message);

    } finally {
      // Always stop loading at the end
      setLoading(false);
    }
  };

  return (
    // Full screen centered layout
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">

      {/* White card */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* Page title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        {/* Error box — only visible when error has value */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button — disabled while loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {/* Text changes based on loading state */}
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* Link to Signup for new users */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;