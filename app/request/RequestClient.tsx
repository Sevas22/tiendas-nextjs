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

export default function RequestClient() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <>
      <HeroBanner
        title="Request a Product"
        subtitle="Fill out the form below and our team will get back to you within 24 hours"
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Request a Product</CardTitle>
              <CardDescription>
                Please provide as much detail as possible
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* GRID 2x2 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Full Name */}
                  <div>
                    <Label>Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="John Doe"
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        className="pl-10"
                        placeholder="john@email.com"
                        value={form.email}
                        onChange={(e) =>
                          handleChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="+1 555 123 456"
                        value={form.phone}
                        onChange={(e) =>
                          handleChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <Label>Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="ACME Corp"
                        value={form.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <Label>Country</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="United States"
                        value={form.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Product */}
                  <div>
                    <Label>Product of Interest</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Rice, electronics, machinery..."
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
                  <Label>Estimated Quantity</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="500 kg, 10 containers..."
                      value={form.quantity}
                      onChange={(e) =>
                        handleChange("quantity", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Message / Special Requirements *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      rows={5}
                      className="pl-10"
                      placeholder="Tell us about your requirements, delivery schedule, etc."
                      value={form.message}
                      onChange={(e) =>
                        handleChange("message", e.target.value)
                      }
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}