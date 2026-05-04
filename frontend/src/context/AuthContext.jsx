// AuthContext.jsx
// Professional pattern — token in React state + ref
// No window globals. Clean closure via setTokenGetter.

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API, setTokenGetter } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser]               = useState(null);
  const [isLoading, setIsLoading]     = useState(true);

  // ref always holds latest token
  // Interceptor reads from ref — never stale
  const tokenRef = useRef(null);

  // Register getter with axios on mount — runs once
  useEffect(() => {
    setTokenGetter(() => tokenRef.current);
  }, []);

  // Login — save token in both ref and state
  const loginUser = (token, userData) => {
    tokenRef.current = token;
    setAccessToken(token);
    setUser(userData);
  };

  // Logout — clear everything
  const logoutUser = () => {
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
        logoutUser();
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