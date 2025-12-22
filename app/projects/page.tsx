"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProjectManager, type Project } from "@/lib/project-manager"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Folder, Plus, Trash2, Download, Upload, ArrowLeft, Edit, GitCompare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProjectsPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    industry: "Manufacturing",
  })

  useEffect(() => {
    setProjects(ProjectManager.getAllProjects())
  }, [])

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return

    const project = ProjectManager.saveProject({
      ...newProject,
      config: null,
      assessment: null,
    })

    setProjects(ProjectManager.getAllProjects())
    setIsDialogOpen(false)
    setNewProject({ name: "", description: "", industry: "Manufacturing" })
    router.push(`/?projectId=${project.id}`)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm(t("confirmDelete") || "Are you sure you want to delete this project?")) {
      ProjectManager.deleteProject(id)
      setProjects(ProjectManager.getAllProjects())
    }
  }

  const handleExportProject = (project: Project) => {
    ProjectManager.exportProject(project)
  }

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    ProjectManager.importProject(file)
      .then(() => {
        setProjects(ProjectManager.getAllProjects())
        alert(t("importSuccess") || "Project imported successfully!")
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const getRiskLevelColor = (riskScore: number) => {
    if (riskScore >= 7) return "text-red-500"
    if (riskScore >= 4) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-balance">{t("projectManagement")}</h1>
                <p className="text-muted-foreground">{t("projectManagementDesc")}</p>
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
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("newProject")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createNewProject")}</DialogTitle>
                  <DialogDescription>{t("createProjectDesc")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("projectName")}</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder={t("projectNamePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("projectDescription")}</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder={t("projectDescPlaceholder")}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">{t("industry")}</Label>
                    <select
                      id="industry"
                      value={newProject.industry}
                      onChange={(e) => setNewProject({ ...newProject, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Energy">Energy</option>
                      <option value="Oil & Gas">Oil & Gas</option>
                      <option value="Water Treatment">Water Treatment</option>
                      <option value="Chemical">Chemical</option>
                      <option value="Pharmaceutical">Pharmaceutical</option>
                      <option value="Food Processing">Food Processing</option>
                      <option value="Automotive">Automotive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleCreateProject}>{t("create")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {t("importProject")}
                <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
              </label>
            </Button>

            <Link href="/compare">
              <Button variant="outline">
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
            <div className="text-center space-y-4">
              <Folder className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">{t("noProjects")}</p>
                <p className="text-muted-foreground">{t("noProjectsDesc")}</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("createFirstProject")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-balance">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{project.description || t("noDescription")}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted rounded">{project.industry}</span>
                      </div>
                    </div>
                  </div>

                  {project.assessment && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{t("riskScore")}:</span>
                        <span className={`text-lg font-bold ${getRiskLevelColor(project.assessment.riskScore)}`}>
                          {project.assessment.riskScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("vulnerabilities")}:</span>
                        <span className="text-sm font-medium">{project.assessment.vulnerabilities?.length || 0}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                    <div>
                      {t("created")}: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      {t("updated")}: {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/?projectId=${project.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        {t("open")}
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handleExportProject(project)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
