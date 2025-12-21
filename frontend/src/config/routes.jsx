import { lazy, Suspense } from 'react';
import Index from '../pages/Index';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Notifications from '../pages/Notifications';
import Bookmarks from '../pages/Bookmarks';
import NotFound from '../pages/NotFound';

// Lazy load domain pages
const Water = lazy(() => import('../pages/domains/Water'));
const Garbage = lazy(() => import('../pages/domains/Garbage'));
const Road = lazy(() => import('../pages/domains/Road'));
const Street = lazy(() => import('../pages/domains/Street'));
const Animals = lazy(() => import('../pages/domains/Animals'));
const Recycling = lazy(() => import('../pages/domains/Recycling'));
const Others = lazy(() => import('../pages/domains/Others'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const publicRoutes = [
  { path: '/', element: <Index />, label: 'Home' },
  { path: '/login', element: <Login />, label: 'Login' },
  { path: '/signup', element: <Signup />, label: 'Sign Up' },
];

export const protectedRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    label: 'Dashboard',
    role: 'user',
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
    label: 'Admin Dashboard',
    role: 'admin',
  },
  {
    path: '/notifications',
    element: <Notifications />,
    label: 'Notifications',
    role: 'user',
  },
  {
    path: '/bookmarks',
    element: <Bookmarks />,
    label: 'Bookmarks',
    role: 'user',
  },
];

export const domainRoutes = [
  {
    path: '/domain/water',
    element: withSuspense(Water),
    domain: 'water',
    name: 'Water Issues',
    emoji: '💧',
  },
  {
    path: '/domain/garbage',
    element: withSuspense(Garbage),
    domain: 'garbage',
    name: 'Garbage Issues',
    emoji: '🗑️',
  },
  {
    path: '/domain/road',
    element: withSuspense(Road),
    domain: 'road',
    name: 'Road Issues',
    emoji: '🚗',
  },
  {
    path: '/domain/street',
    element: withSuspense(Street),
    domain: 'street',
    name: 'Street Issues',
    emoji: '💡',
  },
  {
    path: '/domain/animals',
    element: withSuspense(Animals),
    domain: 'animals',
    name: 'Animal Issues',
    emoji: '🐕',
  },
  {
    path: '/domain/recycling',
    element: withSuspense(Recycling),
    domain: 'recycling',
    name: 'Recycling Issues',
    emoji: '♻️',
  },
  {
    path: '/domain/others',
    element: withSuspense(Others),
    domain: 'others',
    name: 'Other Issues',
    emoji: '🔧',
  },
];

export const errorRoutes = [
  { path: '*', element: <NotFound /> },
];

export const allRoutes = [...publicRoutes, ...protectedRoutes, ...domainRoutes, ...errorRoutes];

export default {
  publicRoutes,
  protectedRoutes,
  domainRoutes,
  errorRoutes,
  allRoutes,
};
