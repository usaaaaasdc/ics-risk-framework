"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  const { language } = useLanguage()

  return (
    <section className="container mx-auto px-4 py-20 md:py-32 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
          {language === "ar" && (
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              ICS-Risk: إطار مفتوح المصدر لتقييم أمن أنظمة التحكم الصناعي
            </span>
          )}
          {language === "en" && (
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              ICS-Risk: An Open-Source Framework for Industrial Control Systems Risk Assessment
            </span>
          )}
          {language === "de" && (
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              ICS-Risk: Ein Open-Source-Framework für die Risikobewertung industrieller Steuerungssysteme
            </span>
          )}
          {language === "tr" && (
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              ICS-Risk: Endüstriyel Kontrol Sistemleri Risk Değerlendirmesi İçin Açık Kaynaklı Çerçeve
            </span>
          )}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto">
          {language === "ar" && "شامل، بدون اتصال، ومتعدد اللغات. مصمم للأكاديميا والصناعة والاقتصادات النامية."}
          {language === "en" &&
            "Comprehensive, offline, and multilingual. Built for academia, industry, and developing economies."}
          {language === "de" &&
            "Umfassend, offline und mehrsprachig. Entwickelt für Akademie, Industrie und Entwicklungsländer."}
          {language === "tr" &&
            "Kapsamlı, çevrimdışı ve çok dilli. Akademi, endüstri ve gelişmekte olan ekonomiler için geliştirildi."}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link href="/assessment" className="flex-1 sm:flex-initial">
            <Button
              size="lg"
              className="w-full sm:w-auto px-12 py-7 text-lg gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105"
            >
              <Shield className="w-6 h-6" />
              {language === "ar" && "ابدأ التقييم الكامل"}
              {language === "en" && "Start Full Assessment"}
              {language === "de" && "Vollständige Bewertung starten"}
              {language === "tr" && "Tam Değerlendirmeyi Başlat"}
            </Button>
          </Link>
          <Link href="/simple-mode" className="flex-1 sm:flex-initial">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-12 py-7 text-lg gap-3 border-2 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500 backdrop-blur-sm bg-background/50 transition-all hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              {language === "ar" && "الوضع المبسط للمديرين"}
              {language === "en" && "Simple Mode for Managers"}
              {language === "de" && "Einfacher Modus für Manager"}
              {language === "tr" && "Yöneticiler İçin Basit Mod"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
