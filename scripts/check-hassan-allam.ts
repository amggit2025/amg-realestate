import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProject() {
  try {
    const project = await prisma.project.findFirst({
      where: { title: { contains: 'حسن علام' } },
      include: { images: true }
    });

    if (!project) {
      console.log('❌ مشروع حسن علام مش موجود');
      return;
    }

    console.log('📋 معلومات المشروع:');
    console.log('   - ID:', project.id);
    console.log('   - العنوان:', project.title);
    console.log('   - mainImage:', project.mainImage || '❌ فارغ');
    console.log('   - featured:', project.featured);
    console.log('   - published:', project.published);
    console.log('   - عدد الصور:', project.images.length);
    
    if (project.images.length > 0) {
      console.log('\n📸 الصور:');
      project.images.forEach((img, i) => {
        console.log(`   ${i + 1}. URL: ${img.url}`);
        console.log(`      publicId: ${img.publicId || '❌ مش موجود'}`);
        console.log(`      isMain: ${img.isMain}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProject();
