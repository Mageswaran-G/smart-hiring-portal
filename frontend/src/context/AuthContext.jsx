// AuthContext.jsx
// Purpose: Shared memory for the entire app
// Stores accessToken and user info after login
// Any page can read this using useAuth()

import { createContext, useContext, useState } from 'react';

// Create the empty shared memory box
const AuthContext = createContext();

// AuthProvider wraps the whole app
// All pages inside can access token and user info
export const AuthProvider = ({ children }) => {

  // accessToken: stores JWT access token
  // Starts as null = no one is logged in
  const [accessToken, setAccessToken] = useState(null);

  // user: stores { id, name, email, role }
  // Starts as null = no user data yet
  const [user, setUser] = useState(null);

  // loginUser: called after successful login
  // Saves token and user info into memory
  const loginUser = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  // logoutUser: called when user clicks Logout
  // Clears token and user from memory
  const logoutUser = () => {
    setAccessToken(null);
    setUser(null);
  };

  // Provide these 4 values to all child pages:
  // accessToken, user, loginUser, logoutUser
  return (
    <AuthContext.Provider value={{ accessToken, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth: shortcut hook for any page to access context
// Usage: const { user, loginUser } = useAuth();
export const useAuth = () => useContext(AuthContext);