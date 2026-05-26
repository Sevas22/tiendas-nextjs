"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { updateStoreSettingsAction } from "@/app/admin/actions/settings"
import { storeSettingsSchema, type StoreSettingsFormValues } from "@/lib/validators/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StoreSettings } from "@/types/admin"

interface SettingsFormProps {
  settings: StoreSettings | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [pending, startTransition] = useTransition()

  const form = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: settings?.storeName ?? "venextrading",
      logoUrl: settings?.logoUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
      bannerUrls: settings?.bannerUrls ?? [],
      contactEmail: settings?.contactEmail ?? "",
      contactPhone: settings?.contactPhone ?? "",
      address: settings?.address ?? "",
      socialInstagram: settings?.socialLinks?.instagram ?? "",
      socialFacebook: settings?.socialLinks?.facebook ?? "",
      socialLinkedin: settings?.socialLinks?.linkedin ?? "",
      socialWhatsapp: settings?.socialLinks?.whatsapp ?? "",
      paymentMethods: settings?.paymentMethods ?? [],
      shippingMethods: settings?.shippingMethods ?? [],
    },
  })

  const paymentMethods = form.watch("paymentMethods")
  const shippingMethods = form.watch("shippingMethods")

  const onSubmit = (values: StoreSettingsFormValues) => {
    const fd = new FormData()
    fd.append("storeName", values.storeName)
    fd.append("logoUrl", values.logoUrl ?? "")
    fd.append("faviconUrl", values.faviconUrl ?? "")
    fd.append("bannerUrls", JSON.stringify(values.bannerUrls))
    fd.append("contactEmail", values.contactEmail ?? "")
    fd.append("contactPhone", values.contactPhone ?? "")
    fd.append("address", values.address ?? "")
    fd.append("socialInstagram", values.socialInstagram ?? "")
    fd.append("socialFacebook", values.socialFacebook ?? "")
    fd.append("socialLinkedin", values.socialLinkedin ?? "")
    fd.append("socialWhatsapp", values.socialWhatsapp ?? "")
    fd.append("paymentMethods", JSON.stringify(values.paymentMethods))
    fd.append("shippingMethods", JSON.stringify(values.shippingMethods))

    const logoFile = (document.getElementById("logoFile") as HTMLInputElement)?.files?.[0]
    const faviconFile = (document.getElementById("faviconFile") as HTMLInputElement)?.files?.[0]
    const bannerFile = (document.getElementById("bannerFile") as HTMLInputElement)?.files?.[0]
    if (logoFile) fd.append("logoFile", logoFile)
    if (faviconFile) fd.append("faviconFile", faviconFile)
    if (bannerFile) fd.append("bannerFile", bannerFile)

    startTransition(async () => {
      const result = await updateStoreSettingsAction({ success: false }, fd)
      if (result.success) {
        toast.success("Configuración guardada")
      } else {
        toast.error(result.error ?? "Error al guardar")
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
          <CardDescription>Nombre, logo y datos de contacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre de la tienda</Label>
            <Input {...form.register("storeName")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Logo (URL)</Label>
              <Input {...form.register("logoUrl")} placeholder="https://..." />
              <Input id="logoFile" type="file" accept="image/*" className="mt-2" />
            </div>
            <div className="space-y-2">
              <Label>Favicon (URL)</Label>
              <Input {...form.register("faviconUrl")} placeholder="https://..." />
              <Input id="faviconFile" type="file" accept="image/*" className="mt-2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Banner adicional</Label>
            <Input id="bannerFile" type="file" accept="image/*" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("contactEmail")} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input {...form.register("contactPhone")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Textarea rows={2} {...form.register("address")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes sociales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input {...form.register("socialInstagram")} />
          </div>
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input {...form.register("socialFacebook")} />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input {...form.register("socialLinkedin")} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input {...form.register("socialWhatsapp")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos y envíos</CardTitle>
          <CardDescription>Un método por línea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Métodos de pago</Label>
            <Textarea
              rows={3}
              value={paymentMethods.join("\n")}
              onChange={(e) =>
                form.setValue(
                  "paymentMethods",
                  e.target.value.split("\n").filter(Boolean)
                )
              }
              placeholder="Transferencia&#10;Pago móvil"
            />
          </div>
          <div className="space-y-2">
            <Label>Métodos de envío</Label>
            <Textarea
              rows={3}
              value={shippingMethods.join("\n")}
              onChange={(e) =>
                form.setValue(
                  "shippingMethods",
                  e.target.value.split("\n").filter(Boolean)
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar configuración"}
      </Button>
    </form>
  )
}
