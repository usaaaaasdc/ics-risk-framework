"use client"

import { useEffect, useMemo, useState } from "react"
import { zipSync, strToU8 } from "fflate"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Download, Package, RotateCcw, TrendingDown } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import {
    MONTE_CARLO_EQUATION,
    monteCarloDistributionToCsv,
    monteCarloSummaryToCsv,
    runMonteCarloSimulation,
    type SimulationParams,
} from "@/lib/calculators/risk-engine"
import { MARKOV_STATES, MarkovEngine, type ManualSecurityState } from "@/lib/calculators/markov-engine"
import { type DetectedThreat, type TrafficAnalysisResult } from "@/lib/calculators/pcap-ingestor"
import { buildCaseStudyBundleFiles } from "@/lib/case-study-export"
import { downloadJsonFile, downloadTextFile, triggerBrowserDownload } from "@/lib/browser-download"
import { NetworkTopology } from "@/components/network-topology"
import { PacketUpload } from "@/components/packet-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function percent(value: number) {
    return `${Math.round(value * 100)}%`
}

export default function RiskSimulationChart() {
    const { language } = useLanguage()
    const isArabic = language === "ar"

    const [params, setParams] = useState<SimulationParams>({
        baseImpact: 7,
        baseLikelihood: 0.6,
        mitigationFactor: 0.5,
        uncertainty: 0.2,
        iterations: 2000,
        seed: 20260630,
    })
    const [detectedThreats, setDetectedThreats] = useState<DetectedThreat[]>([])
    const [trafficAnalysis, setTrafficAnalysis] = useState<TrafficAnalysisResult | null>(null)
    const [publicationMode, setPublicationMode] = useState(false)
    const [exportStatus, setExportStatus] = useState<string | null>(null)

    useEffect(() => {
        setParams((previous) => {
            const shared = {
                uncertainty: previous.uncertainty,
                iterations: previous.iterations,
                seed: previous.seed,
            }

            if (detectedThreats.length === 0) {
                return {
                    ...shared,
                    baseImpact: 3,
                    baseLikelihood: 0.2,
                    mitigationFactor: 0.8,
                }
            }

            const hasCritical = detectedThreats.some((threat) => threat.severity === "Critical")
            const hasHigh = detectedThreats.some((threat) => threat.severity === "High")

            if (hasCritical) {
                return {
                    ...shared,
                    baseImpact: 9.5,
                    baseLikelihood: 0.95,
                    mitigationFactor: 0.1,
                }
            }

            if (hasHigh) {
                return {
                    ...shared,
                    baseImpact: 7,
                    baseLikelihood: 0.7,
                    mitigationFactor: 0.3,
                }
            }

            return {
                ...shared,
                baseImpact: 4,
                baseLikelihood: 0.4,
                mitigationFactor: 0.6,
            }
        })
    }, [detectedThreats])

    const stats = useMemo(() => runMonteCarloSimulation(params), [params])

    const markovRiskScore = useMemo(
        () => params.baseImpact * params.baseLikelihood * (1 - params.mitigationFactor),
        [params.baseImpact, params.baseLikelihood, params.mitigationFactor],
    )
    const transitionMatrix = useMemo(() => MarkovEngine.createTransitionMatrix(markovRiskScore), [markovRiskScore])
    const transitionMatrixValid = useMemo(() => MarkovEngine.validateTransitionMatrix(transitionMatrix), [transitionMatrix])
    const markovHistory = useMemo(() => MarkovEngine.simulateAttackProgression(markovRiskScore, 24), [markovRiskScore])
    const markovSummary = useMemo(() => MarkovEngine.summarize(markovHistory), [markovHistory])

    const currentSimState = useMemo<ManualSecurityState>(() => {
        const midPoint = markovHistory[12]
        if (!midPoint) return "Secure"
        const probs = midPoint.probabilities
        if (probs.Compromised > 0.4) return "Compromised"
        if (probs.Exploitation > 0.4) return "Exploitation"
        if (probs.Reconnaissance > 0.4) return "Reconnaissance"
        return "Secure"
    }, [markovHistory])

    const labels = {
        title: isArabic ? "محاكاة المخاطر الصناعية" : "Industrial Risk Simulation",
        params: isArabic ? "معاملات المحاكاة" : "Simulation Parameters",
        impact: isArabic ? "الأثر" : "Impact",
        likelihood: isArabic ? "الاحتمالية" : "Likelihood",
        mitigation: isArabic ? "فعالية التخفيف" : "Mitigation Efficacy",
        uncertainty: isArabic ? "عدم اليقين" : "Uncertainty",
        iterations: isArabic ? "عدد التكرارات" : "Iterations",
        seed: isArabic ? "Seed ثابت" : "Deterministic Seed",
        recalculate: isArabic ? "إعادة حساب" : "Recalculate",
        publication: isArabic ? "وضع النشر" : "Publication Mode",
        exportBundle: isArabic ? "تصدير حزمة دراسة الحالة" : "Export Case Study Bundle",
        exportStarted: isArabic ? "بدأ التصدير" : "export started",
        exportFailed: isArabic ? "فشل التصدير" : "export failed",
        tabs: {
            risk: isArabic ? "محاكاة المخاطر" : "Risk Sim",
            markov: isArabic ? "مسار الهجوم" : "Attack Path",
            topology: isArabic ? "خريطة الشبكة" : "Network Map",
            traffic: isArabic ? "تحليل المرور" : "Traffic Analysis",
        },
        monteCarloTitle: isArabic ? "Monte Carlo للمخاطر المتبقية" : "Monte Carlo Residual Risk",
        markovTitle: isArabic ? "توقع تطور الهجوم (24 ساعة)" : "Attack Progression Forecast (24 Hours)",
    }

    const monteCarloCards = [
        { label: "Mean", value: stats.mean.toFixed(2), className: "text-blue-600" },
        { label: "Median", value: stats.median.toFixed(2), className: "text-slate-700 dark:text-slate-100" },
        { label: "P10", value: stats.p10.toFixed(2), className: "text-green-600", icon: true },
        { label: "P90", value: stats.p90.toFixed(2), className: "text-red-600" },
        { label: "StdDev", value: stats.standardDeviation.toFixed(2), className: "text-slate-700 dark:text-slate-100" },
        { label: "Min / Max", value: `${stats.minRisk.toFixed(1)} / ${stats.maxRisk.toFixed(1)}`, className: "text-slate-700 dark:text-slate-100" },
        {
            label: "95% CI",
            value: `${stats.confidenceInterval95.lower.toFixed(2)} - ${stats.confidenceInterval95.upper.toFixed(2)}`,
            className: "text-slate-700 dark:text-slate-100",
        },
        { label: "Iterations", value: stats.iterations.toLocaleString(), className: "text-slate-700 dark:text-slate-100" },
    ]

    const runExport = (label: string, action: () => void) => {
        try {
            action()
            setExportStatus(`${label} ${labels.exportStarted}.`)
        } catch (error) {
            console.error(`${label} export failed`, error)
            setExportStatus(`${label} ${labels.exportFailed}.`)
        }
    }

    const exportMonteCarloCsv = () => runExport("Monte Carlo CSV", () => {
        downloadTextFile("monte-carlo-summary.csv", monteCarloSummaryToCsv(stats), "text/csv;charset=utf-8")
        downloadTextFile("monte-carlo-results.csv", monteCarloDistributionToCsv(stats), "text/csv;charset=utf-8")
    })

    const exportMonteCarloJson = () => runExport("Monte Carlo JSON", () => {
        downloadJsonFile("monte-carlo-results.json", {
            params,
            equation: stats.equation,
            summary: {
                mean: stats.mean,
                median: stats.median,
                p10: stats.p10,
                p90: stats.p90,
                standardDeviation: stats.standardDeviation,
                minRisk: stats.minRisk,
                maxRisk: stats.maxRisk,
                confidenceInterval95: stats.confidenceInterval95,
                iterations: stats.iterations,
            },
            rawResults: stats.rawResults,
        })
    })

    const exportMarkovCsv = () => runExport("Markov CSV", () => {
        downloadTextFile("markov-probabilities.csv", MarkovEngine.historyToCsv(markovHistory), "text/csv;charset=utf-8")
        downloadTextFile("transition-matrix.csv", MarkovEngine.transitionMatrixToCsv(transitionMatrix), "text/csv;charset=utf-8")
    })

    const exportMarkovJson = () => runExport("Markov JSON", () => {
        downloadJsonFile("markov-forecast.json", {
            equation: "P(t+1) = P(t) x TransitionMatrix; Compromised row = [0,0,0,1].",
            markovRiskScore,
            transitionMatrixValid,
            transitionMatrix,
            summary: markovSummary,
            history: markovHistory,
        })
    })

    const exportCaseStudyBundle = () => runExport("Case Study Bundle", () => {
        const files = buildCaseStudyBundleFiles({
            trafficAnalysis,
            simulationParams: params,
            monteCarloStats: stats,
            markovHistory,
            markovSummary,
            transitionMatrix,
        })
        const zipped = zipSync(Object.fromEntries(
            Object.entries(files).map(([filename, content]) => [filename, strToU8(content)]),
        ))
        const blob = new Blob([new Uint8Array(zipped)], { type: "application/zip" })
        triggerBrowserDownload("ics-risk-case-study-bundle.zip", blob)
    })

    const handleAnalysisComplete = (analysis: TrafficAnalysisResult) => {
        setTrafficAnalysis(analysis)
        setDetectedThreats(analysis.threats)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-normal">{labels.title}</h2>
                    {!publicationMode && (
                        <p className="text-sm text-muted-foreground">
                            {MONTE_CARLO_EQUATION}; Markov input risk (0-10) = Impact x Likelihood x (1 - Mitigation).
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 rounded border px-3 py-2">
                    <Label htmlFor="publication-mode">{labels.publication}</Label>
                    <Switch id="publication-mode" checked={publicationMode} onCheckedChange={setPublicationMode} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">{labels.params}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{labels.impact}</Label>
                                <span className="text-sm text-muted-foreground">{params.baseImpact}</span>
                            </div>
                            <Slider value={[params.baseImpact]} max={10} min={1} step={0.5} onValueChange={(v) => setParams((p) => ({ ...p, baseImpact: v[0] }))} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{labels.likelihood}</Label>
                                <span className="text-sm text-muted-foreground">{percent(params.baseLikelihood)}</span>
                            </div>
                            <Slider value={[params.baseLikelihood]} max={1} min={0.1} step={0.05} onValueChange={(v) => setParams((p) => ({ ...p, baseLikelihood: v[0] }))} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{labels.mitigation}</Label>
                                <span className="text-sm text-muted-foreground">{percent(params.mitigationFactor)}</span>
                            </div>
                            <Slider value={[params.mitigationFactor]} max={0.95} min={0} step={0.05} onValueChange={(v) => setParams((p) => ({ ...p, mitigationFactor: v[0] }))} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{labels.uncertainty}</Label>
                                <span className="text-sm text-muted-foreground">{percent(params.uncertainty)}</span>
                            </div>
                            <Slider value={[params.uncertainty]} max={0.5} min={0.05} step={0.05} onValueChange={(v) => setParams((p) => ({ ...p, uncertainty: v[0] }))} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="iterations">{labels.iterations}</Label>
                                <Input
                                    id="iterations"
                                    type="number"
                                    min={100}
                                    step={100}
                                    value={params.iterations}
                                    onChange={(event) => setParams((p) => ({ ...p, iterations: Math.max(100, Number(event.target.value) || 100) }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seed">{labels.seed}</Label>
                                <Input
                                    id="seed"
                                    type="number"
                                    value={params.seed ?? ""}
                                    onChange={(event) => {
                                        const nextSeed = Number(event.target.value)
                                        setParams((p) => ({ ...p, seed: Number.isFinite(nextSeed) ? nextSeed : undefined }))
                                    }}
                                />
                            </div>
                        </div>

                        <Button className="w-full" onClick={() => setParams({ ...params })}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            {labels.recalculate}
                        </Button>

                        <Button variant="secondary" className="w-full" onClick={exportCaseStudyBundle}>
                            <Package className="mr-2 h-4 w-4" />
                            {labels.exportBundle}
                        </Button>
                        {exportStatus && (
                            <div className="rounded border bg-muted px-3 py-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                                {exportStatus}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6 md:col-span-2">
                    <Tabs defaultValue="monte-carlo">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="monte-carlo">{labels.tabs.risk}</TabsTrigger>
                            <TabsTrigger value="markov">{labels.tabs.markov}</TabsTrigger>
                            <TabsTrigger value="topology">{labels.tabs.topology}</TabsTrigger>
                            <TabsTrigger value="traffic">{labels.tabs.traffic}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="monte-carlo">
                            <Card>
                                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <CardTitle>{labels.monteCarloTitle}</CardTitle>
                                        {!publicationMode && <CardDescription>{stats.equation}</CardDescription>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={exportMonteCarloCsv}>
                                            <Download className="mr-2 h-4 w-4" />
                                            CSV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={exportMonteCarloJson}>
                                            <Download className="mr-2 h-4 w-4" />
                                            JSON
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.data} margin={{ top: 20, right: 30, left: 20, bottom: 26 }}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="riskScore" label={{ value: "Residual Risk Score (0-100)", position: "insideBottom", offset: -12 }} />
                                                <YAxis />
                                                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", color: "#fff" }} labelStyle={{ color: "#94a3b8" }} />
                                                <ReferenceLine x={stats.mean} stroke="#2563eb" label="Mean" strokeDasharray="3 3" />
                                                <ReferenceLine x={stats.p90} stroke="#dc2626" label="P90" />
                                                <Bar dataKey="count" fill="#2563eb" radius={[3, 3, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        {monteCarloCards.map((card) => (
                                            <div key={card.label} className="rounded border bg-muted/45 p-3 text-center">
                                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                    {card.icon && <TrendingDown className="h-4 w-4 text-green-500" />}
                                                    {card.label}
                                                </div>
                                                <div className={`text-xl font-semibold ${card.className}`}>{card.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="markov">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <CardTitle>{labels.markovTitle}</CardTitle>
                                            {!publicationMode && (
                                                <CardDescription>
                                                    P(t+1) = P(t) x TransitionMatrix; Compromised is absorbing [0,0,0,1].
                                                </CardDescription>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={exportMarkovCsv}>
                                                <Download className="mr-2 h-4 w-4" />
                                                CSV
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={exportMarkovJson}>
                                                <Download className="mr-2 h-4 w-4" />
                                                JSON
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[360px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={markovHistory} margin={{ top: 20, right: 30, left: 20, bottom: 24 }}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                    <XAxis dataKey="step" label={{ value: "Time (Hours)", position: "insideBottom", offset: -12 }} />
                                                    <YAxis label={{ value: "Probability", angle: -90, position: "insideLeft" }} />
                                                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", color: "#fff" }} />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="probabilities.Secure" stroke="#22c55e" name="Secure" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" dataKey="probabilities.Reconnaissance" stroke="#eab308" name="Reconnaissance" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" dataKey="probabilities.Exploitation" stroke="#f97316" name="Exploitation" strokeWidth={2} dot={false} />
                                                    <Line type="monotone" dataKey="probabilities.Compromised" stroke="#ef4444" name="Compromised" strokeWidth={3} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="mt-6 grid gap-3 md:grid-cols-5">
                                            <div className="rounded border p-3 text-center">
                                                <div className="text-sm text-muted-foreground">Compromise @24h</div>
                                                <div className="text-lg font-semibold">{percent(markovSummary.probabilityOfCompromiseAt24h)}</div>
                                            </div>
                                            <div className="rounded border p-3 text-center">
                                                <div className="text-sm text-muted-foreground">Time to 50%</div>
                                                <div className="text-lg font-semibold">{markovSummary.timeTo50PercentCompromise ?? "n/a"}</div>
                                            </div>
                                            <div className="rounded border p-3 text-center">
                                                <div className="text-sm text-muted-foreground">Peak Recon</div>
                                                <div className="text-lg font-semibold">h{markovSummary.peakReconnaissanceTime}</div>
                                            </div>
                                            <div className="rounded border p-3 text-center">
                                                <div className="text-sm text-muted-foreground">Peak Exploit</div>
                                                <div className="text-lg font-semibold">h{markovSummary.peakExploitationTime}</div>
                                            </div>
                                            <div className="rounded border p-3 text-center">
                                                <div className="text-sm text-muted-foreground">Final State</div>
                                                <div className="text-lg font-semibold">{markovSummary.dominantFinalState}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Transition Matrix</CardTitle>
                                        {!publicationMode && (
                                            <CardDescription>
                                                Row validation: {transitionMatrixValid ? "all rows sum to 1" : "check row sums"}; Markov input risk = {markovRiskScore.toFixed(2)} / 10.
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>From</TableHead>
                                                    {MARKOV_STATES.map((state) => <TableHead key={state}>{state}</TableHead>)}
                                                    <TableHead>Row Sum</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {MARKOV_STATES.map((state) => {
                                                    const rowSum = MARKOV_STATES.reduce((sum, target) => sum + transitionMatrix[state][target], 0)
                                                    return (
                                                        <TableRow key={state}>
                                                            <TableCell className="font-medium">{state}</TableCell>
                                                            {MARKOV_STATES.map((target) => (
                                                                <TableCell key={target}>{transitionMatrix[state][target].toFixed(3)}</TableCell>
                                                            ))}
                                                            <TableCell>{rowSum.toFixed(3)}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="topology">
                            <NetworkTopology
                                riskScore={stats.mean}
                                simulationState={currentSimState}
                                attackPaths={trafficAnalysis?.attackPaths ?? []}
                                publicationMode={publicationMode}
                            />
                        </TabsContent>

                        <TabsContent value="traffic">
                            <PacketUpload onThreatsDetected={setDetectedThreats} onAnalysisComplete={handleAnalysisComplete} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
