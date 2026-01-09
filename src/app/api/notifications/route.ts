import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserFromToken } from '@/lib/auth';
import { getUserNotifications, getUnreadNotificationCount } from '@/lib/notifications';

// GET - Get user notifications
export async function GET(request: Request) {
  try {
    // First try NextAuth session
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Fallback to JWT token
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                    (request as any).cookies?.get?.('auth-token')?.value;
      
      if (token) {
        const user = await getUserFromToken(token);
        if (user) {
          userId = user.id;
        }
      }
    }

    if (!userId) {
      // Return empty notifications instead of 401 to avoid console spam
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(userId, limit),
      getUnreadNotificationCount(userId),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty instead of error to avoid console spam
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
    });
  }
}
