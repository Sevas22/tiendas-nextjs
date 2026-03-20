"use client"

import { useState, useEffect } from "react"
import { AdminPanel } from "./AdminPanel"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"
import type { User } from "@supabase/supabase-js"
import { Mail, KeyRound, UserPlus, ArrowLeft } from "lucide-react"

const ADMIN_PASSWORD = "venextrading"

type AuthView = "choice" | "password" | "register" | "otp_send" | "otp_verify"

export default function AdminPage() {
  const { t } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [view, setView] = useState<AuthView>("password")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isSupabaseConfigured()) {
      const stored = typeof window !== "undefined" ? sessionStorage.getItem("admin-auth") : null
      if (stored === "true") setIsLoggedIn(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.role === "proveedor" || data?.role === "admin") {
              setSupabaseUser(session.user)
              setIsLoggedIn(true)
            }
          })
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSupabaseUser(null)
        setIsLoggedIn(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLoginPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!isSupabaseConfigured()) {
      if (password === ADMIN_PASSWORD) {
        setIsLoggedIn(true)
        if (typeof window !== "undefined") sessionStorage.setItem("admin-auth", "true")
      } else {
        setError(t.admin.wrongPassword)
      }
      return
    }
    try {
      const supabase = createClient()
      const { data, error: signError } = await supabase.auth.signInWithPassword({ email, password })
      if (signError) {
        const msg = signError.message.toLowerCase()
        setError(
          msg.includes("rate limit") || msg.includes("email rate limit exceeded")
            ? t.admin.emailRateLimit
            : msg.includes("email not confirmed") || msg.includes("email_not_confirmed")
              ? t.admin.emailNotConfirmed
              : t.admin.wrongCredentials
        )
        return
      }
      let { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()
      if (profile && profile.role !== "proveedor" && profile.role !== "admin") {
        await supabase.from("profiles").update({ role: "proveedor" }).eq("id", data.user.id)
        profile = { role: "proveedor" as const }
      }
      if (!profile?.role || (profile.role !== "proveedor" && profile.role !== "admin")) {
        await supabase.auth.signOut()
        setError(t.admin.notProveedor)
        return
      }
      setSupabaseUser(data.user)
      setIsLoggedIn(true)
    } catch {
      setError(t.admin.wrongCredentials)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const options: { data?: Record<string, string>; shouldCreateUser?: boolean } = {
        shouldCreateUser: true,
      }
      if (view === "register" && fullName.trim()) {
        options.data = { full_name: fullName.trim(), role: "proveedor" }
      }
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options,
      })
      if (otpError) {
        setError(
          otpError.message.toLowerCase().includes("rate limit") ||
            otpError.message.toLowerCase().includes("email rate limit exceeded")
            ? t.admin.emailRateLimit
            : otpError.message
        )
        setLoading(false)
        return
      }
      setView("otp_verify")
    } catch (err) {
      setError(t.admin.invalidCode)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const token = otpCode.replace(/\s/g, "").trim()
    if (token.length < 6) {
      setError(t.admin.invalidCode)
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "email",
      })
      if (verifyError) {
        setError(t.admin.invalidCode)
        setLoading(false)
        return
      }
      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()
        if (profile?.role !== "proveedor" && profile?.role !== "admin") {
          await supabase.auth.signOut()
          setError(t.admin.notProveedor)
        } else {
          setSupabaseUser(data.user)
          setIsLoggedIn(true)
        }
      }
    } catch {
      setError(t.admin.invalidCode)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    if (supabaseUser && isSupabaseConfigured()) {
      await createClient().auth.signOut()
    }
    setSupabaseUser(null)
    setIsLoggedIn(false)
    setEmail("")
    setFullName("")
    setPassword("")
    setOtpCode("")
    setView("choice")
    if (typeof window !== "undefined") sessionStorage.removeItem("admin-auth")
  }

  const backToChoice = () => {
    setView("choice")
    setError("")
    setOtpCode("")
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (isLoggedIn) {
    return <AdminPanel onLogout={handleLogout} useSupabase={!!supabaseUser} />
  }

  // Sin Supabase: solo login por contraseña
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
          <h1 className="mb-6 text-center text-xl font-bold text-foreground">venextrading Admin</h1>
          <form onSubmit={handleLoginPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                {t.admin.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.admin.passwordPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t.admin.login}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Con Supabase: choice → password | register | otp_send → otp_verify
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-24 pb-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
        <h1 className="mb-2 text-center text-xl font-bold text-foreground">venextrading</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">Panel de proveedores</p>

        {view === "choice" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setView("password")}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              {t.admin.loginWithPassword}
            </button>
            <button
              type="button"
              onClick={() => setView("register")}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <UserPlus className="h-5 w-5 text-muted-foreground" />
              {t.admin.registerAsProvider}
            </button>
            <button
              type="button"
              onClick={() => setView("otp_send")}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
              {t.admin.loginWithCode}
            </button>
          </div>
        )}

        {(view === "password" || view === "register" || view === "otp_send") && (
          <form
            onSubmit={view === "password" ? handleLoginPassword : handleSendOtp}
            className="space-y-4"
          >
            <button
              type="button"
              onClick={backToChoice}
              className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
            {view === "register" && (
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
                  {t.admin.fullName}
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.admin.fullNamePlaceholder}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                {t.admin.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.admin.emailPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                autoComplete="email"
              />
            </div>
            {view === "password" && (
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                  {t.admin.password}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.admin.passwordPlaceholder}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {view === "password" ? t.admin.login : t.admin.sendCode}
            </button>
          </form>
        )}

        {view === "otp_verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <button
              type="button"
              onClick={backToChoice}
              className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
            <p className="text-sm text-muted-foreground">{t.admin.sendCodeSent}</p>
            <p className="text-xs font-medium text-foreground">{email}</p>
            <div>
              <label htmlFor="otp" className="mb-2 block text-sm font-medium text-foreground">
                Código de 6 dígitos
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder={t.admin.otpPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-center text-lg tracking-widest"
                autoComplete="one-time-code"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {t.admin.verifyCode}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                setError("")
                await createClient().auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } })
                setLoading(false)
              }}
              className="w-full text-sm text-muted-foreground underline hover:text-foreground disabled:opacity-50"
            >
              Reenviar código
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
