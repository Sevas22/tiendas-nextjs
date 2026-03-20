"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const primaryLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/store", label: t.nav.store },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const solidHeader = scrolled || !isHome

  /** Enlaces de texto legibles sobre el hero (fondo claro u oscuro) */
  const primaryLinkClass = (href: string) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive(href)
        ? solidHeader
          ? "bg-primary text-primary-foreground"
          : "bg-white/25 text-white shadow-[0_1px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm"
        : solidHeader
          ? "text-foreground hover:bg-secondary"
          : "text-white shadow-[0_1px_6px_rgba(0,0,0,0.45)] drop-shadow-sm hover:bg-white/15",
    ].join(" ")

  const authTextClass = solidHeader
    ? "text-foreground hover:bg-secondary"
    : "border border-white/25 bg-[#00247D]/92 text-white shadow-[0_2px_12px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-[#00247D]"

  const loginBtnClass = solidHeader
    ? "border-border bg-background text-foreground hover:bg-secondary"
    : "border border-white/30 bg-[#00247D]/92 text-white shadow-[0_2px_12px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-[#00247D] [&_svg]:text-white"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidHeader ? "bg-card/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo — solo a la izquierda */}
        <Link href="/" className="flex shrink-0 items-center">
          <div className="flex h-14 items-center rounded-lg bg-white px-3 py-1.5 shadow-sm md:h-16 md:px-4">
            <img
              src="/venextrading-logo.png"
              alt="venextrading"
              className="h-full w-auto max-h-14 object-contain object-left md:max-h-16"
            />
          </div>
        </Link>

        {/* Todo lo demás alineado a la derecha */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1.5 sm:gap-2 md:gap-2">
          {/* Desktop: Inicio, Al por mayor, Tienda */}
          <div className="hidden items-center gap-1 md:flex">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className={primaryLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Ruedas de negocios — botón destacado */}
          <Button
            asChild
            size="sm"
            className="hidden h-9 shrink-0 border-0 bg-gradient-to-r from-gold to-[#ffe066] px-3 font-bold text-[#00247D] shadow-[0_4px_16px_rgba(255,215,0,0.45)] hover:from-[#ffe066] hover:to-gold hover:shadow-[0_6px_20px_rgba(255,215,0,0.5)] md:flex md:whitespace-nowrap"
          >
            <Link href="/ruedas-de-negocios">{t.nav.businessRounds}</Link>
          </Button>

          <Link
            href="/registro"
            className={`hidden shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:block ${authTextClass}`}
          >
            {t.nav.createAccount}
          </Link>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={`hidden shrink-0 gap-2 rounded-md sm:flex ${loginBtnClass}`}
          >
            <Link href="/admin">
              <LogIn className="h-4 w-4" />
              {t.nav.login}
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden rounded-md bg-[#00247D] px-4 text-white shadow-md hover:bg-[#00247D]/90 sm:flex">
            <Link href="/request">{t.nav.request}</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${
                  solidHeader
                    ? "text-foreground"
                    : "border border-white/25 bg-[#00247D]/85 text-white shadow-md backdrop-blur hover:bg-[#00247D]"
                }`}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-1 pt-8">
                {primaryLinks.map((link) => (
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
                  href="/ruedas-de-negocios"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gradient-to-r from-gold to-[#ffe066] px-4 py-3 text-center text-sm font-bold text-[#00247D] shadow-md transition-opacity hover:opacity-95"
                >
                  {t.nav.businessRounds}
                </Link>
                <Link
                  href="/request"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-md bg-[#00247D] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#00247D]/90"
                >
                  {t.nav.request}
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-md border border-border px-4 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  {t.nav.createAccount}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <LogIn className="h-4 w-4" />
                  {t.nav.login}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
