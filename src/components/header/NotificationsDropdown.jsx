import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bell, RefreshCw, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkMultipleAsRead } from '../../hooks/api/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

const TABS = [
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'all', label: 'All' },
];

const PER_PAGE = 10;

export const NotificationsDropdown = ({ 
  showNotifications, 
  setShowNotifications, 
  notificationsRef,
}) => {
  const [activeTab, setActiveTab] = useState('unread');
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]);
  const scrollContainerRef = useRef(null);
  const queryClient = useQueryClient();
  
  const { data, isLoading, isFetching } = useNotifications(activeTab, page, PER_PAGE);
  const markAsRead = useMarkAsRead();
  const markMultipleAsRead = useMarkMultipleAsRead();

  const notifications = data?.notifications || [];
  const pagination = data?.pagination || {};
  const hasMore = pagination.page < pagination.total_pages;

  // Reset when tab changes
  useEffect(() => {
    setPage(1);
    setAllNotifications([]);
  }, [activeTab]);

  // Append new notifications when data changes
  useEffect(() => {
    if (notifications.length > 0) {
      if (page === 1) {
        setAllNotifications(notifications);
      } else {
        setAllNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const newNotifications = notifications.filter(n => !existingIds.has(n.id));
          return [...prev, ...newNotifications];
        });
      }
    } else if (page === 1) {
      setAllNotifications([]);
    }
  }, [notifications]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoading || isFetching || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollThreshold = 50;
    
    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, isFetching, hasMore]);

  const handleRefresh = () => {
    setPage(1);
    setAllNotifications([]);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    markAsRead.mutate(notificationId, {
      onSuccess: () => {
        // Remove from list if on unread tab
        if (activeTab === 'unread') {
          setAllNotifications(prev => prev.filter(n => parseInt(n.id) !== notificationId));
        } else {
          // Update status in list
          setAllNotifications(prev => prev.map(n => 
            parseInt(n.id) === notificationId ? { ...n, status: '1' } : n
          ));
        }
      }
    });
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = allNotifications
      .filter(n => n.status === '0')
      .map(n => parseInt(n.id));
    if (unreadIds.length > 0) {
      markMultipleAsRead.mutate(unreadIds, {
        onSuccess: () => {
          if (activeTab === 'unread') {
            setAllNotifications([]);
          } else {
            setAllNotifications(prev => prev.map(n => ({ ...n, status: '1' })));
          }
        }
      });
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  // Count unread in current list
  const unreadCount = activeTab === 'unread' ? (pagination.total || 0) : allNotifications.filter(n => n.status === '0').length;

  return (
    <div className="relative" ref={notificationsRef}>
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative group bg-white dark:bg-gray-800 shadow-md hover:shadow-xl p-3 md:p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#E60012]/30 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Bell className="w-5 h-5 md:w-5.5 md:h-5.5 text-[#848E9A] dark:text-gray-400 group-hover:text-[#E60012] transition-colors duration-300" />
        {unreadCount > 0 && activeTab === 'unread' && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 md:w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-700 z-[10000] animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-white dark:to-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-[#344251] dark:text-gray-100">Notifications</h3>
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Refresh notifications"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 dark:text-gray-400 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-[#E60012] shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-80 md:max-h-96 overflow-y-auto dropdown-scroll"
          >
            {isLoading && page === 1 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#E60012] animate-spin" />
              </div>
            ) : allNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No {activeTab} notifications</p>
              </div>
            ) : (
              <>
                {allNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                      notification.status === '0' ? 'bg-red-50/30 dark:bg-red-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.status === '0' && (
                        <div className="w-2 h-2 rounded-full bg-[#E60012] mt-2 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 leading-relaxed">
                          {notification.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {notification.plan_name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                              {notification.plan_name}
                            </span>
                          )}
                          {notification.activity_name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                              {notification.activity_name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTime(notification.creation_date)}
                          </p>
                          {notification.status === '0' && (
                            <button
                              onClick={(e) => handleMarkAsRead(parseInt(notification.id), e)}
                              disabled={markAsRead.isPending}
                              className="text-xs text-[#E60012] hover:text-[#B91C1C] font-medium flex items-center gap-1 disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading more indicator */}
                {isFetching && page > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-[#E60012] animate-spin" />
                  </div>
                )}
                
                {/* End of list */}
                {!hasMore && allNotifications.length > 0 && (
                  <div className="py-3 text-center text-xs text-gray-400 dark:text-gray-500">
                    No more notifications
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'unread' && allNotifications.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={handleMarkAllAsRead}
                disabled={markMultipleAsRead.isPending}
                className="w-full text-sm text-[#E60012] hover:text-[#B91C1C] font-semibold hover:underline transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                {markMultipleAsRead.isPending ? 'Marking...' : 'Mark all as read'}
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {pagination.total > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Showing {allNotifications.length} of {pagination.total} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
