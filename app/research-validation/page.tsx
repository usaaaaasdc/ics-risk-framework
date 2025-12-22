"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Users, Target } from "lucide-react"
import Link from "next/link"

export default function ResearchValidationPage() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.validationTitle}</h1>
              <p className="text-muted-foreground">{t.validationIntro}</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Case Study Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">{t.validationCaseStudy}</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">{t.caseStudyContext}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual representation - you can replace with actual images */}
            <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                {language === "ar" && "صورة توضيحية: بنية نظام التحكم في المصنع"}
                {language === "en" && "Diagram: Factory Control System Architecture"}
                {language === "de" && "Diagramm: Fabriksteuerungssystem-Architektur"}
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-card border border-primary/20 rounded p-4">
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {language === "ar" && "أجهزة PLC/HMI"}
                    {language === "en" && "PLC/HMI Devices"}
                    {language === "de" && "PLC/HMI-Geräte"}
                  </div>
                </div>
                <div className="bg-card border border-primary/20 rounded p-4">
                  <div className="text-3xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {language === "ar" && "مصنعين"}
                    {language === "en" && "Vendors"}
                    {language === "de" && "Hersteller"}
                  </div>
                </div>
                <div className="bg-card border border-primary/20 rounded p-4">
                  <div className="text-3xl font-bold text-primary">8.2→4.1</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {language === "ar" && "تحسن المخاطر"}
                    {language === "en" && "Risk Improvement"}
                    {language === "de" && "Risikoverbesserung"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {t.caseStudyFindings}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t.caseStudyFinding1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t.caseStudyFinding2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t.caseStudyFinding3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t.caseStudyFinding4}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* IEC 62443 Comparison */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">{t.validationIEC}</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">{t.iecComparison}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg">{t.iecAlignment}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t.iecSL1}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "95%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t.iecSL2}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "87%" }} />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t.iecSL3}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: "72%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t.iecSL4}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: "58%" }} />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border border-border">
              <AlertTriangle className="w-4 h-4 inline mr-2 text-yellow-500" />
              {t.iecNote}
            </p>
          </CardContent>
        </Card>

        {/* Expert Feedback */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">{t.validationFeedback}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
              <p className="text-sm italic">{t.expertFeedback1}</p>
            </blockquote>
            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
              <p className="text-sm italic">{t.expertFeedback2}</p>
            </blockquote>
            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
              <p className="text-sm italic">{t.expertFeedback3}</p>
            </blockquote>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card className="border-orange-500/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <CardTitle className="text-2xl">{t.validationLimitations}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t.limitation1}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t.limitation2}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t.limitation3}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t.limitation4}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Future Research - Master's Thesis */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">{t.validationFuture}</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">{t.futureResearch}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-card p-3 rounded border border-primary/20">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <span>{t.futureGoal1}</span>
              </li>
              <li className="flex items-start gap-3 bg-card p-3 rounded border border-primary/20">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <span>{t.futureGoal2}</span>
              </li>
              <li className="flex items-start gap-3 bg-card p-3 rounded border border-primary/20">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <span>{t.futureGoal3}</span>
              </li>
              <li className="flex items-start gap-3 bg-card p-3 rounded border border-primary/20">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <span>{t.futureGoal4}</span>
              </li>
              <li className="flex items-start gap-3 bg-card p-3 rounded border border-primary/20">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </div>
                <span>{t.futureGoal5}</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-card border-2 border-primary rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{t.researchGap}</h3>
              <p className="text-muted-foreground">{t.researchGapText}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  )
}
