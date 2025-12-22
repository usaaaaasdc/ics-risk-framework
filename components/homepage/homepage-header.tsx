"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Shield } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function HomepageHeader() {
  const { language } = useLanguage()

  return (
    <header className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              ICS-Risk
            </span>
            <div className="text-xs text-muted-foreground">Framework</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
