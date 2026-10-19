import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('threadline_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('threadline_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data.user);
          localStorage.setItem('threadline_user', JSON.stringify(res.data.data.user));
        }
      } catch {
        localStorage.removeItem('threadline_token');
        localStorage.removeItem('threadline_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: userData, token } = res.data.data;
        localStorage.setItem('threadline_token', token);
        localStorage.setItem('threadline_user', JSON.stringify(userData));
        setUser(userData);
        addToast(`Welcome back, ${userData.name}!`, 'success');
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        const { user: userData, token } = res.data.data;
        localStorage.setItem('threadline_token', token);
        localStorage.setItem('threadline_user', JSON.stringify(userData));
        setUser(userData);
        addToast('Account created successfully!', 'success');
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('threadline_token');
    localStorage.removeItem('threadline_user');
    setUser(null);
    addToast('Logged out of Threadline.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
