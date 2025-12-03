// Test API for portfolio
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await prisma.$connect()
    console.log('Testing portfolio connection...')
    
    const count = await prisma.portfolioItem.count()
    console.log('Portfolio count:', count)
    
    return NextResponse.json({
      success: true,
      count,
      message: 'Portfolio test successful'
    })
  } catch (error) {
    console.error('Portfolio test error:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}