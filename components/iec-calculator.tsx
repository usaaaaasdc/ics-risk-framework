"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { iec62443Standards } from "@/lib/standards/iec62443"
import { calculateIECScore } from "@/lib/calculators/iec-score"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertCircle, CheckCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function IECCalculator() {
    const { language } = useLanguage()
    const [checkedReqs, setCheckedReqs] = useState<string[]>([])

    const results = calculateIECScore(checkedReqs)

    const toggleReq = (id: string) => {
        setCheckedReqs(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        )
    }

    const getText = (obj: any, key: string) => {
        const suffix = language === 'ar' ? 'Ar' : language === 'de' ? 'De' : 'En'
        return obj[`${key}${suffix}`]
    }

    return (
        <div className="space-y-8">
            {/* Score Summary */}
            <Card className="bg-slate-950 text-white border-blue-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Shield className="h-8 w-8 text-blue-500" />
                        {language === 'ar' ? 'مستوى الأمان المحقق' : language === 'de' ? 'Erreichtes Sicherheitsniveau' : 'Achieved Security Level'}
                        <span className="text-4xl font-bold text-blue-400 ml-auto">SL-{results.overallSL}</span>
                    </CardTitle>
                    <CardDescription className="text-blue-200">
                        {language === 'ar'
                            ? 'بناءً على المعيار IEC 62443-3-3 (مبدأ الحلقة الأضعف)'
                            : language === 'de'
                                ? 'Basierend auf IEC 62443-3-3 Standard (Weakest-Link-Prinzip)'
                                : 'Based on IEC 62443-3-3 Standard (Weakest Link Principle)'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {results.frScores.map((fr) => (
                            <div key={fr.frId} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-sm text-slate-400">{fr.frId}</span>
                                    <span className="text-xs font-mono text-blue-300">SL-{fr.achievedSL}</span>
                                </div>
                                <Progress value={fr.percentage} className="h-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Checklist */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold">
                        {language === 'ar' ? 'قائمة التحقق من المتطلبات' : language === 'de' ? 'Anforderungs-Checkliste' : 'Requirements Checklist'}
                    </h2>

                    <Accordion type="single" collapsible className="w-full">
                        {iec62443Standards.map((fr) => (
                            <AccordionItem key={fr.id} value={fr.id}>
                                <AccordionTrigger className="text-lg font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${results.frScores.find(s => s.frId === fr.id)?.percentage === 100 ? 'bg-green-500' : 'bg-orange-500'}`} />
                                        <span>{fr.id}: {getText(fr, 'name')}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 pt-4 px-2">
                                        {fr.requirements.map((req) => (
                                            <div key={req.id} className="flex items-start space-x-3 rtl:space-x-reverse bg-slate-50 dark:bg-slate-900 p-3 rounded-md border">
                                                <Checkbox
                                                    id={req.id}
                                                    checked={checkedReqs.includes(req.id)}
                                                    onCheckedChange={() => toggleReq(req.id)}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <Label
                                                        htmlFor={req.id}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        <span className="text-blue-600 dark:text-blue-400 font-mono mr-2 rtl:ml-2">[{req.id}]</span>
                                                        {getText(req, 'name')}
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {getText(req, 'description')}
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                                            Required for SL-{req.requiredForSL}
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

                {/* Sidebar / Insights */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {language === 'ar' ? 'التوصيات' : language === 'de' ? 'Empfehlungen' : 'Recommendations'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {results.overallSL < 2 ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Critical Requirements Missing</AlertTitle>
                                    <AlertDescription className="text-xs mt-2">
                                        {language === 'ar'
                                            ? 'النظام لا يحقق الحد الأدنى من متطلبات SL-1. ركز على "التحكم في الوصول" و "تجزئة الشبكة".'
                                            : 'System does not meet minimum SL-1 requirements. Focus on Access Control and Network Segmentation.'}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800 dark:text-green-300">Basic Security Achieved</AlertTitle>
                                    <AlertDescription className="text-xs mt-2 text-green-700 dark:text-green-400">
                                        {language === 'ar'
                                            ? 'أحسنت! لقد حققت مستوى الأمان الأساسي. انتقل لتحقيق SL-3.'
                                            : 'Great! You have achieved basic security level. Aim for SL-3.'}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
