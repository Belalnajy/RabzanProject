'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const persistSession = useCallback((nextToken, nextUser) => {
    authStorage.setToken(nextToken);
    authStorage.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await api.post('/auth/login', { email, password });
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession],
  );

  const register = useCallback(
    async ({ fullName, email, password }) => {
      const data = await api.post('/auth/register', { fullName, email, password });
      return data;
    },
    [],
  );

  const forgotPassword = useCallback(async ({ email }) => {
    return api.post('/auth/forgot-password', { email });
  }, []);

  const resetPassword = useCallback(async ({ token: resetToken, newPassword, confirmNewPassword }) => {
    return api.post('/auth/reset-password', {
      token: resetToken,
      newPassword,
      confirmNewPassword,
    });
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
    setToken(null);
    router.replace('/login');
  }, [router]);

  const hasPermission = useCallback(
    (permissionKey) => {
      if (!permissionKey) return true;
      const permissions = user?.role?.permissions?.map((p) => p.key) || [];
      return permissions.includes(permissionKey);
    },
    [user],
  );

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(patch || {}) };
      authStorage.setUser(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      hasPermission,
      updateUser,
    }),
    [user, token, isLoading, login, register, forgotPassword, resetPassword, logout, hasPermission, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
