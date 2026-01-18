"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertTriangle,
  Activity,
  Shield,
  Target,
  TrendingUp,
  Eye,
  PlayCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { simulationScenarios, runSimulation } from "@/lib/simulation-engine"

export default function SimulationPage() {
  const { translations, isRTL, language } = useLanguage()
  const t = typeof translations.simulation === 'object' ? translations.simulation : {
    title: "Attack Simulation Lab",
    subtitle: "Simulate real-world ICS attack scenarios",
    scenarios: "Attack Scenarios",
    run: "Run",
    selectScenario: "Select a scenario to start simulation",
    running: "Running simulation...",
    attackSuccess: "Attack Success Probability",
    riskScore: "Risk Score",
    attackPath: "Attack Progression Path",
    detection: "Detection",
    impact: "Cascading Impact",
    detectionPoints: "Detection Opportunities",
    prevention: "Prevention Measures"
  }

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunSimulation = (scenarioId: string) => {
    setIsRunning(true)
    setSelectedScenario(scenarioId)

    // Simulate loading time
    setTimeout(() => {
      const result = runSimulation(scenarioId, language as "en" | "ar" | "de")
      setSimulationResult(result)
      setIsRunning(false)
    }, 1500)
  }

  const getRiskColor = (risk: number) => {
    if (risk < 40) return "text-green-400"
    if (risk < 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getRiskBgColor = (risk: number) => {
    if (risk < 40) return "bg-green-500/10 border-green-500/20"
    if (risk < 70) return "bg-yellow-500/10 border-yellow-500/20"
    return "bg-red-500/10 border-red-500/20"
  }

  const getImpactColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-orange-400"
      case "critical":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
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
              {translations.backToHome}
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Scenarios List */}
          <div className="md:col-span-1">
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                {t.scenarios}
              </h2>

              <div className="space-y-3">
                {simulationScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`p-4 cursor-pointer transition-all ${selectedScenario === scenario.id
                        ? "bg-blue-500/20 border-blue-500"
                        : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                      }`}
                    onClick={() => handleRunSimulation(scenario.id)}
                  >
                    <h3 className="font-semibold text-white text-sm mb-2">
                      {scenario.name[language as "en" | "ar" | "de"]}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      {scenario.description[language as "en" | "ar" | "de"]}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{scenario.targetDevice}</span>
                      <Button size="sm" className="h-7 px-3 gap-1" disabled={isRunning}>
                        <PlayCircle className="w-3 h-3" />
                        {t.run}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Simulation Results */}
          <div className="md:col-span-2">
            {!simulationResult && !isRunning && (
              <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">{t.selectScenario}</p>
              </Card>
            )}

            {isRunning && (
              <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-400">{t.running}</p>
              </Card>
            )}

            {simulationResult && !isRunning && (
              <div className="space-y-6">
                {/* Risk Score */}
                <Card className={`border-2 p-6 ${getRiskBgColor(simulationResult.totalRisk)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-1">{t.attackSuccess}</h2>
                      <p className="text-sm text-slate-400">{simulationResult.scenario.name}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getRiskColor(simulationResult.totalRisk)}`}>
                        {simulationResult.totalRisk.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{t.riskScore}</div>
                    </div>
                  </div>
                </Card>

                {/* Attack Path */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    {t.attackPath}
                  </h3>

                  <div className="space-y-4">
                    {simulationResult.scenario.steps.map((step: any, index: number) => (
                      <div key={step.id} className="relative">
                        {index < simulationResult.scenario.steps.length - 1 && (
                          <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-700" />
                        )}

                        <div className="flex gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 ${step.impact_level === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : step.impact_level === "high"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : step.impact_level === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                              }`}
                          >
                            {index + 1}
                          </div>

                          <div className="flex-1">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{step.action}</h4>
                                  <p className="text-xs text-slate-500">{step.phase}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {step.detectable ? (
                                    <Eye className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-400" />
                                  )}
                                  <span className={`text-sm font-semibold ${getImpactColor(step.impact_level)}`}>
                                    {(step.success_probability * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-slate-400 mb-2">{step.description}</p>

                              {step.detection_method && (
                                <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded px-2 py-1 inline-block">
                                  {t.detection}: {step.detection_method}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Cascading Impact */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    {t.impact}
                  </h3>

                  <div className="space-y-2">
                    {simulationResult.cascadingImpact.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                        <span className="text-slate-300">{impact}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Detection Points */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-400" />
                    {t.detectionPoints}
                  </h3>

                  <div className="grid gap-2">
                    {simulationResult.scenario.detectionPoints.map((point: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm bg-slate-800/50 border border-slate-700 rounded p-3"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    {t.prevention}
                  </h3>

                  <div className="space-y-2">
                    {simulationResult.recommendations.map((rec: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm bg-blue-500/10 border border-blue-500/20 rounded p-3"
                      >
                        <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{rec}</span>
                      </div>
                    ))}
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
