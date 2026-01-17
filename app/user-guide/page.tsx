"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Printer, Shield, CheckCircle2, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"

export default function UserGuidePage() {
  const { t, language } = useLanguage()

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header - Hide in print */}
      <header className="border-b border-border bg-card print:hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{t("userGuide")}</h1>
                <p className="text-muted-foreground text-sm">{t("appSubtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                {t("printGuide")}
              </Button>
              <Link href="/">
                <Button variant="default" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("backToApp")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Print Header - Show only in print */}
      <div className="hidden print:block text-center py-6 border-b">
        <h1 className="text-3xl font-bold">{t("userGuideTitle")}</h1>
        <p className="text-muted-foreground mt-2">{t("appSubtitle")}</p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-primary mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">{t("guideIntro")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("guideIntroContent")}</p>
            </div>
          </div>
        </Card>

        {/* Key Features */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("guideFeatures")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{t(`guideFeature${num}` as any)}</h3>
                  <p className="text-muted-foreground text-sm">{t(`guideFeature${num}Desc` as any)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* How to Use */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("guideHowToUse")}</h2>

          {/* Step 1 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">{t("guideStep1")}</h3>
            </div>
            <p className="text-muted-foreground mb-3 ml-11">{t("guideStep1Desc")}</p>
            <ul className="space-y-2 ml-11">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <li key={num} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{t(`guideStep1Item${num}` as any)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 2 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">{t("guideStep2")}</h3>
            </div>
            <p className="text-muted-foreground mb-3 ml-11">{t("guideStep2Desc")}</p>
            <ul className="space-y-2 ml-11">
              {[1, 2, 3].map((num) => (
                <li key={num} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{t(`guideStep2Item${num}` as any)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 3 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">{t("guideStep3")}</h3>
            </div>
            <p className="text-muted-foreground ml-11">{t("guideStep3Desc")}</p>
          </div>

          {/* Step 4 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold">{t("guideStep4")}</h3>
            </div>
            <p className="text-muted-foreground mb-3 ml-11">{t("guideStep4Desc")}</p>
            <ul className="space-y-2 ml-11">
              {[1, 2, 3, 4].map((num) => (
                <li key={num} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{t(`guideStep4Item${num}` as any)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 5 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="text-xl font-semibold">{t("guideStep5")}</h3>
            </div>
            <p className="text-muted-foreground ml-11">{t("guideStep5Desc")}</p>
          </div>

          {/* New Tools Section */}
          <div className="mb-6 border-t pt-6 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                *
              </div>
              <h3 className="text-xl font-semibold">{t("guideNewTools")}</h3>
            </div>
            <p className="text-muted-foreground mb-3 ml-11">{t("guideNewToolsDesc")}</p>
            <div className="ml-11 grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">IEC 62443 Calculator</h4>
                <p className="text-sm text-muted-foreground">{t("guideIecDesc")}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-bold mb-2">Risk Simulation</h4>
                <p className="text-sm text-muted-foreground">{t("guideRiskSimDesc")}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Calculation */}
        <Card className="p-6 mb-8 bg-primary/5">
          <h2 className="text-2xl font-bold mb-4">{t("guideRiskCalculation")}</h2>
          <p className="text-muted-foreground mb-4">{t("guideRiskCalculationDesc")}</p>
          <div className="bg-card p-4 rounded-lg border-2 border-primary/20 mb-4">
            <code className="text-sm font-mono">{t("guideRiskFormula")}</code>
          </div>
          <p className="text-sm text-muted-foreground">{t("guideRiskFormulaDesc")}</p>
        </Card >

        {/* Important Tips */}
        < Card className="p-6 mb-8" >
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />
            <h2 className="text-2xl font-bold">{t("guideTips")}</h2>
          </div>
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((num) => (
              <li key={num} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-xs font-bold">{num}</span>
                </div>
                <span className="text-sm">{t(`guideTip${num}` as any)}</span>
              </li>
            ))}
          </ul>
        </Card >

        {/* Privacy */}
        < Card className="p-6 mb-8 bg-green-500/5" >
          <h2 className="text-2xl font-bold mb-3">{t("guidePrivacy")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("guidePrivacyDesc")}</p>
        </Card >

        {/* Support */}
        < Card className="p-6 mb-8" >
          <h2 className="text-2xl font-bold mb-3">{t("guideSupport")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("guideSupportDesc")}</p>
        </Card >

        {/* Footer - Print only */}
        < div className="hidden print:block text-center py-6 border-t mt-8" >
          <p className="text-sm text-muted-foreground">{t("footerText")}</p>
        </div >
      </div >
    </main >
  )
}
