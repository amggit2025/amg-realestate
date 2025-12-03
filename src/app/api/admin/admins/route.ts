import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET: جلب جميع المشرفين
export async function GET(request: NextRequest) {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        permissions: true,
        active: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب المشرفين' },
      { status: 500 }
    );
  }
}

// POST: إضافة مشرف جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, firstName, lastName, password, role, permissions, active } = body;

    // التحقق من البيانات المطلوبة
    if (!username || !email || !firstName || !lastName || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'جميع البيانات مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود اسم المستخدم أو البريد الإلكتروني
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingAdmin.username === username 
            ? 'اسم المستخدم موجود بالفعل' 
            : 'البريد الإلكتروني موجود بالفعل' 
        },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المشرف الجديد
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: role || 'MODERATOR',
        permissions: permissions || {},
        active: active !== undefined ? active : true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المشرف بنجاح',
      data: admin,
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إضافة المشرف' },
      { status: 500 }
    );
  }
}

// PUT: تعديل مشرف
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, username, email, firstName, lastName, role, permissions, active, password } = body;

    console.log('📝 Update Admin Request:', { id, username, email, role, permissions, active });

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف المشرف مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من المشرف الحالي
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
      select: { role: true }
    });

    // منع تعديل صلاحيات أو دور السوبر أدمن
    if (existingAdmin?.role === 'SUPER_ADMIN') {
      if (role && role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { success: false, message: 'لا يمكن تغيير دور السوبر أدمن' },
          { status: 403 }
        );
      }
      // السوبر أدمن يحتفظ بكل الصلاحيات دائماً - نتجاهل أي تعديل على الصلاحيات
      console.log('⚠️ Ignoring permissions update for SUPER_ADMIN');
    }

    // بناء البيانات المراد تحديثها
    const updateData: any = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role && existingAdmin?.role !== 'SUPER_ADMIN') updateData.role = role;
    
    // تحديث الصلاحيات فقط إذا لم يكن سوبر أدمن
    if (permissions && existingAdmin?.role !== 'SUPER_ADMIN') {
      updateData.permissions = permissions;
      console.log('✅ Permissions will be updated:', permissions);
    }
    
    if (active !== undefined) updateData.active = active;
    
    // تحديث كلمة المرور إذا تم إرسالها
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    console.log('💾 Final update data:', updateData);

    // تحديث المشرف
    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        permissions: true,
        active: true,
        updatedAt: true,
      },
    });

    console.log('✅ Admin updated successfully:', admin);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المشرف بنجاح',
      data: admin,
    });

  } catch (error) {
    console.error('❌ Error updating admin:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث المشرف' },
      { status: 500 }
    );
  }
}

// DELETE: حذف مشرف
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف المشرف مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من أن المشرف المراد حذفه ليس سوبر أدمن
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { role: true, username: true }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'المشرف غير موجود' },
        { status: 404 }
      );
    }

    if (admin.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'لا يمكن حذف السوبر أدمن' },
        { status: 403 }
      );
    }

    // حذف المشرف
    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشرف بنجاح',
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حذف المشرف' },
      { status: 500 }
    );
  }
}
