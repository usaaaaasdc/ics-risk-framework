"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { compareVendors, type VendorRiskProfile } from "@/lib/supply-chain-risk"
import { ArrowLeft, Package, Shield, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function SupplyChainPage() {
  const { language } = useLanguage()
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [vendorProfile] = useState<VendorRiskProfile | null>(null)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  const vendors = ["Siemens", "Rockwell Automation", "Schneider Electric", "HollySys", "Mitsubishi", "ABB", "Honeywell"]

  const toggleVendorForComparison = (vendor: string) => {
    setSelectedVendors((prev) => (prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor]))
  }

  const handleCompare = () => {
    if (selectedVendors.length >= 2) {
      setComparisonMode(true)
      setSelectedVendor(null)
    }
  }

  const comparison = comparisonMode ? compareVendors(selectedVendors) : null

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

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            {language === "ar" && "العودة للرئيسية"}
            {language === "en" && "Back to Home"}
            {language === "de" && "Zurück zur Startseite"}
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {language === "ar" && "تقييم مخاطر سلسلة التوريد"}
              {language === "en" && "Supply Chain Risk Assessment"}
              {language === "de" && "Lieferkettenrisikobewertung"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar" && "تحليل سجل الأمان التاريخي للمصنعين والموردين"}
              {language === "en" && "Analyze vendors' historical security track record"}
              {language === "de" && "Analysieren Sie die historische Sicherheitsbilanz von Lieferanten"}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {language === "ar" && "اختر المصنعين"}
            {language === "en" && "Select Vendors"}
            {language === "de" && "Lieferanten auswählen"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {vendors.map((vendor) => (
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

          <div className="flex gap-3">
            <Button onClick={handleCompare} disabled={selectedVendors.length < 2} className="gap-2">
              <TrendingUp className="w-4 h-4" />
              {language === "ar" && `مقارنة (${selectedVendors.length})`}
              {language === "en" && `Compare (${selectedVendors.length})`}
              {language === "de" && `Vergleichen (${selectedVendors.length})`}
            </Button>
            {selectedVendors.length > 0 && (
              <Button variant="outline" onClick={() => setSelectedVendors([])}>
                {language === "ar" && "إعادة تعيين"}
                {language === "en" && "Reset"}
                {language === "de" && "Zurücksetzen"}
              </Button>
            )}
          </div>
        </Card>

        {comparisonMode && comparison && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {language === "ar" && "نتائج المقارنة"}
              {language === "en" && "Comparison Results"}
              {language === "de" && "Vergleichsergebnisse"}
            </h2>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
              <p className="text-sm">
                <strong>
                  {language === "ar" ? "التوصية: " : language === "de" ? "Empfehlung: " : "Recommendation: "}
                </strong>
                {comparison.recommendation}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-4">
                  {language === "ar" && "مقارنة درجات الثقة"}
                  {language === "en" && "Trust Score Comparison"}
                  {language === "de" && "Vergleich der Vertrauenswerte"}
                </h3>
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
                <h3 className="font-semibold mb-4">
                  {language === "ar" && "متوسط وقت الاستجابة (أيام)"}
                  {language === "en" && "Average Response Time (days)"}
                  {language === "de" && "Durchschnittliche Antwortzeit (Tage)"}
                </h3>
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
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{profile.vendor}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" && "حصة السوق: "}
                        {language === "en" && "Market Share: "}
                        {language === "de" && "Marktanteil: "}
                        {profile.marketShare}%
                      </p>
                    </div>
                    <Badge className={getTrustScoreBadge(profile.trustScore)}>{profile.trustScore}/100</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {language === "ar" && "وقت الاستجابة: "}
                        {language === "en" && "Response Time: "}
                        {language === "de" && "Antwortzeit: "}
                      </span>
                      <span className="font-medium">
                        {profile.responseTime.avg_days} {language === "ar" ? "يوم" : "days"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {language === "ar" && "التقييم: "}
                        {language === "en" && "Rating: "}
                        {language === "de" && "Bewertung: "}
                      </span>
                      <span className="font-medium">{profile.responseTime.rating}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "ar" && "الشهادات:"}
                      {language === "en" && "Certifications:"}
                      {language === "de" && "Zertifizierungen:"}
                    </p>
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

        {selectedVendor && vendorProfile && !comparisonMode && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{vendorProfile.vendor}</h2>
                  <p className="text-muted-foreground">
                    {language === "ar" && "حصة السوق: "}
                    {language === "en" && "Market Share: "}
                    {language === "de" && "Marktanteil: "}
                    {vendorProfile.marketShare}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "درجة الثقة"}
                    {language === "en" && "Trust Score"}
                    {language === "de" && "Vertrauenswert"}
                  </div>
                  <div className={`text-4xl font-bold ${getTrustScoreColor(vendorProfile.trustScore)}`}>
                    {vendorProfile.trustScore}/100
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "متوسط وقت الاستجابة"}
                    {language === "en" && "Avg Response Time"}
                    {language === "de" && "Durchschn. Antwortzeit"}
                  </div>
                  <div className="text-2xl font-bold">
                    {vendorProfile.responseTime.avg_days} {language === "ar" ? "يوم" : "days"}
                  </div>
                  <Badge className="mt-2">{vendorProfile.responseTime.rating}</Badge>
                </Card>

                <Card className="p-4 bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "الحوادث المسجلة"}
                    {language === "en" && "Recorded Incidents"}
                    {language === "de" && "Aufgezeichnete Vorfälle"}
                  </div>
                  <div className="text-2xl font-bold">{vendorProfile.incidents.length}</div>
                </Card>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {language === "ar" && "الشهادات الأمنية"}
                  {language === "en" && "Security Certifications"}
                  {language === "de" && "Sicherheitszertifizierungen"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vendorProfile.certifications.map((cert) => (
                    <Badge key={cert} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  {language === "ar" && "سجل الثغرات (CVE)"}
                  {language === "en" && "CVE History"}
                  {language === "de" && "CVE-Verlauf"}
                </h3>
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
              </div>

              {vendorProfile.incidents.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {language === "ar" && "الحوادث الأمنية الرئيسية"}
                    {language === "en" && "Major Security Incidents"}
                    {language === "de" && "Wichtige Sicherheitsvorfälle"}
                  </h3>
                  <div className="space-y-3">
                    {vendorProfile.incidents.map((incident, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex justify-between items-start mb-2">
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
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">
                  {language === "ar" && "التوصيات"}
                  {language === "en" && "Recommendations"}
                  {language === "de" && "Empfehlungen"}
                </h3>
                <div className="space-y-2">
                  {vendorProfile.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <span className="text-blue-500">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {!selectedVendor && !comparisonMode && (
          <Card className="p-12 text-center text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>
              {language === "ar" && "اختر مصنعًا لعرض تفاصيل سجله الأمني"}
              {language === "en" && "Select a vendor to view their security track record"}
              {language === "de" && "Wählen Sie einen Lieferanten aus, um dessen Sicherheitsbilanz anzuzeigen"}
            </p>
          </Card>
        )}
      </div>
    </main>
  )
}
