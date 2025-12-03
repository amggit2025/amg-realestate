import Hero from '@/components/features/Hero'
import FeaturedProjects from '@/components/features/FeaturedProjects'
import Services from '@/components/features/Services'
import Testimonials from '@/components/features/Testimonials'
import CallToAction from '@/components/features/CallToAction'
import PortfolioShowcase from '@/components/features/PortfolioShowcase'

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <FeaturedProjects />
      <PortfolioShowcase />
      <Services />
      <Testimonials />
      <CallToAction />
    </main>
  )
}
