import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, signupUser, googleLoginUser, getMe, getInterviewHistory } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mockai_token') || null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Load active session and history on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mockai_token');
      if (storedToken) {
        try {
          const res = await getMe();
          if (res.user) {
            setUser(res.user);
            if (res.history) setHistory(res.history);
          }
        } catch (e) {
          console.warn('Session expired or invalid:', e);
          localStorage.removeItem('mockai_token');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const refreshHistory = useCallback(async () => {
    const storedToken = localStorage.getItem('mockai_token');
    if (!storedToken) return;
    try {
      const res = await getInterviewHistory();
      if (res.history) setHistory(res.history);
    } catch (e) {
      console.warn('History fetch error:', e);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.token) {
      localStorage.setItem('mockai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      refreshHistory();
    }
    return res;
  }, [refreshHistory]);

  const signup = useCallback(async (name, email, password) => {
    const res = await signupUser({ name, email, password });
    if (res.token) {
      localStorage.setItem('mockai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      refreshHistory();
    }
    return res;
  }, [refreshHistory]);

  const loginWithGoogle = useCallback(async (googleData = {}) => {
    const res = await googleLoginUser(googleData);
    if (res.token) {
      localStorage.setItem('mockai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      refreshHistory();
    }
    return res;
  }, [refreshHistory]);

  const logout = useCallback(() => {
    localStorage.removeItem('mockai_token');
    localStorage.removeItem('mockai_user');
    setToken(null);
    setUser(null);
    setHistory([]);
  }, []);

  const updateUserProfile = useCallback(({ name, email }) => {
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        name: name !== undefined ? name : prev?.name,
        email: email !== undefined ? email : prev?.email,
      };
      localStorage.setItem('mockai_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const openAuth = useCallback((mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const openHistory = useCallback(() => {
    refreshHistory();
    setHistoryModalOpen(true);
  }, [refreshHistory]);

  const closeHistory = useCallback(() => {
    setHistoryModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        history,
        isLoading,
        isAuthenticated: !!token || !!user,
        authModalOpen,
        authMode,
        historyModalOpen,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUserProfile,
        openAuth,
        closeAuth,
        openHistory,
        closeHistory,
        setAuthMode,
        refreshHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
