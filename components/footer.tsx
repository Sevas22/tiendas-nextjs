"use client"

import Link from "next/link"
import { Ship, MapPin, Phone, Mail, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Ship className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-tight text-white">
                  CHINA Trading
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold">
                  International Export
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t.footer.quickLinks}
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { href: "/", label: t.nav.home },
                { href: "/products", label: t.nav.products },
                { href: "/store", label: t.nav.store },
                { href: "/request", label: t.nav.request },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t.footer.contactInfo}
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="text-sm text-white/70">
                  <p>{t.footer.address}</p>
                  <p>{t.footer.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-white/70">{t.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-white/70">{t.footer.email}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t.footer.newsletter}
            </h3>
            <p className="text-sm text-white/70">{t.footer.newsletterDesc}</p>
            <div className="flex gap-2">
              <Input
                placeholder={t.footer.emailPlaceholder}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
              />
              <Button size="icon" className="shrink-0 bg-gold text-white hover:bg-gold/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} CHINA Trading. {t.footer.rights}
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-white/50">info@chinatrading.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
