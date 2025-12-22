"use client"

import type { RiskAssessment } from "@/lib/risk-engine"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldAlert, AlertTriangle, Info, Download, FileText, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { BaselineComparison } from "./baseline-comparison"

interface RiskDisplayProps {
  assessment: RiskAssessment
  onExportCSV: () => void
  onExportPDF: () => void
}

export function RiskDisplay({ assessment, onExportCSV, onExportPDF }: RiskDisplayProps) {
  const { t, language } = useLanguage()

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "bg-green-600 text-white"
      case "MEDIUM":
        return "bg-yellow-600 text-white"
      case "HIGH":
      case "CRITICAL":
        return "bg-red-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "CRITICAL":
        return "bg-red-600 text-white border-red-600"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-600 text-white"
    if (confidence >= 60) return "bg-yellow-600 text-white"
    return "bg-orange-600 text-white"
  }

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card className={`p-6 border-2 ${getRiskColor(assessment.riskLevel)}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8" />
              <h2 className="text-2xl font-bold">{t("riskScore")}</h2>
            </div>
            <p className="text-sm opacity-90">{t("riskAssessment")}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{assessment.riskScore.toFixed(1)}</div>
            <Badge className={`mt-2 ${getRiskColor(assessment.riskLevel)}`}>{assessment.riskLevel}</Badge>
          </div>
        </div>
      </Card>

      {assessment.baselineComparison && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {language === "ar" && "مقارنة مع الحد الأدنى الأمني"}
            {language === "en" && "Secure Baseline Comparison"}
            {language === "de" && "Vergleich mit Sicherheitsbaseline"}
          </h3>
          <BaselineComparison comparison={assessment.baselineComparison} />
        </div>
      )}

      {/* Attack Surface */}
      <Card className="p-6 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t("attackSurface")}
        </h3>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            {t("exposureLevel")}:{" "}
            <span className="font-semibold text-foreground">{assessment.attackSurface.exposureLevel}</span>
          </p>
          <div className="mt-3">
            <p className="font-semibold mb-2">{t("criticalPoints")}:</p>
            <div className="flex flex-wrap gap-2">
              {assessment.attackSurface.criticalPoints.map((point, idx) => (
                <Badge key={idx} variant="outline" className="border-red-500/50 text-red-400">
                  {point}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Vulnerabilities Table */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t("vulnerabilities")}
          </h3>
          <div className="flex gap-2">
            <Button onClick={onExportPDF} variant="default" size="sm">
              <FileText className="w-4 h-4 ml-2" />
              {t("exportPDF")}
            </Button>
            <Button onClick={onExportCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 ml-2" />
              {t("exportCSV")}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">{t("cveId")}</TableHead>
                <TableHead className="text-right">{t("description")}</TableHead>
                <TableHead className="text-right">{t("cvss")}</TableHead>
                <TableHead className="text-right">{t("severity")}</TableHead>
                <TableHead className="text-right">
                  {language === "ar" && "الثقة"}
                  {language === "en" && "Confidence"}
                  {language === "de" && "Vertrauen"}
                </TableHead>
                <TableHead className="text-right">{t("category")}</TableHead>
                <TableHead className="text-right">{t("recommendation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessment.vulnerabilities.map((vuln, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-sm">{vuln.id}</TableCell>
                  <TableCell className="max-w-md">
                    {language === "ar" ? vuln.description_ar : vuln.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(vuln.severity)}>
                      {vuln.cvss}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    {assessment.vulnerabilityConfidence && (
                      <Badge className={getConfidenceColor(assessment.vulnerabilityConfidence.get(vuln.id) || 0)}>
                        {assessment.vulnerabilityConfidence.get(vuln.id) || 0}%
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{vuln.category}</TableCell>
                  <TableCell className="max-w-md text-sm">
                    {language === "ar" ? vuln.recommendation_ar : vuln.recommendation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Security Recommendations */}
      <Card className="p-6 border-primary/20">
        <h3 className="text-xl font-bold mb-4">{t("recommendations")}</h3>
        <div className="space-y-3">
          {(language === "ar" ? assessment.recommendations_ar : assessment.recommendations).map((rec, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              <p className="text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
