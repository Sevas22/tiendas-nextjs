"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth/session"
import { storeSettingsSchema } from "@/lib/validators/settings"
import { upsertStoreSettings } from "@/services/settings.service"
import { uploadStoreAsset } from "@/services/storage.service"
import type { ActionResult } from "@/types/admin"

export async function updateStoreSettingsAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin()

    const paymentRaw = formData.get("paymentMethods")?.toString() ?? "[]"
    const shippingRaw = formData.get("shippingMethods")?.toString() ?? "[]"
    const bannersRaw = formData.get("bannerUrls")?.toString() ?? "[]"

    let logoUrl = formData.get("logoUrl")?.toString() ?? ""
    let faviconUrl = formData.get("faviconUrl")?.toString() ?? ""
    let bannerUrls: string[] = []

    try {
      bannerUrls = JSON.parse(bannersRaw) as string[]
    } catch {
      bannerUrls = []
    }

    const logoFile = formData.get("logoFile")
    if (logoFile instanceof File && logoFile.size > 0) {
      const res = await uploadStoreAsset(logoFile, "logo")
      if ("error" in res) return { success: false, error: res.error }
      logoUrl = res.url
    }

    const faviconFile = formData.get("faviconFile")
    if (faviconFile instanceof File && faviconFile.size > 0) {
      const res = await uploadStoreAsset(faviconFile, "favicon")
      if ("error" in res) return { success: false, error: res.error }
      faviconUrl = res.url
    }

    const bannerFile = formData.get("bannerFile")
    if (bannerFile instanceof File && bannerFile.size > 0) {
      const res = await uploadStoreAsset(bannerFile, "banners")
      if ("error" in res) return { success: false, error: res.error }
      bannerUrls = [...bannerUrls, res.url]
    }

    const parsed = storeSettingsSchema.safeParse({
      storeName: formData.get("storeName"),
      logoUrl,
      faviconUrl,
      bannerUrls,
      contactEmail: formData.get("contactEmail") ?? "",
      contactPhone: formData.get("contactPhone") ?? "",
      address: formData.get("address") ?? "",
      socialInstagram: formData.get("socialInstagram") ?? "",
      socialFacebook: formData.get("socialFacebook") ?? "",
      socialLinkedin: formData.get("socialLinkedin") ?? "",
      socialWhatsapp: formData.get("socialWhatsapp") ?? "",
      paymentMethods: JSON.parse(paymentRaw) as string[],
      shippingMethods: JSON.parse(shippingRaw) as string[],
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Validación fallida" }
    }

    await upsertStoreSettings(parsed.data)
    revalidatePath("/admin/settings")
    revalidatePath("/")
    return { success: true }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Error al guardar configuración",
    }
  }
}
