/**
 * 🗑️ Cloudinary Helper - دوال مساعدة لحذف الصور من Cloudinary
 * استخدمها في أي API لحذف الصور القديمة تلقائياً
 */

import cloudinary from '@/lib/cloudinary'

/**
 * حذف صورة واحدة من Cloudinary
 * @param publicId - معرف الصورة على Cloudinary
 * @returns Promise<boolean> - true إذا نجح الحذف
 */
export async function deleteImageFromCloudinary(publicId: string | null | undefined): Promise<boolean> {
  if (!publicId || publicId === '') {
    return false
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    
    if (result.result === 'ok') {
      console.log(`✅ تم حذف الصورة من Cloudinary: ${publicId}`)
      return true
    } else if (result.result === 'not found') {
      console.warn(`⚠️ الصورة غير موجودة على Cloudinary: ${publicId}`)
      return true // نعتبرها نجاح لأن الصورة مش موجودة أصلاً
    } else {
      console.error(`❌ فشل حذف الصورة من Cloudinary: ${publicId}`, result)
      return false
    }
  } catch (error) {
    console.error(`❌ خطأ في حذف الصورة من Cloudinary: ${publicId}`, error)
    return false
  }
}

/**
 * حذف عدة صور من Cloudinary
 * @param publicIds - مصفوفة من معرفات الصور
 * @returns Promise<number> - عدد الصور المحذوفة بنجاح
 */
export async function deleteMultipleImagesFromCloudinary(
  publicIds: (string | null | undefined)[]
): Promise<number> {
  if (!publicIds || publicIds.length === 0) {
    return 0
  }

  let deletedCount = 0
  const validPublicIds = publicIds.filter(id => id && id !== '')

  for (const publicId of validPublicIds) {
    const success = await deleteImageFromCloudinary(publicId)
    if (success) {
      deletedCount++
    }
  }

  console.log(`🗑️ تم حذف ${deletedCount} من ${validPublicIds.length} صورة من Cloudinary`)
  return deletedCount
}

/**
 * حذف صورة قديمة قبل رفع صورة جديدة
 * @param oldPublicId - معرف الصورة القديمة
 * @param context - السياق (portfolio, project, property, etc.)
 */
export async function deleteOldImageBeforeUpload(
  oldPublicId: string | null | undefined,
  context: string = 'image'
): Promise<void> {
  if (!oldPublicId || oldPublicId === '') {
    console.log(`ℹ️ لا توجد صورة ${context} قديمة لحذفها`)
    return
  }

  console.log(`🔄 جاري حذف صورة ${context} القديمة قبل رفع الجديدة...`)
  await deleteImageFromCloudinary(oldPublicId)
}

/**
 * حذف صور مصفوفة قديمة قبل رفع صور جديدة
 * @param oldPublicIds - مصفوفة معرفات الصور القديمة
 * @param context - السياق
 */
export async function deleteOldImagesBeforeUpload(
  oldPublicIds: (string | null | undefined)[],
  context: string = 'images'
): Promise<void> {
  if (!oldPublicIds || oldPublicIds.length === 0) {
    console.log(`ℹ️ لا توجد صور ${context} قديمة لحذفها`)
    return
  }

  console.log(`🔄 جاري حذف ${oldPublicIds.length} صورة ${context} قديمة...`)
  await deleteMultipleImagesFromCloudinary(oldPublicIds)
}
