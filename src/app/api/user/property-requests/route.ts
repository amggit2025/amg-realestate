import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }
    
    const user = authResult.user

    console.log(`🔍 Fetching property requests for user ${user.id} (${user.email})`)

    // Fetch all property requests for this user (by submittedBy or email fallback)
    // Using raw query to avoid Prisma type issues with submittedBy field
    const rawRequests = await prisma.$queryRaw`
      SELECT * FROM property_listing_requests 
      WHERE submittedBy = ${user.id} OR ownerEmail = ${user.email}
      ORDER BY createdAt DESC
    ` as any[]

    console.log(`✅ Found ${rawRequests.length} property requests for user ${user.id}`)

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

  } catch (error) {
    console.error('Error fetching property requests:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء جلب الطلبات',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
