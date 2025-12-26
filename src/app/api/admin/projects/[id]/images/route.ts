// ======================================================
// 🏗️ AMG Real Estate - Project Images API
// ======================================================
// إدارة صور المشاريع منفصلة

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteImageFromCloudinary } from '@/lib/cloudinary-helper'

// إضافة صورة جديدة للمشروع
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { imageUrl, publicId, alt } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'رابط الصورة مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من وجود المشروع
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    // إضافة الصورة الجديدة مع publicId
    const imageData = {
      url: imageUrl,
      publicId: publicId || null,
      alt: alt || `${project.title} - صورة ${project.images.length + 1}`,
      isMain: project.images.length === 0,
      order: project.images.length,
      projectId: projectId
    }
    
    // @ts-ignore - publicId exists in schema
    const newImage = await prisma.projectImage.create({
      data: imageData
    })

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الصورة بنجاح',
      data: newImage
    })

  } catch (error) {
    console.error('Error adding project image:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في إضافة الصورة' },
      { status: 500 }
    )
  }
}

// حذف صورة من المشروع
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { imageId } = await request.json()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🗑️ DELETE /api/admin/projects/[id]/images')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Project ID:', projectId)
    console.log('Image ID:', imageId)

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: 'معرف الصورة مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من وجود الصورة
    const image: any = await prisma.projectImage.findUnique({
      where: { 
        id: imageId,
        projectId: projectId 
      }
    })

    if (!image) {
      console.error('❌ Image not found')
      return NextResponse.json(
        { success: false, message: 'الصورة غير موجودة' },
        { status: 404 }
      )
    }

    console.log('📸 Image details:')
    console.log('   - URL:', image.url)
    console.log('   - Public ID:', image.publicId || 'NOT SET')
    console.log('   - isMain:', image.isMain)

    // 🗑️ حذف الصورة من Cloudinary أولاً
    if (image.publicId) {
      console.log('☁️ Deleting from Cloudinary:', image.publicId)
      const deleted = await deleteImageFromCloudinary(image.publicId)
      if (deleted) {
        console.log('✅ Successfully deleted from Cloudinary')
      } else {
        console.warn('⚠️ Failed to delete from Cloudinary (continuing anyway)')
      }
    } else {
      console.warn('⚠️ No publicId found - cannot delete from Cloudinary')
      console.warn('   This image was likely uploaded without storing publicId')
    }

    // حذف الصورة من قاعدة البيانات
    console.log('💾 Deleting from database...')
    await prisma.projectImage.delete({
      where: { id: imageId }
    })
    console.log('✅ Deleted from database')

    // If this was the main image, update project mainImage
    if (image.isMain) {
      console.log('⚠️ This was the main image - updating project...')
      const remainingImages = await prisma.projectImage.findFirst({
        where: { projectId: projectId },
        orderBy: { order: 'asc' }
      })

      await prisma.project.update({
        where: { id: projectId },
        data: { mainImage: remainingImages?.url || null }
      })
      console.log('✅ Project mainImage updated to:', remainingImages?.url || 'null')
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Image deletion completed')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return NextResponse.json({
      success: true,
      message: image.publicId 
        ? 'تم حذف الصورة بنجاح من قاعدة البيانات و Cloudinary'
        : 'تم حذف الصورة من قاعدة البيانات (لم يكن لها publicId على Cloudinary)',
      deletedFromCloudinary: !!image.publicId
    })

  } catch (error: any) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('💥 Image deletion error')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('Error:', error?.message)
    console.error('Stack:', error?.stack)
    
    return NextResponse.json(
      { success: false, message: `خطأ في حذف الصورة: ${error?.message}` },
      { status: 500 }
    )
  }
}
