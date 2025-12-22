"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  generateComplianceRoadmap,
  calculateComplianceProgress,
  IEC62443_REQUIREMENTS,
  type CompliancePhase,
} from "@/lib/compliance-roadmap"
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function ComplianceRoadmapPage() {
  const { language } = useLanguage()
  const [currentCompliance, setCurrentCompliance] = useState<{ [key: string]: boolean }>({})
  const [roadmap, setRoadmap] = useState<CompliancePhase[]>([])
  const [showRoadmap, setShowRoadmap] = useState(false)

  const handleGenerateRoadmap = () => {
    const generatedRoadmap = generateComplianceRoadmap(currentCompliance)
    setRoadmap(generatedRoadmap)
    setShowRoadmap(true)
  }

  const toggleCompliance = (id: string) => {
    setCurrentCompliance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const progress = calculateComplianceProgress(currentCompliance)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            {language === "ar" && "العودة للرئيسية"}
            {language === "en" && "Back to Home"}
            {language === "de" && "Zurück zur Startseite"}
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {language === "ar" && "خارطة طريق الامتثال"}
              {language === "en" && "Compliance Roadmap"}
              {language === "de" && "Compliance-Roadmap"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar" && "خطة تنفيذية للوصول للامتثال الكامل مع IEC 62443"}
              {language === "en" && "Implementation plan to achieve full IEC 62443 compliance"}
              {language === "de" && "Implementierungsplan zur vollständigen Einhaltung von IEC 62443"}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                {language === "ar" && "تقدم الامتثال الحالي"}
                {language === "en" && "Current Compliance Progress"}
                {language === "de" && "Aktueller Compliance-Fortschritt"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "ar" && `${progress.completed} من ${progress.total} متطلب مكتمل`}
                {language === "en" && `${progress.completed} of ${progress.total} requirements completed`}
                {language === "de" && `${progress.completed} von ${progress.total} Anforderungen erfüllt`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {progress.percentage.toFixed(0)}%
              </div>
            </div>
          </div>
          <Progress value={progress.percentage} className="h-3" />

          {progress.percentage < 100 && (
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  {language === "ar" && "الوقت المتبقي"}
                  {language === "en" && "Time Remaining"}
                  {language === "de" && "Verbleibende Zeit"}
                </div>
                <div className="text-2xl font-bold">
                  {progress.remainingDays} {language === "ar" ? "يوم" : "days"}
                </div>
                <div className="text-xs text-muted-foreground">
                  ~{Math.ceil(progress.remainingDays / 30)} {language === "ar" ? "شهر" : "months"}
                </div>
              </Card>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="w-4 h-4" />
                  {language === "ar" && "التكلفة المتوقعة"}
                  {language === "en" && "Estimated Cost"}
                  {language === "de" && "Geschätzte Kosten"}
                </div>
                <div className="text-lg font-bold">{formatCurrency(progress.remainingCost.min)}</div>
                <div className="text-xs text-muted-foreground">
                  {language === "ar" && "إلى "}
                  {language === "en" && "to "}
                  {language === "de" && "bis "}
                  {formatCurrency(progress.remainingCost.max)}
                </div>
              </Card>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Target className="w-4 h-4" />
                  {language === "ar" && "المتطلبات المتبقية"}
                  {language === "en" && "Remaining Requirements"}
                  {language === "de" && "Verbleibende Anforderungen"}
                </div>
                <div className="text-2xl font-bold">{progress.total - progress.completed}</div>
              </Card>
            </div>
          )}
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {language === "ar" && "حدد المتطلبات المكتملة"}
            {language === "en" && "Mark Completed Requirements"}
            {language === "de" && "Erfüllte Anforderungen markieren"}
          </h2>

          <div className="space-y-4 mb-6">
            {IEC62443_REQUIREMENTS.map((req) => (
              <div
                key={req.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={req.id}
                  checked={currentCompliance[req.id] || false}
                  onCheckedChange={() => toggleCompliance(req.id)}
                  className="mt-1"
                />
                <label htmlFor={req.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{req.title}</span>
                    <Badge className={getPriorityColor(req.priority)}>{req.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {req.estimatedDays} {language === "ar" ? "يوم" : "days"}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatCurrency(req.cost.min)} - {formatCurrency(req.cost.max)}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <Button onClick={handleGenerateRoadmap} size="lg" className="w-full gap-2">
            <Calendar className="w-5 h-5" />
            {language === "ar" && "إنشاء خارطة الطريق"}
            {language === "en" && "Generate Roadmap"}
            {language === "de" && "Roadmap erstellen"}
          </Button>
        </Card>

        {showRoadmap && roadmap.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {language === "ar" && "خارطة الطريق التنفيذية"}
              {language === "en" && "Implementation Roadmap"}
              {language === "de" && "Umsetzungs-Roadmap"}
            </h2>

            {roadmap.map((phase, phaseIdx) => (
              <Card key={phaseIdx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{phase.phase}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {phase.duration} {language === "ar" ? "يوم" : "days"} (~
                        {Math.ceil(phase.duration / 30)} {language === "ar" ? "شهر" : "months"})
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(phase.totalCost.min)} - {formatCurrency(phase.totalCost.max)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {phase.requirements.length}{" "}
                        {language === "ar" ? "متطلب" : language === "de" ? "Anforderungen" : "requirements"}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {phaseIdx + 1}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {phase.requirements.map((req) => (
                    <div key={req.id} className="border-l-4 border-emerald-500 pl-4 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{req.title}</span>
                            <Badge className={getPriorityColor(req.priority)} variant="outline">
                              {req.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{req.description}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          {language === "ar" && "المهام:"}
                          {language === "en" && "Tasks:"}
                          {language === "de" && "Aufgaben:"}
                        </p>
                        <ul className="space-y-1">
                          {req.tasks.map((task, idx) => (
                            <li key={idx} className="text-sm flex gap-2">
                              <span className="text-emerald-500">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                        <span>
                          {language === "ar" ? "المدة: " : language === "de" ? "Dauer: " : "Duration: "}
                          {req.estimatedDays} {language === "ar" ? "يوم" : "days"}
                        </span>
                        <span>
                          {language === "ar" ? "التكلفة: " : language === "de" ? "Kosten: " : "Cost: "}
                          {formatCurrency(req.cost.min)} - {formatCurrency(req.cost.max)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {showRoadmap && roadmap.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              {language === "ar" && "مبروك!"}
              {language === "en" && "Congratulations!"}
              {language === "de" && "Glückwunsch!"}
            </h3>
            <p className="text-muted-foreground">
              {language === "ar" && "لقد أكملت جميع متطلبات IEC 62443"}
              {language === "en" && "You have completed all IEC 62443 requirements"}
              {language === "de" && "Sie haben alle IEC 62443-Anforderungen erfüllt"}
            </p>
          </Card>
        )}
      </div>
    </main>
  )
}
