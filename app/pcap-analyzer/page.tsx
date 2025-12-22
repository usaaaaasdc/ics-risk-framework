"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  Upload,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Network,
  Shield,
  ArrowLeft,
  Download,
} from "lucide-react"
import Link from "next/link"
import { PCAPAnalyzer, type PCAPAnalysisResult } from "@/lib/pcap-analyzer"
import { Progress } from "@/components/ui/progress"

export default function PCAPAnalyzerPage() {
  const { language } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<PCAPAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // التحقق من امتداد الملف
      if (
        !selectedFile.name.endsWith(".pcap") &&
        !selectedFile.name.endsWith(".pcapng") &&
        !selectedFile.name.endsWith(".cap")
      ) {
        setError(
          language === "ar"
            ? "يرجى رفع ملف PCAP صالح (.pcap, .pcapng, .cap)"
            : language === "de"
              ? "Bitte laden Sie eine gültige PCAP-Datei hoch (.pcap, .pcapng, .cap)"
              : "Please upload a valid PCAP file (.pcap, .pcapng, .cap)",
        )
        return
      }
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const analyzeFile = async () => {
    if (!file) return

    setAnalyzing(true)
    setError(null)

    try {
      const analyzer = new PCAPAnalyzer()
      await analyzer.parsePCAPFile(file)
      const analysisResult = analyzer.analyze()
      setResult(analysisResult)
    } catch (err) {
      setError(
        language === "ar"
          ? "فشل تحليل الملف. يرجى التأكد من صحة الملف."
          : language === "de"
            ? "Fehler beim Analysieren der Datei. Bitte überprüfen Sie die Datei."
            : "Failed to analyze file. Please check the file is valid.",
      )
    } finally {
      setAnalyzing(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 3) return "text-green-500"
    if (score < 6) return "text-yellow-500"
    if (score < 8) return "text-orange-500"
    return "text-red-500"
  }

  const getRiskLabel = (score: number) => {
    if (score < 3) {
      return language === "ar" ? "منخفض" : language === "de" ? "Niedrig" : "Low"
    }
    if (score < 6) {
      return language === "ar" ? "متوسط" : language === "de" ? "Mittel" : "Medium"
    }
    if (score < 8) {
      return language === "ar" ? "عالي" : language === "de" ? "Hoch" : "High"
    }
    return language === "ar" ? "حرج" : language === "de" ? "Kritisch" : "Critical"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-orange-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === "ar" && "العودة للرئيسية"}
                {language === "en" && "Back to Home"}
                {language === "de" && "Zurück zur Startseite"}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">
              {language === "ar" && "محلل ملفات PCAP"}
              {language === "en" && "PCAP File Analyzer"}
              {language === "de" && "PCAP-Dateianalysator"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar" && "حلل حركة الشبكة من ملفات Wireshark واكتشف الأنماط المشبوهة"}
              {language === "en" && "Analyze network traffic from Wireshark files and detect suspicious patterns"}
              {language === "de" &&
                "Analysieren Sie den Netzwerkverkehr aus Wireshark-Dateien und erkennen Sie verdächtige Muster"}
            </p>
          </div>
        </div>

        {/* Upload Section */}
        {!result && (
          <Card className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                {language === "ar" && "رفع ملف PCAP"}
                {language === "en" && "Upload PCAP File"}
                {language === "de" && "PCAP-Datei hochladen"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {language === "ar" && "قم برفع ملف PCAP من Wireshark أو tcpdump لتحليل حركة الشبكة الصناعية"}
                {language === "en" &&
                  "Upload a PCAP file from Wireshark or tcpdump to analyze industrial network traffic"}
                {language === "de" &&
                  "Laden Sie eine PCAP-Datei von Wireshark oder tcpdump hoch, um den industriellen Netzwerkverkehr zu analysieren"}
              </p>

              <input
                type="file"
                accept=".pcap,.pcapng,.cap"
                onChange={handleFileUpload}
                className="hidden"
                id="pcap-upload"
              />
              <label htmlFor="pcap-upload">
                <Button asChild variant="outline" className="mb-4 bg-transparent">
                  <span>
                    <FileText className="w-4 h-4 mr-2" />
                    {language === "ar" && "اختر ملف"}
                    {language === "en" && "Choose File"}
                    {language === "de" && "Datei wählen"}
                  </span>
                </Button>
              </label>

              {file && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === "ar" && "الملف المحدد:"}
                    {language === "en" && "Selected file:"}
                    {language === "de" && "Ausgewählte Datei:"}
                  </p>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button onClick={analyzeFile} disabled={!file || analyzing} className="w-full">
                {analyzing ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    {language === "ar" && "جاري التحليل..."}
                    {language === "en" && "Analyzing..."}
                    {language === "de" && "Analysiere..."}
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    {language === "ar" && "بدء التحليل"}
                    {language === "en" && "Start Analysis"}
                    {language === "de" && "Analyse starten"}
                  </>
                )}
              </Button>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {language === "ar" && "ملاحظة هامة"}
                  {language === "en" && "Important Note"}
                  {language === "de" && "Wichtiger Hinweis"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === "ar" && "جميع التحليلات تتم محلياً في المتصفح. لا يتم رفع أي بيانات للخوادم الخارجية."}
                  {language === "en" &&
                    "All analysis is performed locally in your browser. No data is uploaded to external servers."}
                  {language === "de" &&
                    "Alle Analysen werden lokal in Ihrem Browser durchgeführt. Es werden keine Daten auf externe Server hochgeladen."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" && "إجمالي الحزم"}
                      {language === "en" && "Total Packets"}
                      {language === "de" && "Gesamtpakete"}
                    </p>
                    <p className="text-2xl font-bold">{result.totalPackets.toLocaleString()}</p>
                  </div>
                  <Network className="w-8 h-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" && "المدة"}
                      {language === "en" && "Duration"}
                      {language === "de" && "Dauer"}
                    </p>
                    <p className="text-2xl font-bold">{Math.floor(result.duration)}s</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" && "الأنماط المشبوهة"}
                      {language === "en" && "Suspicious Patterns"}
                      {language === "de" && "Verdächtige Muster"}
                    </p>
                    <p className="text-2xl font-bold">{result.suspiciousPatterns.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" && "درجة المخاطر"}
                      {language === "en" && "Risk Score"}
                      {language === "de" && "Risikobewertung"}
                    </p>
                    <p className={`text-2xl font-bold ${getRiskColor(result.riskScore)}`}>
                      {result.riskScore.toFixed(1)}/10
                    </p>
                    <p className={`text-xs ${getRiskColor(result.riskScore)}`}>{getRiskLabel(result.riskScore)}</p>
                  </div>
                  <Shield className={`w-8 h-8 ${getRiskColor(result.riskScore)}`} />
                </div>
              </Card>
            </div>

            {/* Protocols Distribution */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {language === "ar" && "توزيع البروتوكولات"}
                {language === "en" && "Protocol Distribution"}
                {language === "de" && "Protokollverteilung"}
              </h2>
              <div className="space-y-3">
                {Object.entries(result.protocols)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([protocol, count]) => {
                    const percentage = (count / result.totalPackets) * 100
                    return (
                      <div key={protocol}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{protocol}</span>
                          <span className="text-muted-foreground">
                            {count.toLocaleString()} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
              </div>
            </Card>

            {/* Industrial Protocols */}
            {result.industrialProtocols.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === "ar" && "البروتوكولات الصناعية"}
                  {language === "en" && "Industrial Protocols"}
                  {language === "de" && "Industrielle Protokolle"}
                </h2>
                <div className="space-y-4">
                  {result.industrialProtocols.map((proto, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{proto.protocol}</h3>
                        <span className="text-sm text-muted-foreground">
                          {proto.packets.toLocaleString()} packets ({proto.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      {proto.commands.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === "ar" && "الأوامر المكتشفة:"}
                            {language === "en" && "Detected Commands:"}
                            {language === "de" && "Erkannte Befehle:"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {proto.commands.map((cmd, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {cmd}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {proto.anomalies.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === "ar" && "الشذوذات:"}
                            {language === "en" && "Anomalies:"}
                            {language === "de" && "Anomalien:"}
                          </p>
                          <div className="space-y-1">
                            {proto.anomalies.map((anomaly, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5" />
                                <span className="text-xs text-orange-600">{anomaly}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Suspicious Patterns */}
            {result.suspiciousPatterns.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  {language === "ar" && "الأنماط المشبوهة"}
                  {language === "en" && "Suspicious Patterns"}
                  {language === "de" && "Verdächtige Muster"}
                </h2>
                <div className="space-y-3">
                  {result.suspiciousPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 border-l-4"
                      style={{
                        borderLeftColor:
                          pattern.severity === "critical"
                            ? "#ef4444"
                            : pattern.severity === "high"
                              ? "#f97316"
                              : pattern.severity === "medium"
                                ? "#eab308"
                                : "#22c55e",
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{pattern.type}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(pattern.severity)}`}>
                          {pattern.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {language === "ar" && "العدد:"}
                          {language === "en" && "Count:"}
                          {language === "de" && "Anzahl:"} {pattern.count}
                        </span>
                        <span>
                          {language === "ar" && "العناوين المتأثرة:"}
                          {language === "en" && "Affected IPs:"}
                          {language === "de" && "Betroffene IPs:"} {pattern.affectedIPs.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                {language === "ar" && "التوصيات الأمنية"}
                {language === "en" && "Security Recommendations"}
                {language === "de" && "Sicherheitsempfehlungen"}
              </h2>
              <div className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                }}
              >
                {language === "ar" && "تحليل ملف آخر"}
                {language === "en" && "Analyze Another File"}
                {language === "de" && "Weitere Datei analysieren"}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                {language === "ar" && "تحميل التقرير"}
                {language === "en" && "Download Report"}
                {language === "de" && "Bericht herunterladen"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
