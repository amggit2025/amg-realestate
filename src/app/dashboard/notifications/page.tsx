'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=100');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setFilteredNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      logger.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications
  useEffect(() => {
    let filtered = [...notifications];

    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.isRead);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [filter, searchQuery, notifications]);

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
      logger.error('Error marking notification as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
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
      logger.error('Error deleting notification:', error);
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
      logger.error('Error marking all as read:', error);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) return;
    
    try {
      await fetch('/api/notifications/clear', {
        method: 'DELETE',
      });
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      logger.error('Error clearing notifications:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Get notification icon and color based on type
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'PROPERTY_APPROVED':
        return { emoji: '✅', color: 'from-green-100 to-emerald-100', border: 'border-green-500' };
      case 'PROPERTY_REJECTED':
        return { emoji: '❌', color: 'from-red-100 to-rose-100', border: 'border-red-500' };
      case 'PROPERTY_PENDING_REVIEW':
        return { emoji: '⏳', color: 'from-yellow-100 to-amber-100', border: 'border-yellow-500' };
      case 'NEW_INQUIRY':
        return { emoji: '💬', color: 'from-blue-100 to-cyan-100', border: 'border-blue-500' };
      case 'PROPERTY_SOLD':
        return { emoji: '🎉', color: 'from-purple-100 to-pink-100', border: 'border-purple-500' };
      case 'SUBSCRIPTION_EXPIRING':
        return { emoji: '⚠️', color: 'from-orange-100 to-red-100', border: 'border-orange-500' };
      case 'NEW_MESSAGE':
        return { emoji: '📧', color: 'from-indigo-100 to-blue-100', border: 'border-indigo-500' };
      default:
        return { emoji: '🔔', color: 'from-gray-100 to-slate-100', border: 'border-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-36 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BellIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">الإشعارات</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount > 0 ? (
                    <span className="text-blue-600 font-semibold">
                      لديك {unreadCount} إشعار غير مقروء
                    </span>
                  ) : (
                    'لا توجد إشعارات جديدة'
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm font-medium"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">قراءة الكل</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md text-sm font-medium"
                >
                  <TrashIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">حذف الكل</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                الكل ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                غير مقروء ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'read'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                مقروء ({notifications.length - unreadCount})
              </button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الإشعارات..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-600">
              {searchQuery ? 'لم يتم العثور على نتائج للبحث' : 'ستظهر إشعاراتك هنا'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notification, index) => {
                const style = getNotificationStyle(notification.type);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden border-r-4 ${
                      !notification.isRead ? style.border : 'border-transparent'
                    }`}
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${style.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                            {style.emoji}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className={`text-base sm:text-lg font-bold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all flex-shrink-0"
                              title="حذف"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>

                          <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          {/* Property Info */}
                          {notification.property && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                              {notification.property.images[0] && (
                                <img
                                  src={notification.property.images[0].url}
                                  alt={notification.property.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <span className="text-sm font-medium text-gray-700">
                                {notification.property.title}
                              </span>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                  locale: ar,
                                })}
                              </span>
                              <span className="text-xs text-gray-400">
                                {format(new Date(notification.createdAt), 'dd MMM yyyy', { locale: ar })}
                              </span>
                            </div>

                            {!notification.isRead && (
                              <span className="inline-flex items-center text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-blue-600 rounded-full ml-1.5 animate-pulse"></span>
                                جديد
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
