import React, { useState, useEffect, useRef } from 'react';
import { Menu, Grid3x3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../LogoutModal';
import { SearchBar } from '../header/SearchBar';
import { NotificationsDropdown } from '../header/NotificationsDropdown';
import { UserMenuDropdown } from '../header/UserMenuDropdown';
import { DarkModeToggle } from '../header/DarkModeToggle';

export const Header = ({ onMenuClick, sidebarCollapsed = false }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const navigate = useNavigate();
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-40 bg-white/95 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none backdrop-blur-md flex flex-col items-stretch font-normal px-4 md:px-8 lg:px-12 py-4 animate-fade-in transition-all duration-300 left-0 right-0 ${
        sidebarCollapsed ? 'md:left-[80px]' : 'md:left-[306px]'
      }`}
    >
      <button onClick={onMenuClick} className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700" aria-label="Toggle menu">
        <Menu className="w-6 h-6 text-[#344251] dark:text-gray-300" />
      </button>
      
      <div className="flex w-full items-center gap-3 md:gap-6 lg:gap-[40px] text-sm text-[#848E9A] dark:text-gray-400 justify-end flex-wrap">
    <></>
        {/* <SearchBar /> */}
        <div className="flex items-center gap-2 md:gap-4 leading-6">
          {/* <button className="hidden lg:flex group bg-white dark:bg-gray-800 shadow-md hover:shadow-xl items-center gap-3 justify-center px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#E60012]/30 transition-all duration-300 hover:scale-105">
            <Grid3x3 className="w-5 h-5 text-[#848E9A] dark:text-gray-400 group-hover:text-[#E60012] transition-colors duration-300" />
            <div className="text-[#6B7280] dark:text-gray-300 font-semibold group-hover:text-[#344251] dark:group-hover:text-white transition-colors duration-300">Change View</div>
          </button> */}
          <DarkModeToggle />
          <NotificationsDropdown showNotifications={showNotifications} setShowNotifications={setShowNotifications} notificationsRef={notificationsRef} />
          <UserMenuDropdown showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} userMenuRef={userMenuRef} onLogoutClick={() => setShowLogoutModal(true)} />
        </div>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => { setShowLogoutModal(false); navigate('/login'); }} />
    </header>
  );
};
