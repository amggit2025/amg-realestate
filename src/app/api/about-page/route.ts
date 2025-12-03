import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - جلب محتوى صفحة من نحن
export async function GET() {
  try {
    // @ts-ignore
    const aboutPage = await prisma.aboutPage.findFirst({
      where: { isActive: true }
    })

    if (!aboutPage) {
      // إرجاع قيم افتراضية
      return NextResponse.json({
        success: true,
        data: {
          companyName: "مجموعة أحمد الملاح",
          companyFullName: "مجموعة أحمد الملاح للمقاولات والتشطيبات والتسويق العقاري",
          foundedYear: 2009,
          founderImage: null,
          yearsOfExperience: 15,
          completedProjects: 500,
          happyClients: 1000,
          teamSize: 50,
          ourStory: "تأسست مجموعة أحمد الملاح عام 2009 كشركة رائدة في مجال المقاولات والتشطيبات والتسويق العقاري. نفخر بتقديم خدمات متكاملة تشمل التشييد والبناء، التشطيبات الداخلية والخارجية، والتسويق العقاري الاحترافي.",
          vision: "أن نكون الشركة الرائدة في مجال المقاولات والتشطيبات في مصر والشرق الأوسط، ونموذجاً يُحتذى به في الجودة والابتكار.",
          mission: "تقديم خدمات بناء وتشطيب متكاملة بأعلى معايير الجودة العالمية، مع الالتزام بالمواعيد وتحقيق رضا عملائنا الكامل.",
          values: JSON.stringify([
            {title: "الالتزام", description: "نلتزم بتسليم مشاريعنا في الوقت المحدد"},
            {title: "الكفاءة", description: "فريق عمل محترف ومدرب على أعلى مستوى"},
            {title: "الإبداع", description: "حلول مبتكرة لكل تحدي نواجهه"},
            {title: "الجودة", description: "أعلى معايير الجودة في التنفيذ"}
          ]),
          principles: JSON.stringify([
            "الشفافية الكاملة في التعامل",
            "استخدام أفضل المواد والخامات",
            "الالتزام بالمواعيد المحددة",
            "خدمة ما بعد البيع المتميزة",
            "أسعار تنافسية وعادلة"
          ]),
          tagline: "شريكك الموثوق في عالم العقارات"
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...aboutPage,
        values: JSON.parse(aboutPage.values),
        principles: JSON.parse(aboutPage.principles)
      }
    })
  } catch (error) {
    console.error('خطأ في جلب محتوى صفحة من نحن:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب المحتوى' },
      { status: 500 }
    )
  }
}

// PUT - تحديث محتوى صفحة من نحن
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // @ts-ignore
    const existingPage = await prisma.aboutPage.findFirst({
      where: { isActive: true }
    })

    // تحويل القيم والمبادئ إلى JSON strings
    const valuesString = typeof body.values === 'string' ? body.values : JSON.stringify(body.values)
    const principlesString = typeof body.principles === 'string' ? body.principles : JSON.stringify(body.principles)

    let aboutPage
    if (existingPage) {
      // @ts-ignore
      aboutPage = await prisma.aboutPage.update({
        where: { id: existingPage.id },
        data: {
          companyName: body.companyName,
          companyFullName: body.companyFullName,
          foundedYear: body.foundedYear,
          founderImage: body.founderImage,
          yearsOfExperience: body.yearsOfExperience,
          completedProjects: body.completedProjects,
          happyClients: body.happyClients,
          teamSize: body.teamSize,
          ourStory: body.ourStory,
          vision: body.vision,
          mission: body.mission,
          values: valuesString,
          principles: principlesString,
          tagline: body.tagline
        }
      })
    } else {
      // @ts-ignore
      aboutPage = await prisma.aboutPage.create({
        data: {
          companyName: body.companyName || "مجموعة أحمد الملاح",
          companyFullName: body.companyFullName || "مجموعة أحمد الملاح للمقاولات والتشطيبات والتسويق العقاري",
          foundedYear: body.foundedYear || 2009,
          founderImage: body.founderImage,
          yearsOfExperience: body.yearsOfExperience || 15,
          completedProjects: body.completedProjects || 500,
          happyClients: body.happyClients || 1000,
          teamSize: body.teamSize || 50,
          ourStory: body.ourStory || "قصتنا...",
          vision: body.vision || "رؤيتنا...",
          mission: body.mission || "مهمتنا...",
          values: valuesString,
          principles: principlesString,
          tagline: body.tagline || "شريكك الموثوق في عالم العقارات",
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ المحتوى بنجاح',
      data: aboutPage
    })
  } catch (error) {
    console.error('خطأ في حفظ محتوى صفحة من نحن:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حفظ المحتوى' },
      { status: 500 }
    )
  }
}
