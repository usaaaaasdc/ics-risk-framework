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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssessmentPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [currentConfig, setCurrentConfig] = useState<SystemConfig | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportLanguage, setExportLanguage] = useState<"ar" | "en" | "de" | "tr">("ar")

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
    setExportLanguage(language as "ar" | "en" | "de" | "tr")
    setIsExportDialogOpen(true)
  }

  const confirmExportPDF = () => {
    if (!assessment || !currentConfig) return
    generatePDF(assessment, currentConfig, exportLanguage)
    setIsExportDialogOpen(false)
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
                  {language === "tr" && "Geri"}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">
                    {language === "ar" && "تقييم المخاطر الأمنية"}
                    {language === "en" && "Security Risk Assessment"}
                    {language === "de" && "Sicherheitsrisikobewertung"}
                    {language === "tr" && "Güvenlik Risk Değerlendirmesi"}
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
              {language === "tr" && "Gelişmiş Güvenlik Analizi"}
            </h2>
            <AdvancedAnalysisTabs config={currentConfig} assessment={assessment} />
          </div>
        )}
      </div>
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "ar" && "تصدير التقرير"}
              {language === "en" && "Export Report"}
              {language === "de" && "Bericht exportieren"}
              {language === "tr" && "Raporu Dışa Aktar"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" && "اختر لغة التقرير الذي تريد تصديره"}
              {language === "en" && "Choose the language for the exported report"}
              {language === "de" && "Wählen Sie die Sprache für den exportierten Bericht"}
              {language === "tr" && "Dışa aktarılacak raporun dilini seçin"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                {t("language")}
              </Label>
              <Select
                value={exportLanguage}
                onValueChange={(val: "ar" | "en" | "de" | "tr") => setExportLanguage(val)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch (German)</SelectItem>
                  <SelectItem value="tr">Türkçe (Turkish)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={confirmExportPDF}>{t("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
