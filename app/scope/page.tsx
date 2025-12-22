"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Shield, CheckCircle, XCircle, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ScopePage() {
  const { t, language } = useLanguage()

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {language === "ar" && "نطاق التغطية"}
                  {language === "en" && "Scope & Coverage"}
                  {language === "de" && "Umfang & Abdeckung"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" && "ما يغطيه الإطار وما لا يغطيه"}
                  {language === "en" && "What the framework covers and what it doesn't"}
                  {language === "de" && "Was das Framework abdeckt und was nicht"}
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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* What We Cover */}
          <Card className="p-6 border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-green-500">
                {language === "ar" && "ما نغطيه"}
                {language === "en" && "What We Cover"}
                {language === "de" && "Was wir abdecken"}
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                {
                  en: "Known CVE vulnerabilities in ICS/SCADA systems",
                  ar: "الثغرات المعروفة CVE في أنظمة ICS/SCADA",
                  de: "Bekannte CVE-Schwachstellen in ICS/SCADA-Systemen",
                },
                {
                  en: "Configuration weaknesses (network exposure, legacy systems)",
                  ar: "نقاط ضعف التكوين (التعرض للشبكة، الأنظمة القديمة)",
                  de: "Konfigurationsschwächen (Netzwerkexposition, Legacy-Systeme)",
                },
                {
                  en: "Protocol-level vulnerabilities (Modbus, DNP3, OPC UA)",
                  ar: "ثغرات على مستوى البروتوكول (Modbus، DNP3، OPC UA)",
                  de: "Protokollebene-Schwachstellen (Modbus, DNP3, OPC UA)",
                },
                {
                  en: "STRIDE threat modeling for industrial systems",
                  ar: "نمذجة التهديدات STRIDE للأنظمة الصناعية",
                  de: "STRIDE-Bedrohungsmodellierung für industrielle Systeme",
                },
                {
                  en: "IEC 62443 and NIST compliance checking",
                  ar: "فحص الامتثال لمعايير IEC 62443 و NIST",
                  de: "IEC 62443 und NIST Compliance-Prüfung",
                },
                {
                  en: "Attack surface mapping and risk scoring",
                  ar: "رسم خريطة سطح الهجوم وتسجيل المخاطر",
                  de: "Angriffsflächen-Mapping und Risikobewertung",
                },
                {
                  en: "Vendor-specific vulnerabilities (Siemens, Rockwell, etc.)",
                  ar: "ثغرات خاصة بالمصنعين (Siemens، Rockwell، إلخ)",
                  de: "Herstellerspezifische Schwachstellen (Siemens, Rockwell usw.)",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item[language as keyof typeof item] || item.en}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* What We Don't Cover */}
          <Card className="p-6 border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-red-500">
                {language === "ar" && "ما لا نغطيه"}
                {language === "en" && "What We Don't Cover"}
                {language === "de" && "Was wir nicht abdecken"}
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                {
                  en: "Social engineering attacks (phishing, insider threats)",
                  ar: "هجمات الهندسة الاجتماعية (التصيد، التهديدات الداخلية)",
                  de: "Social-Engineering-Angriffe (Phishing, Insider-Bedrohungen)",
                },
                {
                  en: "Physical security vulnerabilities (access control, surveillance)",
                  ar: "ثغرات الأمن المادي (التحكم في الوصول، المراقبة)",
                  de: "Physische Sicherheitslücken (Zugriffskontrolle, Überwachung)",
                },
                {
                  en: "Custom malware or APT campaigns (Stuxnet-style attacks)",
                  ar: "برامج ضارة مخصصة أو حملات APT (هجمات من نوع Stuxnet)",
                  de: "Maßgeschneiderte Malware oder APT-Kampagnen (Stuxnet-ähnliche Angriffe)",
                },
                {
                  en: "Supply chain security risks",
                  ar: "مخاطر أمن سلسلة التوريد",
                  de: "Sicherheitsrisiken in der Lieferkette",
                },
                {
                  en: "Compliance with local/national regulations (beyond IEC/NIST)",
                  ar: "الامتثال للوائح المحلية/الوطنية (بخلاف IEC/NIST)",
                  de: "Einhaltung lokaler/nationaler Vorschriften (außer IEC/NIST)",
                },
                {
                  en: "Real-time network traffic analysis",
                  ar: "تحليل حركة الشبكة في الوقت الفعلي",
                  de: "Echtzeit-Netzwerkverkehrsanalyse",
                },
                {
                  en: "Penetration testing or active vulnerability scanning",
                  ar: "اختبار الاختراق أو فحص الثغرات النشط",
                  de: "Penetrationstests oder aktives Schwachstellenscanning",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{item[language as keyof typeof item] || item.en}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* When to Use Other Tools */}
        <Card className="p-6 bg-yellow-500/5 border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">
              {language === "ar" && "متى تستخدم أدوات أخرى"}
              {language === "en" && "When to Use Additional Tools"}
              {language === "de" && "Wann zusätzliche Tools verwenden"}
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {language === "ar" && "ICS-Risk هو جزء من استراتيجية أمن شاملة. للحماية الكاملة، ستحتاج إلى:"}
              {language === "en" &&
                "ICS-Risk is part of a comprehensive security strategy. For complete protection, you'll need:"}
              {language === "de" &&
                "ICS-Risk ist Teil einer umfassenden Sicherheitsstrategie. Für vollständigen Schutz benötigen Sie:"}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: { en: "Network Monitoring", ar: "مراقبة الشبكة", de: "Netzwerküberwachung" },
                  tools: "Wireshark, Zeek, GRASSMARLIN",
                  use: {
                    en: "Real-time traffic analysis",
                    ar: "تحليل حركة المرور في الوقت الفعلي",
                    de: "Echtzeit-Verkehrsanalyse",
                  },
                },
                {
                  title: { en: "Penetration Testing", ar: "اختبار الاختراق", de: "Penetrationstests" },
                  tools: "Metasploit, SCADA Shutdown Tool",
                  use: {
                    en: "Active vulnerability verification",
                    ar: "التحقق النشط من الثغرات",
                    de: "Aktive Schwachstellenüberprüfung",
                  },
                },
                {
                  title: { en: "SIEM Integration", ar: "تكامل SIEM", de: "SIEM-Integration" },
                  tools: "Splunk, QRadar, ArcSight",
                  use: {
                    en: "Centralized log management",
                    ar: "إدارة السجلات المركزية",
                    de: "Zentrale Protokollverwaltung",
                  },
                },
                {
                  title: { en: "Asset Discovery", ar: "اكتشاف الأصول", de: "Asset-Erkennung" },
                  tools: "Nmap, Shodan, BinaryEdge",
                  use: { en: "Network device inventory", ar: "جرد أجهزة الشبكة", de: "Netzwerkgeräteinventar" },
                },
              ].map((tool, index) => (
                <div key={index} className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">
                    {tool.title[language as keyof typeof tool.title] || tool.title.en}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>
                      {language === "ar" && "الأدوات:"}
                      {language === "en" && "Tools:"}
                      {language === "de" && "Werkzeuge:"}
                    </strong>{" "}
                    {tool.tools}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>
                      {language === "ar" && "الاستخدام:"}
                      {language === "en" && "Use:"}
                      {language === "de" && "Verwendung:"}
                    </strong>{" "}
                    {tool.use[language as keyof typeof tool.use] || tool.use.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">
            {language === "ar" && "أفضل الممارسات"}
            {language === "en" && "Best Practices"}
            {language === "de" && "Best Practices"}
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {[
              {
                en: "Use ICS-Risk for initial risk assessment and vulnerability mapping",
                ar: "استخدم ICS-Risk للتقييم الأولي للمخاطر ورسم خريطة الثغرات",
                de: "Verwenden Sie ICS-Risk für erste Risikobewertung und Schwachstellenmapping",
              },
              {
                en: "Follow up with network monitoring tools for continuous visibility",
                ar: "تابع بأدوات مراقبة الشبكة للحصول على رؤية مستمرة",
                de: "Folgen Sie mit Netzwerküberwachungstools für kontinuierliche Sichtbarkeit",
              },
              {
                en: "Conduct annual penetration tests to verify findings",
                ar: "أجرِ اختبارات اختراق سنوية للتحقق من النتائج",
                de: "Führen Sie jährliche Penetrationstests durch, um Ergebnisse zu überprüfen",
              },
              {
                en: "Integrate with SIEM for centralized security management",
                ar: "تكامل مع SIEM لإدارة الأمن المركزية",
                de: "Integrieren Sie mit SIEM für zentrales Sicherheitsmanagement",
              },
              {
                en: "Keep the vulnerability database updated quarterly",
                ar: "حافظ على تحديث قاعدة بيانات الثغرات ربع سنوياً",
                de: "Halten Sie die Schwachstellendatenbank vierteljährlich aktualisiert",
              },
            ].map((item, index) => (
              <li key={index} className="text-muted-foreground">
                {item[language as keyof typeof item] || item.en}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </main>
  )
}
