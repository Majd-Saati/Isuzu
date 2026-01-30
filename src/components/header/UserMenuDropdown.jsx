import React from 'react';
import { useSelector } from 'react-redux';
import { User, ChevronDown, Settings, HelpCircle, Mail, LogOut } from 'lucide-react';

export const UserMenuDropdown = ({ 
  showUserMenu, 
  setShowUserMenu, 
  userMenuRef,
  onLogoutClick 
}) => {
  const user = useSelector((state) => state.auth.user);
  
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userRole = user?.is_admin === '1' || user?.is_admin === 1 ? 'Administrator' : 'User';
  return (
    <div className="relative" ref={userMenuRef}>
      <button 
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="group bg-white dark:bg-gray-800 shadow-md hover:shadow-xl flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#E60012]/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#E60012] to-[#B91C1C] flex items-center justify-center shadow-md flex-shrink-0">
          <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-bold text-[#344251] dark:text-gray-200 leading-none">{userName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1">{userRole}</span>
        </div>
        <ChevronDown className="hidden md:block w-4 h-4 text-[#848E9A] dark:text-gray-400 group-hover:text-[#E60012] transition-colors" />
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-700 z-[10000] animate-fade-in overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-white dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E60012] to-[#B91C1C] flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#344251] dark:text-gray-200">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail || 'No email'}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              Settings
            </button>
            <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              Messages
            </button>
            <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              Help & Support
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 py-2">
            <button
              onClick={() => {
                setShowUserMenu(false);
                onLogoutClick();
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
