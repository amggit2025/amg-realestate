import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'لم يتم رفع ملف' 
      })
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG, PNG أو WebP'
      })
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت'
      })
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary using Cloudinary SDK with signed upload
    const cloudinary = require('cloudinary').v2

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Upload with signed request (no preset needed)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'amg-projects',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' }, // حد أقصى للدقة
            { quality: 'auto:good' }, // جودة تلقائية
            { fetch_format: 'auto' } // تحويل تلقائي للصيغة المناسبة
          ]
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصورة بنجاح على Cloudinary',
      data: {
        url: (result as any).secure_url,
        public_id: (result as any).public_id,
        original_filename: file.name,
        width: (result as any).width,
        height: (result as any).height,
        format: (result as any).format
      }
    })

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطأ في رفع الصورة'
    })
  }
}
