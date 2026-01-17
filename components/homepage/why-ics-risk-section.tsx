"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Lock, Globe, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function WhyICSRiskSection() {
  const { language } = useLanguage()

  return (
    <section className="container mx-auto px-4 py-20 relative z-10 bg-background/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "ar" && "لماذا ICS-Risk؟"}
            {language === "en" && "Why ICS-Risk?"}
            {language === "de" && "Warum ICS-Risk?"}
            {language === "tr" && "Neden ICS-Risk?"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar" && "ثلاث مزايا فريدة تميزنا عن الأدوات التجارية"}
            {language === "en" && "Three unique advantages that set us apart from commercial tools"}
            {language === "de" && "Drei einzigartige Vorteile, die uns von kommerziellen Tools unterscheiden"}
            {language === "tr" && "Bizi ticari araçlardan ayıran üç benzersiz avantaj"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-2xl transition-all border-2 hover:border-blue-500 bg-gradient-to-br from-blue-500/10 via-background to-background">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {language === "ar" && "خصوصية كاملة"}
              {language === "en" && "Complete Privacy"}
              {language === "de" && "Vollständige Privatsphäre"}
              {language === "tr" && "Tam Gizlilik"}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {language === "ar" && "100% بدون اتصال. لا إرسال بيانات، لا تتبع. مثالي للبنية التحتية الحرجة."}
              {language === "en" &&
                "100% offline. No data transmission, no tracking. Ideal for critical infrastructure."}
              {language === "de" &&
                "100% offline. Keine Datenübertragung, kein Tracking. Ideal für kritische Infrastruktur."}
              {language === "tr" &&
                "%100 çevrimdışı. Veri iletimi yok, izleme yok. Kritik altyapi için ideal."}
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl transition-all border-2 hover:border-purple-500 bg-gradient-to-br from-purple-500/10 via-background to-background">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {language === "ar" && "عالمي ومتعدد اللغات"}
              {language === "en" && "Global & Multilingual"}
              {language === "de" && "Global & Mehrsprachig"}
              {language === "tr" && "Küresel ve Çok Dilli"}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {language === "ar" &&
                "دعم العربية والإنجليزية والألمانية. يشمل مصنعين غربيين وآسيويين مثل HollySys و INVT."}
              {language === "en" &&
                "Supports Arabic, English, German. Covers Western and Asian vendors like HollySys and INVT."}
              {language === "de" &&
                "Unterstützt Arabisch, Englisch, Deutsch. Umfasst westliche und asiatische Hersteller wie HollySys und INVT."}
              {language === "tr" &&
                "Arapça, İngilizce, Almanca ve Türkçe destekler. HollySys ve INVT gibi Batılı ve Asyalı üreticileri kapsar."}
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-2xl transition-all border-2 hover:border-green-500 bg-gradient-to-br from-green-500/10 via-background to-background">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {language === "ar" && "أكاديمي وتعليمي"}
              {language === "en" && "Academic & Educational"}
              {language === "de" && "Akademisch & Bildungsreich"}
              {language === "tr" && "Akademik ve Eğitsel"}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {language === "ar" && "مبني على CVSS وSTRIDE وIEC 62443. مثالي للأبحاث والتدريب ودراسات الحالة."}
              {language === "en" &&
                "Built with CVSS, STRIDE, IEC 62443. Perfect for research, training, and case studies."}
              {language === "de" &&
                "Entwickelt mit CVSS, STRIDE, IEC 62443. Perfekt für Forschung, Schulung und Fallstudien."}
              {language === "tr" &&
                "CVSS, STRIDE, IEC 62443 ile oluşturuldu. Araştırma, eğitim ve vaka çalışmaları için mükemmel."}
            </p>
          </Card>
        </div>

        <div className="text-center mt-12 space-y-4">
          <Link href="/about">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              {language === "ar" && "اقرأ المزيد عن المشروع"}
              {language === "en" && "Read More About the Project"}
              {language === "de" && "Mehr über das Projekt erfahren"}
              {language === "tr" && "Proje Hakkında Daha Fazla Bilgi"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            {language === "ar" && "مفتوح المصدر • MIT License • مجاني للأبد"}
            {language === "en" && "Open Source • MIT License • Free Forever"}
            {language === "de" && "Open Source • MIT-Lizenz • Für immer kostenlos"}
            {language === "tr" && "Açık Kaynak • MIT Lisansı • Sonsuza Kadar Ücretsiz"}
          </div>
        </div>
      </div>
    </section>
  )
}
