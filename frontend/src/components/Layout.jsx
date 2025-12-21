import Navbar from './Navbar';
import ConnectionStatus from './ConnectionStatus';
import RealtimeNotificationToast from './RealtimeNotificationToast';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const noNavRoutes = ['/login', '/signup'];
  const showNavbar = !noNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {showNavbar && <Navbar />}
      
      <main className="flex-1">
        {children}
      </main>

      {/* Real-time features */}
      <ConnectionStatus />
      <RealtimeNotificationToast />
    </div>
  );
};

export default Layout;
