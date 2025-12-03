// ======================================================
// 📊 AMG Real Estate - Admin Activity Logger
// ======================================================
import prisma from './db';

export interface ActivityData {
  adminId: string;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'VIEW';
  targetType?: 'USER' | 'PROPERTY' | 'PROJECT' | 'SERVICE' | 'INQUIRY' | 'ADMIN' | 'PORTFOLIO' | 'TESTIMONIAL' | 'OTHER';
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * تسجيل نشاط المشرف في قاعدة البيانات
 */
export async function logAdminActivity(data: ActivityData): Promise<void> {
  try {
    await (prisma as any).adminActivity.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        targetType: data.targetType || null,
        targetId: data.targetId || null,
        details: data.details || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
    
    console.log(`✅ Activity logged: ${data.action} by admin ${data.adminId}`);
  } catch (error) {
    console.error('❌ Error logging admin activity:', error);
    // لا نوقف العملية في حالة فشل التسجيل
  }
}

/**
 * الحصول على IP من الطلب
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * الحصول على User Agent من الطلب
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * تحليل User Agent للحصول على معلومات الجهاز
 */
export function parseUserAgent(userAgent: string): {
  device: string;
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();
  
  // تحديد نوع الجهاز
  let device = 'Desktop';
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    device = 'Mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    device = 'Tablet';
  }
  
  // تحديد المتصفح
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // تحديد نظام التشغيل
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'MacOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { device, browser, os };
}

/**
 * إنشاء جلسة جديدة للمشرف
 */
export async function createAdminSession(
  adminId: string,
  token: string,
  request: Request,
  expiresInDays: number = 7
): Promise<void> {
  try {
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    const { device, browser, os } = parseUserAgent(userAgent);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    await (prisma as any).adminSession.create({
      data: {
        adminId,
        token,
        ipAddress,
        userAgent,
        device,
        browser,
        os,
        isActive: true,
        expiresAt,
      },
    });
    
    console.log(`✅ Session created for admin ${adminId}`);
  } catch (error) {
    console.error('❌ Error creating admin session:', error);
  }
}

/**
 * تحديث آخر نشاط في الجلسة
 */
export async function updateSessionActivity(token: string): Promise<void> {
  try {
    await (prisma as any).adminSession.updateMany({
      where: { token, isActive: true },
      data: { lastActivity: new Date() },
    });
  } catch (error) {
    console.error('❌ Error updating session activity:', error);
  }
}

/**
 * إنهاء جلسة
 */
export async function terminateSession(token: string): Promise<void> {
  try {
    await (prisma as any).adminSession.updateMany({
      where: { token },
      data: { isActive: false },
    });
    
    console.log(`✅ Session terminated`);
  } catch (error) {
    console.error('❌ Error terminating session:', error);
  }
}

/**
 * إنهاء جميع جلسات المشرف
 */
export async function terminateAllAdminSessions(adminId: string): Promise<void> {
  try {
    await (prisma as any).adminSession.updateMany({
      where: { adminId },
      data: { isActive: false },
    });
    
    console.log(`✅ All sessions terminated for admin ${adminId}`);
  } catch (error) {
    console.error('❌ Error terminating admin sessions:', error);
  }
}

/**
 * تنظيف الجلسات المنتهية
 */
export async function cleanExpiredSessions(): Promise<void> {
  try {
    const result = await (prisma as any).adminSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isActive: false, lastActivity: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // 30 days old
        ],
      },
    });
    
    console.log(`✅ Cleaned ${result.count} expired sessions`);
  } catch (error) {
    console.error('❌ Error cleaning expired sessions:', error);
  }
}
