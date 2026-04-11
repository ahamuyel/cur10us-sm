import { prisma } from "@/lib/prisma"
import LandingNavbar from "@/components/landing/LandingNavbar"
import HeroSection from "@/components/landing/HeroSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import ProfilesSection from "@/components/landing/ProfilesSection"
import StatsSection from "@/components/landing/StatsSection"
import PricingSection from "@/components/landing/PricingSection"
import FAQSection from "@/components/landing/FAQSection"
import CTASection from "@/components/landing/CTASection"
import Footer from "@/components/landing/Footer"

export const dynamic = 'force-dynamic'

export type PlatformBranding = {
  name: string
  description: string | null
  logo: string | null
  contactEmail: string | null
  contactPhone: string | null
}

async function getData() {
  const [schools, students, teachers, classes, config] = await Promise.all([
    prisma.school.count({ where: { status: "ativa" } }),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.platformConfig.findUnique({
      where: { id: "singleton" },
      select: { name: true, description: true, logo: true, contactEmail: true, contactPhone: true },
    }),
  ])
  const branding: PlatformBranding = {
    name: config?.name || "Cur10usX",
    description: config?.description || null,
    logo: config?.logo || null,
    contactEmail: config?.contactEmail || "suporte@cur10usx.com",
    contactPhone: config?.contactPhone || null,
  }
  return { stats: { schools, students, teachers, classes }, branding }
}

export default async function Home() {
  const { stats, branding } = await getData()

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 scroll-smooth">
      <LandingNavbar branding={branding} />
      <HeroSection branding={branding} />
      <StatsSection {...stats} />
      <HowItWorksSection />
      <FeaturesSection />
      <ProfilesSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer branding={branding} />
    </main>
  )
}
