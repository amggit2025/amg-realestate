import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ProjectType, ProjectStatus, Currency } from '@prisma/client'

export async function GET() {
  try {
    await prisma.$connect()
    
    // إنشاء بيانات تجريبية للمشاريع المميزة
    const projectsData = [
      {
        title: 'كمبوند النرجس الجديدة',
        description: 'كمبوند سكني راقي في قلب العاصمة الإدارية الجديدة',
        location: 'العاصمة الإدارية الجديدة',
        developer: 'AMG للتطوير العقاري',
        projectType: ProjectType.RESIDENTIAL,
        mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        contactName: 'أحمد محمد',
        contactPhone: '01234567890',
        contactEmail: 'projects@amgrealestate.com',
        featured: true,
        published: true
      },
      {
        title: 'برج الماسة التجاري',
        description: 'برج تجاري وإداري متميز في منطقة التجمع الخامس',
        location: 'التجمع الخامس',
        developer: 'AMG للتطوير العقاري',
        projectType: ProjectType.COMMERCIAL,
        mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        contactName: 'سارة أحمد',
        contactPhone: '01098765432',
        contactEmail: 'commercial@amgrealestate.com',
        featured: true,
        published: true
      },
      {
        title: 'فيلات الريحان',
        description: 'مجموعة فيلات فاخرة في الشيخ زايد مع حدائق خاصة ومسابح',
        location: 'الشيخ زايد',
        developer: 'AMG للتطوير العقاري',
        projectType: ProjectType.RESIDENTIAL,
        mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        contactName: 'محمد علي',
        contactPhone: '01156789012',
        contactEmail: 'villas@amgrealestate.com',
        featured: true,
        published: true
      }
    ]
    
    // إدراج البيانات
    const createdProjects = []
    for (const project of projectsData) {
      const created = await prisma.project.create({ data: project })
      createdProjects.push(created)
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المشاريع المميزة بنجاح',
      created: createdProjects.length,
      projects: createdProjects
    })
    
  } catch (error) {
    console.error('Error creating projects data:', error)
    return NextResponse.json({
      success: false,
      message: 'خطأ في إنشاء المشاريع',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}