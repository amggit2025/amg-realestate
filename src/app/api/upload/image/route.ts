import { NextRequest, NextResponse } from 'next/server'
import cloudinary from 'cloudinary'

// Configure Cloudinary
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  console.log('📤 Upload request received')
  
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      console.log('❌ No file in request')
      return NextResponse.json({ 
        success: false, 
        message: 'لم يتم رفع ملف' 
      })
    }

    console.log('📁 File received:', file.name, file.type, file.size)

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({
        success: false,
        message: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG, PNG أو WebP'
      })
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
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

    console.log('☁️ Uploading to Cloudinary...')
    console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set ✓' : 'Missing ✗')
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set ✓' : 'Missing ✗')

    // Upload with signed request
    const result = await cloudinaryV2.uploader.upload(dataURI, {
      folder: 'amg-projects',
      resource_type: 'image',
    })

    console.log('✅ Upload successful:', result.secure_url)

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصورة بنجاح على Cloudinary',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        original_filename: file.name,
        width: result.width,
        height: result.height,
        format: result.format
      }
    })

  } catch (error: any) {
    console.error('❌ Error uploading to Cloudinary:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json({
      success: false,
      message: error?.message || error?.error?.message || 'خطأ في رفع الصورة',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}
