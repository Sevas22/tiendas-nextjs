"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Send,
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Package,
  Layers,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HeroBanner } from "@/components/hero-banner"
import { useLanguage } from "@/contexts/language-context"

export default function RequestPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    productInterest: "",
    quantity: "",
    message: "",
  })

  useEffect(() => {
    const product = searchParams.get("product")
    const qty = searchParams.get("qty")
    if (product) {
      setForm((prev) => ({
        ...prev,
        productInterest: product,
        quantity: qty || "",
      }))
    }
  }, [searchParams])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.fullName.trim()) newErrors.fullName = t.requestPage.required
    if (!form.email.trim()) {
      newErrors.email = t.requestPage.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t.requestPage.invalidEmail
    }
    if (!form.message.trim()) newErrors.message = t.requestPage.required
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSending(true)
    setStatus("idle")

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          country: "",
          productInterest: "",
          quantity: "",
          message: "",
        })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <HeroBanner title={t.requestPage.title} subtitle={t.requestPage.subtitle} />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-foreground">{t.requestPage.title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t.requestPage.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === "success" && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-primary/10 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm font-medium text-primary">{t.requestPage.success}</p>
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                  <p className="text-sm font-medium text-destructive">{t.requestPage.error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fullName" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.requestPage.fullName} *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder={t.requestPage.fullNamePlaceholder}
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.requestPage.email} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.requestPage.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone + Company */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.requestPage.phone}
                    </Label>
                    <Input
                      id="phone"
                      placeholder={t.requestPage.phonePlaceholder}
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="company" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.requestPage.company}
                    </Label>
                    <Input
                      id="company"
                      placeholder={t.requestPage.companyPlaceholder}
                      value={form.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 3: Country + Product */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="country" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.requestPage.country}
                    </Label>
                    <Input
                      id="country"
                      placeholder={t.requestPage.countryPlaceholder}
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="productInterest" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.requestPage.productInterest}
                    </Label>
                    <Input
                      id="productInterest"
                      placeholder={t.requestPage.productPlaceholder}
                      value={form.productInterest}
                      onChange={(e) => handleChange("productInterest", e.target.value)}
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="quantity" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.requestPage.quantity}
                  </Label>
                  <Input
                    id="quantity"
                    placeholder={t.requestPage.quantityPlaceholder}
                    value={form.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.requestPage.message} *
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={t.requestPage.messagePlaceholder}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={sending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {sending ? (
                    <>{t.requestPage.sending}</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t.requestPage.submit}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
