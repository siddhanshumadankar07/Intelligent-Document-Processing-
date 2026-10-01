import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('clause_token'));
  const [loading, setLoading] = useState(true);

  // Check URL query token (for OAuth callbacks) or verify stored token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get('token');
    
    if (queryToken) {
      localStorage.setItem('clause_token', queryToken);
      setToken(queryToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchCurrentUser();
  }, [token]);

  const fetchCurrentUser = async () => {
    const currentToken = localStorage.getItem('clause_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      // If token invalid or expired, clear it
      localStorage.removeItem('clause_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      localStorage.setItem('clause_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (name, email, password, profession) => {
    const res = await api.post('/auth/register', { name, email, password, profession });
    if (res.data?.success) {
      localStorage.setItem('clause_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  // Instant 1-Click Demo Login for smooth Hackathon evaluation
  const loginAsDemoUser = async (profession = 'Finance/Accounting') => {
    const demoEmail = `evaluator_${profession.toLowerCase().replace(/[^a-z]/g, '')}@clause.demo`;
    try {
      const res = await login(demoEmail, 'DemoPass123!');
      return res;
    } catch (err) {
      // If not yet registered, register automatically
      const res = await register('Hackathon Judge', demoEmail, 'DemoPass123!', profession);
      return res;
    }
  };

  const requestWhatsAppOTP = async (phoneOrEmail) => {
    const res = await api.post('/auth/whatsapp/request-otp', { phoneOrEmail });
    return res.data;
  };

  const verifyWhatsAppOTP = async (phoneOrEmail, code, name) => {
    const res = await api.post('/auth/whatsapp/verify-otp', { phoneOrEmail, code, name });
    if (res.data?.success) {
      localStorage.setItem('clause_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('clause_token');
    localStorage.removeItem('clause_session_id');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginAsDemoUser,
        requestWhatsAppOTP,
        verifyWhatsAppOTP,
        updateUserProfile,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
