"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

const slides = [
  { image: "/images/hero-1.jpg" },
  { image: "/images/hero-2.jpg" },
  { image: "/images/hero-3.jpg" },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const { t } = useLanguage()

  const titles = [t.hero.slide1Title, t.hero.slide2Title, t.hero.slide3Title]
  const subs = [t.hero.slide1Sub, t.hero.slide2Sub, t.hero.slide3Sub]

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [next])

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={`Hero banner ${i + 1}`}
            className="h-full w-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-navy/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            {/* Gold accent line */}
            <div className="mb-6 h-1 w-20 bg-gold" />

            <h1
              key={`title-${current}`}
              className="animate-in fade-in slide-in-from-bottom-4 mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{ animationDuration: "700ms" }}
            >
              {titles[current]}
            </h1>

            <p
              key={`sub-${current}`}
              className="animate-in fade-in slide-in-from-bottom-4 mb-8 max-w-lg text-pretty text-lg leading-relaxed text-white/80"
              style={{ animationDuration: "700ms", animationDelay: "150ms", animationFillMode: "backwards" }}
            >
              {subs[current]}
            </p>

            <div
              className="animate-in fade-in slide-in-from-bottom-4 flex flex-wrap gap-4"
              style={{ animationDuration: "700ms", animationDelay: "300ms", animationFillMode: "backwards" }}
            >
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/products">{t.hero.cta}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/request">{t.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "w-10 bg-gold" : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
