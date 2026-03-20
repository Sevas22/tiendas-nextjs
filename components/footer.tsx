"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-white/25 md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:divide-y-0 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-y-0 lg:divide-white/30 [&>div]:px-3 [&>div]:py-10 md:[&>div]:py-0 lg:[&>div]:px-6 lg:[&>div]:first:pl-0 lg:[&>div]:last:pr-0">
          {/* Brand */}
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <Link href="/" className="flex shrink-0 items-center justify-center md:justify-start">
              <div className="flex h-12 items-center rounded-lg bg-white px-3 py-1.5 shadow-sm md:h-14 md:px-4">
                <img
                  src="/venextrading-logo.png"
                  alt="venextrading"
                  className="h-full w-auto max-h-12 object-contain object-left md:max-h-14"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t.footer.quickLinks}
            </h3>
            <div className="flex flex-col items-center gap-2 md:items-start">
              {[
                { href: "/", label: t.nav.home },
                { href: "/products", label: t.nav.products },
                { href: "/store", label: t.nav.store },
                { href: "/ruedas-de-negocios", label: t.nav.businessRounds },
                { href: "/request", label: t.nav.request },
                { href: "/registro", label: t.nav.createAccount },
                { href: "/admin", label: t.nav.login },
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
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t.footer.contactInfo}
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-center gap-2 md:justify-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="text-sm text-white/70">
                  <p>{t.footer.address}</p>
                  <p>{t.footer.city}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-white/70">{t.footer.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-white/70">{t.footer.email}</span>
              </div>
            </div>
          </div>

          {/* Sellers */}
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">{t.footer.sellers}</h3>
            <p className="text-sm text-white/70">{t.footer.sellersDesc}</p>
            <Button
              asChild
              className="w-full max-w-sm bg-gold font-semibold text-white shadow-[0_2px_10px_rgba(204,163,0,0.3)] hover:bg-gold/90 hover:shadow-[0_4px_14px_rgba(204,163,0,0.35)] sm:w-auto"
            >
              <Link href="/registro" className="inline-flex items-center justify-center gap-2">
                <Store className="h-4 w-4" />
                {t.footer.sellers}
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/10 pt-8 text-center sm:mt-12">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} venextrading. {t.footer.rights}
          </p>
          <p className="text-sm text-white/50">
            {t.footer.developedBy}{" "}
            <a
              href="https://www.codifikai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline-offset-2 transition-colors hover:text-gold hover:underline"
            >
              codifikai.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
