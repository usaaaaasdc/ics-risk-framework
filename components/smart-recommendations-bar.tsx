"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, DollarSign, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface Recommendation {
  id: string
  title: string
  impact: number
  likelihood: number
  quickFix: string
  costEstimate: string
  timeEstimate: string
}

interface SmartRecommendationsBarProps {
  recommendations?: Recommendation[]
  language?: "en" | "ar" | "de"
}

export function SmartRecommendationsBar({ recommendations = [], language = "en" }: SmartRecommendationsBarProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  const sortedRecommendations = recommendations
    .sort((a, b) => b.impact * b.likelihood - a.impact * a.likelihood)
    .slice(0, 3)

  const handleComplete = (id: string) => {
    setCompletedIds((prev) => new Set([...prev, id]))
  }

  const progress = recommendations.length > 0 ? Math.round((completedIds.size / recommendations.length) * 100) : 0

  const titles = {
    en: "Top Priority Actions",
    ar: "الإجراءات ذات الأولوية",
    de: "Wichtigste Maßnahmen",
  }

  const labels = {
    impact: { en: "Impact", ar: "التأثير", de: "Auswirkung" },
    time: { en: "Time", ar: "الوقت", de: "Zeit" },
    cost: { en: "Cost", ar: "التكلفة", de: "Kosten" },
    completed: { en: "Completed", ar: "مكتمل", de: "Abgeschlossen" },
    markDone: { en: "Mark as Done", ar: "تعليم كمكتمل", de: "Als erledigt markieren" },
    progress: { en: "Progress", ar: "التقدم", de: "Fortschritt" },
  }

  return (
    <div className="w-full md:w-80 space-y-4">
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{titles[language]}</span>
            <Badge variant="secondary">{progress}%</Badge>
          </CardTitle>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedRecommendations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              {language === "ar"
                ? "لا توجد توصيات حالياً"
                : language === "de"
                  ? "Derzeit keine Empfehlungen"
                  : "No recommendations yet"}
            </p>
          ) : (
            sortedRecommendations.map((rec, idx) => {
              const isCompleted = completedIds.has(rec.id)
              return (
                <Card key={rec.id} className={`${isCompleted ? "opacity-50" : ""}`}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <Badge className="mt-1">{idx + 1}</Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{rec.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{rec.quickFix}</p>
                        </div>
                      </div>
                      {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span>
                          {labels.impact[language]}: {Math.round(rec.impact * rec.likelihood)}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>{rec.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-green-500" />
                        <span>{rec.costEstimate}</span>
                      </div>
                    </div>

                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => handleComplete(rec.id)}
                      >
                        {labels.markDone[language]}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
