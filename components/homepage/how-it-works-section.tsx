"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { FileInput, Cpu, CheckCircle2, Download, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function HowItWorksSection() {
  const { language } = useLanguage()

  return (
    <section className="container mx-auto px-4 py-20 relative z-10 bg-background/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "ar" && "كيف يعمل ICS-Risk؟"}
            {language === "en" && "How Does ICS-Risk Work?"}
            {language === "de" && "Wie funktioniert ICS-Risk?"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar" && "رحلة بسيطة من 4 خطوات للحصول على تقييم أمني كامل"}
            {language === "en" && "A simple 4-step journey to get a complete security assessment"}
            {language === "de" && "Eine einfache 4-Schritte-Reise zu einer vollständigen Sicherheitsbewertung"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FileInput className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold">
                    {language === "ar" && "إدخال تفاصيل النظام"}
                    {language === "en" && "Input System Details"}
                    {language === "de" && "Systemdetails eingeben"}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {language === "ar" && "اختر الأجهزة، البروتوكولات، التوصيلات، والبيئة"}
                  {language === "en" && "Choose devices, protocols, connections, and environment"}
                  {language === "de" && "Wählen Sie Geräte, Protokolle, Verbindungen und Umgebung"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold">
                    {language === "ar" && "التقييم الآلي"}
                    {language === "en" && "Automated Assessment"}
                    {language === "de" && "Automatisierte Bewertung"}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {language === "ar" && "نحصل على درجة المخاطر + الثغرات + تحليل STRIDE"}
                  {language === "en" && "Get risk score + vulnerabilities + STRIDE analysis"}
                  {language === "de" && "Erhalten Sie Risikobewertung + Schwachstellen + STRIDE-Analyse"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-green-500/50 bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold">
                    {language === "ar" && "التوصيات الذكية"}
                    {language === "en" && "Smart Recommendations"}
                    {language === "de" && "Intelligente Empfehlungen"}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {language === "ar" && "خطة علاج مرتبة حسب الأولوية والتكلفة والفعالية"}
                  {language === "en" && "Remediation plan prioritized by severity, cost, and effectiveness"}
                  {language === "de" && "Sanierungsplan nach Priorität, Kosten und Wirksamkeit"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                4
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <h3 className="text-xl font-bold">
                    {language === "ar" && "التصدير والمشاركة"}
                    {language === "en" && "Export & Share"}
                    {language === "de" && "Exportieren & Teilen"}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {language === "ar" && "صدّر التقارير بصيغة PDF أو CSV أو قارن المشاريع"}
                  {language === "en" && "Export reports as PDF, CSV, or compare projects"}
                  {language === "de" && "Berichte als PDF, CSV exportieren oder Projekte vergleichen"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/user-guide">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              <BookOpen className="w-5 h-5" />
              {language === "ar" && "شاهد الدليل الكامل"}
              {language === "en" && "View Complete Guide"}
              {language === "de" && "Vollständige Anleitung anzeigen"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
