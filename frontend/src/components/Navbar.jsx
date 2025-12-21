import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Bookmark, LogOut, Settings } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/notifications', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            const unread = Array.isArray(data) ? data.filter(n => !n.read).length : 0;
            setUnreadNotifications(unread);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
      // Poll every 30 seconds for updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setUser(null);
  };

  const isActive = (path) => location.pathname === path ? 'text-blue-600 dark:text-blue-400' : '';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline">CityPulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link to="/dashboard" className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/bookmarks" className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${isActive('/bookmarks')}`}>
                  Bookmarks
                </Link>
                {user.userType === 'admin' && (
                  <Link to="/admin-dashboard" className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${isActive('/admin-dashboard')}`}>
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/" className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${isActive('/')}`}>
                  Home
                </Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{user.userType} Account</p>
                    </div>
                    <Link to="/dashboard" className="w-full block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                  Dashboard
                </Link>
                <Link to="/bookmarks" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                  Bookmarks
                </Link>
                <Link to="/notifications" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                  Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
                </Link>
                {user.userType === 'admin' && (
                  <Link to="/admin-dashboard" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                  Home
                </Link>
                <Link to="/login" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                  Login
                </Link>
                <Link to="/signup" className="block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
