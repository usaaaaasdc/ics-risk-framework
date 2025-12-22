"use client"

import type { BaselineComparisonResult } from "@/lib/secure-baseline"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react"

interface BaselineComparisonProps {
  comparison: BaselineComparisonResult
}

export function BaselineComparison({ comparison }: BaselineComparisonProps) {
  const { language } = useLanguage()

  if (comparison.totalRequirements === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>
            {language === "ar" && "لا توجد متطلبات أساسية محددة لهذا الجهاز"}
            {language === "en" && "No specific baseline requirements defined for this device"}
            {language === "de" && "Keine spezifischen Baseline-Anforderungen für dieses Gerät definiert"}
          </p>
        </div>
      </Card>
    )
  }

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 80) return "text-green-600"
    if (compliance >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getComplianceBadge = (compliance: number) => {
    if (compliance >= 80) return <Badge className="bg-green-600">Compliant</Badge>
    if (compliance >= 50) return <Badge className="bg-yellow-600">Partial</Badge>
    return <Badge className="bg-red-600">Non-Compliant</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Overall Compliance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {language === "ar" && "الامتثال للحد الأدنى الأمني"}
            {language === "en" && "Secure Baseline Compliance"}
            {language === "de" && "Einhaltung der Sicherheitsbaseline"}
          </h3>
          {getComplianceBadge(comparison.compliance)}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getComplianceColor(comparison.compliance)}`}>
              {comparison.compliance}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "نسبة الامتثال"}
              {language === "en" && "Compliance"}
              {language === "de" && "Konformität"}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-6 h-6" />
              {comparison.met}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "مستوفاة"}
              {language === "en" && "Met"}
              {language === "de" && "Erfüllt"}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 flex items-center justify-center gap-1">
              <XCircle className="w-6 h-6" />
              {comparison.unmet}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "غير مستوفاة"}
              {language === "en" && "Unmet"}
              {language === "de" && "Nicht erfüllt"}
            </p>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              comparison.compliance >= 80
                ? "bg-green-600"
                : comparison.compliance >= 50
                  ? "bg-yellow-600"
                  : "bg-red-600"
            }`}
            style={{ width: `${comparison.compliance}%` }}
          />
        </div>
      </Card>

      {/* Security Gaps */}
      {comparison.gaps.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            {language === "ar" && "الفجوات الأمنية"}
            {language === "en" && "Security Gaps"}
            {language === "de" && "Sicherheitslücken"}
          </h3>

          <div className="space-y-3">
            {comparison.gaps.map((gap) => (
              <div key={gap.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {language === "ar" && gap.requirement_ar}
                      {language === "en" && gap.requirement}
                      {language === "de" && gap.requirement_de}
                    </div>
                    <div className="text-sm text-muted-foreground">{gap.category}</div>
                  </div>
                  <Badge
                    variant={
                      gap.criticality === "CRITICAL"
                        ? "destructive"
                        : gap.criticality === "HIGH"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {gap.criticality}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {language === "ar" && "المعيار"}
                  {language === "en" && "Standard"}
                  {language === "de" && "Standard"}: {gap.standard}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
