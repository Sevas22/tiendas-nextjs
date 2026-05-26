import { createAdminDbClient } from "@/lib/supabase/admin"
import { isMissingSchemaError } from "@/lib/supabase/db-errors"
import { mapStoreSettings } from "@/lib/supabase/mappers"
import type { StoreSettings } from "@/types/admin"
import type { StoreSettingsFormValues } from "@/lib/validators/settings"

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = createAdminDbClient()
  const { data } = await supabase
    .from("store_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  return data ? mapStoreSettings(data) : null
}

export async function upsertStoreSettings(
  values: StoreSettingsFormValues
): Promise<StoreSettings> {
  const supabase = createAdminDbClient()
  const existing = await getStoreSettings()

  const payload = {
    store_name: values.storeName.trim(),
    logo_url: values.logoUrl || null,
    favicon_url: values.faviconUrl || null,
    banner_urls: values.bannerUrls,
    contact_email: values.contactEmail || null,
    contact_phone: values.contactPhone || null,
    address: values.address || null,
    social_links: {
      instagram: values.socialInstagram ?? "",
      facebook: values.socialFacebook ?? "",
      linkedin: values.socialLinkedin ?? "",
      whatsapp: values.socialWhatsapp ?? "",
    },
    payment_methods: values.paymentMethods,
    shipping_methods: values.shippingMethods,
  }

  if (existing) {
    const { data, error } = await supabase
      .from("store_settings")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapStoreSettings(data)
  }

  const { data, error } = await supabase
    .from("store_settings")
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapStoreSettings(data)
}

export async function getOrderStats() {
  const supabase = createAdminDbClient()

  const { count: totalOrders, error: ordersErr } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  if (ordersErr && isMissingSchemaError(ordersErr.message)) {
    return { totalOrders: 0, pendingOrders: 0, revenue: 0 }
  }

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { data: revenueRows } = await supabase
    .from("orders")
    .select("total")
    .neq("status", "cancelled")

  const revenue = (revenueRows ?? []).reduce((sum, o) => sum + Number(o.total), 0)

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    revenue,
  }
}
