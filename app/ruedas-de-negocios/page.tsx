"use client"

import Link from "next/link"
import { HeroBanner } from "@/components/hero-banner"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function RuedasDeNegociosPage() {
  const { t } = useLanguage()

  return (
    <>
      <HeroBanner title={t.businessRoundsPage.title} subtitle={t.businessRoundsPage.subtitle} />
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{t.businessRoundsPage.body}</p>
          <Button asChild className="bg-[#00247D] px-8 text-white hover:bg-[#00247D]/90">
            <Link href="/request">{t.nav.request}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
