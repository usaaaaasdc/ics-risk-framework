"use client"

import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import { useHydrated } from "@/hooks/use-hydrated"
import { translations, type Language } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.ar) => string
  translations: typeof translations.ar
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const supportedLanguages = ["ar", "en", "de", "tr"] as const

export function LanguageProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const savedLanguage = useMemo<Language>(() => {
    if (hydrated) {
      const saved = localStorage.getItem("app-language") as Language
      if (saved && supportedLanguages.includes(saved)) {
        return saved
      }
    }
    return "ar"
  }, [hydrated])
  const [selectedLanguage, setLanguageState] = useState<Language | null>(null)
  const language = selectedLanguage ?? savedLanguage

  const setLanguage = (lang: Language) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang)
      if (typeof window !== "undefined") {
        localStorage.setItem("app-language", lang)
      }
    }
  }

  const t = (key: keyof typeof translations.ar): string => {
    try {
      return translations[language]?.[key] || translations.ar[key] || key
    } catch {
      return key
    }
  }

  const currentTranslations = translations[language] || translations.ar
  const isRTL = language === "ar"

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations: currentTranslations, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

export type { Language }
