import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importServices() {
  try {
    // قراءة الملف
    const servicesData = JSON.parse(
      fs.readFileSync('services-export.json', 'utf-8')
    );

    console.log(`📦 جاري استيراد ${servicesData.length} خدمة إلى Railway...\n`);

    for (const service of servicesData) {
      try {
        // حذف الحقول اللي مش محتاجينها
        const { id, createdAt, updatedAt, ...serviceData } = service;

        await prisma.service.upsert({
          where: { slug: service.slug },
          update: serviceData as any,
          create: serviceData as any
        });

        console.log(`✅ ${service.slug} - ${service.title}`);
      } catch (error: any) {
        console.log(`❌ ${service.slug}: ${error.message}`);
      }
    }

    console.log(`\n✅ تم استيراد الخدمات بنجاح إلى Railway! 🎉`);

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importServices();
