import { NextRequest, NextResponse } from 'next/server'
import { deleteImageFromCloudinary, deleteMultipleImagesFromCloudinary } from '@/lib/cloudinary-helper'

/**
 * DELETE API - حذف صورة أو عدة صور من Cloudinary
 * يستخدم لحذف الصور القديمة عند رفع صور جديدة أو عند الحذف النهائي
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { publicId, publicIds } = body

    // حذف صورة واحدة
    if (publicId) {
      const success = await deleteImageFromCloudinary(publicId)
      
      return NextResponse.json({ 
        success, 
        message: success ? 'تم حذف الصورة بنجاح من Cloudinary' : 'فشل حذف الصورة من Cloudinary'
      })
    }
    
    // حذف عدة صور
    if (publicIds && Array.isArray(publicIds)) {
      const deletedCount = await deleteMultipleImagesFromCloudinary(publicIds)
      
      return NextResponse.json({ 
        success: deletedCount > 0, 
        deletedCount,
        message: `تم حذف ${deletedCount} من ${publicIds.length} صورة من Cloudinary`
      })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'لم يتم تحديد معرف الصورة أو الصور' 
    })

  } catch (error: any) {
    console.error('خطأ في حذف الصورة من Cloudinary:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'حدث خطأ أثناء حذف الصورة من Cloudinary'
    })
  }
}
