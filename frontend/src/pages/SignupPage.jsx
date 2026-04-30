// SignupPage.jsx
// Purpose: Signup form UI for new users
// Collects name, email, password, role
// Sends data to backend via authService

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';

function SignupPage() {

  // formData: stores all input field values in one object
  // Updated every time user types in any field
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate' // default role
  });

  // error: stores error message from backend
  // Shown in red box below the title
  const [error, setError] = useState('');

  // loading: true while API call is happening
  // Disables button and shows "Creating Account..."
  const [loading, setLoading] = useState(false);

  // useNavigate: used to go to another page after signup
  const navigate = useNavigate();

  // handleChange: runs every time user types in any input
  // e.target.name  = which field changed (e.g. "email")
  // e.target.value = what user typed (e.g. "test@gmail.com")
  // ...formData = keep all other fields unchanged
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleSubmit: runs when user clicks "Sign Up" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page from refreshing on form submit
    setError('');        // clear any old error
    setLoading(true);    // show loading state

    try {
      // Call backend signup API with form data
      await signup(formData);

      // Success: show message and go to login page
      alert('Account created! Please login.');
      navigate('/login');

    } catch (err) {
      // Failure: get error message from backend response
      // If no message found, show default error
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);

    } finally {
      // Always runs: stop loading whether success or fail
      setLoading(false);
    }
  };

  return (
    // Full screen centered layout with gray background
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">

      {/* White card box */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* Page title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Error message box — only shows if error is not empty */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              placeholder="Min 8 characters"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role dropdown — only candidate or company allowed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="candidate">Candidate (Job Seeker)</option>
              <option value="company">Company (Employer)</option>
            </select>
          </div>

          {/* Submit button — disabled while loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {/* Show different text based on loading state */}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

        </form>

        {/* Link to Login page for existing users */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;