"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { iec62443Standards, type SecurityLevel } from "@/lib/standards/iec62443"
import { calculateIECScore } from "@/lib/calculators/iec-score"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Shield } from "lucide-react"

export default function IECCalculator() {
    const { language } = useLanguage()
    const [checkedReqs, setCheckedReqs] = useState<string[]>([])
    const [targetSL, setTargetSL] = useState<SecurityLevel>(2)

    const results = calculateIECScore(checkedReqs)
    const targetLevels: SecurityLevel[] = [1, 2, 3, 4]

    const toggleReq = (id: string) => {
        setCheckedReqs((prev) =>
            prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id],
        )
    }

    const getText = (obj: Record<string, string>, key: string) => {
        const suffix = language === "ar" ? "Ar" : language === "de" ? "De" : "En"
        return obj[`${key}${suffix}`] ?? obj[`${key}En`] ?? ""
    }

    const ui = {
        achieved: language === "ar" ? "مستوى الأمان المحقق" : language === "de" ? "Erreichtes Sicherheitsniveau" : "Achieved Security Level",
        basedOn:
            language === "ar"
                ? "يعرض SL-A المحقق بناء على متطلبات baseline المتوفرة ومبدأ الحلقة الأضعف."
                : language === "de"
                    ? "Zeigt den erreichten SL-A anhand der verfügbaren Baseline-Anforderungen und des Weakest-Link-Prinzips."
                    : "Shows achieved SL-A from the available baseline requirements using the weakest-link principle.",
        target: language === "ar" ? "مستوى الأمان المستهدف SL-T" : language === "de" ? "Ziel-Sicherheitsniveau SL-T" : "Target Security Level SL-T",
        partialTitle: language === "ar" ? "تنبيه نطاق الحساب" : language === "de" ? "Hinweis zum Bewertungsumfang" : "Calculator Scope Notice",
        partialBody:
            language === "ar"
                ? "هذه الحاسبة تقيم ضوابط IEC 62443 الأساسية المتوفرة حاليا ولا تمثل تقييما كاملا لمطابقة SL-3/SL-4 أو شهادة امتثال."
                : language === "de"
                    ? "Dieser Rechner bewertet derzeit verfügbare IEC 62443-Baseline-Kontrollen und stellt keine vollständige SL-3/SL-4-Konformitätsbewertung dar."
                    : "This calculator currently evaluates baseline IEC 62443 controls and does not represent a complete SL-3/SL-4 conformity assessment.",
        weakestTitle: language === "ar" ? "مبدأ الحلقة الأضعف" : language === "de" ? "Weakest-Link-Prinzip" : "Weakest-Link Principle",
        weakestBody:
            language === "ar"
                ? "النتيجة النهائية SL-A تساوي أدنى مستوى محقق بين جميع Foundational Requirements. لذلك قد يبقى Overall SL = 0 حتى بعد اختيار متطلب واحد إذا بقيت متطلبات أساسية في FR أخرى غير مكتملة."
                : language === "de"
                    ? "Der finale SL-A entspricht dem niedrigsten erreichten Niveau über alle Foundational Requirements hinweg."
                    : "Final SL-A is limited by the lowest achieved Foundational Requirement. Overall SL can remain 0 after one checkbox if other required FRs are still incomplete.",
        checklist: language === "ar" ? "قائمة التحقق من المتطلبات" : language === "de" ? "Anforderungs-Checkliste" : "Requirements Checklist",
        recommendations: language === "ar" ? "التوصيات" : language === "de" ? "Empfehlungen" : "Recommendations",
        missingTitle: language === "ar" ? "متطلبات أساسية ناقصة" : language === "de" ? "Kritische Anforderungen fehlen" : "Critical Requirements Missing",
        missingBody:
            language === "ar"
                ? "النظام لا يحقق الحد الأدنى من متطلبات SL-1 عبر جميع FRs. أكمل متطلبات SL-1 في كل قسم قبل توقع ارتفاع Overall SL."
                : language === "de"
                    ? "Das System erfüllt nicht alle SL-1-Anforderungen über alle FRs hinweg."
                    : "System does not meet SL-1 across every FR. Complete SL-1 requirements in each section before expecting Overall SL to rise.",
        achievedBasic: language === "ar" ? "تم تحقيق مستوى أساسي" : language === "de" ? "Basissicherheit erreicht" : "Basic Security Achieved",
        achievedBasicBody:
            language === "ar"
                ? "تم تحقيق مستوى أساسي ضمن نطاق بيانات baseline المتوفرة. راجع الفجوات للوصول إلى SL-T."
                : language === "de"
                    ? "Basissicherheit wurde innerhalb der verfügbaren Baseline-Daten erreicht."
                    : "A baseline security level has been achieved within the available control dataset. Review gaps to reach SL-T.",
        gap: language === "ar" ? "الفجوة إلى SL-T" : language === "de" ? "Lücke zu SL-T" : "Gap to SL-T",
        met: language === "ar" ? "تم بلوغ الهدف" : language === "de" ? "Ziel erreicht" : "Target met",
        partialTarget:
            language === "ar"
                ? "SL-3/SL-4 معروضة كهدف تخطيطي فقط لأن بيانات المتطلبات التفصيلية غير مكتملة."
                : language === "de"
                    ? "SL-3/SL-4 werden nur als Planungsziele angezeigt."
                    : "SL-3/SL-4 are shown as planning targets only because detailed requirement data is not complete.",
        requiredFor: language === "ar" ? "مطلوب لـ SL-" : language === "de" ? "Erforderlich für SL-" : "Required for SL-",
    }

    return (
        <div className="space-y-8">
            <Card className="border-blue-900 bg-slate-950 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Shield className="h-8 w-8 text-blue-500" />
                        {ui.achieved}
                        <span className="ml-auto text-4xl font-bold text-blue-400">SL-{results.overallSL}</span>
                    </CardTitle>
                    <CardDescription className="text-blue-200">{ui.basedOn}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                            <div className="text-xs uppercase text-slate-400">{ui.target}</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {targetLevels.map((level) => (
                                    <Button
                                        key={level}
                                        type="button"
                                        size="sm"
                                        variant={targetSL === level ? "secondary" : "outline"}
                                        onClick={() => setTargetSL(level)}
                                        className="border-slate-700"
                                    >
                                        SL-{level}
                                    </Button>
                                ))}
                            </div>
                            {targetSL > 2 && <p className="mt-3 text-xs text-amber-200">{ui.partialTarget}</p>}
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                            <div className="text-xs uppercase text-slate-400">{ui.achieved}</div>
                            <div className="mt-2 text-3xl font-bold text-blue-300">SL-{results.overallSL}</div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                            <div className="text-xs uppercase text-slate-400">{ui.gap}</div>
                            <div className="mt-2 text-3xl font-bold text-amber-300">
                                {targetSL > results.overallSL ? `SL-${targetSL - results.overallSL}` : ui.met}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {results.frScores.map((fr) => (
                            <div key={fr.frId} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                                <div className="mb-2 flex items-end justify-between">
                                    <span className="text-sm font-bold text-slate-400">{fr.frId}</span>
                                    <span className="font-mono text-xs text-blue-300">SL-{fr.achievedSL}</span>
                                </div>
                                <Progress value={fr.percentage} className="h-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{ui.partialTitle}</AlertTitle>
                    <AlertDescription>{ui.partialBody}</AlertDescription>
                </Alert>
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{ui.weakestTitle}</AlertTitle>
                    <AlertDescription>{ui.weakestBody}</AlertDescription>
                </Alert>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                    <h2 className="text-xl font-bold">{ui.checklist}</h2>

                    <Accordion type="single" collapsible className="w-full">
                        {iec62443Standards.map((fr) => (
                            <AccordionItem key={fr.id} value={fr.id}>
                                <AccordionTrigger className="text-lg font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${results.frScores.find((score) => score.frId === fr.id)?.percentage === 100 ? "bg-green-500" : "bg-orange-500"}`} />
                                        <span>{fr.id}: {getText(fr as unknown as Record<string, string>, "name")}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 px-2 pt-4">
                                        {fr.requirements.map((req) => (
                                            <div key={req.id} className="flex items-start space-x-3 rounded-md border bg-slate-50 p-3 rtl:space-x-reverse dark:bg-slate-900">
                                                <Checkbox
                                                    id={req.id}
                                                    checked={checkedReqs.includes(req.id)}
                                                    onCheckedChange={() => toggleReq(req.id)}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <Label
                                                        htmlFor={req.id}
                                                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        <span className="mr-2 font-mono text-blue-600 rtl:ml-2 dark:text-blue-400">[{req.id}]</span>
                                                        {getText(req as unknown as Record<string, string>, "name")}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {getText(req as unknown as Record<string, string>, "description")}
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                            {ui.requiredFor}{req.requiredForSL}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{ui.recommendations}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {results.overallSL < 2 ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{ui.missingTitle}</AlertTitle>
                                    <AlertDescription className="mt-2 text-xs">{ui.missingBody}</AlertDescription>
                                </Alert>
                            ) : (
                                <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800 dark:text-green-300">{ui.achievedBasic}</AlertTitle>
                                    <AlertDescription className="mt-2 text-xs text-green-700 dark:text-green-400">{ui.achievedBasicBody}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
