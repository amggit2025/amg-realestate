import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMainImages() {
  try {
    // جلب كل المشاريع اللي mainImage فيها فارغ بس عندها صور
    const projects = await prisma.project.findMany({
      where: {
        mainImage: null
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    });

    console.log(`📋 وجدت ${projects.length} مشروع بدون mainImage`);

    for (const project of projects) {
      if (project.images.length > 0) {
        const firstImage = project.images[0];
        await prisma.project.update({
          where: { id: project.id },
          data: { mainImage: firstImage.url }
        });
        console.log(`✅ ${project.title} - تم تحديث mainImage`);
      } else {
        console.log(`⚠️ ${project.title} - لا يوجد صور`);
      }
    }

    console.log('\n🎉 تم الانتهاء!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMainImages();
