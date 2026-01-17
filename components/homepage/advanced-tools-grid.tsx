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
  Shield,
  LayoutDashboard,
  Search,
  Siren,
  LineChart,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdvancedToolsGrid() {
  const { language } = useLanguage()

  const tools = {
    assessment: [
      {
        href: "/iec-calculator",
        icon: Shield,
        color: "blue",
        titleAr: "حاسبة IEC 62443",
        titleEn: "IEC 62443 Calc",
        titleDe: "IEC 62443 Rechner",
        descAr: "حساب مستوى الأمان (SL)",
        descEn: "Calculate Security Level",
        descDe: "Sicherheitsniveau berechnen",
        titleTr: "IEC 62443 Hesaplayıcı",
        descTr: "Güvenlik Seviyesini (SL) Hesapla",
      },
      {
        href: "/risk-simulation",
        icon: Activity,
        color: "red",
        titleAr: "محاكاة المخاطر",
        titleEn: "Risk Simulation",
        titleDe: "Risikosimulation",
        descAr: "نموذج مونت كارلو",
        descEn: "Monte Carlo Model",
        descDe: "Monte-Carlo-Modell",
        titleTr: "Risk Simülasyonu",
        descTr: "Monte Carlo Modeli",
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
        titleTr: "Tedarik Zinciri",
        descTr: "Tedarikçi risk değerlendirmesi",
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
        titleTr: "Saldırı Simülasyonu",
        descTr: "4 gerçekçi senaryo",
      },
    ],
    detection: [
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
    ],
    response: [
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
    ],
    management: [
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
    ]
  }

  const categories = [
    { id: 'assessment', labelEn: 'Assessment', labelAr: 'التقييم', labelDe: 'Bewertung', labelTr: 'Değerlendirme', icon: LineChart },
    { id: 'detection', labelEn: 'Detection & Analysis', labelAr: 'الكشف والتحليل', labelDe: 'Erkennung & Analyse', labelTr: 'Tespit & Analiz', icon: Search },
    { id: 'response', labelEn: 'Response', labelAr: 'الاستجابة', labelDe: 'Reaktion', labelTr: 'Müdahale', icon: Siren },
    { id: 'management', labelEn: 'Management', labelAr: 'الإدارة', labelDe: 'Management', labelTr: 'Yönetim', icon: LayoutDashboard },
  ]

  return (
    <section className="container mx-auto px-4 py-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "ar" && "مجموعة الأدوات الهندسية"}
            {language === "en" && "Engineering Toolset"}
            {language === "de" && "Engineering-Toolkit"}
            {language === "tr" && "Mühendislik Araç Seti"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar" && "منظومة متكاملة لدورة حياة الأمن السيبراني الصناعي"}
            {language === "en" && "Integrated ecosystem for ICS security lifecycle"}
            {language === "de" && "Integriertes Ökosystem für den ICS-Sicherheitslebenszyklus"}
            {language === "tr" && "ICS güvenlik yaşam döngüsü için entegre ekosistem"}
          </p>
        </div>

        <Tabs defaultValue="assessment" className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-muted/50 p-1 h-auto">
              {categories.map(cat => {
                const Icon = cat.icon
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>
                      {language === 'ar' ? cat.labelAr : language === 'de' ? cat.labelDe : language === 'tr' ? cat.labelTr : cat.labelEn}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {tools[cat.id as keyof typeof tools].map((tool: any) => {
                  const Icon = tool.icon
                  return (
                    <Link key={tool.href} href={tool.href}>
                      <Card
                        className={`p-6 hover:shadow-xl transition-all border-2 hover:border-${tool.color}-500/50 bg-gradient-to-br from-${tool.color}-500/5 to-transparent h-full group`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <Icon className={`w-10 h-10 text-${tool.color}-600 dark:text-${tool.color}-400 group-hover:scale-110 transition-transform`} />
                          <div className={`w-2 h-2 rounded-full bg-${tool.color}-500 opacity-50`} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          {language === "ar" && tool.titleAr}
                          {language === "en" && tool.titleEn}
                          {language === "de" && tool.titleDe}
                          {language === "tr" && tool.titleTr}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" && tool.descAr}
                          {language === "en" && tool.descEn}
                          {language === "de" && tool.descDe}
                          {language === "tr" && tool.descTr}
                        </p>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            {language === "ar" && "جميع الأدوات متوافقة مع معايير IEC 62443 و NIST"}
            {language === "en" && "All tools compliant with IEC 62443 & NIST standards"}
            {language === "de" && "Alle Tools entsprechen den Standards IEC 62443 & NIST"}
            {language === "tr" && "Tüm araçlar IEC 62443 & NIST standartlarına uygundur"}
          </p>
        </div>
      </div>
    </section>
  )
}

