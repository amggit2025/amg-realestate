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
      return NextResponse.json(
        { success: false, message: 'الصورة غير موجودة' },
        { status: 404 }
      )
    }

    // 🗑️ حذف الصورة من Cloudinary أولاً
    if (image.publicId) {
      await deleteImageFromCloudinary(image.publicId)
      console.log('🗑️ تم حذف الصورة من Cloudinary:', image.publicId)
    }

    // حذف الصورة من قاعدة البيانات
    await prisma.projectImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصورة بنجاح من قاعدة البيانات و Cloudinary'
    })

  } catch (error) {
    console.error('Error deleting project image:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في حذف الصورة' },
      { status: 500 }
    )
  }
}
