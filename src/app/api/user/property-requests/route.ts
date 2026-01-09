import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, data: [], error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }
    
    const user = authResult.user

    // Fetch all property requests for this user using Prisma (safer than raw query)
    try {
      const rawRequests = await prisma.propertyListingRequest.findMany({
        where: {
          OR: [
            { submittedBy: user.id },
            { ownerEmail: user.email }
          ]
        },
        orderBy: { createdAt: 'desc' }
      })

      // Parse JSON fields (images and features)
      const requests = rawRequests.map((req: any) => ({
        ...req,
        images: typeof req.images === 'string' ? JSON.parse(req.images) : (req.images || []),
        features: typeof req.features === 'string' ? JSON.parse(req.features as string) : (req.features || [])
      }))

      return NextResponse.json({
        success: true,
        data: requests,
      })
    } catch (dbError) {
      // If table doesn't exist or query fails, return empty array
      console.error('Database query error:', dbError)
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

  } catch (error) {
    console.error('Error fetching property requests:', error)
    return NextResponse.json(
      { 
        success: false,
        data: [],
        error: 'حدث خطأ أثناء جلب الطلبات'
      },
      { status: 500 }
    )
  }
}
