"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import {
  Network,
  Layers,
  FileCode,
  Brain,
  Wrench,
  Target,
  PackageCheck,
  MapPin,
  Activity,
  TrendingUp,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function AdvancedToolsGrid() {
  const { language } = useLanguage()

  const tools = [
    {
      href: "/network-topology",
      icon: Network,
      color: "cyan",
      titleAr: "خريطة الشبكة",
      titleEn: "Network Map",
      titleDe: "Netzwerkkarte",
      descAr: "تصور هيكل الشبكة",
      descEn: "Visualize network structure",
      descDe: "Netzwerkstruktur visualisieren",
    },
    {
      href: "/digital-twin",
      icon: Layers,
      color: "blue",
      titleAr: "التوأم الرقمي",
      titleEn: "Digital Twin",
      titleDe: "Digitaler Zwilling",
      descAr: "محاكاة انتشار المخاطر",
      descEn: "Risk propagation simulation",
      descDe: "Risikoausbreitungssimulation",
    },
    {
      href: "/pcap-analyzer",
      icon: FileCode,
      color: "purple",
      titleAr: "محلل PCAP",
      titleEn: "PCAP Analyzer",
      titleDe: "PCAP-Analysator",
      descAr: "تحليل حزم البيانات",
      descEn: "Traffic packet analysis",
      descDe: "Datenpaketanalyse",
    },
    {
      href: "/ai-prediction",
      icon: Brain,
      color: "pink",
      titleAr: "توقع المخاطر",
      titleEn: "AI Prediction",
      titleDe: "KI-Vorhersage",
      descAr: "توقع ذكي للمخاطر",
      descEn: "Smart risk forecasting",
      descDe: "Intelligente Risikovorhersage",
    },
    {
      href: "/remediation-planner",
      icon: Wrench,
      color: "orange",
      titleAr: "مخطط العلاج",
      titleEn: "Remediation Plan",
      titleDe: "Sanierungsplan",
      descAr: "خطة تنفيذية للعلاج",
      descEn: "Action plan with timeline",
      descDe: "Aktionsplan mit Zeitplan",
    },
    {
      href: "/mitre-attack",
      icon: Target,
      color: "red",
      titleAr: "MITRE ATT&CK",
      titleEn: "MITRE ATT&CK",
      titleDe: "MITRE ATT&CK",
      descAr: "تكتيكات وتقنيات الهجوم",
      descEn: "Attack tactics & techniques",
      descDe: "Angriffstaktiken & -techniken",
    },
    {
      href: "/supply-chain",
      icon: PackageCheck,
      color: "yellow",
      titleAr: "سلسلة التوريد",
      titleEn: "Supply Chain",
      titleDe: "Lieferkette",
      descAr: "تقييم مخاطر الموردين",
      descEn: "Vendor risk assessment",
      descDe: "Lieferantenrisikobewertung",
    },
    {
      href: "/compliance-roadmap",
      icon: MapPin,
      color: "green",
      titleAr: "خريطة الامتثال",
      titleEn: "Compliance Roadmap",
      titleDe: "Compliance-Roadmap",
      descAr: "طريق الامتثال الكامل",
      descEn: "Path to full compliance",
      descDe: "Weg zur vollständigen Compliance",
    },
    {
      href: "/simulation",
      icon: Activity,
      color: "indigo",
      titleAr: "محاكاة الهجمات",
      titleEn: "Attack Simulation",
      titleDe: "Angriffssimulation",
      descAr: "4 سيناريوهات واقعية",
      descEn: "4 realistic scenarios",
      descDe: "4 realistische Szenarien",
    },
    {
      href: "/cost-analysis",
      icon: TrendingUp,
      color: "emerald",
      titleAr: "تحليل التكلفة",
      titleEn: "Cost Analysis",
      titleDe: "Kostenanalyse",
      descAr: "ROI والتكلفة المالية",
      descEn: "ROI & financial impact",
      descDe: "ROI & finanzielle Auswirkungen",
    },
    {
      href: "/analytics",
      icon: BarChart3,
      color: "teal",
      titleAr: "لوحة التحليلات",
      titleEn: "Analytics Dashboard",
      titleDe: "Analyse-Dashboard",
      descAr: "إحصائيات ورسوم بيانية",
      descEn: "Stats & visual reports",
      descDe: "Statistiken & visuelle Berichte",
    },
    {
      href: "/incident-response",
      icon: AlertTriangle,
      color: "rose",
      titleAr: "الطوارئ",
      titleEn: "Incident Response",
      titleDe: "Notfallreaktion",
      descAr: "إجراءات الطوارئ الفورية",
      descEn: "Emergency procedures",
      descDe: "Notfallverfahren",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "ar" && "الأدوات المتقدمة"}
            {language === "en" && "Advanced Tools & Features"}
            {language === "de" && "Erweiterte Tools & Funktionen"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar" && "12 أداة احترافية لتحليل شامل ومتعمق"}
            {language === "en" && "12 professional tools for comprehensive and in-depth analysis"}
            {language === "de" && "12 professionelle Werkzeuge für umfassende und detaillierte Analysen"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.href} href={tool.href}>
                <Card
                  className={`p-6 hover:shadow-xl transition-all border-2 hover:border-${tool.color}-500/50 bg-gradient-to-br from-${tool.color}-500/5 to-transparent h-full`}
                >
                  <Icon className={`w-10 h-10 text-${tool.color}-600 dark:text-${tool.color}-400 mb-3`} />
                  <h3 className="font-bold text-lg mb-2">
                    {language === "ar" && tool.titleAr}
                    {language === "en" && tool.titleEn}
                    {language === "de" && tool.titleDe}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" && tool.descAr}
                    {language === "en" && tool.descEn}
                    {language === "de" && tool.descDe}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            {language === "ar" && "جميع الأدوات تعمل بدون اتصال بالإنترنت وبخصوصية كاملة"}
            {language === "en" && "All tools work offline with complete privacy"}
            {language === "de" && "Alle Tools funktionieren offline mit vollständiger Privatsphäre"}
          </p>
        </div>
      </div>
    </section>
  )
}
