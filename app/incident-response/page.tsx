"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Shield, Network, Power, Lock, Eye, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function IncidentResponsePage() {
  const { language } = useLanguage()

  const immediateActions = [
    {
      priority: 1,
      icon: Network,
      titleEn: "Isolate Affected Systems",
      titleAr: "عزل الأنظمة المتضررة",
      titleDe: "Betroffene Systeme isolieren",
      actionEn:
        "Disconnect the compromised HMI/PLC from the network immediately. Use physical disconnection if possible.",
      actionAr: "افصل HMI/PLC المخترق من الشبكة فوراً. استخدم الفصل الفيزيائي إن أمكن.",
      actionDe:
        "Trennen Sie das kompromittierte HMI/PLC sofort vom Netzwerk. Verwenden Sie nach Möglichkeit physische Trennung.",
      color: "red",
    },
    {
      priority: 2,
      icon: Power,
      titleEn: "Disable Remote Access",
      titleAr: "تعطيل الوصول عن بعد",
      titleDe: "Fernzugriff deaktivieren",
      actionEn: "Block all external connections: Modbus TCP, OPC-UA, HTTP/HTTPS, VNC, RDP.",
      actionAr: "احظر جميع الاتصالات الخارجية: Modbus TCP، OPC-UA، HTTP/HTTPS، VNC، RDP.",
      actionDe: "Alle externen Verbindungen blockieren: Modbus TCP, OPC-UA, HTTP/HTTPS, VNC, RDP.",
      color: "orange",
    },
    {
      priority: 3,
      icon: Lock,
      titleEn: "Change All Credentials",
      titleAr: "تغيير جميع بيانات الاعتماد",
      titleDe: "Alle Zugangsdaten ändern",
      actionEn: "Immediately change passwords for: Engineering workstations, HMI, SCADA servers, network devices.",
      actionAr: "غيّر كلمات المرور فوراً لـ: محطات الهندسة، HMI، خوادم SCADA، أجهزة الشبكة.",
      actionDe: "Passwörter sofort ändern für: Engineering-Workstations, HMI, SCADA-Server, Netzwerkgeräte.",
      color: "yellow",
    },
    {
      priority: 4,
      icon: Eye,
      titleEn: "Enable Enhanced Monitoring",
      titleAr: "تفعيل المراقبة المعززة",
      titleDe: "Erweiterte Überwachung aktivieren",
      actionEn:
        "Turn on maximum logging on all devices. Monitor for: Unusual traffic patterns, unauthorized commands, config changes.",
      actionAr: "فعّل السجلات الكاملة على جميع الأجهزة. راقب: أنماط غير عادية، أوامر غير مصرح بها، تغييرات الإعدادات.",
      actionDe:
        "Maximale Protokollierung auf allen Geräten aktivieren. Überwachen: Ungewöhnliche Verkehrsmuster, unbefugte Befehle, Konfigurationsänderungen.",
      color: "blue",
    },
    {
      priority: 5,
      icon: FileText,
      titleEn: "Document Everything",
      titleAr: "توثيق كل شيء",
      titleDe: "Alles dokumentieren",
      actionEn:
        "Record: Time of detection, affected systems, actions taken, who was notified. This is critical for forensics.",
      actionAr: "سجّل: وقت الاكتشاف، الأنظمة المتضررة، الإجراءات المتخذة، من تم إخباره. هذا حاسم للتحليل الجنائي.",
      actionDe:
        "Aufzeichnen: Erkennungszeit, betroffene Systeme, ergriffene Maßnahmen, wer benachrichtigt wurde. Dies ist für die Forensik entscheidend.",
      color: "purple",
    },
  ]

  const iocs = [
    {
      typeEn: "Network IOCs",
      typeAr: "مؤشرات الشبكة",
      typeDe: "Netzwerk-IOCs",
      indicators: [
        "Unusual Modbus function codes (0x5A, 0x5B, 0x7B, 0x7C)",
        "Traffic to/from unexpected IP ranges",
        "Large data transfers at unusual times",
        "Repeated authentication failures",
      ],
    },
    {
      typeEn: "System IOCs",
      typeAr: "مؤشرات النظام",
      typeDe: "System-IOCs",
      indicators: [
        "Unauthorized ladder logic changes",
        "New user accounts created",
        "Configuration backups missing",
        "System time changes",
      ],
    },
    {
      typeEn: "Process IOCs",
      typeAr: "مؤشرات العملية",
      typeDe: "Prozess-IOCs",
      indicators: [
        "Unexpected process shutdowns",
        "Setpoint changes without authorization",
        "Safety system bypasses",
        "Abnormal sensor readings",
      ],
    },
  ]

  const resources = [
    {
      nameEn: "ICS-CERT Advisories",
      nameAr: "تنبيهات ICS-CERT",
      nameDe: "ICS-CERT-Warnungen",
      url: "https://www.cisa.gov/uscert/ics/advisories",
      descEn: "Latest security advisories for industrial systems",
      descAr: "أحدث التنبيهات الأمنية للأنظمة الصناعية",
      descDe: "Neueste Sicherheitshinweise für industrielle Systeme",
    },
    {
      nameEn: "NIST ICS Security",
      nameAr: "أمن ICS من NIST",
      nameDe: "NIST ICS-Sicherheit",
      url: "https://www.nist.gov/programs-projects/industrial-control-systems-security",
      descEn: "NIST guidelines and best practices",
      descAr: "إرشادات وأفضل الممارسات من NIST",
      descDe: "NIST-Richtlinien und Best Practices",
    },
    {
      nameEn: "SANS ICS Resources",
      nameAr: "موارد SANS لـ ICS",
      nameDe: "SANS ICS-Ressourcen",
      url: "https://www.sans.org/industrial-control-systems-security/",
      descEn: "Training and incident response guides",
      descAr: "أدلة التدريب والاستجابة للحوادث",
      descDe: "Schulungs- und Incident-Response-Leitfäden",
    },
  ]

  const getTitle = (item: any) => (language === "ar" ? item.titleAr : language === "de" ? item.titleDe : item.titleEn)
  const getAction = (item: any) => (language === "ar" ? item.actionAr : language === "de" ? item.actionDe : item.actionEn)
  const getType = (item: any) => (language === "ar" ? item.typeAr : language === "de" ? item.typeDe : item.typeEn)
  const getName = (item: any) => (language === "ar" ? item.nameAr : language === "de" ? item.nameDe : item.nameEn)
  const getDesc = (item: any) => (language === "ar" ? item.descAr : language === "de" ? item.descDe : item.descEn)

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="h-12 w-12 text-red-500 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500">
              {language === "ar" ? "وضع الطوارئ" : language === "de" ? "Notfallmodus" : "INCIDENT RESPONSE MODE"}
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            {language === "ar"
              ? "إجراءات فورية عند اكتشاف هجوم على أنظمة التحكم الصناعي"
              : language === "de"
                ? "Sofortmaßnahmen bei Angriffen auf industrielle Steuerungssysteme"
                : "Immediate Actions for ICS/SCADA Security Incidents"}
          </p>
        </div>

        {/* Critical Alert */}
        <Alert className="border-red-500 bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertDescription className="text-lg">
            {language === "ar"
              ? "⚠️ هذه الإجراءات للطوارئ فقط. قد تؤدي لتوقف الإنتاج. تأكد من إخطار الإدارة فوراً."
              : language === "de"
                ? "⚠️ Nur für Notfälle. Kann zu Produktionsausfällen führen. Management sofort benachrichtigen."
                : "⚠️ Emergency procedures only. May cause production downtime. Notify management immediately."}
          </AlertDescription>
        </Alert>

        {/* Immediate Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            {language === "ar"
              ? "الإجراءات الفورية (5 دقائق)"
              : language === "de"
                ? "Sofortmaßnahmen (5 Minuten)"
                : "Immediate Actions (5 Minutes)"}
          </h2>

          <div className="space-y-4">
            {immediateActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.priority} className="border-l-4 border-l-red-500 bg-gray-900">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-${action.color}-500/20`}>
                        <Icon className={`h-6 w-6 text-${action.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            #{action.priority}
                          </span>
                          <CardTitle className="text-xl">{getTitle(action)}</CardTitle>
                        </div>
                        <CardDescription className="text-base mt-2 text-gray-300">{getAction(action)}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* IOCs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {language === "ar"
              ? "مؤشرات الاختراق (IOCs)"
              : language === "de"
                ? "Kompromittierungsindikatoren (IOCs)"
                : "Indicators of Compromise (IOCs)"}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {iocs.map((category, idx) => (
              <Card key={idx} className="bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-500">{getType(category)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.indicators.map((indicator, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span className="text-gray-300">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {language === "ar"
              ? "موارد خارجية للمساعدة"
              : language === "de"
                ? "Externe Hilfsressourcen"
                : "External Resources for Help"}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {resources.map((resource, idx) => (
              <Card key={idx} className="bg-gray-900 hover:bg-gray-800 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getName(resource)}
                    <ExternalLink className="h-4 w-4" />
                  </CardTitle>
                  <CardDescription>{getDesc(resource)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {language === "ar" ? "فتح الرابط" : language === "de" ? "Link öffnen" : "Open Link"}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-8">
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              {language === "ar"
                ? "← العودة للصفحة الرئيسية"
                : language === "de"
                  ? "← Zurück zur Startseite"
                  : "← Back to Home"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

