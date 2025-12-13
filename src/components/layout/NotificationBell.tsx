'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    images: { url: string }[];
  };
}

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      });
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      
      const notification = notifications.find(n => n.id === id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (notification && !notification.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      await fetch('/api/notifications/clear', {
        method: 'DELETE',
      });
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    
    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Get notification icon based on type
  const getNotificationEmoji = (type: string) => {
    switch (type) {
      case 'PROPERTY_APPROVED':
        return '✅';
      case 'PROPERTY_REJECTED':
        return '❌';
      case 'PROPERTY_PENDING_REVIEW':
        return '⏳';
      case 'NEW_INQUIRY':
        return '💬';
      case 'PROPERTY_SOLD':
        return '🎉';
      case 'SUBSCRIPTION_EXPIRING':
        return '⚠️';
      case 'NEW_MESSAGE':
        return '📧';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
        aria-label="الإشعارات"
      >
        <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Notifications Panel */}
          <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BellIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">الإشعارات</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                    title="تحديد الكل كمقروء"
                  >
                    <CheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">قراءة الكل</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                    title="حذف الكل"
                  >
                    <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">جاري التحميل...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>لا توجد إشعارات</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 border-r-4 ${
                        !notification.isRead 
                          ? 'bg-blue-50/50 border-blue-500' 
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xl shadow-sm">
                            {getNotificationEmoji(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-bold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => deleteNotification(notification.id, e)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all flex-shrink-0"
                              title="حذف"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ar,
                              })}
                            </p>
                            {!notification.isRead && (
                              <span className="inline-flex items-center text-xs text-blue-600 font-semibold">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-1 animate-pulse"></span>
                                جديد
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <button
                  onClick={() => {
                    router.push('/dashboard/notifications');
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>عرض جميع الإشعارات</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
