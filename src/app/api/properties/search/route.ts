import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const purpose = searchParams.get('purpose')
    
    const where: any = {
      status: 'APPROVED',
    }

    // Search query
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { district: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Filters
    if (type) {
      where.propertyType = type
    }

    if (city) {
      where.city = city
    }

    if (purpose) {
      where.purpose = purpose
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) }
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms)
    }

    const properties = await prisma.listings.findMany({
      where,
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      properties,
      count: properties.length,
    })
  } catch (error) {
    console.error('Error searching properties:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to search properties' },
      { status: 500 }
    )
  }
}
