import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API, setTokenGetter, logoutAPI } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser]               = useState(null);
  const [isLoading, setIsLoading]     = useState(true);

  const tokenRef = useRef(null);

  // Fix 1 — setAuthToken updates BOTH ref and React state
  // Interceptor uses this to keep UI in sync after auto-refresh
  const setAuthToken = (token) => {
    tokenRef.current = token;
    setAccessToken(token);
    if (!token) setUser(null);
  };

  // Fix 2 — clearAuth = silent cleanup, NO backend call
  // Used when session expires naturally
  const clearAuth = () => {
    tokenRef.current = null;
    setAccessToken(null);
    setUser(null);
  };

  // Register getter + inject setAuthToken into API object
  // Interceptor can now call API.setAuthToken(newToken)
  useEffect(() => {
    setTokenGetter(() => tokenRef.current);
    API.setAuthToken = setAuthToken;
  }, []);

  // Login — user clicked login button
  const loginUser = (token, userData) => {
    tokenRef.current = token;
    setAccessToken(token);
    setUser(userData);
  };

  // Logout — user clicked logout button → call backend
  const logoutUser = async () => {
    await logoutAPI();
    clearAuth();
  };

  // Auto-refresh on app startup
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await API.post('/auth/refresh');
        const { accessToken, user } = res.data.data;

        tokenRef.current = accessToken;
        setAccessToken(accessToken);
        setUser(user);

      } catch (err) {
        // Fix 2 — use clearAuth here, NOT logoutUser
        // Refresh failed = no valid session, no need to call backend
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      accessToken, user, loginUser, logoutUser, isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);