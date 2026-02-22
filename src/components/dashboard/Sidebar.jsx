import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from "../../asstes/images/logo.png";
import { mainNavigation, otherNavigation } from '../../data/navigationData';
import { useDealers } from '@/hooks/api/useCompanies';
import { AddEditCompanyModal } from '@/components/companies/AddEditCompanyModal';
import { canAccessRoute, isAdminUser } from '@/lib/permissions';

export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  // Check if user is admin
  const isAdmin = isAdminUser(user);
  
  const [dealersExpanded, setDealersExpanded] = useState(true);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  
  // Fetch dealers (companies) from API - data is always cached
  const { data: dealers = [] } = useDealers();
  
  // Filter navigation items based on permissions
  const filteredMainNavigation = mainNavigation.filter((item) => {
    return canAccessRoute(user, item.path);
  });

  // Filter other navigation items based on permissions
  const filteredOtherNavigation = otherNavigation.filter((item) => {
    return canAccessRoute(user, item.path);
  });

  const isActive = (path) => location.pathname === path;
  const searchParams = new URLSearchParams(location.search);
  const currentCompanyId = searchParams.get('company_id');
  
  const isMarketingPlansActive = () => {
    return location.pathname === '/marketing-plans' || location.pathname.startsWith('/marketing-plans/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  const handleDownload = () => {
    // TODO: Implement PDF report download
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 h-screen flex flex-col items-stretch bg-gray-50 dark:bg-gray-900 z-40
          transition-all duration-300 ease-in-out border-r-2 border-gray-200 dark:border-gray-800 shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-[80px]' : 'w-[306px] max-w-[85vw]'}
        `}
      >
      {/* Logo Section */}
      <div className={`bg-white dark:bg-gray-900 w-full h-[80px] sm:h-[100px] flex items-center justify-center border-b-2 border-gray-100 dark:border-gray-800 relative flex-shrink-0 `}>
        <button
          onClick={() => navigate('/dashboard')}
          className={`transform hover:scale-105 transition-transform duration-300 cursor-pointer ${isCollapsed ? 'hidden' : ''}`}
          title="Go to home"
        >
          <img
            src={logo}
            className="aspect-[4.55] object-contain w-[140px] max-w-full drop-shadow-sm"
            alt="Company Logo"
          />
        </button>
        
        {/* Collapsed Logo - Show first letter */}
        {isCollapsed && (
          <button
            onClick={() => navigate('/')}
            className="text-[#E60012] font-bold text-2xl cursor-pointer hover:scale-110 transition-transform duration-300"
            title="Go to home"
          >
            I
          </button>
        )}
        
        {/* Toggle Button - Fully inside sidebar so it is not cut off */}
        <button
          onClick={onToggleCollapse}
          className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full items-center justify-center hover:bg-[#E60012] hover:border-[#E60012] hover:text-white text-gray-600 dark:text-gray-300 transition-all duration-300 shadow-md hover:shadow-lg z-20 group right-0`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
      {/* Scrollable area: navigation, PDF and other items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll bg-gray-50 dark:bg-gray-900">
        {/* Navigation Section */}
        <nav className={`w-full text-[#848E9A] dark:text-gray-400 font-normal mt-4 sm:mt-6 transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-4 sm:px-8'}`}>
        <div className="w-full overflow-hidden">
          {!isCollapsed && (
            <div className="text-[#848E9A] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 px-2">Main Menu</div>
          )}
          <div className="flex w-full flex-col items-stretch text-base space-y-1.5">
            {filteredMainNavigation.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3 rounded-xl w-full transition-all duration-200 group relative ${
                    isCollapsed ? 'px-3 justify-center' : 'px-3 sm:px-4'
                  } ${
                    (item.id === 'marketing-plans' ? isMarketingPlansActive() : isActive(item.path))
                      ? 'text-[#E60012] bg-red-50 dark:bg-red-900/20 shadow-sm border-l-4 border-[#E60012] font-semibold' 
                      : 'text-[#848E9A] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
                  } hover:text-[#E60012]`}
                  title={isCollapsed ? item.label : ''}
                >
                  <img
                    src={item.icon}
                    className="aspect-[1] object-contain w-6 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md"
                    alt={item.label}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 my-auto text-left text-sm leading-6 whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Companies Section - Always visible for admins when sidebar is expanded */}
        {!isCollapsed && isAdmin && (
          <div className="w-full mt-8 animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => setDealersExpanded(!dealersExpanded)}
                className="text-[#848E9A] hover:text-[#E60012] transition-all duration-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-red-50 rounded-lg px-2 py-1.5 -ml-2"
                title={dealersExpanded ? "Collapse companies" : "Expand companies"}
              >
                Companies
              </button>
              <div className="flex gap-2 flex-shrink-0">
                {/* Add Company Button - Only for admins */}
                {isAdmin && (
                  <button 
                    onClick={() => setShowAddCompanyModal(true)}
                    className="text-[#848E9A] hover:text-[#E60012] transition-all duration-300 p-1.5 hover:bg-red-50 rounded-lg hover:scale-110"
                    title="Add new company"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                {/* Expand/Collapse Button */}
                <button 
                  onClick={() => setDealersExpanded(!dealersExpanded)}
                  className="text-[#848E9A] hover:text-[#E60012] transition-all duration-300 p-1.5 hover:bg-red-50 rounded-lg hover:scale-110"
                  title={dealersExpanded ? "Collapse companies" : "Expand companies"}
                >
                  {dealersExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {dealersExpanded && (
              <div className="flex flex-col gap-1.5 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {dealers.length === 0 ? (
                  <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">No companies available</div>
                ) : (
                  dealers.map((dealer) => {
                    const isDealerActive = (location.pathname === '/marketing-plans' || location.pathname === '/budgets-allocation') && String(currentCompanyId) === String(dealer.id);
                    return (
                      <button
                        key={dealer.id}
                        onClick={() => {
                          // Stay on current page if on budgets-allocation, otherwise go to marketing-plans
                          const targetPath = location.pathname === '/budgets-allocation' 
                            ? '/budgets-allocation' 
                            : '/marketing-plans';
                          navigate(`${targetPath}?company_id=${dealer.id}&page=1&per_page=20`);
                          if (window.innerWidth < 768) {
                            onClose?.();
                          }
                        }}
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 group min-w-0 ${
                          isDealerActive 
                            ? 'bg-red-100 dark:bg-red-900/30 shadow-sm border-l-4 border-[#E60012]' 
                            : 'hover:bg-white dark:hover:bg-gray-700 border-l-4 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div 
                          className="w-3 h-3 rounded-full shadow-md flex-shrink-0" 
                          style={{ backgroundColor: dealer.color }}
                        />
                        <span className={`text-sm font-medium transition-colors truncate ${isDealerActive ? 'text-[#E60012]' : 'text-[#848E9A] group-hover:text-[#E60012]'}`}>
                          {dealer.label}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {!isCollapsed && <div className="border-t-2 w-full mt-8 mb-8 border-gray-200 dark:border-gray-800 opacity-50" />}

        {/* Other Navigation Section - Always visible when sidebar is expanded */}
        {!isCollapsed && (
          <div className="w-full overflow-hidden">
            <div className="text-[#848E9A] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 px-2">Others</div>
            <div className="flex w-full flex-col text-base space-y-1.5">
              {filteredOtherNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group ${
                    isCollapsed ? 'px-3 justify-center' : 'px-3 sm:px-4'
                  } ${
                    isActive(item.path) 
                      ? 'text-[#E60012] bg-red-50 dark:bg-red-900/20 shadow-sm border-l-4 border-[#E60012] font-semibold' 
                      : 'text-[#848E9A] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
                  } hover:text-[#E60012]`}
                  title={isCollapsed ? item.label : ''}
                >
                  <img
                    src={item.icon}
                    className="aspect-[1] object-contain w-6 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md"
                    alt={item.label}
                  />
                  {!isCollapsed && (
                    <span className="text-sm leading-6 whitespace-nowrap flex-1 text-left">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        </nav>

        {/* PDF Download Section - Hidden when collapsed */}
        {/* {!isCollapsed && (
          <div className="w-full mt-6 sm:mt-8 mb-6 px-4 sm:px-8">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 sm:p-5 border-2 border-red-100 dark:border-red-900/30 shadow-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm mb-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/8e5e48345a48b097bb0c25f93edbbcd548fcafe3?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-full max-w-[100px] mx-auto drop-shadow-md"
                  alt="PDF Report Preview"
                />
              </div>
              <div className="w-full text-left">
                <div className="text-[#1F2937] dark:text-gray-200 text-lg font-bold truncate">
                  PDF Reports
                </div>
                <div className="text-[#6E6E6E] dark:text-gray-400 text-sm font-normal leading-none mt-2 truncate">
                  2025 Terms Report
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-[#E60012] to-[#C00010] flex w-full items-center gap-3 text-sm text-white font-semibold whitespace-nowrap leading-6 justify-center mt-5 px-6 py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 hover:from-[#C00010] hover:to-[#E60012]"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="animate-pulse flex-shrink-0">
                  <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="text-white leading-6">Download PDF</span>
              </button>
            </div>
          </div>
        )} */}
        {/* Bottom spacer */}
        <div className="bg-transparent flex shrink-0 h-[20px]" />
      </div>
      </aside>

      {/* Add Company Modal */}
      <AddEditCompanyModal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
      />
    </>
  );
};
