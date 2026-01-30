import { useState } from 'react';
import { Bell, LogOut, User, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import NotificationsPanel from './NotificationsPanel';
import logo from '../asstes/images/logo.png';

const DashboardHeader = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <header className="bg-white border-b-2 border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 p-2">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ISUZU Marketing CMS</h1>
              <p className="text-xs text-muted-foreground">Dealer Management Portal</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#D22827] rounded-full"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#D22827] to-[#B91C1C] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-300 py-2 z-[10000] animate-scale-in">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-foreground">John Doe</p>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#D22827] text-white text-xs font-semibold rounded">
                        Administrator
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Navigate to profile
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                      >
                        <UserCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-foreground">My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Navigate to settings
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-foreground">Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left group"
                      >
                        <LogOut className="w-4 h-4 text-gray-600 group-hover:text-[#D22827]" />
                        <span className="text-sm text-foreground group-hover:text-[#D22827] font-semibold">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <style>{`
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
    </>
  );
};

export default DashboardHeader;
