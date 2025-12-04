// @ts-nocheck
import { PrismaClient } from '@prisma/client';

// Local database
const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root:Mysql2025%40@localhost:3306/amg_real_estate'
    }
  }
});

// Railway database
const prismaRailway = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root:RiQGehslYCNRilpFqFzIRoxiJaLXnOQX@nozomi.proxy.rlwy.net:16757/railway'
    }
  }
});

async function migrateAllData() {
  try {
    console.log('🚀 بدء نقل البيانات من Local إلى Railway...\n');

    // 1. نقل الخدمات (Services)
    console.log('📦 1. نقل الخدمات...');
    const services = await prismaLocal.service.findMany();
    
    for (const service of services) {
      try {
        // @ts-ignore
        await prismaRailway.service.upsert({
          where: { slug: service.slug },
          update: {
            title: service.title,
            description: service.description,
            heroImage: service.heroImage,
            heroImagePublicId: service.heroImagePublicId,
            cardImage: service.cardImage,
            cardImagePublicId: service.cardImagePublicId,
            features: service.features,
            benefits: service.benefits,
            processSteps: service.processSteps,
            faq: service.faq,
            active: service.active,
            featured: service.featured,
            order: service.order,
            titleAr: service.titleAr,
            descriptionAr: service.descriptionAr
          },
          create: {
            slug: service.slug,
            title: service.title,
            description: service.description,
            heroImage: service.heroImage,
            heroImagePublicId: service.heroImagePublicId,
            cardImage: service.cardImage,
            cardImagePublicId: service.cardImagePublicId,
            features: service.features,
            benefits: service.benefits,
            processSteps: service.processSteps,
            faq: service.faq,
            active: service.active,
            featured: service.featured,
            order: service.order,
            titleAr: service.titleAr,
            descriptionAr: service.descriptionAr
          }
        });
        console.log(`   ✅ ${service.slug}`);
      } catch (error: any) {
        console.log(`   ❌ ${service.slug}: ${error.message}`);
      }
    }
    console.log(`   ✅ تم نقل ${services.length} خدمة\n`);

    console.log('✅ اكتمل نقل الخدمات بنجاح! 🎉');

  } catch (error) {
    console.error('❌ خطأ في النقل:', error);
  } finally {
    await prismaLocal.$disconnect();
    await prismaRailway.$disconnect();
  }
}

migrateAllData();
