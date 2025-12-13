import prisma from '@/lib/db';
import { sendPushNotification } from './firebase-admin';

export type NotificationType =
  | 'PROPERTY_APPROVED'
  | 'PROPERTY_REJECTED'
  | 'PROPERTY_PENDING_REVIEW'
  | 'NEW_INQUIRY'
  | 'PROPERTY_SOLD'
  | 'SUBSCRIPTION_EXPIRING'
  | 'NEW_MESSAGE'
  | 'PROPERTY_UPDATED'
  | 'ADMIN_MESSAGE';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  propertyId?: string;
}

// Create notification in database
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        propertyId: params.propertyId,
      },
    });

    // TODO: Send push notification if user has FCM token
    // This will be implemented when we add FCM token storage
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

// Get user notifications
export async function getUserNotifications(userId: string, limit = 20) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              select: { url: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// Mark all user notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

// Delete notification
export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}

// Delete all user notifications
export async function deleteAllUserNotifications(userId: string) {
  try {
    await prisma.notification.deleteMany({
      where: { userId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return false;
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

// Helper functions for specific notification types

export async function notifyPropertyApproved(userId: string, propertyId: string, propertyTitle: string) {
  return createNotification({
    userId,
    type: 'PROPERTY_APPROVED',
    title: '✅ تم قبول عقارك',
    message: `تم قبول عقار "${propertyTitle}" وهو الآن متاح للعرض على الموقع`,
    link: `/listings/${propertyId}`,
    propertyId,
  });
}

export async function notifyPropertyRejected(
  userId: string,
  propertyId: string,
  propertyTitle: string,
  reason?: string
) {
  return createNotification({
    userId,
    type: 'PROPERTY_REJECTED',
    title: '❌ تم رفض عقارك',
    message: reason 
      ? `تم رفض عقار "${propertyTitle}". السبب: ${reason}`
      : `تم رفض عقار "${propertyTitle}". يمكنك تعديله والمحاولة مرة أخرى`,
    link: `/dashboard/properties`,
    propertyId,
  });
}

export async function notifyPropertyPendingReview(userId: string, propertyId: string, propertyTitle: string) {
  return createNotification({
    userId,
    type: 'PROPERTY_PENDING_REVIEW',
    title: '⏳ عقارك قيد المراجعة',
    message: `تم استلام عقار "${propertyTitle}" وهو الآن قيد المراجعة من قبل الإدارة`,
    link: `/dashboard/properties`,
    propertyId,
  });
}

export async function notifyNewInquiry(userId: string, propertyId: string, propertyTitle: string) {
  return createNotification({
    userId,
    type: 'NEW_INQUIRY',
    title: '💬 استفسار جديد',
    message: `لديك استفسار جديد على عقار "${propertyTitle}"`,
    link: `/dashboard/inquiries`,
    propertyId,
  });
}

export async function notifyPropertySold(userId: string, propertyId: string, propertyTitle: string) {
  return createNotification({
    userId,
    type: 'PROPERTY_SOLD',
    title: '🎉 تم بيع عقارك',
    message: `تم تحديث حالة عقار "${propertyTitle}" إلى "تم البيع"`,
    link: `/listings/${propertyId}`,
    propertyId,
  });
}

export async function notifySubscriptionExpiring(userId: string, daysLeft: number) {
  return createNotification({
    userId,
    type: 'SUBSCRIPTION_EXPIRING',
    title: '⚠️ اشتراكك ينتهي قريباً',
    message: `اشتراكك سينتهي خلال ${daysLeft} أيام. قم بتجديد اشتراكك للاستمرار في استخدام الخدمة`,
    link: `/dashboard/subscription`,
  });
}
