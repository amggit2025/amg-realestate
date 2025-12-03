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

    // Upload to Cloudinary using fetch API
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    
    const formData = new FormData()
    formData.append('file', dataURI)
    formData.append('upload_preset', 'amg_projects') // You'll create this preset
    formData.append('folder', 'amg-projects')
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    })

    const result = await cloudinaryResponse.json()

    if (!cloudinaryResponse.ok) {
      throw new Error(result.error?.message || 'فشل رفع الصورة')
    }

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصورة بنجاح على Cloudinary',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        original_filename: file.name
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
