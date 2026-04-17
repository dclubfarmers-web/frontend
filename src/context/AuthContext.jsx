import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      // api utility now auto-injects token from localStorage if available
      const data = await api.get('/api/auth/profile');
      setUser(data.user);
    } catch (err) {
      console.error('Core Authorization Failed:', err.message);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const handleSetup = async (setupData) => {
    const data = await api.post('/api/auth/setup', setupData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login: handleLogin, 
      logout: handleLogout, 
      setup: handleSetup, 
      token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
