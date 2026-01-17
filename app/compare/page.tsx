"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProjectManager, type Project } from "@/lib/project-manager"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GitCompare, X } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export default function ComparePage() {
  const { t, language } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [comparing, setComparing] = useState(false)

  useEffect(() => {
    setProjects(ProjectManager.getAllProjects().filter((p) => p.assessment))
  }, [])

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        if (newSet.size < 4) {
          newSet.add(projectId)
        } else {
          alert("You can compare up to 4 projects at once")
        }
      }
      return newSet
    })
  }

  const selectedProjectsData = Array.from(selectedProjects)
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as Project[]

  const getRiskColor = (score: number) => {
    if (score >= 7) return "text-red-500 bg-red-500/10 border-red-500/20"
    if (score >= 4) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    return "text-green-500 bg-green-500/10 border-green-500/20"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 9) return "Critical"
    if (score >= 7) return "High"
    if (score >= 4) return "Medium"
    return "Low"
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <GitCompare className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-balance">Project Comparison</h1>
                <p className="text-muted-foreground">Compare security assessments side by side</p>
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
        {!comparing ? (
          <>
            {/* Project Selection */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Select Projects to Compare</h2>
                  <p className="text-sm text-muted-foreground">Choose 2-4 projects for comparison</p>
                </div>
                <Button onClick={() => setComparing(true)} disabled={selectedProjects.size < 2}>
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare ({selectedProjects.size})
                </Button>
              </div>

              {projects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No projects available for comparison. Create some assessments first.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className={`p-4 cursor-pointer transition-all ${selectedProjects.has(project.id) ? "ring-2 ring-primary" : ""
                        }`}
                      onClick={() => toggleProject(project.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedProjects.has(project.id)}
                          onCheckedChange={() => toggleProject(project.id)}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{project.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
                          {project.assessment && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Risk:</span>
                              <Badge className={getRiskColor(project.assessment.riskScore)}>
                                {project.assessment.riskScore.toFixed(1)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : (
          <>
            {/* Comparison View */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Comparison Results</h2>
              <Button variant="outline" onClick={() => setComparing(false)}>
                <X className="w-4 h-4 mr-2" />
                Change Selection
              </Button>
            </div>

            {/* Risk Score Comparison */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Risk Score Overview</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedProjectsData.map((project) => (
                  <div key={project.id} className="text-center p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2 truncate">{project.name}</p>
                    <div
                      className={`text-3xl font-bold mb-1 ${getRiskColor(project.assessment.riskScore).split(" ")[0]}`}
                    >
                      {project.assessment.riskScore.toFixed(1)}
                    </div>
                    <Badge variant="outline">{getRiskLevel(project.assessment.riskScore)}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Configuration Comparison */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">System Configuration</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Attribute</th>
                      {selectedProjectsData.map((project) => (
                        <th key={project.id} className="text-left py-3 px-4 font-semibold">
                          {project.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Device Type</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          {project.config?.deviceType || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Manufacturer</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          {project.config?.manufacturer || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Model</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          {project.config?.model || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Internet Connected</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          <Badge variant={project.config?.internetConnected ? "destructive" : "default"}>
                            {project.config?.internetConnected ? "Yes" : "No"}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Legacy Device</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          <Badge variant={project.config?.isLegacy ? "destructive" : "default"}>
                            {project.config?.isLegacy ? "Yes" : "No"}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Protocols</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(project.config?.protocols as string[] || [])?.slice(0, 3).map((p) => (
                              <Badge key={p} variant="outline" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                            {((project.config?.protocols as string[])?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{((project.config?.protocols as string[])?.length || 0) - 3}
                              </Badge>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Vulnerability Comparison */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Vulnerability Statistics</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Metric</th>
                      {selectedProjectsData.map((project) => (
                        <th key={project.id} className="text-left py-3 px-4 font-semibold">
                          {project.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Total Vulnerabilities</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4 font-semibold">
                          {project.assessment.vulnerabilities?.length || 0}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Critical</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          <Badge variant="destructive">
                            {project.assessment.vulnerabilities?.filter((v: any) => v.severity === "CRITICAL").length || 0}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">High</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          <Badge variant="default">
                            {project.assessment.vulnerabilities?.filter((v: any) => v.severity === "HIGH").length || 0}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Medium</td>
                      {selectedProjectsData.map((project) => (
                        <td key={project.id} className="py-3 px-4">
                          <Badge variant="secondary">
                            {project.assessment.vulnerabilities?.filter((v: any) => v.severity === "MEDIUM").length || 0}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">Average CVSS</td>
                      {selectedProjectsData.map((project) => {
                        const avgCVSS =
                          project.assessment.vulnerabilities.length > 0
                            ? project.assessment.vulnerabilities.reduce((sum: number, v: any) => sum + v.cvss, 0) /
                            project.assessment.vulnerabilities.length
                            : 0
                        return (
                          <td key={project.id} className="py-3 px-4">
                            <span className={getRiskColor(avgCVSS).split(" ")[0]}>{avgCVSS.toFixed(1)}</span>
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Recommendations Comparison */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Key Recommendations</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {selectedProjectsData.map((project) => (
                  <div key={project.id} className="space-y-3">
                    <h4 className="font-semibold">{project.name}</h4>
                    <div className="space-y-2">
                      {project.assessment.recommendations?.slice(0, 5).map((rec: string, idx: number) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
