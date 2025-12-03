import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // التحقق من المصادقة (سوبر أدمن فقط)
    const { isValid, admin } = await verifyAdminToken(req)
    if (!isValid || !admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'هذه العملية متاحة للسوبر أدمن فقط' },
        { status: 403 }
      )
    }

    // جلب جميع البيانات من كل الجداول (32 جدول)
    const [
      users,
      properties,
      propertyImages,
      projects,
      projectImages,
      portfolioItems,
      portfolioImages,
      inquiries,
      favorites,
      admins,
      adminActivities,
      adminSessions,
      listingCategories,
      listingFavorites,
      listingImages,
      listingStats,
      listingVideos,
      listings,
      messages,
      reports,
      reviews,
      userActivities,
      services,
      heroStats,
      testimonialStats,
      testimonials,
      footerInfo,
      portfolioStats,
      aboutPage,
      teamMembers,
      socialLinks,
      newsletterSubscriptions,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.property.findMany(),
      prisma.propertyImage.findMany(),
      prisma.project.findMany(),
      prisma.projectImage.findMany(),
      prisma.portfolioItem.findMany(),
      prisma.portfolioImage.findMany(),
      prisma.inquiry.findMany(),
      prisma.favorite.findMany(),
      prisma.admin.findMany(),
      (prisma as any).adminActivity?.findMany() || [],
      (prisma as any).adminSession?.findMany() || [],
      prisma.listing_categories.findMany(),
      prisma.listing_favorites.findMany(),
      prisma.listing_images.findMany(),
      prisma.listing_stats.findMany(),
      prisma.listing_videos.findMany(),
      prisma.listings.findMany(),
      prisma.messages.findMany(),
      prisma.reports.findMany(),
      prisma.reviews.findMany(),
      prisma.userActivity.findMany(),
      prisma.service.findMany(),
      prisma.heroStats.findMany(),
      prisma.testimonialStats.findMany(),
      prisma.testimonial.findMany(),
      prisma.footerInfo.findMany(),
      prisma.portfolioStats.findMany(),
      prisma.aboutPage.findMany(),
      prisma.teamMember.findMany(),
      prisma.socialLinks.findMany(),
      prisma.newsletterSubscription.findMany(),
    ])

    // تحويل البيانات إلى JSON منسق
    const backup = {
      exportDate: new Date().toISOString(),
      exportedBy: {
        id: admin.id,
        username: admin.username,
      },
      database: 'amg_real_estate',
      version: '2.0 - Full Database Export',
      totalTables: 32,
      tables: {
        // 👥 المستخدمين والإدارة
        users: { count: users.length, data: users },
        admins: { count: admins.length, data: admins },
        adminActivities: { count: adminActivities.length, data: adminActivities },
        adminSessions: { count: adminSessions.length, data: adminSessions },
        userActivities: { count: userActivities.length, data: userActivities },
        
        // 🏠 العقارات
        properties: { count: properties.length, data: properties },
        propertyImages: { count: propertyImages.length, data: propertyImages },
        
        // 🏗️ المشاريع
        projects: { count: projects.length, data: projects },
        projectImages: { count: projectImages.length, data: projectImages },
        
        // 💼 معرض الأعمال
        portfolioItems: { count: portfolioItems.length, data: portfolioItems },
        portfolioImages: { count: portfolioImages.length, data: portfolioImages },
        portfolioStats: { count: portfolioStats.length, data: portfolioStats },
        
        // 📋 نظام الإعلانات
        listingCategories: { count: listingCategories.length, data: listingCategories },
        listings: { count: listings.length, data: listings },
        listingImages: { count: listingImages.length, data: listingImages },
        listingVideos: { count: listingVideos.length, data: listingVideos },
        listingFavorites: { count: listingFavorites.length, data: listingFavorites },
        listingStats: { count: listingStats.length, data: listingStats },
        
        // 💬 التفاعلات
        inquiries: { count: inquiries.length, data: inquiries },
        favorites: { count: favorites.length, data: favorites },
        messages: { count: messages.length, data: messages },
        reports: { count: reports.length, data: reports },
        reviews: { count: reviews.length, data: reviews },
        
        // 🛠️ الخدمات
        services: { count: services.length, data: services },
        
        // 🎨 إدارة المحتوى
        testimonials: { count: testimonials.length, data: testimonials },
        testimonialStats: { count: testimonialStats.length, data: testimonialStats },
        heroStats: { count: heroStats.length, data: heroStats },
        footerInfo: { count: footerInfo.length, data: footerInfo },
        aboutPage: { count: aboutPage.length, data: aboutPage },
        teamMembers: { count: teamMembers.length, data: teamMembers },
        socialLinks: { count: socialLinks.length, data: socialLinks },
        
        // 📧 التسويق
        newsletterSubscriptions: { count: newsletterSubscriptions.length, data: newsletterSubscriptions },
      },
      totalRecords: 
        users.length +
        properties.length +
        propertyImages.length +
        projects.length +
        projectImages.length +
        portfolioItems.length +
        portfolioImages.length +
        inquiries.length +
        favorites.length +
        admins.length +
        adminActivities.length +
        adminSessions.length +
        listingCategories.length +
        listingFavorites.length +
        listingImages.length +
        listingStats.length +
        listingVideos.length +
        listings.length +
        messages.length +
        reports.length +
        reviews.length +
        userActivities.length +
        services.length +
        heroStats.length +
        testimonialStats.length +
        testimonials.length +
        footerInfo.length +
        portfolioStats.length +
        aboutPage.length +
        teamMembers.length +
        socialLinks.length +
        newsletterSubscriptions.length,
    }

    // إنشاء اسم الملف
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `amg_real_estate_backup_${timestamp}.json`

    // إرجاع الملف كاستجابة
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Error exporting database (JSON):', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء تصدير قاعدة البيانات',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
