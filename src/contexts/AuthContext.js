import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, getProfile } from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On mount, check for token and set user if possible
  useEffect(() => {
    if (token) {
      // Fetch user profile for session validation
      (async () => {
        try {
          const res = await getProfile();
          if (res.status === 'success' && res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          // Token invalid or expired
          logout();
        }
      })();
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin({ email, password });
      if (res.status === 'success' && res.token && res.user) {
        // DO NOT force role to 'patient'
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRegister({ name, email, password });
      if (res.status === 'success' && res.token && res.user) {
        // DO NOT force role to 'patient'
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiForgotPassword(email);
      return res;
    } catch (err) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiResetPassword(token, password);
      if (res.status === 'success' && res.token) {
        setToken(res.token);
        // Optionally fetch user profile after reset
        const profileRes = await getProfile();
        if (profileRes.status === 'success' && profileRes.data && profileRes.data.user) {
          setUser(profileRes.data.user);
          localStorage.setItem('user', JSON.stringify(profileRes.data.user));
        }
        localStorage.setItem('token', res.token);
      }
      return res;
    } catch (err) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => !!token && !!user;
  const getUserRole = () => user ? user.role : null;

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, forgotPassword, resetPassword, logout, isAuthenticated, getUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);