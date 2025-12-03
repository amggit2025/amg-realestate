import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'لم يتم تحديد ملف' 
      })
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        message: 'يجب أن يكون الملف صورة' 
      })
    }

    // التحقق من حجم الملف (10MB max لـ Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        message: 'حجم الصورة يجب أن يكون أقل من 10 ميجابايت' 
      })
    }

    // تحويل الملف إلى base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // إنشاء اسم ملف فريد
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const publicId = `amg-realestate/${type}/${timestamp}-${randomString}`

    // رفع الصورة إلى Cloudinary بأعلى جودة
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      public_id: publicId,
      folder: `amg-realestate/${type}`,
      // إعدادات محسّنة للجودة العالية
      quality: 'auto:best', // أعلى جودة تلقائية
      fetch_format: 'auto', // اختيار أفضل تنسيق تلقائياً
      // لا نعمل resize إلا إذا كانت الصورة أكبر من 4K
      transformation: type === 'hero' ? [
        { width: 2560, height: 1440, crop: 'limit', quality: 95 }, // Full HD+ للـ Hero
      ] : [
        { width: 1920, height: 1280, crop: 'limit', quality: 90 }, // للصور العادية
      ],
      tags: [`amg-${type}`, 'portfolio', 'website']
    })

    // إنشاء صورة مصغرة إضافية للمعاينة
    const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
      width: 400,
      height: 300,
      crop: 'fill',
      quality: 'auto:good',
      format: 'auto'
    })

    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url,
      thumbnailUrl: thumbnailUrl,
      publicId: uploadResult.public_id,
      fileName: file.name,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      message: 'تم رفع الصورة بنجاح إلى Cloudinary'
    })

  } catch (error) {
    console.error('خطأ في رفع الصورة إلى Cloudinary:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ أثناء رفع الصورة إلى Cloudinary'
    })
  }
}