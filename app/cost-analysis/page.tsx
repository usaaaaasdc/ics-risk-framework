"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SmartTip } from "@/components/smart-tip"
import { ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, PieChart, Calculator } from "lucide-react"
import Link from "next/link"
import { ProjectManager } from "@/lib/project-manager"
import { calculateCostEstimation, industryPresets, type CostEstimationInput } from "@/lib/cost-estimation"

export default function CostAnalysisPage() {
  const { translations, isRTL } = useLanguage()
  const t = translations.costAnalysis
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [industryType, setIndustryType] = useState<string>("Manufacturing")
  const [costInput, setCostInput] = useState<CostEstimationInput>({
    dailyRevenue: 500000,
    ...industryPresets.Manufacturing,
    industryType: "Manufacturing",
  })
  const [result, setResult] = useState<any>(null)

  const projects = ProjectManager.getAllProjects()

  const handleIndustryChange = (industry: string) => {
    setIndustryType(industry)
    const preset = industryPresets[industry] || industryPresets.Manufacturing
    setCostInput({
      ...costInput,
      ...preset,
      industryType: industry,
    })
  }

  const handleCalculate = () => {
    if (!selectedProject) return

    const project = ProjectManager.getProject(selectedProject)
    if (!project || !project.assessment || !project.config) return

    const estimation = calculateCostEstimation(project.assessment, project.config, costInput)
    setResult(estimation)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSmartTip = () => {
    if (industryType === "Steel Manufacturing") {
      return isRTL
        ? "💡 في أنظمة الصلب، متوسط تكلفة تعطيل المصنع 24 ساعة = 500,000 يورو. الاستثمار في جدار ناري صناعي = 15,000 يورو فقط."
        : "💡 In steel plants, average 24-hour downtime cost = €500,000. Investment in industrial firewall = only €15,000."
    }

    if (result && result.totalFinancialRisk > 1000000) {
      return isRTL
        ? "⚠️ المخاطر المالية عالية جداً! ننصح بتخصيص 10-15% من الخسارة المحتملة كميزانية أمنية فورية."
        : "⚠️ Financial risk is very high! We recommend allocating 10-15% of potential loss as immediate security budget."
    }

    if (result && result.returnOnSecurityInvestment?.costBenefitRatio > 5) {
      return isRTL
        ? "✅ عائد استثمار ممتاز! كل يورو تنفقه على الأمن يوفر عليك أكثر من 5 يورو من الخسائر المحتملة."
        : "✅ Excellent ROI! Every euro spent on security saves you more than €5 in potential losses."
    }

    return isRTL
      ? "💡 استخدم القيم الافتراضية كنقطة بداية، ثم عدّلها حسب بيئتك الصناعية الفعلية."
      : "💡 Use default values as a starting point, then adjust based on your actual industrial environment."
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-slate-400">{t.subtitle}</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              {translations.header?.backToHome || "Back to Home"}
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <SmartTip tip={getSmartTip()} variant={result && result.totalFinancialRisk > 1000000 ? "warning" : "info"} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                {t.inputParameters}
              </h2>

              <div className="space-y-4">
                {/* Project Selection */}
                <div>
                  <Label className="text-slate-300">{t.selectProject}</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder={t.selectProjectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Type */}
                <div>
                  <Label className="text-slate-300">{t.industryType}</Label>
                  <Select value={industryType} onValueChange={handleIndustryChange}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(industryPresets).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Daily Revenue */}
                <div>
                  <Label className="text-slate-300">{t.dailyRevenue}</Label>
                  <Input
                    type="number"
                    value={costInput.dailyRevenue}
                    onChange={(e) =>
                      setCostInput({ ...costInput, dailyRevenue: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Downtime Cost Per Hour */}
                <div>
                  <Label className="text-slate-300">{t.downtimeCost}</Label>
                  <Input
                    type="number"
                    value={costInput.downtimeCostPerHour}
                    onChange={(e) =>
                      setCostInput({ ...costInput, downtimeCostPerHour: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Recovery Time */}
                <div>
                  <Label className="text-slate-300">{t.recoveryTime}</Label>
                  <Input
                    type="number"
                    value={costInput.recoveryTimeHours}
                    onChange={(e) =>
                      setCostInput({ ...costInput, recoveryTimeHours: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Data Loss Impact */}
                <div>
                  <Label className="text-slate-300">{t.dataLoss}</Label>
                  <Input
                    type="number"
                    value={costInput.dataLossImpact}
                    onChange={(e) =>
                      setCostInput({ ...costInput, dataLossImpact: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Reputation Impact */}
                <div>
                  <Label className="text-slate-300">{t.reputationDamage}</Label>
                  <Input
                    type="number"
                    value={costInput.reputationImpact}
                    onChange={(e) =>
                      setCostInput({ ...costInput, reputationImpact: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Regulatory Fines */}
                <div>
                  <Label className="text-slate-300">{t.regulatoryFines}</Label>
                  <Input
                    type="number"
                    value={costInput.regulatoryFines}
                    onChange={(e) =>
                      setCostInput({ ...costInput, regulatoryFines: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <Button onClick={handleCalculate} disabled={!selectedProject} className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  {t.calculate}
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {!result && (
              <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <PieChart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">{t.selectProjectAndCalculate}</p>
              </Card>
            )}

            {result && (
              <div className="space-y-6">
                {/* Total Risk */}
                <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-1">{t.totalFinancialRisk}</h2>
                      <p className="text-sm text-slate-400">{t.potentialLoss}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-red-400">{formatCurrency(result.totalFinancialRisk)}</div>
                      <div className="text-xs text-slate-400 mt-1">{t.perIncident}</div>
                    </div>
                  </div>
                </Card>

                {/* Cost Breakdown */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    {t.costBreakdown}
                  </h3>

                  <div className="space-y-3">
                    {[
                      { label: t.downtimeCost, value: result.breakdown.downtimeCost },
                      { label: t.dataLoss, value: result.breakdown.dataLossCost },
                      { label: t.reputationDamage, value: result.breakdown.reputationCost },
                      { label: t.regulatoryFines, value: result.breakdown.regulatoryCost },
                      { label: t.incidentResponse, value: result.breakdown.incidentResponseCost },
                      { label: t.recovery, value: result.breakdown.recoveryAndRemediationCost },
                    ].map((item, index) => {
                      const percentage = (item.value / result.totalFinancialRisk) * 100
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-slate-300">{item.label}</span>
                              <span className="text-sm font-semibold text-white">{formatCurrency(item.value)}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Annualized Loss Expectancy */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-orange-400" />
                    {t.annualizedLoss}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-400">
                        {formatCurrency(result.annualizedLossExpectancy)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">{t.expectedAnnualLoss}</div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(result.returnOnSecurityInvestment.recommendedBudget)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">{t.recommendedBudget}</div>
                    </div>
                  </div>
                </Card>

                {/* ROI Metrics */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    {t.roi}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-2">{t.costBenefitRatio}</div>
                      <div className="text-2xl font-bold text-white">
                        {result.returnOnSecurityInvestment.costBenefitRatio.toFixed(2)}:1
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-2">{t.paybackPeriod}</div>
                      <div className="text-2xl font-bold text-white">
                        {result.returnOnSecurityInvestment.paybackPeriod}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Industry Benchmark */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    {t.industryBenchmark}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-2">{t.industryAverage}</div>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(result.industryBenchmark.averageCost)}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="text-slate-400 text-sm mb-2">{t.yourPosition}</div>
                      <div
                        className={`text-2xl font-bold ${
                          result.industryBenchmark.yourPosition === "Below Average"
                            ? "text-green-400"
                            : result.industryBenchmark.yourPosition === "Average"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {result.industryBenchmark.yourPosition}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
