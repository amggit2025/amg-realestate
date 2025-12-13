import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { markAllNotificationsAsRead } from '@/lib/notifications';

// POST - Mark all notifications as read
export async function POST(request: Request) {
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

    await markAllNotificationsAsRead(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الإشعارات' },
      { status: 500 }
    );
  }
}
