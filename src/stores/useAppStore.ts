/**
 * Global Application Store
 * Main Zustand store for global app state
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types/api';

interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Partial<Theme>) => void;
  toggleTheme: () => void;

  // User Authentication
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Recently viewed articles
  recentlyViewed: string[];
  addRecentlyViewed: (articleId: string) => void;
  clearRecentlyViewed: () => void;

  // Preferences
  preferences: {
    articlesPerPage: number;
    defaultSort: 'newest' | 'oldest' | 'popular';
    showReadingTime: boolean;
    autoPlayVideos: boolean;
    emailNotifications: boolean;
  };
  updatePreferences: (prefs: Partial<AppState['preferences']>) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialPreferences = {
  articlesPerPage: 12,
  defaultSort: 'newest' as const,
  showReadingTime: true,
  autoPlayVideos: false,
  emailNotifications: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: {
        mode: 'dark',
        primaryColor: '#6366f1',
      },
      setTheme: (theme) =>
        set((state) => ({
          theme: { ...state.theme, ...theme },
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: {
            ...state.theme,
            mode: state.theme.mode === 'light' ? 'dark' : 'light',
          },
        })),

      // User Authentication
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          recentlyViewed: [],
        }),

      // UI State
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Mobile menu
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearSearch: () => set({ searchQuery: '' }),

      // Recently viewed articles
      recentlyViewed: [],
      addRecentlyViewed: (articleId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter(id => id !== articleId);
          return {
            recentlyViewed: [articleId, ...filtered].slice(0, 10), // Keep last 10
          };
        }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      // Preferences
      preferences: initialPreferences,
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      // Error handling
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'donozon-blog-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);

// Selectors for better performance
export const useTheme = () => useAppStore((state) => state.theme);
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useMobileMenu = () => useAppStore((state) => ({
  isOpen: state.mobileMenuOpen,
  setOpen: state.setMobileMenuOpen,
  toggle: state.toggleMobileMenu,
}));
export const useSearch = () => useAppStore((state) => ({
  query: state.searchQuery,
  setQuery: state.setSearchQuery,
  clear: state.clearSearch,
}));
export const usePreferences = () => useAppStore((state) => state.preferences);