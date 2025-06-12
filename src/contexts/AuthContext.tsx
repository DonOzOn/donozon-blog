'use client';

/**
 * Simple Admin Authentication Hook
 * Basic username/password authentication for admin panel
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: { username: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'donozon2024'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    try {
      const savedAuth = localStorage.getItem('admin_auth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated && authData.user) {
          setIsAuthenticated(true);
          setUser(authData.user);
          console.log('🔐 Auth restored from localStorage:', authData.user.username);
        }
      }
    } catch (error) {
      console.error('Error restoring auth from localStorage:', error);
      // Clear invalid localStorage data
      localStorage.removeItem('admin_auth');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser({ username });
      
      // Save to localStorage
      localStorage.setItem('admin_auth', JSON.stringify({
        isAuthenticated: true,
        user: { username }
      }));
      
      console.log('🔐 User logged in:', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('admin_auth');
    console.log('🔐 User logged out');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
