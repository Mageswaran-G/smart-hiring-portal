// AuthContext.jsx
// Fixed: registers tokenUpdater so interceptor can update ref properly

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API, setTokenGetter, setTokenUpdater, logoutAPI } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser]               = useState(null);
  const [isLoading, setIsLoading]     = useState(true);

  // Ref always holds latest token — interceptor reads this
  const tokenRef = useRef(null);

  // Register getter — interceptor reads token via this
  useEffect(() => {
    setTokenGetter(() => tokenRef.current);
  }, []);

  // Register updater — interceptor updates token via this
  // This keeps ref and state in sync after auto-refresh
  useEffect(() => {
    setTokenUpdater((newToken) => {
      tokenRef.current = newToken;
      setAccessToken(newToken);
      // If token cleared → user is logged out
      if (!newToken) {
        setUser(null);
      }
    });
  }, []);

  // Login — save token in both ref and state
  const loginUser = (token, userData) => {
    tokenRef.current = token;
    setAccessToken(token);
    setUser(userData);
  };

  // Logout — call backend first, then clear frontend
  const logoutUser = async () => {
    await logoutAPI();
    tokenRef.current = null;
    setAccessToken(null);
    setUser(null);
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
        // No valid session — user needs to login
        tokenRef.current = null;
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      accessToken,
      user,
      loginUser,
      logoutUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);