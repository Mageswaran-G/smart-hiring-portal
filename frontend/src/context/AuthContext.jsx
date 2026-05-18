import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API, setTokenGetter, logoutAPI } from '../services/authService';

const AuthContext = createContext();

// ─── Normalize profile from backend ──────────────────────────
// Backend stores: profilePhoto
// Frontend uses:  profile.photo (for simplicity everywhere)
// This function maps profilePhoto → photo so both always work
const normalizeProfile = (data) => {
  if (!data) return null;
  return {
    ...data,
    // map profilePhoto → photo so dashboards can use profile.photo
    photo: data.profilePhoto || data.photo || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user,        setUser]        = useState(null);
  const [profile,     setProfile]     = useState(null); // global profile — shared across all pages
  const [isLoading,   setIsLoading]   = useState(true);

  const tokenRef = useRef(null);

  // Updates both ref and React state
  // Interceptor uses this to keep UI in sync after auto-refresh
  const setAuthToken = (token) => {
    tokenRef.current = token;
    setAccessToken(token);
    if (!token) {
      setUser(null);
      setProfile(null); // clear profile on logout
    }
  };

  // Silent cleanup — no backend call
  const clearAuth = () => {
    tokenRef.current = null;
    setAccessToken(null);
    setUser(null);
    setProfile(null); // clear profile on session expiry
  };

  // Register token getter and inject setAuthToken into API
  useEffect(() => {
    setTokenGetter(() => tokenRef.current);
    API.setAuthToken = setAuthToken;
  }, []);

  // Fetch profile from backend and store globally
  // Called after login and after refresh
  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      setProfile(normalizeProfile(res.data.data));  // normalize field names
    } catch (err) {
      console.error('Profile fetch failed:', err.message);
    }
  };

  // Login — called when user submits login form
  const loginUser = async (token, userData) => {
    tokenRef.current = token;
    setAccessToken(token);
    setUser(userData);
    // Fetch profile immediately after login
    try {
      const res = await API.get('/users/profile');
      setProfile(normalizeProfile(res.data.data));  // normalize field names
    } catch (err) {
      console.error('Profile fetch after login failed:', err.message);
    }
  };

  // Logout — called when user clicks logout
  const logoutUser = async () => {
    await logoutAPI();
    clearAuth();
  };

  // Auto-refresh on app startup
  // Restores session if user refreshes the browser
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await API.post('/auth/refresh');
        const { accessToken, user } = res.data.data;

        tokenRef.current = accessToken;
        setAccessToken(accessToken);
        setUser(user);

        // Fetch profile after successful refresh
        // So profile photo shows in dashboard on page reload
        try {
          const profileRes = await API.get('/users/profile');
          setProfile(normalizeProfile(profileRes.data.data));  // normalize field names
        } catch (err) {
          console.error('Profile fetch after refresh failed:', err.message);
        }

      } catch (err) {
        // Refresh failed — clear everything silently
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    refreshUser();
  }, []);

  return (
    // profile and fetchProfile now available to ALL pages
    <AuthContext.Provider value={{
      accessToken,
      user,
      profile,      // global profile data
      fetchProfile, // call this after updating profile
      loginUser,
      logoutUser,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);