import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

// حذف صورة من Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ 
        success: false, 
        message: 'معرف الصورة مطلوب' 
      })
    }

    // حذف الصورة من Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(publicId)

    if (deleteResult.result === 'ok') {
      return NextResponse.json({ 
        success: true, 
        message: 'تم حذف الصورة بنجاح من Cloudinary'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'فشل في حذف الصورة من Cloudinary'
      })
    }

  } catch (error) {
    console.error('خطأ في حذف الصورة من Cloudinary:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ أثناء حذف الصورة من Cloudinary'
    })
  }
}

// الحصول على معلومات الصورة من Cloudinary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ 
        success: false, 
        message: 'معرف الصورة مطلوب' 
      })
    }

    // الحصول على تفاصيل الصورة
    const result = await cloudinary.api.resource(publicId)

    return NextResponse.json({ 
      success: true, 
      image: {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        createdAt: result.created_at
      }
    })

  } catch (error) {
    console.error('خطأ في الحصول على معلومات الصورة:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ في الحصول على معلومات الصورة'
    })
  }
}