"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import IECCalculator from "@/components/iec-calculator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function IECCalculatorPage() {
    const { language } = useLanguage()

    return (
        <div className="min-h-screen bg-background p-6 md:p-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {language === 'ar' ? 'العودة' : language === 'de' ? 'Zurück' : 'Back'}
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">IEC 62443-3-3 Calculator</h1>
                        <p className="text-muted-foreground">
                            {language === 'ar'
                                ? 'أداة تقييم هندسية لتحديد مستوى الأمان المستهدف (SL-T) والمحقق (SL-A)'
                                : language === 'de'
                                    ? 'Engineering-Tool zur Bestimmung des Sicherheitsniveaus'
                                    : 'Engineering tool to determine Target (SL-T) and Achieved (SL-A) Security Levels'}
                        </p>
                    </div>
                </div>

                <IECCalculator />
            </div>
        </div>
    )
}
