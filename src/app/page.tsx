import dynamic from 'next/dynamic'
import Hero from '@/components/features/Hero'
import FeaturedProjects from '@/components/features/FeaturedProjects'
import Services from '@/components/features/Services'

// Dynamic import for heavy components with loading states
const PortfolioShowcase = dynamic(() => import('@/components/features/PortfolioShowcase'), {
  loading: () => (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    </div>
  ),
})

const Testimonials = dynamic(() => import('@/components/features/Testimonials'), {
  loading: () => (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    </div>
  ),
})

const CallToAction = dynamic(() => import('@/components/features/CallToAction'), {
  loading: () => <div className="h-32 bg-gray-100"></div>,
})

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <PortfolioShowcase />
      <Services />
      <Testimonials />
      <CallToAction />
    </main>
  )
}
