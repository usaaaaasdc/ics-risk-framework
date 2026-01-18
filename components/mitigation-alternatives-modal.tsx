"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Shield, AlertTriangle, CheckCircle2, DollarSign, Clock } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"

interface MitigationAlternative {
  type: "network_isolation" | "service_disable" | "firewall_rule" | "access_control"
  title: string
  description: string
  effectiveness: number
  complexity: "low" | "medium" | "high"
  cost: "none" | "low" | "medium" | "high"
  steps: string[]
}

interface MitigationAlternativesModalProps {
  open: boolean
  onClose: () => void
  cveId: string
  alternatives: MitigationAlternative[]
}

export function MitigationAlternativesModal({ open, onClose, cveId, alternatives }: MitigationAlternativesModalProps) {
  const { language } = useLanguage()
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({})

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "network_isolation":
        return "🔒"
      case "service_disable":
        return "⚠️"
      case "firewall_rule":
        return "🛡️"
      case "access_control":
        return "🔑"
      default:
        return "📋"
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 0.85) return "text-green-600"
    if (effectiveness >= 0.7) return "text-yellow-600"
    return "text-orange-600"
  }

  const getComplexityBadge = (complexity: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[complexity as keyof typeof colors] || colors.medium
  }

  const getCostBadge = (cost: string) => {
    const colors = {
      none: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[cost as keyof typeof colors] || colors.medium
  }

  const copySteps = (steps: string[]) => {
    const text = steps.map((step, index) => `${index + 1}. ${step}`).join("\n")
    navigator.clipboard.writeText(text)
  }

  const t = {
    ar: {
      title: "بدائل التخفيف",
      subtitle: "حلول بديلة عندما لا يمكن تحديث البرامج الثابتة",
      effectiveness: "الفعالية",
      complexity: "التعقيد",
      cost: "التكلفة",
      steps: "خطوات التنفيذ",
      copySteps: "نسخ الخطوات",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      none: "مجاني",
      completed: "مكتمل",
    },
    en: {
      title: "Mitigation Alternatives",
      subtitle: "Alternative solutions when firmware updates are not possible",
      effectiveness: "Effectiveness",
      complexity: "Complexity",
      cost: "Cost",
      steps: "Implementation Steps",
      copySteps: "Copy Steps",
      low: "Low",
      medium: "Medium",
      high: "High",
      none: "Free",
      completed: "Completed",
    },
    de: {
      title: "Mitigationsalternativen",
      subtitle: "Alternative Lösungen, wenn Firmware-Updates nicht möglich sind",
      effectiveness: "Wirksamkeit",
      complexity: "Komplexität",
      cost: "Kosten",
      steps: "Implementierungsschritte",
      copySteps: "Schritte kopieren",
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      none: "Kostenlos",
      completed: "Abgeschlossen",
    },
  }[language as 'ar' | 'en' | 'de'] || {
    title: "Mitigation Alternatives",
    subtitle: "Alternative solutions when firmware updates are not possible",
    effectiveness: "Effectiveness",
    complexity: "Complexity",
    cost: "Cost",
    steps: "Implementation Steps",
    copySteps: "Copy Steps",
    low: "Low",
    medium: "Medium",
    high: "High",
    none: "Free",
    completed: "Completed",
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir={language === "ar" ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-primary" />
            {t.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {t.subtitle} ({cveId})
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {alternatives.map((alt, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(alt.type)}</span>
                    <h3 className="text-lg font-semibold">{alt.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{alt.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.effectiveness}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full transition-all"
                        style={{ width: `${alt.effectiveness * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${getEffectivenessColor(alt.effectiveness)}`}>
                      {(alt.effectiveness * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t.complexity}
                  </div>
                  <Badge className={getComplexityBadge(alt.complexity)}>
                    {t[alt.complexity as keyof typeof t] as string}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {t.cost}
                  </div>
                  <Badge className={getCostBadge(alt.cost)}>{t[alt.cost as keyof typeof t] as string}</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t.steps}
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => copySteps(alt.steps)}>
                    <Copy className="w-4 h-4 mr-2" />
                    {t.copySteps}
                  </Button>
                </div>

                <div className="space-y-2">
                  {alt.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={checkedSteps[`${index}-${stepIndex}`] || false}
                        onCheckedChange={(checked) =>
                          setCheckedSteps((prev) => ({ ...prev, [`${index}-${stepIndex}`]: checked as boolean }))
                        }
                      />
                      <span
                        className={`text-sm flex-1 ${checkedSteps[`${index}-${stepIndex}`] ? "line-through text-muted-foreground" : ""}`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {alt.steps.every((_, i) => checkedSteps[`${index}-${i}`]) && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.completed}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
