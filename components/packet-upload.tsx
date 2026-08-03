"use client"

import { useRef, useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    DetectedThreat,
    Packet,
    TrafficAnalysisResult,
    TraficAnalyzer,
} from "@/lib/calculators/pcap-ingestor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileCode, ShieldAlert } from "lucide-react"

export interface PacketUploadProps {
    onThreatsDetected?: (threats: DetectedThreat[]) => void
    onAnalysisComplete?: (analysis: TrafficAnalysisResult) => void
}

export function PacketUpload({ onThreatsDetected, onAnalysisComplete }: PacketUploadProps) {
    const { language } = useLanguage()
    const [jsonInput, setJsonInput] = useState("")
    const [threats, setThreats] = useState<DetectedThreat[]>([])
    const [analysis, setAnalysis] = useState<TrafficAnalysisResult | null>(null)
    const [selectedThreat, setSelectedThreat] = useState<DetectedThreat | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isArabic = language === "ar"
    const labels = {
        trafficInjection: isArabic ? "إدخال بيانات المرور" : "Traffic Injection",
        trafficHelp: isArabic ? "ارفع ملف JSON أو الصق سجل الحزم لمحاكاة إدخال حركة مرور واقعية." : "Upload a JSON file or paste packet log data to simulate real-world traffic ingestion.",
        upload: isArabic ? "رفع ملف JSON" : "Upload JSON File",
        loaded: isArabic ? "تم تحميل" : "Loaded",
        loadSample: isArabic ? "تحميل عينة" : "Load Sample",
        analyze: isArabic ? "تحليل المرور" : "Analyze Traffic",
        error: isArabic ? "خطأ" : "Error",
        invalidJson: isArabic ? "تنسيق JSON غير صالح. تأكد أنه مصفوفة حزم." : "Invalid JSON format. Please ensure it is an array of packets.",
        detectedThreats: isArabic ? "التهديدات المكتشفة" : "Detected Threats",
        noThreats: isArabic ? "لم يتم اكتشاف تهديدات بعد." : "No threats detected yet.",
        type: isArabic ? "النوع" : "Type",
        sourceIp: isArabic ? "عنوان المصدر" : "Source IP",
        severity: isArabic ? "الخطورة" : "Severity",
    }

    const loadSampleData = () => {
        const now = Date.now()
        const sample: Packet[] = [
            21, 22, 80, 443, 502, 1911, 20000, 44818, 8080, 8443,
        ].map((port, index) => ({
            id: index + 1,
            timestamp: new Date(now + index * 1000).toISOString(),
            source_ip: "172.27.224.100",
            dest_ip: "172.27.224.250",
            protocol: "TCP",
            destination_port: port,
        }))

        sample.push(
            {
                id: 11,
                timestamp: new Date(now + 11000).toISOString(),
                source_ip: "172.27.224.100",
                dest_ip: "172.27.224.250",
                protocol: "Modbus",
                destination_port: 502,
                function_code: 3,
            },
            {
                id: 12,
                timestamp: new Date(now + 12000).toISOString(),
                source_ip: "172.27.224.100",
                dest_ip: "172.27.224.250",
                protocol: "Modbus",
                destination_port: 502,
                function_code: 5,
            },
            {
                id: 13,
                timestamp: new Date(now + 13000).toISOString(),
                source_ip: "172.27.224.100",
                dest_ip: "172.27.224.250",
                protocol: "Modbus",
                destination_port: 502,
                function_code: 15,
            },
            {
                id: 14,
                timestamp: new Date(now + 14000).toISOString(),
                source_ip: "172.27.224.100",
                dest_ip: "172.27.224.250",
                protocol: "TCP",
                destination_port: 80,
                payload: "Text that says FC 15 but is not Modbus",
            },
        )

        setJsonInput(JSON.stringify(sample, null, 2))
        setFileName(null)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setError(null)

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string
                const parsedData = JSON.parse(content)

                if (Array.isArray(parsedData)) {
                    setJsonInput(JSON.stringify(parsedData, null, 2))
                    return
                }

                if (parsedData && typeof parsedData === "object") {
                    const possibleKeys = ["packets", "data", "items", "records", "traffic", "payload"]
                    const arrayKey = possibleKeys.find((key) => Array.isArray(parsedData[key]))
                    if (arrayKey) {
                        setJsonInput(JSON.stringify(parsedData[arrayKey], null, 2))
                        return
                    }
                }

                setError("JSON must be an array of packets or an object with a packets array.")
            } catch (err) {
                setError(`Failed to parse JSON: ${err instanceof Error ? err.message : "Unknown error"}`)
            }
        }
        reader.onerror = () => setError("Failed to read the file. Please try again.")
        reader.readAsText(file)
    }

    const handleAnalyze = () => {
        setError(null)
        try {
            const packets = TraficAnalyzer.parseImportedFile(jsonInput)
            const detailed = TraficAnalyzer.analyzeDetailed(packets)
            setAnalysis(detailed)
            setThreats(detailed.threats)
            setSelectedThreat(detailed.threats[0] ?? null)
            onThreatsDetected?.(detailed.threats)
            onAnalysisComplete?.(detailed)

            if (typeof window !== "undefined") {
                localStorage.setItem("detected-threats", JSON.stringify(detailed.threats))
                localStorage.setItem("traffic-analysis", JSON.stringify(detailed))
            }
        } catch (e) {
            console.error("Analysis failed:", e)
            setError(labels.invalidJson)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.8fr)_minmax(560px,1.3fr)]">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            {labels.trafficInjection}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {labels.trafficHelp}
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            {labels.upload}
                        </Button>

                        {fileName && <p className="text-sm text-green-600 font-medium">{labels.loaded}: {fileName}</p>}

                        <div className="relative">
                            <Textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='[{"source_ip": "...", "protocol": "Modbus", ...}]'
                                className="font-mono text-xs h-[200px]"
                            />
                            <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={loadSampleData}>
                                <FileCode className="w-3 h-3 mr-1" />
                                {labels.loadSample}
                            </Button>
                        </div>

                        <Button className="w-full" onClick={handleAnalyze}>{labels.analyze}</Button>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>{labels.error}</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            {labels.detectedThreats}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {threats.length === 0 ? (
                            <div className="flex items-center justify-center h-[200px] text-muted-foreground border border-dashed rounded-lg">
                                {labels.noThreats}
                            </div>
                        ) : (
                            <div className="h-[360px] overflow-auto rounded border">
                                <Table className="min-w-[760px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{labels.type}</TableHead>
                                            <TableHead>{labels.sourceIp}</TableHead>
                                            <TableHead>Target IP</TableHead>
                                            <TableHead>Port</TableHead>
                                            <TableHead>Count</TableHead>
                                            <TableHead>{labels.severity}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {threats.map((threat) => (
                                            <TableRow key={threat.id} className="cursor-pointer" onClick={() => setSelectedThreat(threat)}>
                                                <TableCell className="min-w-[190px] font-medium">{threat.type}</TableCell>
                                                <TableCell>{threat.source_ip}</TableCell>
                                                <TableCell>{threat.target_ip ?? "n/a"}</TableCell>
                                                <TableCell>{threat.port ?? "n/a"}</TableCell>
                                                <TableCell>{threat.count ?? "n/a"}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${threat.severity === "Critical" ? "bg-red-100 text-red-700" :
                                                        threat.severity === "High" ? "bg-orange-100 text-orange-700" :
                                                            threat.severity === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                                                "bg-blue-100 text-blue-700"
                                                        }`}>
                                                        {threat.severity}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {analysis && (
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Modbus Function Code Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded border">
                                <Table className="min-w-[820px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Function Code</TableHead>
                                            <TableHead>Meaning</TableHead>
                                            <TableHead>Count</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Sources</TableHead>
                                            <TableHead>Targets</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analysis.modbusFunctionCodes.map((stat) => (
                                            <TableRow key={stat.functionCode}>
                                                <TableCell className="font-medium">FC{stat.functionCode}</TableCell>
                                                <TableCell className="min-w-[220px]">{stat.meaning}</TableCell>
                                                <TableCell>{stat.count}</TableCell>
                                                <TableCell>{stat.severity}</TableCell>
                                                <TableCell className="min-w-[170px]">{stat.sources.join(", ")}</TableCell>
                                                <TableCell className="min-w-[170px]">{stat.targets.join(", ")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ground Truth Validation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                <div className="rounded border p-3">
                                    <div className="text-muted-foreground">Matched</div>
                                    <div className="text-xl font-semibold">{analysis.groundTruthSummary.matchedEvents}</div>
                                </div>
                                <div className="rounded border p-3">
                                    <div className="text-muted-foreground">Missed</div>
                                    <div className="text-xl font-semibold">{analysis.groundTruthSummary.missedEvents}</div>
                                </div>
                                <div className="rounded border p-3">
                                    <div className="text-muted-foreground">Coverage</div>
                                    <div className="text-xl font-semibold">{Math.round(analysis.groundTruthSummary.detectionCoverage * 100)}%</div>
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded border">
                                <Table className="min-w-[880px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Expected</TableHead>
                                            <TableHead>Expected Evidence</TableHead>
                                            <TableHead>Tool Output</TableHead>
                                            <TableHead>Match</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analysis.groundTruthValidation.map((row) => (
                                            <TableRow key={row.expectedLabel}>
                                                <TableCell className="min-w-[190px] font-medium">{row.expectedLabel}</TableCell>
                                                <TableCell className="min-w-[340px]">{row.expectedEvidence}</TableCell>
                                                <TableCell className="min-w-[240px]">{row.toolOutput}</TableCell>
                                                <TableCell>{row.match}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Threat Explainability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedThreat ? (
                                <div className="grid gap-3 md:grid-cols-2 text-sm">
                                    <div>
                                        <div className="font-semibold">{selectedThreat.type}</div>
                                        <p className="text-muted-foreground">{selectedThreat.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><span className="text-muted-foreground">Source:</span> {selectedThreat.source_ip}</div>
                                        <div><span className="text-muted-foreground">Target:</span> {selectedThreat.target_ip ?? "n/a"}</div>
                                        <div><span className="text-muted-foreground">Port:</span> {selectedThreat.port ?? "n/a"}</div>
                                        <div><span className="text-muted-foreground">FC:</span> {selectedThreat.function_code ?? "n/a"}</div>
                                        <div><span className="text-muted-foreground">Count:</span> {selectedThreat.count ?? "n/a"}</div>
                                        <div><span className="text-muted-foreground">Confidence:</span> {selectedThreat.confidence ? `${Math.round(selectedThreat.confidence * 100)}%` : "n/a"}</div>
                                    </div>
                                    {selectedThreat.evidence && (
                                        <pre className="md:col-span-2 overflow-auto rounded bg-muted p-3 text-xs">
                                            {JSON.stringify(selectedThreat.evidence, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">Select a detected threat to view classification evidence.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
