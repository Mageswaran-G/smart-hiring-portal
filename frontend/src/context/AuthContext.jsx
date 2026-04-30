// AuthContext.jsx
// Purpose: Shared memory for the entire app
// Stores accessToken and user info after login
// Any page can read this using useAuth()

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Axios instance to call backend refresh endpoint
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  withCredentials: true  // needed to send HTTP-only cookie
});
// Create the empty shared memory box
const AuthContext = createContext();

// AuthProvider wraps the whole app
// All pages inside can access token and user info
export const AuthProvider = ({ children }) => {

  // accessToken: JWT token — starts null (not logged in)
  const [accessToken, setAccessToken] = useState(null);

  // user: { id, name, email, role } — starts null
  const [user, setUser] = useState(null);
  // Auto-refresh on app start
// When browser refreshes → call /refresh endpoint
// Backend reads HTTP-only cookie and gives new token
// If cookie expired → logout user cleanly
useEffect(() => {
  const refreshUser = async () => {
    try {
      // Call our existing /refresh endpoint
      const res = await API.post('/auth/refresh');

      // Save new token to memory and window
      setAccessToken(res.data.data.accessToken);
      window.__accessToken__ = res.data.data.accessToken;

    } catch (err) {
      // Cookie expired or invalid → clear everything
      setAccessToken(null);
      setUser(null);
      window.__accessToken__ = null;
    }
  };

  // Run once when app first loads
  refreshUser();
}, []); // [] means run only once on startup
  // loginUser: called after successful login
  // Saves token to React memory AND window (for axios)
  const loginUser = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    window.__accessToken__ = token; // axios interceptor reads this
  };

  // logoutUser: called when user clicks Logout
  // Clears everything from memory
  const logoutUser = () => {
    setAccessToken(null);
    setUser(null);
    window.__accessToken__ = null;
  };

  // Share these 4 things with all pages
  return (
    <AuthContext.Provider value={{ accessToken, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth: shortcut to read context in any page
export const useAuth = () => useContext(AuthContext);