"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { HomepageHeader } from "@/components/homepage/homepage-header"
import { HeroSection } from "@/components/homepage/hero-section"
import { HowItWorksSection } from "@/components/homepage/how-it-works-section"
import { AdvancedToolsGrid } from "@/components/homepage/advanced-tools-grid"
import { WhyICSRiskSection } from "@/components/homepage/why-ics-risk-section"
import { HomepageFooter } from "@/components/homepage/homepage-footer"

export default function Home() {
  const { language } = useLanguage()

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-slate-950 dark:via-background dark:to-blue-950"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <HomepageHeader />
      <HeroSection />
      <HowItWorksSection />
      <AdvancedToolsGrid />
      <WhyICSRiskSection />
      <HomepageFooter />
    </main>
  )
}
