"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import IECCalculator from "@/components/iec-calculator"
import { Button } from "@/components/ui/button"

export default function IECCalculatorPage() {
    const { language } = useLanguage()
    const title = language === "ar"
        ? "حاسبة IEC 62443-3-3 الأساسية"
        : language === "de"
            ? "IEC 62443-3-3 Basisrechner"
            : "Baseline IEC 62443-3-3 Calculator"
    const description = language === "ar"
        ? "أداة تقييم هندسية لتحديد مستوى الأمان المستهدف (SL-T) والمحقق (SL-A) ضمن بيانات baseline المتوفرة"
        : language === "de"
            ? "Engineering-Tool zur Bestimmung von Zielniveau (SL-T) und erreichtem Niveau (SL-A) im verfügbaren Baseline-Datensatz"
            : "Engineering tool to determine Target (SL-T) and Achieved (SL-A) Security Levels from the available baseline dataset"

    return (
        <div className="min-h-screen bg-background p-6 md:p-12" dir={language === "ar" ? "rtl" : "ltr"}>
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === "ar" ? "العودة" : language === "de" ? "Zurück" : "Back"}
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                </div>

                <IECCalculator />
            </div>
        </div>
    )
}
