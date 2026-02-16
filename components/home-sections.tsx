"use client"

import Link from "next/link"
import {
  Award,
  Users,
  Lightbulb,
  Globe,
  ShieldCheck,
  Truck,
  Clock,
  DollarSign,
  Cookie,
  Coffee,
  Package,
  Leaf,
  Wheat,
  Flame,
  Milk,
  UtensilsCrossed,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

// ── Value Propositions ──────────────────────────────────────────────
export function ValuesSection() {
  const { t } = useLanguage()

  const values = [
    { icon: Award, title: t.values.quality, desc: t.values.qualityDesc },
    { icon: Users, title: t.values.focus, desc: t.values.focusDesc },
    { icon: Lightbulb, title: t.values.innovation, desc: t.values.innovationDesc },
    { icon: Globe, title: t.values.global, desc: t.values.globalDesc },
  ]

  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-1 w-12 bg-gold" />
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.values.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Card key={i} className="border-0 bg-card shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <v.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── About Section ───────────────────────────────────────────────────
export function AboutSection() {
  const { t } = useLanguage()

  const stats = [
    { value: "10+", label: t.about.yearsExp },
    { value: "30+", label: t.about.countries },
    { value: "200+", label: t.about.products },
    { value: "500+", label: t.about.clients },
  ]

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className="relative w-full lg:w-1/2">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/about.jpg"
                alt="About CHINA Trading"
                className="h-[400px] w-full object-cover"
              />
            </div>
            {/* Decorative overlay */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-gold/20" />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2">
            <div className="mb-4 h-1 w-12 bg-gold" />
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t.about.title}
            </h2>
            <p className="mb-6 text-lg font-medium text-gold">{t.about.subtitle}</p>
            <p className="mb-4 leading-relaxed text-muted-foreground">{t.about.p1}</p>
            <p className="mb-8 leading-relaxed text-muted-foreground">{t.about.p2}</p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-6">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products">{t.about.discover}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Categories Section ──────────────────────────────────────────────
export function CategoriesSection() {
  const { t } = useLanguage()

  const categories = [
    { icon: Cookie, label: t.categories.snacks, color: "bg-orange-50 text-orange-600" },
    { icon: Coffee, label: t.categories.beverages, color: "bg-amber-50 text-amber-700" },
    { icon: Package, label: t.categories.canned, color: "bg-blue-50 text-blue-600" },
    { icon: Leaf, label: t.categories.produce, color: "bg-emerald-50 text-emerald-600" },
    { icon: Wheat, label: t.categories.grains, color: "bg-yellow-50 text-yellow-700" },
    { icon: Flame, label: t.categories.spices, color: "bg-red-50 text-red-600" },
    { icon: Milk, label: t.categories.dairy, color: "bg-sky-50 text-sky-600" },
    { icon: UtensilsCrossed, label: t.categories.sauces, color: "bg-rose-50 text-rose-600" },
  ]

  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-1 w-12 bg-gold" />
          <h2 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.categories.title}
          </h2>
          <p className="text-muted-foreground">{t.categories.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link key={i} href="/products">
              <Card className="group cursor-pointer border-0 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color}`}>
                    <cat.icon className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Why Choose Us ───────────────────────────────────────────────────
export function WhyChooseSection() {
  const { t } = useLanguage()

  const features = [
    { icon: Clock, title: t.whyChoose.experience, desc: t.whyChoose.experienceDesc },
    { icon: ShieldCheck, title: t.whyChoose.qualityAssurance, desc: t.whyChoose.qualityAssuranceDesc },
    { icon: Truck, title: t.whyChoose.reliableService, desc: t.whyChoose.reliableServiceDesc },
    { icon: DollarSign, title: t.whyChoose.competitivePricing, desc: t.whyChoose.competitivePricingDesc },
  ]

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-1 w-12 bg-gold" />
          <h2 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.whyChoose.title}
          </h2>
          <p className="text-muted-foreground">{t.whyChoose.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-5 rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                <f.icon className="h-7 w-7 text-gold" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Countries Section ───────────────────────────────────────────────
export function CountriesSection() {
  const { t } = useLanguage()

  const countries = [
    { name: "United States", flag: "🇺🇸" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "India", flag: "🇮🇳" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Chile", flag: "🇨🇱" },
  ]

  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-1 w-12 bg-gold" />
          <h2 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t.countries.title}
          </h2>
          <p className="text-muted-foreground">{t.countries.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {countries.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl" role="img" aria-label={c.name}>{c.flag}</span>
              <span className="text-center text-xs font-medium text-foreground">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Banner ──────────────────────────────────────────────────────
export function CTABanner() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-primary py-20">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-white" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full border-[30px] border-white" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          {t.cta.title}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
          {t.cta.subtitle}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gold text-white hover:bg-gold/90"
          >
            <Link href="/request">{t.cta.button}</Link>
          </Button>
          <p className="text-sm text-primary-foreground/70">
            {t.cta.call}{" "}
            <span className="font-semibold text-primary-foreground">+86 123 456 7890</span>
          </p>
        </div>
      </div>
    </section>
  )
}
