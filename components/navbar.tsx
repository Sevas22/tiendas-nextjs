"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { t, language, toggleLanguage } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/store", label: t.nav.store },
    { href: "/request", label: t.nav.request },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-card/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white px-2.5 py-2 md:h-16 md:w-16">
            <img src="/venextrading-logo.png" alt="venextrading" className="h-full w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-2xl font-bold leading-tight tracking-tight transition-colors md:text-3xl ${
                scrolled || !isHome ? "text-foreground" : "text-white"
              }`}
            >
              venextrading
            </span>
            <span
              className={`text-xs uppercase tracking-widest transition-colors md:text-sm ${
                scrolled || !isHome ? "text-gold" : "text-gold"
              }`}
            >
              Mercado Venezolano
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? scrolled || !isHome
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/20 text-white"
                  : scrolled || !isHome
                    ? "text-foreground hover:bg-secondary"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: Contact + Language toggle + Mobile menu */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden rounded-md bg-[#00247D] px-4 text-white hover:bg-[#00247D]/90 sm:flex">
            <Link href="/request">{t.nav.contact}</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              scrolled || !isHome
                ? "text-foreground hover:bg-secondary"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "ES" : "EN"}
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${
                  scrolled || !isHome ? "text-foreground" : "text-white"
                }`}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-1 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/request"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-md bg-[#00247D] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#00247D]/90"
                >
                  {t.nav.contact}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border px-4 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  {t.nav.admin}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
