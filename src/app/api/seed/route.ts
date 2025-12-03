// ======================================================
// 🌱 AMG Real Estate - Database Seed API
// ======================================================
// API لإضافة بيانات تجريبية إلى قاعدة البيانات

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { UserType, PropertyType, PropertyPurpose, PropertyStatus, Currency } from '@prisma/client'

export async function POST() {
  try {
    console.log('🌱 Starting database seeding...')

    // إنشاء مستخدم تجريبي
    const testUser = await prisma.user.create({
      data: {
        email: 'test@amg-invest.com',
        firstName: 'أحمد',
        lastName: 'الملاح',
        phone: '+201000025080',
        password: 'hashed_password_here', // في التطبيق الحقيقي سنستخدم bcrypt
        userType: UserType.ADMIN,
        verified: true
      }
    })

    console.log('✅ Test user created:', testUser.id)

    // إنشاء عقار تجريبي
    const testProperty = await prisma.property.create({
      data: {
        title: 'شقة فاخرة في التجمع الخامس',
        description: 'شقة مميزة 200 متر في موقع حيوي بالتجمع الخامس، تشطيب سوبر لوكس',
        price: 4500000,
        currency: Currency.EGP,
        area: 200,
        bedrooms: 3,
        bathrooms: 2,
        parking: true,
        furnished: false,
        city: 'القاهرة الجديدة',
        district: 'التجمع الخامس',
        address: 'التجمع الخامس، بجوار الجامعة الأمريكية',
        propertyType: PropertyType.APARTMENT,
        purpose: PropertyPurpose.SALE,
        status: PropertyStatus.ACTIVE,
        features: JSON.stringify([
          'تكييف مركزي',
          'أمن وحراسة 24/7',
          'حديقة',
          'نادي صحي',
          'مصعد'
        ]),
        contactName: 'أحمد الملاح',
        contactPhone: '+201000025080',
        contactEmail: 'info@amg-invest.com',
        userId: testUser.id
      }
    })

    console.log('✅ Test property created:', testProperty.id)

    // إضافة صور للعقار
    const propertyImages = await prisma.propertyImage.createMany({
      data: [
        {
          url: '/images/projects/project-1-1.jpg',
          alt: 'صورة رئيسية للشقة',
          isMain: true,
          order: 1,
          propertyId: testProperty.id
        },
        {
          url: '/images/projects/project-1-2.jpg',
          alt: 'غرفة المعيشة',
          isMain: false,
          order: 2,
          propertyId: testProperty.id
        },
        {
          url: '/images/projects/project-1-3.jpg',
          alt: 'المطبخ',
          isMain: false,
          order: 3,
          propertyId: testProperty.id
        }
      ]
    })

    console.log('✅ Property images created:', propertyImages.count)

    // إنشاء مشروع تجريبي
    const testProject = await prisma.project.create({
      data: {
        title: 'مشروع الكمبوند الذكي - العاصمة الإدارية',
        description: 'مشروع سكني متكامل في العاصمة الإدارية الجديدة يضم وحدات سكنية وتجارية',
        location: 'العاصمة الإدارية الجديدة',
        developer: 'AMG Real Estate',
        projectType: 'RESIDENTIAL',
        status: 'UNDER_CONSTRUCTION',
        totalUnits: 500,
        availableUnits: 200,
        minPrice: 2000000,
        maxPrice: 8000000,
        currency: Currency.EGP,
        deliveryDate: new Date('2025-12-31'),
        features: JSON.stringify([
          'مول تجاري',
          'حمام سباحة',
          'نادي صحي',
          'مناطق خضراء',
          'أمن وحراسة 24/7',
          'تصميم معماري عصري',
          'أنظمة ذكية',
          'مواقف سيارات',
          'مصاعد عالية الجودة'
        ]),
        contactName: 'أحمد الملاح',
        contactPhone: '+201000025080',
        contactEmail: 'projects@amg-invest.com'
      }
    })

    console.log('✅ Test project created:', testProject.id)

    // إضافة استفسار تجريبي
    const testInquiry = await prisma.inquiry.create({
      data: {
        name: 'محمد علي',
        email: 'mohamed.ali@example.com',
        phone: '+201111111111',
        subject: 'استفسار عن شقة في التجمع الخامس',
        message: 'أريد المزيد من المعلومات عن الشقة المعروضة في التجمع الخامس',
        inquiryType: 'PROPERTY',
        status: 'PENDING',
        userId: testUser.id,
        propertyId: testProperty.id
      }
    })

    console.log('✅ Test inquiry created:', testInquiry.id)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully! 🌱',
      data: {
        user: testUser.id,
        property: testProperty.id,
        project: testProject.id,
        inquiry: testInquiry.id,
        images: propertyImages.count
      }
    })

  } catch (error) {
    console.error('❌ Seeding error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database seeding failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
