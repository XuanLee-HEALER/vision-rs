'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null; // Kept for backward compatibility, always null now
  login: (email: string, password: string) => Promise<void>; // Kept for backward compatibility, throws error
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn && data.email) {
          setUser({ email: data.email });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (_email: string, _password: string) => {
    // This method is kept for backward compatibility but is no longer used
    // Users should use the email verification code flow instead
    throw new Error('Password login is deprecated. Please use email verification code.');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token: null, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
