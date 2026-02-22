import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen overflow-x-hidden transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main 
        className={`w-auto min-h-screen overflow-x-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[306px]'
        }`}
      >
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <div className="w-full bg-gray-50 dark:bg-gray-950 p-5 pt-24 transition-colors duration-300 min-h-[calc(100vh-96px)]">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};
