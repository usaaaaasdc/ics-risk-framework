"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { runMonteCarloSimulation, SimulationParams } from "@/lib/calculators/risk-engine"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, Legend } from "recharts"
import { MarkovEngine, ManualSecurityState } from "@/lib/calculators/markov-engine"
import { NetworkTopology } from "@/components/network-topology"
import { PacketUpload } from "@/components/packet-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw, TrendingDown } from "lucide-react"

export default function RiskSimulationChart() {
    const { language } = useLanguage()
    const [params, setParams] = useState<SimulationParams>({
        baseImpact: 7,
        baseLikelihood: 0.6,
        mitigationFactor: 0.5,
        uncertainty: 0.2,
        iterations: 2000
    })

    // Memoize calculation so it doesn't run on every render unless params change
    const stats = useMemo(() => runMonteCarloSimulation(params), [params])

    // NEW: Run Markov Chain Simulation
    const markovHistory = useMemo(() => {
        // Calculate a linear risk score from params to seed the Markov Engine (approx 0-10)
        // Risk = Impact * Likelihood * 10
        const currentRisk = params.baseImpact * params.baseLikelihood * (1 - params.mitigationFactor) * 10;
        return MarkovEngine.simulateAttackProgression(currentRisk, 24);
    }, [params]);

    // Determine current most likely state at Hour 12 (mid-simulation) for Topology Coloring
    const currentSimState = useMemo(() => {
        const midPoint = markovHistory[12];
        if (!midPoint) return 'Secure';
        const probs = midPoint.probabilities;
        if (probs.Compromised > 0.4) return 'Compromised';
        if (probs.Exploitation > 0.4) return 'Exploitation';
        if (probs.Reconnaissance > 0.4) return 'Reconnaissance';
        return 'Secure';
    }, [markovHistory]);

    const t = {
        title: language === 'ar' ? 'نمذجة المخاطر (مونت كارلو)' :
            language === 'de' ? 'Monte-Carlo-Risikosimulation' :
                language === 'tr' ? 'Monte Carlo Risk Simülasyonu' :
                    'Monte Carlo Risk Simulation',
        desc: language === 'ar' ? 'محاكاة 2000 سيناريو محتمل لتقدير المخاطر المتبقية بدقة' :
            language === 'de' ? 'Simulation von 2000 Szenarien zur präzisen Risikoschätzung' :
                language === 'tr' ? 'Kalan riski doğru tahmin etmek için 2000 senaryo simülasyonu' :
                    'Simulating 2000 potential scenarios to estimate residual risk accuracy',
        impact: language === 'ar' ? 'الأثر المتوقع ($)' :
            language === 'de' ? 'Erwartete Auswirkung ($)' :
                language === 'tr' ? 'Beklenen Etki ($)' :
                    'Expected Impact ($)',
        likelihood: language === 'ar' ? 'الاحتمالية' :
            language === 'de' ? 'Wahrscheinlichkeit' :
                language === 'tr' ? 'Olasılık' :
                    'Likelihood',
        mitigation: language === 'ar' ? 'فعالية الحماية' :
            language === 'de' ? 'Schutzwirksamkeit' :
                language === 'tr' ? 'Azaltma Etkinliği' :
                    'Mitigation Efficacy',
        uncertainty: language === 'ar' ? 'عامل عدم اليقين' :
            language === 'de' ? 'Unsicherheitsfaktor' :
                language === 'tr' ? 'Belirsizlik Faktörü' :
                    'Uncertainty Factor',
        mean: language === 'ar' ? 'المتوسط' :
            language === 'de' ? 'Durchschnitt' :
                language === 'tr' ? 'Ortalama Risk' :
                    'Mean Risk',
        p90: language === 'ar' ? 'الحد الأعلى (90%)' :
            language === 'de' ? 'Worst Case (P90)' :
                language === 'tr' ? 'En Kötü Durum (P90)' :
                    'Worst Case (P90)',
        p10: language === 'ar' ? 'متفائل (P10)' :
            language === 'de' ? 'Optimistisch (P10)' :
                language === 'tr' ? 'İyimser (P10)' :
                    'Optimistic (P10)',
        run: language === 'ar' ? 'تشغيل المحاكاة' :
            language === 'de' ? 'Simulation starten' :
                language === 'tr' ? 'Simülasyonu Çalıştır' :
                    'Run Simulation'
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Controls */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {language === 'ar' ? 'معاملات المحاكاة' :
                                language === 'de' ? 'Simulationsparameter' :
                                    language === 'tr' ? 'Simülasyon Parametreleri' :
                                        'Simulation Parameters'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{t.impact}</Label>
                                <span className="text-sm text-muted-foreground">{params.baseImpact}</span>
                            </div>
                            <Slider
                                value={[params.baseImpact]}
                                max={10} min={1} step={0.5}
                                onValueChange={(v) => setParams(p => ({ ...p, baseImpact: v[0] }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{t.likelihood}</Label>
                                <span className="text-sm text-muted-foreground">{Math.round(params.baseLikelihood * 100)}%</span>
                            </div>
                            <Slider
                                value={[params.baseLikelihood]}
                                max={1} min={0.1} step={0.05}
                                onValueChange={(v) => setParams(p => ({ ...p, baseLikelihood: v[0] }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{t.mitigation}</Label>
                                <span className="text-sm text-muted-foreground">{Math.round(params.mitigationFactor * 100)}%</span>
                            </div>
                            <Slider
                                value={[params.mitigationFactor]}
                                max={0.95} min={0} step={0.05}
                                onValueChange={(v) => setParams(p => ({ ...p, mitigationFactor: v[0] }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>{t.uncertainty}</Label>
                                <span className="text-sm text-muted-foreground">{Math.round(params.uncertainty * 100)}%</span>
                            </div>
                            <Slider
                                value={[params.uncertainty]}
                                max={0.5} min={0.05} step={0.05}
                                onValueChange={(v) => setParams(p => ({ ...p, uncertainty: v[0] }))}
                            />
                        </div>

                        <Button className="w-full" onClick={() => setParams({ ...params })}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'إعادة حساب' :
                                language === 'de' ? 'Neu berechnen' :
                                    language === 'tr' ? 'Yeniden Hesapla' :
                                        'Recalculate'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Chart */}
                {/* Chart placeholder was here, now moved to Tabs */}

                {/* Main Dashboard Area with Tabs */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="monte-carlo">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="monte-carlo">Risk Sim</TabsTrigger>
                            <TabsTrigger value="markov">Attack Path</TabsTrigger>
                            <TabsTrigger value="topology">Network Map</TabsTrigger>
                            <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
                        </TabsList>

                        {/* TAB 1: Monte Carlo (Original) */}
                        <TabsContent value="monte-carlo">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.title}</CardTitle>
                                    <CardDescription>{t.desc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="riskScore" label={{ value: 'Residual Risk Score', position: 'insideBottom', offset: -5 }} />
                                                <YAxis />
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} labelStyle={{ color: '#94a3b8' }} />
                                                <ReferenceLine x={stats.mean} stroke="#3b82f6" label="Mean" strokeDasharray="3 3" />
                                                <ReferenceLine x={stats.p90} stroke="#ef4444" label="P90" />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">
                                            <div className="text-sm text-muted-foreground">{t.mean}</div>
                                            <div className="text-2xl font-bold text-blue-600">{stats.mean.toFixed(2)}</div>
                                        </div>
                                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-center border-l-4 border-red-500">
                                            <div className="text-sm text-muted-foreground">{t.p90}</div>
                                            <div className="text-2xl font-bold text-red-600">{stats.p90.toFixed(2)}</div>
                                        </div>
                                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">
                                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                <TrendingDown className="h-4 w-4 text-green-500" />
                                                {t.p10}
                                            </div>
                                            <div className="text-2xl font-bold text-green-600">{stats.p10.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 2: Markov Chain */}
                        <TabsContent value="markov">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attack Progression Forecast (24 Hours)</CardTitle>
                                    <CardDescription>Probability of system state transition over time based on current risk.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={markovHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                <XAxis dataKey="step" label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -5 }} />
                                                <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey="probabilities.Secure" stroke="#22c55e" name="Secure" strokeWidth={2} dot={false} />
                                                <Line type="monotone" dataKey="probabilities.Reconnaissance" stroke="#eab308" name="Reconnaissance" strokeWidth={2} dot={false} />
                                                <Line type="monotone" dataKey="probabilities.Exploitation" stroke="#f97316" name="Exploitation" strokeWidth={2} dot={false} />
                                                <Line type="monotone" dataKey="probabilities.Compromised" stroke="#ef4444" name="Compromised" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: Network Topology */}
                        <TabsContent value="topology">
                            <div className="space-y-4">
                                <NetworkTopology
                                    riskScore={stats.mean}
                                    simulationState={currentSimState as ManualSecurityState}
                                />
                                <div className="p-4 bg-muted rounded text-sm text-center">
                                    Topological view updates dynamically based on the <strong>Markov Simulation</strong> state.
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 4: Traffic Analysis */}
                        <TabsContent value="traffic">
                            <PacketUpload />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
