"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-xs font-semibold"
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? "Espanol" : "English"}
    </Button>
  )
}
