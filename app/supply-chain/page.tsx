"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { calculateVendorRisk, compareVendors, type VendorRiskProfile } from "@/lib/supply-chain-risk"
import { ArrowLeft, Package, Shield, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"

const VENDORS = ["Siemens", "Rockwell Automation", "Schneider Electric", "HollySys", "Mitsubishi", "ABB", "Honeywell"]

function getRiskFactors(profile: VendorRiskProfile): string[] {
  const factors: string[] = []
  const criticalIncidents = profile.incidents.filter((incident) => incident.severity === "Critical").length
  const recentCriticalCves = profile.cveHistory.reduce((sum, year) => sum + year.critical, 0)

  if (profile.trustScore < 70) factors.push("Lower trust score requires compensating controls and tighter monitoring.")
  if (profile.responseTime.avg_days > 60) factors.push("Longer vulnerability response time can extend OT exposure windows.")
  if (criticalIncidents > 0) factors.push(`${criticalIncidents} critical incident(s) require stronger patch governance.`)
  if (recentCriticalCves > 20) factors.push("High critical CVE volume should influence spare-part and firmware policy.")
  if (profile.certifications.length === 0) factors.push("No security certifications are available in the local dataset.")
  if (factors.length === 0) factors.push("No major supply-chain risk factor is highlighted by the local dataset.")

  return factors
}

export default function SupplyChainPage() {
  const { language } = useLanguage()
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  const selectedVendor = selectedVendors.length === 1 ? selectedVendors[0] : null
  const vendorProfile = selectedVendor ? calculateVendorRisk(selectedVendor) : null
  const comparison = comparisonMode && selectedVendors.length >= 2 ? compareVendors(selectedVendors) : null

  const t = {
    back: language === "ar" ? "العودة للرئيسية" : language === "de" ? "Zurück zur Startseite" : "Back to Home",
    title: language === "ar" ? "تقييم مخاطر سلسلة التوريد" : language === "de" ? "Lieferkettenrisikobewertung" : "Supply Chain Risk Assessment",
    subtitle: language === "ar" ? "تحليل سجل الأمان التاريخي للمصنعين والموردين" : language === "de" ? "Analysieren Sie die historische Sicherheitsbilanz von Lieferanten" : "Analyze vendors' historical security track record",
    select: language === "ar" ? "اختر الموردين" : language === "de" ? "Lieferanten auswählen" : "Select Vendors",
    compare: language === "ar" ? "مقارنة" : language === "de" ? "Vergleichen" : "Compare",
    reset: language === "ar" ? "إعادة تعيين" : language === "de" ? "Zurücksetzen" : "Reset",
    comparisonResults: language === "ar" ? "نتائج المقارنة" : language === "de" ? "Vergleichsergebnisse" : "Comparison Results",
    recommendation: language === "ar" ? "التوصية: " : language === "de" ? "Empfehlung: " : "Recommendation: ",
    trustScoreComparison: language === "ar" ? "مقارنة درجات الثقة" : language === "de" ? "Vergleich der Vertrauenswerte" : "Trust Score Comparison",
    responseTime: language === "ar" ? "متوسط وقت الاستجابة (أيام)" : language === "de" ? "Durchschnittliche Antwortzeit (Tage)" : "Average Response Time (days)",
    marketShare: language === "ar" ? "حصة السوق: " : language === "de" ? "Marktanteil: " : "Market Share: ",
    rating: language === "ar" ? "التقييم: " : language === "de" ? "Bewertung: " : "Rating: ",
    certifications: language === "ar" ? "الشهادات:" : language === "de" ? "Zertifizierungen:" : "Certifications:",
    trustScore: language === "ar" ? "درجة الثقة" : language === "de" ? "Vertrauenswert" : "Trust Score",
    avgResponse: language === "ar" ? "متوسط وقت الاستجابة" : language === "de" ? "Durchschn. Antwortzeit" : "Avg Response Time",
    recordedIncidents: language === "ar" ? "الحوادث المسجلة" : language === "de" ? "Aufgezeichnete Vorfälle" : "Recorded Incidents",
    securityCertifications: language === "ar" ? "الشهادات الأمنية" : language === "de" ? "Sicherheitszertifizierungen" : "Security Certifications",
    cveHistory: language === "ar" ? "سجل الثغرات (CVE)" : language === "de" ? "CVE-Verlauf" : "CVE History",
    incidents: language === "ar" ? "الحوادث الأمنية الرئيسية" : language === "de" ? "Wichtige Sicherheitsvorfälle" : "Major Security Incidents",
    riskFactors: language === "ar" ? "عوامل مخاطر سلسلة التوريد" : language === "de" ? "Risikofaktoren der Lieferkette" : "Supply-Chain Risk Factors",
    recommendations: language === "ar" ? "التوصيات" : language === "de" ? "Empfehlungen" : "Recommendations",
    limitedProfile: language === "ar" ? "ملف المورد محدود" : language === "de" ? "Begrenztes Lieferantenprofil" : "Limited Vendor Profile",
    limitedProfileBody: language === "ar" ? "البيانات المحلية لهذا المورد محدودة، لذلك يتم عرض الحقول المتوفرة فقط." : language === "de" ? "Für diesen Lieferanten sind nur begrenzte lokale Daten verfügbar." : "The local dataset has limited data for this vendor, so only available fields are shown.",
    empty: language === "ar" ? "اختر موردا واحدا لعرض ملفه، أو اختر موردين أو أكثر للمقارنة." : language === "de" ? "Wählen Sie einen Lieferanten für Details oder mindestens zwei für den Vergleich." : "Select one vendor to view its profile, or select two or more vendors to compare.",
    days: language === "ar" ? "يوم" : "days",
  }

  const toggleVendorForComparison = (vendor: string) => {
    setComparisonMode(false)
    setSelectedVendors((prev) => (prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor]))
  }

  const handleCompare = () => {
    if (selectedVendors.length >= 2) setComparisonMode(true)
  }

  const handleReset = () => {
    setSelectedVendors([])
    setComparisonMode(false)
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const hasLimitedProfile = vendorProfile
    ? vendorProfile.cveHistory.length === 0 && vendorProfile.certifications.length === 0 && vendorProfile.incidents.length === 0
    : false

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Button>
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <Card className="mb-6 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Shield className="h-5 w-5" />
            {t.select}
          </h2>

          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {VENDORS.map((vendor) => (
              <Button
                key={vendor}
                variant={selectedVendors.includes(vendor) ? "default" : "outline"}
                onClick={() => toggleVendorForComparison(vendor)}
                className="h-auto py-3"
              >
                {vendor}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCompare} disabled={selectedVendors.length < 2} className="gap-2">
              <TrendingUp className="h-4 w-4" />
              {t.compare} ({selectedVendors.length})
            </Button>
            {selectedVendors.length > 0 && (
              <Button variant="outline" onClick={handleReset}>
                {t.reset}
              </Button>
            )}
          </div>
        </Card>

        {comparisonMode && comparison && (
          <Card className="mb-6 p-6">
            <h2 className="mb-4 text-2xl font-bold">{t.comparisonResults}</h2>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <p className="text-sm">
                <strong>{t.recommendation}</strong>
                {comparison.recommendation}
              </p>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-semibold">{t.trustScoreComparison}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparison.comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vendor" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="trustScore" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">{t.responseTime}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparison.comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vendor" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responseTime.avg_days" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              {comparison.comparison.map((profile) => (
                <Card key={profile.vendor} className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{profile.vendor}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.marketShare}
                        {profile.marketShare}%
                      </p>
                    </div>
                    <Badge className={getTrustScoreBadge(profile.trustScore)}>{profile.trustScore}/100</Badge>
                  </div>

                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-muted-foreground">{t.responseTime}: </span>
                      <span className="font-medium">
                        {profile.responseTime.avg_days} {t.days}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.rating}</span>
                      <span className="font-medium">{profile.responseTime.rating}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="mb-1 text-xs text-muted-foreground">{t.certifications}</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {vendorProfile && !comparisonMode && (
          <div className="space-y-6">
            {hasLimitedProfile && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t.limitedProfile}</AlertTitle>
                <AlertDescription>{t.limitedProfileBody}</AlertDescription>
              </Alert>
            )}

            <Card className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">{vendorProfile.vendor}</h2>
                  <p className="text-muted-foreground">
                    {t.marketShare}
                    {vendorProfile.marketShare}%
                  </p>
                </div>
                <div className={language === "ar" ? "text-left" : "text-right"}>
                  <div className="mb-1 text-sm text-muted-foreground">{t.trustScore}</div>
                  <div className={`text-4xl font-bold ${getTrustScoreColor(vendorProfile.trustScore)}`}>
                    {vendorProfile.trustScore}/100
                  </div>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <Card className="bg-muted/50 p-4">
                  <div className="mb-1 text-sm text-muted-foreground">{t.avgResponse}</div>
                  <div className="text-2xl font-bold">
                    {vendorProfile.responseTime.avg_days} {t.days}
                  </div>
                  <Badge className="mt-2">{vendorProfile.responseTime.rating}</Badge>
                </Card>

                <Card className="bg-muted/50 p-4">
                  <div className="mb-1 text-sm text-muted-foreground">{t.recordedIncidents}</div>
                  <div className="text-2xl font-bold">{vendorProfile.incidents.length}</div>
                </Card>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  {t.securityCertifications}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vendorProfile.certifications.length > 0 ? (
                    vendorProfile.certifications.map((cert) => (
                      <Badge key={cert} variant="outline">
                        {cert}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No certification data available.</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold">{t.cveHistory}</h3>
                {vendorProfile.cveHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vendorProfile.cveHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                      <Bar dataKey="high" stackId="a" fill="#f59e0b" name="High" />
                      <Bar dataKey="medium" stackId="a" fill="#10b981" name="Medium" />
                      <Bar dataKey="low" stackId="a" fill="#3b82f6" name="Low" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">No CVE history available in the local dataset.</div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {t.incidents}
                </h3>
                {vendorProfile.incidents.length > 0 ? (
                  <div className="space-y-3">
                    {vendorProfile.incidents.map((incident) => (
                      <Card key={`${incident.year}-${incident.description}`} className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="font-medium">{incident.year}</span>
                          <Badge
                            variant={
                              incident.severity === "Critical"
                                ? "destructive"
                                : incident.severity === "High"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">No major incident data available in the local dataset.</div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold">{t.riskFactors}</h3>
                <div className="space-y-2">
                  {getRiskFactors(vendorProfile).map((factor) => (
                    <div key={factor} className="flex gap-2 text-sm">
                      <span className="text-amber-500">•</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">{t.recommendations}</h3>
                <div className="space-y-2">
                  {vendorProfile.recommendations.map((rec) => (
                    <div key={rec} className="flex gap-2 text-sm">
                      <span className="text-blue-500">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {selectedVendors.length === 0 && !comparisonMode && (
          <Card className="p-12 text-center text-muted-foreground">
            <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p>{t.empty}</p>
          </Card>
        )}
      </div>
    </main>
  )
}
