"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Shield, ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SimpleModePage() {
  const { t, language } = useLanguage()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    systemAge: "",
    internetAccess: "",
    lastUpdate: "",
    externalConnections: "",
    securityTools: "",
  })
  const [result, setResult] = useState<string | null>(null)

  const questions = {
    en: {
      systemAge: {
        question: "How old is your industrial control system?",
        options: [
          { value: "new", label: "Less than 2 years", risk: 1 },
          { value: "medium", label: "2-5 years", risk: 2 },
          { value: "old", label: "5-10 years", risk: 3 },
          { value: "legacy", label: "More than 10 years", risk: 4 },
        ],
      },
      internetAccess: {
        question: "Is your system connected to the internet?",
        options: [
          { value: "no", label: "No, completely isolated", risk: 1 },
          { value: "indirect", label: "Only through secure gateway", risk: 2 },
          { value: "yes", label: "Yes, directly connected", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "When was the last security update applied?",
        options: [
          { value: "recent", label: "Within last 3 months", risk: 1 },
          { value: "moderate", label: "3-12 months ago", risk: 2 },
          { value: "old", label: "More than 1 year ago", risk: 3 },
          { value: "never", label: "Never updated", risk: 4 },
        ],
      },
      externalConnections: {
        question: "Do external vendors have remote access?",
        options: [
          { value: "no", label: "No external access", risk: 1 },
          { value: "controlled", label: "Yes, but strictly controlled", risk: 2 },
          { value: "uncontrolled", label: "Yes, with minimal oversight", risk: 4 },
        ],
      },
      securityTools: {
        question: "Do you have security monitoring tools in place?",
        options: [
          { value: "comprehensive", label: "Yes, comprehensive monitoring", risk: 1 },
          { value: "basic", label: "Basic firewall only", risk: 2 },
          { value: "none", label: "No security tools", risk: 4 },
        ],
      },
    },
    ar: {
      systemAge: {
        question: "ما عمر نظام التحكم الصناعي الخاص بك؟",
        options: [
          { value: "new", label: "أقل من سنتين", risk: 1 },
          { value: "medium", label: "2-5 سنوات", risk: 2 },
          { value: "old", label: "5-10 سنوات", risk: 3 },
          { value: "legacy", label: "أكثر من 10 سنوات", risk: 4 },
        ],
      },
      internetAccess: {
        question: "هل النظام متصل بالإنترنت؟",
        options: [
          { value: "no", label: "لا، معزول تماماً", risk: 1 },
          { value: "indirect", label: "فقط من خلال بوابة آمنة", risk: 2 },
          { value: "yes", label: "نعم، متصل مباشرة", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "متى تم تطبيق آخر تحديث أمني؟",
        options: [
          { value: "recent", label: "خلال 3 أشهر الماضية", risk: 1 },
          { value: "moderate", label: "منذ 3-12 شهراً", risk: 2 },
          { value: "old", label: "أكثر من سنة", risk: 3 },
          { value: "never", label: "لم يتم التحديث أبداً", risk: 4 },
        ],
      },
      externalConnections: {
        question: "هل للموردين الخارجيين وصول عن بُعد؟",
        options: [
          { value: "no", label: "لا يوجد وصول خارجي", risk: 1 },
          { value: "controlled", label: "نعم، لكن مراقب بصرامة", risk: 2 },
          { value: "uncontrolled", label: "نعم، مع رقابة محدودة", risk: 4 },
        ],
      },
      securityTools: {
        question: "هل لديك أدوات مراقبة أمنية؟",
        options: [
          { value: "comprehensive", label: "نعم، مراقبة شاملة", risk: 1 },
          { value: "basic", label: "جدار حماية أساسي فقط", risk: 2 },
          { value: "none", label: "لا توجد أدوات أمنية", risk: 4 },
        ],
      },
    },
    de: {
      systemAge: {
        question: "Wie alt ist Ihr industrielles Steuerungssystem?",
        options: [
          { value: "new", label: "Weniger als 2 Jahre", risk: 1 },
          { value: "medium", label: "2-5 Jahre", risk: 2 },
          { value: "old", label: "5-10 Jahre", risk: 3 },
          { value: "legacy", label: "Mehr als 10 Jahre", risk: 4 },
        ],
      },
      internetAccess: {
        question: "Ist Ihr System mit dem Internet verbunden?",
        options: [
          { value: "no", label: "Nein, vollständig isoliert", risk: 1 },
          { value: "indirect", label: "Nur über sicheres Gateway", risk: 2 },
          { value: "yes", label: "Ja, direkt verbunden", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "Wann wurde das letzte Sicherheitsupdate angewendet?",
        options: [
          { value: "recent", label: "Innerhalb der letzten 3 Monate", risk: 1 },
          { value: "moderate", label: "Vor 3-12 Monaten", risk: 2 },
          { value: "old", label: "Vor mehr als 1 Jahr", risk: 3 },
          { value: "never", label: "Nie aktualisiert", risk: 4 },
        ],
      },
      externalConnections: {
        question: "Haben externe Anbieter Fernzugriff?",
        options: [
          { value: "no", label: "Kein externer Zugriff", risk: 1 },
          { value: "controlled", label: "Ja, aber streng kontrolliert", risk: 2 },
          { value: "uncontrolled", label: "Ja, mit minimaler Aufsicht", risk: 4 },
        ],
      },
      securityTools: {
        question: "Haben Sie Sicherheitsüberwachungstools?",
        options: [
          { value: "comprehensive", label: "Ja, umfassende Überwachung", risk: 1 },
          { value: "basic", label: "Nur grundlegende Firewall", risk: 2 },
          { value: "none", label: "Keine Sicherheitstools", risk: 4 },
        ],
      },
    },
  }

  const currentQuestions = questions[language as keyof typeof questions] || questions.en

  const calculateRisk = () => {
    const riskScores = Object.entries(answers).map(([key, value]) => {
      const question = currentQuestions[key as keyof typeof currentQuestions]
      const option = question.options.find((o) => o.value === value)
      return option?.risk || 0
    })

    const totalRisk = riskScores.reduce((sum, score) => sum + score, 0)
    const avgRisk = totalRisk / riskScores.length

    if (avgRisk <= 1.5) return "low"
    if (avgRisk <= 2.5) return "medium"
    return "high"
  }

  const handleNext = () => {
    const currentKey = Object.keys(currentQuestions)[step - 1]
    if (answers[currentKey as keyof typeof answers]) {
      if (step === 5) {
        const riskLevel = calculateRisk()
        setResult(riskLevel)
      } else {
        setStep(step + 1)
      }
    }
  }

  const resultContent = {
    en: {
      low: {
        title: "Good Security Posture",
        icon: CheckCircle,
        color: "text-green-500",
        message: "Your system appears to have good security practices in place.",
        recommendations: [
          "Continue regular security updates",
          "Maintain current monitoring practices",
          "Review security policies annually",
        ],
        action: "Schedule quarterly security reviews to maintain your good standing.",
      },
      medium: {
        title: "Moderate Risk Level",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "Your system has some security gaps that should be addressed.",
        recommendations: [
          "Implement regular update schedule",
          "Add network segmentation",
          "Deploy basic monitoring tools",
        ],
        action: "Invest in security improvements within the next 3-6 months.",
      },
      high: {
        title: "High Risk - Action Required",
        icon: AlertCircle,
        color: "text-red-500",
        message: "Your system has significant security vulnerabilities that require immediate attention.",
        recommendations: [
          "Isolate critical systems immediately",
          "Deploy comprehensive security monitoring",
          "Schedule immediate security audit",
          "Update all systems urgently",
        ],
        action: "Contact a cybersecurity professional within 2 weeks for emergency assessment.",
      },
    },
    ar: {
      low: {
        title: "وضع أمني جيد",
        icon: CheckCircle,
        color: "text-green-500",
        message: "يبدو أن نظامك يطبق ممارسات أمنية جيدة.",
        recommendations: [
          "استمر في التحديثات الأمنية المنتظمة",
          "حافظ على ممارسات المراقبة الحالية",
          "راجع السياسات الأمنية سنوياً",
        ],
        action: "جدول مراجعات أمنية ربع سنوية للحفاظ على وضعك الجيد.",
      },
      medium: {
        title: "مستوى خطر متوسط",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "نظامك يحتوي على بعض الثغرات الأمنية التي يجب معالجتها.",
        recommendations: ["تنفيذ جدول تحديثات منتظم", "إضافة تقسيم للشبكة", "نشر أدوات مراقبة أساسية"],
        action: "استثمر في تحسينات أمنية خلال 3-6 أشهر القادمة.",
      },
      high: {
        title: "خطر عالي - مطلوب إجراء",
        icon: AlertCircle,
        color: "text-red-500",
        message: "نظامك يحتوي على ثغرات أمنية كبيرة تتطلب اهتماماً فورياً.",
        recommendations: [
          "عزل الأنظمة الحرجة فوراً",
          "نشر مراقبة أمنية شاملة",
          "جدولة تدقيق أمني فوري",
          "تحديث جميع الأنظمة بشكل عاجل",
        ],
        action: "اتصل بمتخصص أمن سيبراني خلال أسبوعين لتقييم طارئ.",
      },
    },
    de: {
      low: {
        title: "Gute Sicherheitslage",
        icon: CheckCircle,
        color: "text-green-500",
        message: "Ihr System scheint gute Sicherheitspraktiken zu haben.",
        recommendations: [
          "Regelmäßige Sicherheitsupdates fortsetzen",
          "Aktuelle Überwachungspraktiken beibehalten",
          "Sicherheitsrichtlinien jährlich überprüfen",
        ],
        action: "Planen Sie vierteljährliche Sicherheitsüberprüfungen.",
      },
      medium: {
        title: "Mittleres Risikoniveau",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "Ihr System hat einige Sicherheitslücken, die behoben werden sollten.",
        recommendations: [
          "Regelmäßigen Update-Zeitplan implementieren",
          "Netzwerksegmentierung hinzufügen",
          "Grundlegende Überwachungstools bereitstellen",
        ],
        action: "Investieren Sie in Sicherheitsverbesserungen innerhalb von 3-6 Monaten.",
      },
      high: {
        title: "Hohes Risiko - Maßnahmen erforderlich",
        icon: AlertCircle,
        color: "text-red-500",
        message: "Ihr System hat erhebliche Sicherheitslücken, die sofortige Aufmerksamkeit erfordern.",
        recommendations: [
          "Kritische Systeme sofort isolieren",
          "Umfassende Sicherheitsüberwachung bereitstellen",
          "Sofortiges Sicherheitsaudit planen",
          "Alle Systeme dringend aktualisieren",
        ],
        action: "Kontaktieren Sie innerhalb von 2 Wochen einen Cybersecurity-Experten.",
      },
    },
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {language === "ar" && "الوضع المبسط للمديرين"}
                  {language === "en" && "Simple Mode for Managers"}
                  {language === "de" && "Einfacher Modus für Manager"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" && "تقييم سريع بدون مصطلحات تقنية"}
                  {language === "en" && "Quick assessment without technical jargon"}
                  {language === "de" && "Schnelle Bewertung ohne Fachjargon"}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToHome")}
          </Button>
        </Link>

        {!result ? (
          <Card className="max-w-2xl mx-auto p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  {language === "ar" && `السؤال ${step} من 5`}
                  {language === "en" && `Question ${step} of 5`}
                  {language === "de" && `Frage ${step} von 5`}
                </h2>
                <div className="text-sm text-muted-foreground">{Math.round((step / 5) * 100)}%</div>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(step / 5) * 100}%` }} />
              </div>
            </div>

            {Object.entries(currentQuestions).map(([key, question], index) => {
              if (index + 1 !== step) return null

              return (
                <div key={key} className="space-y-6">
                  <h3 className="text-lg font-medium">{question.question}</h3>
                  <RadioGroup
                    value={answers[key as keyof typeof answers]}
                    onValueChange={(value) => setAnswers({ ...answers, [key]: value })}
                  >
                    {question.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 space-x-reverse p-4 border border-border rounded-lg hover:bg-accent cursor-pointer"
                      >
                        <RadioGroupItem value={option.value} id={`${key}-${option.value}`} />
                        <Label htmlFor={`${key}-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex gap-4">
                    {step > 1 && (
                      <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                        {language === "ar" && "السابق"}
                        {language === "en" && "Previous"}
                        {language === "de" && "Zurück"}
                      </Button>
                    )}
                    <Button onClick={handleNext} disabled={!answers[key as keyof typeof answers]} className="flex-1">
                      {step === 5
                        ? language === "ar"
                          ? "عرض النتيجة"
                          : language === "de"
                            ? "Ergebnis anzeigen"
                            : "Show Result"
                        : language === "ar"
                          ? "التالي"
                          : language === "de"
                            ? "Weiter"
                            : "Next"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </Card>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {(() => {
              const content =
                resultContent[language as keyof typeof resultContent]?.[result as keyof typeof resultContent.en] ||
                resultContent.en[result as keyof typeof resultContent.en]
              const Icon = content.icon

              return (
                <>
                  <Card className="p-8 text-center">
                    <Icon className={`w-20 h-20 mx-auto mb-4 ${content.color}`} />
                    <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{content.message}</p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${result === "low" ? "bg-green-500/10 text-green-500" : result === "medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}
                    >
                      {result === "low" && <TrendingUp className="w-5 h-5" />}
                      {result === "medium" && <AlertCircle className="w-5 h-5" />}
                      {result === "high" && <TrendingDown className="w-5 h-5" />}
                      <span className="font-semibold">
                        {result === "low" &&
                          (language === "ar" ? "خطر منخفض" : language === "de" ? "Niedriges Risiko" : "Low Risk")}
                        {result === "medium" &&
                          (language === "ar" ? "خطر متوسط" : language === "de" ? "Mittleres Risiko" : "Medium Risk")}
                        {result === "high" &&
                          (language === "ar" ? "خطر عالي" : language === "de" ? "Hohes Risiko" : "High Risk")}
                      </span>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h3 className="text-xl font-bold mb-4">
                      {language === "ar" && "التوصيات"}
                      {language === "en" && "Recommendations"}
                      {language === "de" && "Empfehlungen"}
                    </h3>
                    <ul className="space-y-3">
                      {content.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-8 bg-primary/5 border-primary/20">
                    <h3 className="text-xl font-bold mb-4">
                      {language === "ar" && "الخطوة التالية"}
                      {language === "en" && "Next Step"}
                      {language === "de" && "Nächster Schritt"}
                    </h3>
                    <p className="text-lg mb-6">{content.action}</p>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setResult(null)
                          setStep(1)
                          setAnswers({
                            systemAge: "",
                            internetAccess: "",
                            lastUpdate: "",
                            externalConnections: "",
                            securityTools: "",
                          })
                        }}
                      >
                        {language === "ar" && "إعادة التقييم"}
                        {language === "en" && "Retake Assessment"}
                        {language === "de" && "Erneut bewerten"}
                      </Button>
                      <Link href="/">
                        <Button>
                          {language === "ar" && "الوضع المتقدم"}
                          {language === "en" && "Advanced Mode"}
                          {language === "de" && "Erweiterter Modus"}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </>
              )
            })()}
          </div>
        )}
      </div>
    </main>
  )
}
