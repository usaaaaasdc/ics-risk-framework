"use client"

import { useState, useEffect } from "react"
import { DeviceInputForm } from "@/components/device-input-form"
import { RiskDisplay } from "@/components/risk-display"
import { AttackSurfaceMap } from "@/components/attack-surface-map"
import { AdvancedAnalysisTabs } from "@/components/advanced-analysis-tabs"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { type SystemConfig, type RiskAssessment, assessSystem } from "@/lib/risk-engine"
import { generatePDF } from "@/lib/pdf-generator"
import { ProjectManager, type Project } from "@/lib/project-manager"
import vulnerabilitiesData from "@/lib/data/vulnerabilities.json"
import { Shield, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AssessmentPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [currentConfig, setCurrentConfig] = useState<SystemConfig | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  useEffect(() => {
    if (projectId) {
      const project = ProjectManager.getProject(projectId)
      if (project) {
        setCurrentProject(project)
        if (project.config) {
          setCurrentConfig(project.config)
        }
        if (project.assessment) {
          setAssessment(project.assessment)
        }
      }
    }
  }, [projectId])

  const handleSubmit = (config: SystemConfig) => {
    const result = assessSystem(config, vulnerabilitiesData.vulnerabilities)
    setAssessment(result)
    setCurrentConfig(config)

    if (currentProject) {
      ProjectManager.updateProject(currentProject.id, {
        config,
        assessment: result,
      })
      setCurrentProject(ProjectManager.getProject(currentProject.id))
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "lastAssessment",
          JSON.stringify({
            config,
            result,
            timestamp: new Date().toISOString(),
          }),
        )
      }
    }
  }

  const handleSaveAsProject = () => {
    if (!currentConfig || !assessment) return

    const projectName = prompt(t("projectName") + ":", "Security Assessment " + new Date().toLocaleDateString())
    if (!projectName) return

    const project = ProjectManager.saveProject({
      name: projectName,
      description: `${currentConfig.deviceType} - ${currentConfig.model}`,
      industry: "Manufacturing",
      config: currentConfig,
      assessment: assessment,
    })

    setCurrentProject(project)
    alert(t("importSuccess") || "Project saved successfully!")
  }

  const handleExportCSV = () => {
    if (!assessment) return

    const csvHeaders = ["CVE ID", "Description", "CVSS Score", "Severity", "Category", "Recommendation"]
    const csvRows = assessment.vulnerabilities.map((v) => [
      v.id,
      v.description,
      v.cvss.toString(),
      v.severity,
      v.category,
      v.recommendation,
    ])

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `ics-security-assessment-${Date.now()}.csv`
    link.click()
  }

  const handleExportPDF = () => {
    if (!assessment || !currentConfig) return
    generatePDF(assessment, currentConfig)
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === "ar" && "العودة"}
                  {language === "en" && "Back"}
                  {language === "de" && "Zurück"}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {language === "ar" && "تقييم المخاطر الأمنية"}
                    {language === "en" && "Security Risk Assessment"}
                    {language === "de" && "Sicherheitsrisikobewertung"}
                  </h1>
                </div>
              </div>
            </div>
            <LanguageSwitcher />
          </div>

          {currentProject && (
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                {t("currentProject")}: {currentProject.name}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("inputDetails")}</h2>
            <p className="text-muted-foreground mb-6">{t("inputDescription")}</p>
            <DeviceInputForm onSubmit={handleSubmit} initialConfig={currentConfig} />
          </div>

          {/* Results Display */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t("results")}</h2>
              {assessment && !currentProject && (
                <Button variant="outline" size="sm" onClick={handleSaveAsProject}>
                  <Save className="w-4 h-4 mr-2" />
                  {t("saveProject")}
                </Button>
              )}
            </div>
            {assessment && currentConfig ? (
              <div className="space-y-6">
                <AttackSurfaceMap config={currentConfig} riskLevel={assessment.riskLevel} />
                <RiskDisplay assessment={assessment} onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
                <div className="text-center space-y-2">
                  <Shield className="w-16 h-16 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">{t("emptyState")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {assessment && currentConfig && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {language === "ar" && "التحليل الأمني المتقدم"}
              {language === "en" && "Advanced Security Analysis"}
              {language === "de" && "Erweiterte Sicherheitsanalyse"}
            </h2>
            <AdvancedAnalysisTabs config={currentConfig} assessment={assessment} />
          </div>
        )}
      </div>
    </main>
  )
}
