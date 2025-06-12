/**
 * Application Routes Configuration
 * Centralized routing configuration for the blog application
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  
  // Article Routes
  ARTICLES: '/articles',
  ARTICLE_DETAIL: (slug: string) => `/articles/${slug}`,
  
  // Category Routes
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (slug: string) => `/category/${slug}`,
  
  // Search & Filter
  SEARCH: '/search',
  TAG: (tag: string) => `/tag/${tag}`,
  
  // Admin Routes (for future use)
  ADMIN: '/admin',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  
  // Auth Routes (for future use)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // API Routes (for client-side API calls)
  API: {
    ARTICLES: '/api/articles',
    ARTICLE_BY_ID: (id: string) => `/api/articles/${id}`,
    ARTICLE_BY_SLUG: (slug: string) => `/api/articles/slug/${slug}`,
    CATEGORIES: '/api/categories',
    CATEGORY_BY_SLUG: (slug: string) => `/api/categories/${slug}`,
    SEARCH: '/api/search',
    TAGS: '/api/tags',
    USERS: '/api/users',
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
  },
} as const;

/**
 * Route metadata for navigation and SEO
 */
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Home - DonOzOn Blog',
    description: 'Digital development blog by Dastin Darmawan',
    keywords: ['blog', 'development', 'programming', 'photography'],
  },
  [ROUTES.ABOUT]: {
    title: 'About - DonOzOn Blog',
    description: 'Learn more about Dastin Darmawan and his journey',
    keywords: ['about', 'developer', 'photographer', 'bio'],
  },
  [ROUTES.CONTACT]: {
    title: 'Contact - DonOzOn Blog',
    description: 'Get in touch with Dastin Darmawan',
    keywords: ['contact', 'email', 'get in touch'],
  },
  [ROUTES.ARTICLES]: {
    title: 'Articles - DonOzOn Blog',
    description: 'Browse all articles about web development and programming',
    keywords: ['articles', 'blog posts', 'tutorials', 'programming'],
  },
  [ROUTES.CATEGORIES]: {
    title: 'Categories - DonOzOn Blog',
    description: 'Browse articles by category',
    keywords: ['categories', 'topics', 'programming languages'],
  },
} as const;

/**
 * Navigation items for the main menu
 */
export const NAVIGATION_ITEMS = [
  {
    name: 'Home',
    href: ROUTES.HOME,
    external: false,
  },
  {
    name: 'Articles',
    href: ROUTES.ARTICLES,
    external: false,
  },
  {
    name: 'Categories',
    href: ROUTES.CATEGORIES,
    external: false,
  },
  {
    name: 'About',
    href: ROUTES.ABOUT,
    external: false,
  },
  {
    name: 'Contact',
    href: ROUTES.CONTACT,
    external: false,
  },
] as const;

/**
 * Category routes mapping
 */
export const CATEGORY_ROUTES = {
  CSS: ROUTES.CATEGORY_DETAIL('css'),
  JAVASCRIPT: ROUTES.CATEGORY_DETAIL('javascript'),
  REACT: ROUTES.CATEGORY_DETAIL('react'),
  TYPESCRIPT: ROUTES.CATEGORY_DETAIL('typescript'),
  NEXTJS: ROUTES.CATEGORY_DETAIL('nextjs'),
  TAILWIND: ROUTES.CATEGORY_DETAIL('tailwind'),
} as const;

/**
 * Helper function to check if a route is active
 */
export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  if (routePath === ROUTES.HOME) {
    return currentPath === routePath;
  }
  return currentPath.startsWith(routePath);
};

/**
 * Helper function to get route metadata
 */
export const getRouteMetadata = (path: string) => {
  return ROUTE_METADATA[path as keyof typeof ROUTE_METADATA] || {
    title: 'DonOzOn Blog',
    description: 'Digital development blog',
    keywords: ['blog', 'development'],
  };
};