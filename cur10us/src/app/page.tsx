import { prisma } from "@/lib/prisma"
import LandingNavbar from "@/components/landing/LandingNavbar"
import HeroSection from "@/components/landing/HeroSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import ProfilesSection from "@/components/landing/ProfilesSection"
import StatsSection from "@/components/landing/StatsSection"
import FAQSection from "@/components/landing/FAQSection"
import CTASection from "@/components/landing/CTASection"
import Footer from "@/components/landing/Footer"

async function getStats() {
  const [schools, students, teachers, classes] = await Promise.all([
    prisma.school.count({ where: { status: "ativa" } }),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
  ])
  return { schools, students, teachers, classes }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <LandingNavbar />
      <HeroSection />
      <StatsSection {...stats} />
      <HowItWorksSection />
      <FeaturesSection />
      <ProfilesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
