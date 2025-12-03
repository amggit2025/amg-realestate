// أنواع البيانات الخاصة بمعرض الأعمال
export interface PortfolioProject {
  id: number
  slug: string // للـ URL الصديق للـ SEO
  title: string
  category: 'construction' | 'finishing' | 'furniture' | 'kitchens'
  image: string
  images: string[]
  description: string
  completionDate: string
  location: string
  client: string
  duration: string
  area: string
  budget: string
  features: string[]
  likes: number
  views: number
  rating: number
  status: 'completed' | 'in-progress' | 'upcoming'
  tags: string[]
  
  // تفاصيل إضافية للصفحة المنفصلة
  fullDescription?: string
  challenges?: string[]
  solutions?: string[]
  technologies?: string[]
  teamMembers?: string[]
  beforeAfter?: {
    before: string[]
    after: string[]
  }
  clientTestimonial?: {
    comment: string
    rating: number
    clientName: string
    clientTitle: string
    clientAvatar?: string
  }
  relatedProjects?: number[] // IDs للمشاريع المشابهة
}

export interface PortfolioCategory {
  id: string
  name: string
  description: string
  icon: any // React Icon Component
  color: string
}

export interface PortfolioStats {
  totalProjects: number
  totalLikes: number
  totalViews: number
  averageRating: number
  completedProjects: number
  activeProjects: number
}
