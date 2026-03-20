"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"
import { HeroBanner } from "@/components/hero-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MIN_PASSWORD_LENGTH = 6

export default function RegistroPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      setError(t.registerPage.requiredFields)
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t.registerPage.passwordTooShort)
      return
    }
    if (password !== confirmPassword) {
      setError(t.registerPage.passwordMismatch)
      return
    }
    if (!isSupabaseConfigured()) {
      setError(t.registerPage.noSupabase)
      return
    }
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: signError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: "proveedor",
            ...(phone.trim() && { phone: phone.trim() }),
            ...(company.trim() && { company: company.trim() }),
          },
        },
      })
      if (signError) {
        const msg =
          signError.message.toLowerCase().includes("rate limit") ||
          signError.message.toLowerCase().includes("email rate limit exceeded")
            ? t.registerPage.emailRateLimit
            : signError.message
        setError(msg)
        setLoading(false)
        return
      }
      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()
        if (profile?.role === "proveedor" || profile?.role === "admin") {
          router.push("/admin")
          return
        }
      }
      router.push("/admin")
    } catch {
      setError(t.admin.wrongCredentials ?? "Error al crear la cuenta.")
    }
    setLoading(false)
  }

  return (
    <>
      <HeroBanner title={t.registerPage.title} subtitle={t.registerPage.subtitle} />

      <section className="bg-background py-12">
        <div className="mx-auto max-w-md px-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.admin.registerAsProvider}</CardTitle>
              <p className="text-sm font-normal text-muted-foreground">{t.registerPage.formHelp}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
                    {t.registerPage.fullName} <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.registerPage.fullNamePlaceholder}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    {t.registerPage.email} <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.registerPage.emailPlaceholder}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                    {t.registerPage.password} <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.registerPage.passwordPlaceholder}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                    {t.registerPage.confirmPassword} <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.registerPage.confirmPasswordPlaceholder}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                    {t.registerPage.phone}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.registerPage.phonePlaceholder}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-foreground">
                    {t.registerPage.company}
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t.registerPage.companyPlaceholder}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    autoComplete="organization"
                  />
                </div>
                {error && (
                  <div className="space-y-2">
                    <p className="text-sm text-destructive">{error}</p>
                    {error === t.registerPage.noSupabase && (
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/admin">{t.registerPage.signIn}</Link>
                      </Button>
                    )}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "..." : t.registerPage.createAccount}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground">
                {t.registerPage.alreadyHaveAccount}{" "}
                <Link href="/admin" className="font-medium text-primary underline hover:no-underline">
                  {t.registerPage.signIn}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
