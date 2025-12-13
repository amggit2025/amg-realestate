import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { deleteAllUserNotifications } from '@/lib/notifications';

// DELETE - Delete all notifications
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    await deleteAllUserNotifications(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الإشعارات' },
      { status: 500 }
    );
  }
}
