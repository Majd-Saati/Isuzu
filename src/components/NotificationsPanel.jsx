import { Bell, CheckCircle, AlertCircle, Info, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

const dummyNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Budget Approved',
    message: 'Marketing budget for Q1 2025 has been approved.',
    time: '5 minutes ago',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 2,
    type: 'info',
    title: 'New Marketing Plan',
    message: 'Dealer ABC has submitted a new marketing plan for review.',
    time: '1 hour ago',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Budget Alert',
    message: 'Dealer XYZ is approaching 80% of allocated budget.',
    time: '2 hours ago',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 4,
    type: 'success',
    title: 'Performance Update',
    message: 'Monthly performance report is now available.',
    time: '3 hours ago',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 5,
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM.',
    time: '5 hours ago',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 6,
    type: 'success',
    title: 'Activity Approved',
    message: 'Marketing activity "Summer Campaign" has been approved.',
    time: '1 day ago',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 7,
    type: 'info',
    title: 'New User Added',
    message: 'A new user has been added to your organization.',
    time: '1 day ago',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 8,
    type: 'warning',
    title: 'Document Expiring',
    message: 'Marketing agreement expires in 30 days.',
    time: '2 days ago',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const NotificationsPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleRemove = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l-2 border-gray-200 flex flex-col lg:rounded-l-2xl animate-slide-in-right">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#D22827]" />
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            <span className="px-2 py-0.5 bg-[#D22827] text-white text-xs font-bold rounded-full">
              {notifications.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-[#D22827] hover:text-[#B91C1C] font-semibold"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto dropdown-scroll">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 mt-1">You are all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition-colors relative group"
                  >
                    <button
                      onClick={() => handleRemove(notification.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPanel;
