"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { translations, type TranslationKey } from "@/lib/translations"
import type { Language } from "@/lib/types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKey
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"))
  }, [])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
