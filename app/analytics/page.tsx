"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { generateAnalytics, type AnalyticsData } from "@/lib/analytics"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AnalyticsPage() {
  const { t, language } = useLanguage()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const data = generateAnalytics()
    setAnalytics(data)
  }, [])

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const getRiskColor = (score: number) => {
    if (score >= 7) return "text-red-500"
    if (score >= 4) return "text-yellow-500"
    return "text-green-500"
  }

  const getProtocolColor = (level: string) => {
    if (level === "High") return "bg-red-500/10 text-red-500 border-red-500/20"
    if (level === "Medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-green-500/10 text-green-500 border-green-500/20"
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-balance">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Comprehensive security insights and statistics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("backToHome")}
                </Button>
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Projects</span>
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{analytics.totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-2">Active security assessments</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Vulnerabilities</span>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="text-3xl font-bold">{analytics.totalVulnerabilities}</div>
            <p className="text-xs text-muted-foreground mt-2">Identified security issues</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Average Risk Score</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className={`text-3xl font-bold ${getRiskColor(analytics.averageRiskScore)}`}>
              {analytics.averageRiskScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all systems</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Compliance Rate</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold">
              {analytics.totalProjects > 0
                ? Math.round((analytics.complianceOverview.compliantProjects / analytics.totalProjects) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-2">Meeting standards</p>
          </Card>
        </div>

        {/* Risk Distribution */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Risk Distribution</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-3xl font-bold text-red-500">{analytics.criticalSystems}</div>
              <div className="text-sm text-muted-foreground mt-1">Critical (9-10)</div>
            </div>
            <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-500">{analytics.highRiskSystems}</div>
              <div className="text-sm text-muted-foreground mt-1">High (7-8.9)</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-3xl font-bold text-yellow-500">{analytics.mediumRiskSystems}</div>
              <div className="text-sm text-muted-foreground mt-1">Medium (4-6.9)</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-3xl font-bold text-green-500">{analytics.lowRiskSystems}</div>
              <div className="text-sm text-muted-foreground mt-1">Low (0-3.9)</div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Device Type Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Device Type Distribution</h2>
            {analytics.deviceTypeDistribution.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.deviceTypeDistribution.map((device) => (
                  <div key={device.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{device.type}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{device.count} systems</Badge>
                        <span className={`text-sm font-medium ${getRiskColor(device.averageRisk)}`}>
                          {device.averageRisk.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{
                          width: `${Math.min((device.count / analytics.totalProjects) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Protocol Usage */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Protocol Usage & Risk</h2>
            {analytics.protocolUsage.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.protocolUsage
                  .sort((a, b) => b.usage - a.usage)
                  .slice(0, 8)
                  .map((protocol) => (
                    <div key={protocol.protocol} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm">{protocol.protocol}</span>
                        <Badge className={getProtocolColor(protocol.riskLevel)} variant="outline">
                          {protocol.riskLevel} Risk
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{protocol.usage} usage(s)</span>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>

        {/* Top Vulnerabilities */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Top 10 Most Common Vulnerabilities</h2>
          {analytics.topVulnerabilities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No vulnerabilities detected</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">CVE ID</th>
                    <th className="text-left py-3 px-4">Occurrences</th>
                    <th className="text-left py-3 px-4">Avg CVSS</th>
                    <th className="text-left py-3 px-4">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topVulnerabilities.map((vuln) => (
                    <tr key={vuln.cveId} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{vuln.cveId}</td>
                      <td className="py-3 px-4">{vuln.occurrences}</td>
                      <td className="py-3 px-4">
                        <span className={getRiskColor(vuln.averageCVSS)}>{vuln.averageCVSS.toFixed(1)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            vuln.severity === "CRITICAL"
                              ? "destructive"
                              : vuln.severity === "HIGH"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {vuln.severity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Industry Distribution */}
        {analytics.industryDistribution.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Industry Distribution</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.industryDistribution.map((industry) => (
                <div key={industry.industry} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{industry.industry}</span>
                    <Badge variant="outline">{industry.projectCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Risk:</span>
                    <span className={`font-medium ${getRiskColor(industry.averageRisk)}`}>
                      {industry.averageRisk.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Compliance Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Compliance Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">IEC 62443 Average Score</span>
                  <span className="text-2xl font-bold">{analytics.complianceOverview.iec62443Average}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${analytics.complianceOverview.iec62443Average}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">NIST CSF Average Score</span>
                  <span className="text-2xl font-bold">{analytics.complianceOverview.nistAverage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${analytics.complianceOverview.nistAverage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-3xl font-bold text-green-500">
                  {analytics.complianceOverview.compliantProjects}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Compliant</div>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-3xl font-bold text-red-500">
                  {analytics.complianceOverview.nonCompliantProjects}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Non-Compliant</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
