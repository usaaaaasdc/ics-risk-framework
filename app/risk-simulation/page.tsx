"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import RiskSimulationChart from "@/components/risk-simulation-chart"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RiskSimulationPage() {
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
                        <h1 className="text-3xl font-bold tracking-tight">
                            {language === 'ar' ? 'محرك محاكاة المخاطر' : 'Advanced Risk Simulation Engine'}
                        </h1>
                        <p className="text-muted-foreground">
                            {language === 'ar'
                                ? 'استخدام طريقة مونت كارلو لتحليل عدم اليقين في تقييم المخاطر'
                                : 'Using Monte Carlo method to analyze uncertainty in risk assessment'}
                        </p>
                    </div>
                </div>

                <RiskSimulationChart />
            </div>
        </div>
    )
}
