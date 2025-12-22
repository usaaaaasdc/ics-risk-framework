"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  ArrowLeft,
  Zap,
  Target,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AIRiskPredictor } from "@/lib/ai-risk-prediction"

export default function AIPredictionPage() {
  const { language } = useLanguage()
  const [predictor] = useState(() => new AIRiskPredictor())
  const [prediction, setPrediction] = useState<any>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load historical data
    predictor.loadHistoricalData()

    // Get statistics
    const stats = predictor.getStatistics()
    setStatistics(stats)

    // Run prediction if we have data
    if (stats.totalAssessments > 0) {
      // For demo, we'll use sample data
      // In production, this would come from the current project
      const sampleDevices = [
        {
          type: "PLC",
          manufacturer: "Siemens",
          protocols: ["Modbus/TCP", "Profinet"],
          internetExposed: true,
          isLegacy: false,
          riskScore: 7.2,
          vulnerabilitiesFound: 4,
        },
        {
          type: "HMI",
          manufacturer: "Rockwell",
          protocols: ["EtherNet/IP"],
          internetExposed: false,
          isLegacy: true,
          riskScore: 6.5,
          vulnerabilitiesFound: 3,
        },
      ]

      const result = predictor.predictRisk(sampleDevices, "Manufacturing")
      setPrediction(result)
    }

    setLoading(false)
  }, [predictor])

  const getTrendIcon = (severity: string) => {
    if (severity === "improving") return <TrendingDown className="w-4 h-4 text-green-500" />
    if (severity === "worsening") return <TrendingUp className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-yellow-500" />
  }

  const getTrendColor = (severity: string) => {
    if (severity === "improving") return "text-green-600"
    if (severity === "worsening") return "text-red-600"
    return "text-yellow-600"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="w-16 h-16 animate-pulse text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === "ar" && "جاري تحميل البيانات..."}
              {language === "en" && "Loading data..."}
              {language === "de" && "Daten werden geladen..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!prediction || statistics.totalAssessments === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "ar" && "العودة للصفحة الرئيسية"}
              {language === "en" && "Back to Home"}
              {language === "de" && "Zurück zur Startseite"}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              {language === "ar" && "توقع المخاطر بالذكاء الاصطناعي"}
              {language === "en" && "AI Risk Prediction"}
              {language === "de" && "KI-Risikovorhersage"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                {language === "ar" &&
                  "لا توجد بيانات تاريخية كافية للتوقع. يرجى إجراء تقييمات أمنية أولاً لتمكين الذكاء الاصطناعي من التعلم والتوقع."}
                {language === "en" &&
                  "Insufficient historical data for prediction. Please perform security assessments first to enable AI learning and prediction."}
                {language === "de" &&
                  "Unzureichende historische Daten für Vorhersagen. Bitte führen Sie zuerst Sicherheitsbewertungen durch, um KI-Lernen und Vorhersagen zu ermöglichen."}
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <Link href="/assessment">
                <Button>
                  {language === "ar" && "ابدأ تقييماً أمنياً"}
                  {language === "en" && "Start Security Assessment"}
                  {language === "de" && "Sicherheitsbewertung starten"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "ar" && "العودة للصفحة الرئيسية"}
            {language === "en" && "Back to Home"}
            {language === "de" && "Zurück zur Startseite"}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          {language === "ar" && "توقع المخاطر بالذكاء الاصطناعي"}
          {language === "en" && "AI-Powered Risk Prediction"}
          {language === "de" && "KI-gestützte Risikovorhersage"}
        </h1>
        <p className="text-muted-foreground">
          {language === "ar" && "تحليل متقدم باستخدام الذكاء الاصطناعي لتوقع المخاطر المستقبلية"}
          {language === "en" && "Advanced AI analysis to predict future security risks"}
          {language === "de" && "Fortgeschrittene KI-Analyse zur Vorhersage zukünftiger Sicherheitsrisiken"}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" && "التقييمات التاريخية"}
              {language === "en" && "Historical Assessments"}
              {language === "de" && "Historische Bewertungen"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalAssessments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" && "متوسط المخاطر"}
              {language === "en" && "Average Risk"}
              {language === "de" && "Durchschnittliches Risiko"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageRisk}/10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" && "الاتجاه"}
              {language === "en" && "Trend"}
              {language === "de" && "Trend"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getTrendIcon(statistics.trend)}
              <span className={`text-sm font-medium ${getTrendColor(statistics.trend)}`}>
                {statistics.trend === "improving" &&
                  (language === "ar" ? "تحسن" : language === "en" ? "Improving" : "Verbesserung")}
                {statistics.trend === "stable" &&
                  (language === "ar" ? "مستقر" : language === "en" ? "Stable" : "Stabil")}
                {statistics.trend === "worsening" &&
                  (language === "ar" ? "تدهور" : language === "en" ? "Worsening" : "Verschlechterung")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" && "الصناعة"}
              {language === "en" && "Industry"}
              {language === "de" && "Branche"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{statistics.mostCommonIndustry}</div>
          </CardContent>
        </Card>
      </div>

      {/* Predicted Risk Score */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {language === "ar" && "درجة المخاطر المتوقعة"}
            {language === "en" && "Predicted Risk Score"}
            {language === "de" && "Vorhergesagter Risikoscore"}
          </CardTitle>
          <CardDescription>
            {language === "ar" && `مستوى الثقة: ${prediction.confidence}%`}
            {language === "en" && `Confidence Level: ${prediction.confidence}%`}
            {language === "de" && `Vertrauensniveau: ${prediction.confidence}%`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-5xl font-bold">{prediction.predictedRiskScore.toFixed(1)}</span>
                    <span className="text-2xl text-muted-foreground">/10</span>
                  </div>
                  <Badge
                    variant={
                      prediction.predictedRiskScore >= 7
                        ? "destructive"
                        : prediction.predictedRiskScore >= 4
                          ? "default"
                          : "secondary"
                    }
                  >
                    {prediction.predictedRiskScore >= 7 &&
                      (language === "ar" ? "عالي" : language === "en" ? "High" : "Hoch")}
                    {prediction.predictedRiskScore >= 4 &&
                      prediction.predictedRiskScore < 7 &&
                      (language === "ar" ? "متوسط" : language === "en" ? "Medium" : "Mittel")}
                    {prediction.predictedRiskScore < 4 &&
                      (language === "ar" ? "منخفض" : language === "en" ? "Low" : "Niedrig")}
                  </Badge>
                </div>
                <div className="overflow-hidden h-4 text-xs flex rounded bg-secondary">
                  <div
                    style={{ width: `${(prediction.predictedRiskScore / 10) * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      prediction.predictedRiskScore >= 7
                        ? "bg-red-500"
                        : prediction.predictedRiskScore >= 4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                </div>
              </div>

              {prediction.confidence < 70 && (
                <Alert className="mt-4">
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    {language === "ar" && "الثقة متوسطة - يوصى بإجراء المزيد من التقييمات لتحسين دقة التوقع"}
                    {language === "en" &&
                      "Medium confidence - More assessments recommended to improve prediction accuracy"}
                    {language === "de" &&
                      "Mittleres Vertrauen - Weitere Bewertungen empfohlen, um die Vorhersagegenauigkeit zu verbessern"}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trends */}
      {prediction.trends.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {language === "ar" && "الاتجاهات المكتشفة"}
              {language === "en" && "Detected Trends"}
              {language === "de" && "Erkannte Trends"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prediction.trends.map((trend: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(trend.severity)}
                    <div>
                      <div className="font-medium">{trend.label}</div>
                      <div className="text-sm text-muted-foreground">{trend.change.toFixed(1)}%</div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      trend.severity === "worsening"
                        ? "destructive"
                        : trend.severity === "improving"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {trend.severity === "improving" &&
                      (language === "ar" ? "تحسن" : language === "en" ? "Improving" : "Verbesserung")}
                    {trend.severity === "stable" &&
                      (language === "ar" ? "مستقر" : language === "en" ? "Stable" : "Stabil")}
                    {trend.severity === "worsening" &&
                      (language === "ar" ? "تدهور" : language === "en" ? "Worsening" : "Verschlechterung")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Risks */}
      {prediction.futureRisks.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {language === "ar" && "المخاطر المستقبلية المتوقعة"}
              {language === "en" && "Predicted Future Risks"}
              {language === "de" && "Vorhergesagte zukünftige Risiken"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prediction.futureRisks.map((risk: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-5 h-5 ${risk.probability > 0.6 ? "text-red-500" : "text-yellow-500"}`}
                      />
                      <span className="font-medium">{risk.timeframe}</span>
                    </div>
                    <Badge variant={risk.probability > 0.6 ? "destructive" : "default"}>
                      {(risk.probability * 100).toFixed(0)}%{" "}
                      {language === "ar" ? "احتمال" : language === "en" ? "probability" : "Wahrscheinlichkeit"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.risk}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {language === "ar" && "توصيات الذكاء الاصطناعي"}
            {language === "en" && "AI Recommendations"}
            {language === "de" && "KI-Empfehlungen"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
