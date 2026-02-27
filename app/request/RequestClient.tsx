"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
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
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { HeroBanner } from "@/components/hero-banner"
import { useLanguage } from "@/contexts/language-context"

export default function RequestClient() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
      if (!accessKey) {
        toast.error("Configura NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY en .env.local")
        return
      }
      const emailBody = [
        `Nombre: ${form.fullName}`,
        `Email: ${form.email}`,
        `Teléfono: ${form.phone || "N/A"}`,
        `Empresa: ${form.company || "N/A"}`,
        `País: ${form.country || "N/A"}`,
        `Producto de interés: ${form.productInterest || "N/A"}`,
        `Cantidad estimada: ${form.quantity || "N/A"}`,
        ``,
        `Mensaje / Requisitos:`,
        form.message,
      ].join("\n")
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[venextrading] Nueva solicitud de ${form.fullName}`,
          from_name: "venextrading Solicitud",
          replyto: form.email,
          message: emailBody,
        }),
      })
      const data = (await res.json()) as { success?: boolean; message?: string }
      if (res.ok && data.success) {
        toast.success(t.requestPage.success)
        setForm({ fullName: "", email: "", phone: "", company: "", country: "", productInterest: "", quantity: "", message: "" })
      } else {
        toast.error(data.message || t.requestPage.error)
      }
    } catch {
      toast.error(t.requestPage.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <HeroBanner
        title={t.requestPage.title}
        subtitle={t.requestPage.subtitle}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>{t.requestPage.title}</CardTitle>
              <CardDescription>
                {t.requestPage.cardDescription}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* GRID 2x2 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Full Name */}
                  <div>
                    <Label>{t.requestPage.fullName} *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder={t.requestPage.fullNamePlaceholder}
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label>{t.requestPage.email} *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        className="pl-10"
                        placeholder={t.requestPage.emailPlaceholder}
                        value={form.email}
                        onChange={(e) =>
                          handleChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>{t.requestPage.phone}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder={t.requestPage.phonePlaceholder}
                        value={form.phone}
                        onChange={(e) =>
                          handleChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <Label>{t.requestPage.company}</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder={t.requestPage.companyPlaceholder}
                        value={form.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <Label>{t.requestPage.country}</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder={t.requestPage.countryPlaceholder}
                        value={form.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Product */}
                  <div>
                    <Label>{t.requestPage.productInterest}</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder={t.requestPage.productPlaceholder}
                        value={form.productInterest}
                        onChange={(e) =>
                          handleChange("productInterest", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* FULL WIDTH */}
                <div>
                  <Label>{t.requestPage.quantity}</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder={t.requestPage.quantityPlaceholder}
                      value={form.quantity}
                      onChange={(e) =>
                        handleChange("quantity", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>{t.requestPage.message} *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      rows={5}
                      className="pl-10"
                      placeholder={t.requestPage.messagePlaceholder}
                      value={form.message}
                      onChange={(e) =>
                        handleChange("message", e.target.value)
                      }
                    />
                </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? t.requestPage.sending : t.requestPage.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}