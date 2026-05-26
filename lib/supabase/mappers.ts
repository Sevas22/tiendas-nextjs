import type { AdminProduct, AdminProductImage, StoreSettings } from "@/types/admin"
import type { Database } from "@/types/database"
import type { Product } from "@/lib/types"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type ImageRow = Database["public"]["Tables"]["product_images"]["Row"]
type SettingsRow = Database["public"]["Tables"]["store_settings"]["Row"]

export function mapProductImages(rows: ImageRow[]): AdminProductImage[] {
  return rows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: row.id,
      url: row.url,
      storagePath: row.storage_path,
      altText: row.alt_text,
      sortOrder: row.sort_order,
      isPrimary: row.is_primary,
    }))
}

export function mapAdminProduct(
  row: ProductRow,
  images: ImageRow[] = []
): AdminProduct {
  const specs =
    row.specifications && typeof row.specifications === "object" && !Array.isArray(row.specifications)
      ? (row.specifications as Record<string, string>)
      : {}

  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? row.id,
    description: row.description,
    price: Number(row.price),
    stock: row.stock ?? 0,
    sku: row.sku,
    status: row.status ?? "active",
    discount: Number(row.discount ?? 0),
    category: row.category,
    categoryId: row.category_id,
    type: row.type,
    image: row.image,
    images: mapProductImages(images),
    specifications: specs,
    techSheetUrl: row.tech_sheet_url,
    hasVariants: Boolean((row as { has_variants?: boolean }).has_variants),
    optionGroupName: null,
    variants: [],
    optionGroups: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapPublicProduct(row: ProductRow): Product {
  const specs =
    row.specifications && typeof row.specifications === "object" && !Array.isArray(row.specifications)
      ? (row.specifications as Record<string, string>)
      : undefined

  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    description: row.description,
    image: row.image,
    type: row.type,
    specifications: specs,
    techSheetUrl: row.tech_sheet_url || undefined,
    createdAt: typeof row.created_at === "string"
      ? row.created_at.split("T")[0]
      : String(row.created_at),
  }
}

export function mapStoreSettings(row: SettingsRow): StoreSettings {
  const banners = Array.isArray(row.banner_urls) ? (row.banner_urls as string[]) : []
  const social =
    row.social_links && typeof row.social_links === "object" && !Array.isArray(row.social_links)
      ? (row.social_links as Record<string, string>)
      : {}
  const payments = Array.isArray(row.payment_methods) ? (row.payment_methods as string[]) : []
  const shipping = Array.isArray(row.shipping_methods) ? (row.shipping_methods as string[]) : []

  return {
    id: row.id,
    storeName: row.store_name,
    logoUrl: row.logo_url,
    faviconUrl: row.favicon_url,
    bannerUrls: banners,
    socialLinks: social,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    address: row.address,
    paymentMethods: payments,
    shippingMethods: shipping,
  }
}
