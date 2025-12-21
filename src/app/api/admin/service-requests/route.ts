import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminAuth = await verifyAdminToken(request)
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    // Fetch all service requests
    const requests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      requests
    })
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الطلبات' },
      { status: 500 }
    )
  }
}
