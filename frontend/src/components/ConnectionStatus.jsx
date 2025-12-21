import { useConnectionStatus } from '../hooks/useRealtime';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = () => {
  const { isOnline } = useConnectionStatus();

  if (isOnline) return null; // Only show when offline

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-pulse">
      <div className="bg-red-500 text-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
        <WifiOff size={18} />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
