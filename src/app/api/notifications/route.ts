import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getUserNotifications, getUnreadNotificationCount } from '@/lib/notifications';

// GET - Get user notifications
export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  (request as any).cookies?.get?.('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(user.id, limit),
      getUnreadNotificationCount(user.id),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإشعارات' },
      { status: 500 }
    );
  }
}
