import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    // Redirect to /login if no token and not on /login or /signup
    if (!token && !['/login', '/signup'].includes(window.location.pathname)) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
  <AuthContext.Provider value={{ token, login, logout }}>
    {console.log('AuthContext value:', { token, login, logout })}
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);