import { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // isLoading: true while checking refresh token on startup
  // ProtectedRoute waits for this to become false
  const [isLoading, setIsLoading] = useState(true);

  const loginUser = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    window.__accessToken__ = token;
  };

  const logoutUser = () => {
    setAccessToken(null);
    setUser(null);
    window.__accessToken__ = null;
  };

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await API.post('/auth/refresh');
        const { accessToken, user } = res.data.data;

        setAccessToken(accessToken);
        setUser(user);
        window.__accessToken__ = accessToken;
        
      } catch (err) {
        logoutUser();
      } finally {
        // Always stop loading — whether success or fail
        setIsLoading(false);
      }
    };

    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, user, loginUser, logoutUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);