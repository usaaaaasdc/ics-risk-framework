"use client"

import { useMemo } from "react"
import { useHydrated } from "@/hooks/use-hydrated"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardList,
  Calendar,
  DollarSign,
  TrendingDown,
  Download,
  Play,
  CheckCircle,
  Clock,
  Users,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { generateRemediationPlan } from "@/lib/remediation-planner"
import { loadProjects } from "@/lib/project-manager"

export default function RemediationPlannerPage() {
  const { language } = useLanguage()
  const hydrated = useHydrated()
  const loading = !hydrated
  const plan = useMemo(() => {
    if (!hydrated) return null
    // Load latest project
    const projects = loadProjects()
    if (projects.length > 0) {
      const latest = projects[projects.length - 1]
      return generateRemediationPlan(
        latest.assessment?.riskScore || 0,
        latest.assessment?.vulnerabilities || [],
        latest.config?.devices || [],
        (language === 'ar' || language === 'de') ? language : 'en',
      )
    }
    return null
  }, [hydrated, language])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "patch":
        return "🔧"
      case "config":
        return "⚙️"
      case "network":
        return "🌐"
      case "access":
        return "🔐"
      case "monitoring":
        return "👁️"
      case "training":
        return "📚"
      default:
        return "📋"
    }
  }

  const exportPlan = () => {
    if (!plan) return

    const dataStr = JSON.stringify(plan, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `remediation-plan-${Date.now()}.json`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === "ar" && "جاري إنشاء خطة العلاج..."}
            {language === "en" && "Generating remediation plan..."}
            {language === "de" && "Sanierungsplan wird erstellt..."}
          </p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              {language === "ar" && "لا توجد بيانات"}
              {language === "en" && "No Data Available"}
              {language === "de" && "Keine Daten verfügbar"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "ar" && "يرجى إجراء تقييم للمخاطر أولاً"}
              {language === "en" && "Please perform a risk assessment first"}
              {language === "de" && "Bitte führen Sie zuerst eine Risikobewertung durch"}
            </p>
            <Link href="/assessment">
              <Button>
                {language === "ar" && "ابدأ التقييم"}
                {language === "en" && "Start Assessment"}
                {language === "de" && "Bewertung starten"}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "ar" && "العودة للرئيسية"}
              {language === "en" && "Back to Home"}
              {language === "de" && "Zurück zur Startseite"}
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === "ar" && "خطة العلاج الأمني"}
              {language === "en" && "Automated Remediation Planner"}
              {language === "de" && "Automatischer Sanierungsplaner"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {language === "ar" && "خطة تنفيذية تفصيلية لمعالجة الثغرات الأمنية"}
            {language === "en" && "Detailed action plan to address security vulnerabilities"}
            {language === "de" && "Detaillierter Aktionsplan zur Behebung von Sicherheitslücken"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <Badge variant="secondary">{language === "ar" ? "التكلفة" : language === "de" ? "Kosten" : "Cost"}</Badge>
            </div>
            <p className="text-3xl font-bold">${plan.totalCost.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "التكلفة الإجمالية"}
              {language === "en" && "Total Cost"}
              {language === "de" && "Gesamtkosten"}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <Badge variant="secondary">
                {language === "ar" ? "المدة" : language === "de" ? "Dauer" : "Duration"}
              </Badge>
            </div>
            <p className="text-3xl font-bold">{plan.totalDuration}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "يوم عمل"}
              {language === "en" && "Working Days"}
              {language === "de" && "Arbeitstage"}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ClipboardList className="w-8 h-8 text-purple-500" />
              <Badge variant="secondary">
                {language === "ar" ? "المهام" : language === "de" ? "Aufgaben" : "Tasks"}
              </Badge>
            </div>
            <p className="text-3xl font-bold">{plan.tasks.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "مهمة علاجية"}
              {language === "en" && "Remediation Tasks"}
              {language === "de" && "Sanierungsaufgaben"}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-green-500" />
              <Badge variant="secondary">
                {language === "ar" ? "التحسين" : language === "de" ? "Verbesserung" : "Improvement"}
              </Badge>
            </div>
            <p className="text-3xl font-bold">{plan.riskReduction}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "ar" && "تقليل المخاطر"}
              {language === "en" && "Risk Reduction"}
              {language === "de" && "Risikoreduktion"}
            </p>
          </Card>
        </div>

        {/* Phases */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Play className="w-5 h-5" />
            {language === "ar" && "المراحل التنفيذية"}
            {language === "en" && "Implementation Phases"}
            {language === "de" && "Umsetzungsphasen"}
          </h2>

          <div className="space-y-4">
            {plan.phases.map((phase) => (
              <div key={phase.phase} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {phase.phase}
                    </div>
                    <div>
                      <h3 className="font-semibold">{phase.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {phase.tasks.length} {language === "ar" ? "مهمة" : language === "de" ? "Aufgaben" : "tasks"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${phase.cost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {phase.duration} {language === "ar" ? "يوم" : language === "de" ? "Tage" : "days"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Gantt Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === "ar" && "الجدول الزمني"}
            {language === "en" && "Timeline (Gantt Chart)"}
            {language === "de" && "Zeitplan (Gantt-Diagramm)"}
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline header */}
              <div className="flex mb-2 text-xs text-muted-foreground">
                <div className="w-48 flex-shrink-0"></div>
                <div className="flex-1 flex">
                  {Array.from({ length: Math.ceil(plan.totalDuration / 5) }).map((_, i) => (
                    <div key={i} className="flex-1 text-center border-l pl-2">
                      {language === "ar" ? "أسبوع" : language === "de" ? "Woche" : "Week"} {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {plan.tasks.map((task) => {
                  const timelineEvent = plan.timeline.find((t) => t.taskId === task.id)
                  const startPercent = timelineEvent ? (timelineEvent.startDay / plan.totalDuration) * 100 : 0
                  const widthPercent = timelineEvent
                    ? ((timelineEvent.endDay - timelineEvent.startDay) / plan.totalDuration) * 100
                    : 0

                  return (
                    <div key={task.id} className="flex items-center">
                      <div className="w-48 flex-shrink-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(task.category)}</span>
                          <div>
                            <p className="text-sm font-medium truncate">{task.title}</p>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(task.priority)} text-white text-xs`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 relative h-10 bg-muted/20 rounded">
                        <div
                          className={`absolute h-full ${getPriorityColor(task.priority)} rounded flex items-center justify-center text-white text-xs font-medium`}
                          style={{
                            left: `${startPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                        >
                          {task.estimatedDays}d
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Tasks */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {language === "ar" && "المهام التفصيلية"}
            {language === "en" && "Detailed Tasks"}
            {language === "de" && "Detaillierte Aufgaben"}
          </h2>

          <div className="space-y-4">
            {plan.tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-white`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">
                            {language === "ar" ? "التكلفة:" : language === "de" ? "Kosten:" : "Cost:"}
                          </span>
                          <span className="font-semibold">${task.estimatedCost.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">
                            {language === "ar" ? "المدة:" : language === "de" ? "Dauer:" : "Duration:"}
                          </span>
                          <span className="font-semibold">
                            {task.estimatedDays} {language === "ar" ? "يوم" : language === "de" ? "Tage" : "days"}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 md:col-span-2">
                          <Users className="w-4 h-4 text-purple-500 mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">
                              {language === "ar" ? "الموارد:" : language === "de" ? "Ressourcen:" : "Resources:"}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.resources.map((resource, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 p-2 bg-primary/5 rounded">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {language === "ar" ? "مؤشر الأداء:" : language === "de" ? "KPI:" : "KPI:"}
                            </span>{" "}
                            {task.kpi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={exportPlan} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            {language === "ar" && "تصدير الخطة"}
            {language === "en" && "Export Plan"}
            {language === "de" && "Plan exportieren"}
          </Button>

          <Link href="/assessment" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "ar" && "تقييم جديد"}
              {language === "en" && "New Assessment"}
              {language === "de" && "Neue Bewertung"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
