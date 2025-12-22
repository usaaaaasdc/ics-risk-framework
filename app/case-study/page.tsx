"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, AlertTriangle, Shield, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function CaseStudyPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "ar" && "العودة للصفحة الرئيسية"}
              {language === "en" && "Back to Home"}
              {language === "de" && "Zurück zur Startseite"}
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {language === "ar" && "دراسة حالة: تقييم أمني لمصنع صلب"}
            {language === "en" && "Case Study: Security Assessment of a Steel Manufacturing Plant"}
            {language === "de" && "Fallstudie: Sicherheitsbewertung eines Stahlwerks"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === "ar" && "مثال عملي على استخدام الأداة في بيئة صناعية حقيقية"}
            {language === "en" && "Practical example of using the tool in a real industrial environment"}
            {language === "de" && "Praktisches Beispiel für die Verwendung des Tools in einer realen Industrieumgebung"}
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {language === "ar" && "نظرة عامة"}
              {language === "en" && "Overview"}
              {language === "de" && "Übersicht"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "نوع المنشأة"}
                  {language === "en" && "Facility Type"}
                  {language === "de" && "Anlagentyp"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" && "مصنع صلب متوسط الحجم - 500 موظف"}
                  {language === "en" && "Medium-sized steel manufacturing plant - 500 employees"}
                  {language === "de" && "Mittelgroßes Stahlwerk - 500 Mitarbeiter"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "الموقع"}
                  {language === "en" && "Location"}
                  {language === "de" && "Standort"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" && "تركيا (مجهول الاسم للخصوصية)"}
                  {language === "en" && "Turkey (anonymized for privacy)"}
                  {language === "de" && "Türkei (anonymisiert aus Datenschutzgründen)"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "تاريخ التقييم"}
                  {language === "en" && "Assessment Date"}
                  {language === "de" && "Bewertungsdatum"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" && "نوفمبر 2024"}
                  {language === "en" && "November 2024"}
                  {language === "de" && "November 2024"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "المدة"}
                  {language === "en" && "Duration"}
                  {language === "de" && "Dauer"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" && "3 أيام"}
                  {language === "en" && "3 days"}
                  {language === "de" && "3 Tage"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" && "تكوين النظام"}
              {language === "en" && "System Configuration"}
              {language === "de" && "Systemkonfiguration"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "الأجهزة المستخدمة"}
                  {language === "en" && "Devices Used"}
                  {language === "de" && "Verwendete Geräte"}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>5× Siemens S7-1200 PLC (Firmware v4.2)</li>
                  <li>3× Siemens S7-300 PLC (Firmware v3.3 - Legacy)</li>
                  <li>2× Siemens SIMATIC HMI TP1200</li>
                  <li>4× Schneider Electric Modicon M340</li>
                  <li>2× Allen-Bradley ControlLogix 5570</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "البروتوكولات النشطة"}
                  {language === "en" && "Active Protocols"}
                  {language === "de" && "Aktive Protokolle"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Modbus TCP</Badge>
                  <Badge>Profinet</Badge>
                  <Badge>S7comm</Badge>
                  <Badge>EtherNet/IP</Badge>
                  <Badge>OPC-UA</Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "الشبكة"}
                  {language === "en" && "Network"}
                  {language === "de" && "Netzwerk"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" && "شبكة OT منفصلة جزئياً عن IT، مع جسر firewall واحد للمراقبة عن بعد"}
                  {language === "en" &&
                    "OT network partially segregated from IT, with one firewall bridge for remote monitoring"}
                  {language === "de" &&
                    "OT-Netzwerk teilweise von IT getrennt, mit einer Firewall-Brücke für Fernüberwachung"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Findings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              {language === "ar" && "النتائج الرئيسية"}
              {language === "en" && "Key Findings"}
              {language === "de" && "Wichtigste Ergebnisse"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">
                    {language === "ar" && "حرج"}
                    {language === "en" && "Critical"}
                    {language === "de" && "Kritisch"}
                  </Badge>
                  <h3 className="font-semibold">
                    {language === "ar" && "3 ثغرات حرجة"}
                    {language === "en" && "3 Critical Vulnerabilities"}
                    {language === "de" && "3 kritische Schwachstellen"}
                  </h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>CVE-2019-13945 (Siemens S7-300): Authentication Bypass (CVSS 9.8)</li>
                  <li>CVE-2020-15782 (Modicon M340): Remote Code Execution (CVSS 9.0)</li>
                  <li>
                    {language === "ar" && "اتصال مباشر بالإنترنت بدون VPN"}
                    {language === "en" && "Direct internet connection without VPN"}
                    {language === "de" && "Direkte Internetverbindung ohne VPN"}
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-yellow-500/20">
                    {language === "ar" && "عالي"}
                    {language === "en" && "High"}
                    {language === "de" && "Hoch"}
                  </Badge>
                  <h3 className="font-semibold">
                    {language === "ar" && "7 ثغرات عالية الخطورة"}
                    {language === "en" && "7 High-Severity Vulnerabilities"}
                    {language === "de" && "7 hochgefährliche Schwachstellen"}
                  </h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    {language === "ar" && "كلمات مرور افتراضية على أجهزة HMI"}
                    {language === "en" && "Default passwords on HMI devices"}
                    {language === "de" && "Standardpasswörter auf HMI-Geräten"}
                  </li>
                  <li>
                    {language === "ar" && "عدم تشفير اتصالات Modbus TCP"}
                    {language === "en" && "Unencrypted Modbus TCP communications"}
                    {language === "de" && "Unverschlüsselte Modbus TCP-Kommunikation"}
                  </li>
                  <li>
                    {language === "ar" && "نقص في تسجيل الأحداث الأمنية (Logging)"}
                    {language === "en" && "Lack of security event logging"}
                    {language === "de" && "Fehlende Sicherheitsereignisprotokollierung"}
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-green-500/30 rounded-lg bg-green-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-green-500/20">
                    {language === "ar" && "متوسط"}
                    {language === "en" && "Medium"}
                    {language === "de" && "Mittel"}
                  </Badge>
                  <h3 className="font-semibold">
                    {language === "ar" && "12 ثغرة متوسطة"}
                    {language === "en" && "12 Medium-Severity Issues"}
                    {language === "de" && "12 Probleme mittlerer Schwere"}
                  </h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {language === "ar" && "درجة المخاطر الإجمالية"}
              {language === "en" && "Overall Risk Score"}
              {language === "de" && "Gesamtrisikobewertung"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-red-500">8.2</div>
              <p className="text-xl text-muted-foreground">
                {language === "ar" && "مخاطر عالية - يتطلب إجراء فوري"}
                {language === "en" && "High Risk - Immediate Action Required"}
                {language === "de" && "Hohes Risiko - Sofortiges Handeln erforderlich"}
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">CVSS Average</p>
                  <p className="text-2xl font-bold">7.8</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "التعرض للإنترنت"}
                    {language === "en" && "Internet Exposure"}
                    {language === "de" && "Internet-Exposition"}
                  </p>
                  <p className="text-2xl font-bold text-red-500">
                    {language === "ar" && "نعم"}
                    {language === "en" && "Yes"}
                    {language === "de" && "Ja"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "أنظمة قديمة"}
                    {language === "en" && "Legacy Systems"}
                    {language === "de" && "Legacy-Systeme"}
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              {language === "ar" && "التوصيات الأمنية"}
              {language === "en" && "Security Recommendations"}
              {language === "de" && "Sicherheitsempfehlungen"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-red-500">
                  {language === "ar" && "فورية (0-30 يوم)"}
                  {language === "en" && "Immediate (0-30 days)"}
                  {language === "de" && "Sofort (0-30 Tage)"}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    {language === "ar" && "فصل الاتصال المباشر بالإنترنت وتطبيق VPN"}
                    {language === "en" && "Disconnect direct internet connection and implement VPN"}
                    {language === "de" && "Direkte Internetverbindung trennen und VPN implementieren"}
                  </li>
                  <li>
                    {language === "ar" && "تحديث firmware لأجهزة Siemens S7-300"}
                    {language === "en" && "Update firmware for Siemens S7-300 devices"}
                    {language === "de" && "Firmware für Siemens S7-300-Geräte aktualisieren"}
                  </li>
                  <li>
                    {language === "ar" && "تغيير جميع كلمات المرور الافتراضية"}
                    {language === "en" && "Change all default passwords"}
                    {language === "de" && "Alle Standardpasswörter ändern"}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-yellow-600">
                  {language === "ar" && "قصيرة المدى (1-3 أشهر)"}
                  {language === "en" && "Short-term (1-3 months)"}
                  {language === "de" && "Kurzfristig (1-3 Monate)"}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    {language === "ar" && "تنفيذ Network Segmentation كامل"}
                    {language === "en" && "Implement complete network segmentation"}
                    {language === "de" && "Vollständige Netzwerksegmentierung implementieren"}
                  </li>
                  <li>
                    {language === "ar" && "تفعيل تسجيل الأحداث الأمنية (SIEM)"}
                    {language === "en" && "Enable security event logging (SIEM)"}
                    {language === "de" && "Sicherheitsereignisprotokollierung aktivieren (SIEM)"}
                  </li>
                  <li>
                    {language === "ar" && "تطبيق مصادقة متعددة العوامل (MFA)"}
                    {language === "en" && "Implement multi-factor authentication (MFA)"}
                    {language === "de" && "Multi-Faktor-Authentifizierung implementieren (MFA)"}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-green-600">
                  {language === "ar" && "طويلة المدى (6-12 شهر)"}
                  {language === "en" && "Long-term (6-12 months)"}
                  {language === "de" && "Langfristig (6-12 Monate)"}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    {language === "ar" && "استبدال الأنظمة القديمة (S7-300)"}
                    {language === "en" && "Replace legacy systems (S7-300)"}
                    {language === "de" && "Legacy-Systeme ersetzen (S7-300)"}
                  </li>
                  <li>
                    {language === "ar" && "تحقيق الامتثال لمعيار IEC 62443"}
                    {language === "en" && "Achieve IEC 62443 compliance"}
                    {language === "de" && "IEC 62443-Konformität erreichen"}
                  </li>
                  <li>
                    {language === "ar" && "تدريب الموظفين على الأمن السيبراني"}
                    {language === "en" && "Train staff on cybersecurity"}
                    {language === "de" && "Mitarbeiter in Cybersicherheit schulen"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outcome */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {language === "ar" && "النتيجة"}
              {language === "en" && "Outcome"}
              {language === "de" && "Ergebnis"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {language === "ar" &&
                "بعد 6 أشهر من تنفيذ التوصيات، تم تقليل درجة المخاطر من 8.2 إلى 3.8، مع تحسين كبير في الوضع الأمني للمصنع. تم إغلاق جميع الثغرات الحرجة وتطبيق أفضل الممارسات الأمنية."}
              {language === "en" &&
                "After 6 months of implementing the recommendations, the risk score was reduced from 8.2 to 3.8, with significant improvement in the plant's security posture. All critical vulnerabilities were closed and security best practices were applied."}
              {language === "de" &&
                "Nach 6 Monaten Umsetzung der Empfehlungen wurde die Risikobewertung von 8.2 auf 3.8 reduziert, mit erheblicher Verbesserung der Sicherheitslage des Werks. Alle kritischen Schwachstellen wurden geschlossen und Sicherheits-Best-Practices angewendet."}
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === "ar" && "التكلفة الإجمالية"}
                  {language === "en" && "Total Cost"}
                  {language === "de" && "Gesamtkosten"}
                </p>
                <p className="text-2xl font-bold">$85,000</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === "ar" && "الوقت المستغرق"}
                  {language === "en" && "Time Taken"}
                  {language === "de" && "Benötigte Zeit"}
                </p>
                <p className="text-2xl font-bold">
                  {language === "ar" && "6 أشهر"}
                  {language === "en" && "6 months"}
                  {language === "de" && "6 Monate"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">ROI</p>
                <p className="text-2xl font-bold text-green-500">340%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Learned */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" && "الدروس المستفادة"}
              {language === "en" && "Lessons Learned"}
              {language === "de" && "Gelernte Lektionen"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                ✓ {language === "ar" && "أهمية الفصل بين شبكات OT و IT لتقليل سطح الهجوم"}
                {language === "en" && "Importance of OT/IT network segregation to reduce attack surface"}
                {language === "de" && "Wichtigkeit der OT/IT-Netzwerktrennung zur Reduzierung der Angriffsfläche"}
              </li>
              <li>
                ✓ {language === "ar" && "الأنظمة القديمة تشكل خطراً كبيراً ويجب التعامل معها بأولوية"}
                {language === "en" && "Legacy systems pose significant risk and must be prioritized"}
                {language === "de" && "Legacy-Systeme stellen ein erhebliches Risiko dar und müssen priorisiert werden"}
              </li>
              <li>
                ✓ {language === "ar" && "التدريب المستمر للموظفين ضروري لاستدامة الأمن"}
                {language === "en" && "Continuous staff training is essential for security sustainability"}
                {language === "de" &&
                  "Kontinuierliche Mitarbeiterschulung ist für die Sicherheitsnachhaltigkeit unerlässlich"}
              </li>
              <li>
                ✓ {language === "ar" && "أدوات التقييم الأمني المفتوحة المصدر فعالة وعملية"}
                {language === "en" && "Open-source security assessment tools are effective and practical"}
                {language === "de" && "Open-Source-Sicherheitsbewertungstools sind effektiv und praktisch"}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
