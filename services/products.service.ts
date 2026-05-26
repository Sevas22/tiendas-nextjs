import { createAdminDbClient } from "@/lib/supabase/admin"
import { isMissingSchemaError } from "@/lib/supabase/db-errors"
import { mapAdminProduct } from "@/lib/supabase/mappers"
import { slugify } from "@/lib/utils/slug"
import type { AdminProduct, ProductsListParams, ProductsListResult } from "@/types/admin"
import type { ProductWritePayload } from "@/lib/validators/product"
import {
  aggregateProductFromVariants,
  getVariantsForProduct,
  syncProductVariants,
  type SyncVariantsInput,
} from "@/services/variants.service"

const DEFAULT_PAGE_SIZE = 10

export async function listAdminProducts(
  params: ProductsListParams = {}
): Promise<ProductsListResult> {
  const supabase = createAdminDbClient()
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })

  if (params.search?.trim()) {
    const q = params.search.trim().replace(/[%_]/g, "")
    const term = `%${q}%`
    query = query.or(`name.ilike.${term},sku.ilike.${term},slug.ilike.${term}`)
  }
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
  }
  if (params.categoryId) {
    query = query.eq("category_id", params.categoryId)
  }
  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type)
  }

  const { data, count, error } = await query.range(from, to)
  if (error) {
    if (isMissingSchemaError(error.message)) {
      return { products: [], total: 0, page, pageSize, totalPages: 1, setupRequired: true }
    }
    throw new Error(error.message)
  }

  const productIds = (data ?? []).map((r) => r.id)
  let imagesMap: Record<string, Awaited<ReturnType<typeof fetchImagesForProducts>>> = {}

  if (productIds.length > 0) {
    const images = await fetchImagesForProducts(productIds)
    imagesMap = images
  }

  const products = (data ?? []).map((row) =>
    mapAdminProduct(row, imagesMap[row.id] ?? [])
  )

  const total = count ?? 0
  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

async function fetchImagesForProducts(productIds: string[]) {
  const supabase = createAdminDbClient()
  const { data } = await supabase
    .from("product_images")
    .select("*")
    .in("product_id", productIds)
    .order("sort_order")

  const map: Record<string, typeof data> = {}
  for (const img of data ?? []) {
    if (!map[img.product_id]) map[img.product_id] = []
    map[img.product_id]!.push(img)
  }
  return map
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const supabase = createAdminDbClient()
  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single()

  if (error || !row) return null

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order")

  const admin = mapAdminProduct(row, images ?? [])
  if (admin.hasVariants) {
    const { optionGroups, variants } = await getVariantsForProduct(id)
    admin.optionGroups = optionGroups
    admin.variants = variants
    admin.optionGroupName =
      optionGroups[0]?.displayName ?? optionGroups[0]?.name ?? null
  }
  return admin
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function resolveUserId(userId: string | null): string | null {
  if (!userId) return null
  return UUID_RE.test(userId) ? userId : null
}

export async function createProduct(
  values: ProductWritePayload,
  userId: string | null,
  imageUrls: string[] = [],
  variantSync?: SyncVariantsInput & { imageUrls: Map<string, string> }
): Promise<AdminProduct> {
  const supabase = createAdminDbClient()
  const primaryImage = imageUrls[0]
  if (!primaryImage) {
    throw new Error("Se requiere al menos una imagen")
  }

  const { data: row, error } = await supabase
    .from("products")
    .insert({
      name: values.name.trim(),
      slug: values.slug || slugify(values.name),
      description: values.description.trim(),
      price: values.price,
      stock: values.stock,
      sku: values.sku || null,
      status: values.status,
      discount: values.discount,
      category: values.category,
      category_id: values.categoryId || null,
      type: values.type,
      image: primaryImage,
      specifications: values.specifications ?? {},
      tech_sheet_url: values.techSheetUrl || null,
      user_id: resolveUserId(userId),
      has_variants: values.hasVariants ?? false,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await syncProductImages(row.id, imageUrls.length ? imageUrls : [primaryImage])

  if (values.hasVariants && variantSync) {
    await syncProductVariants(row.id, variantSync, variantSync.imageUrls)
    const agg = await aggregateProductFromVariants(row.id, values.price)
    await supabase
      .from("products")
      .update({
        has_variants: true,
        price: agg.price,
        stock: agg.stock,
        ...(agg.image ? { image: agg.image } : {}),
      })
      .eq("id", row.id)
  }

  return (await getAdminProduct(row.id))!
}

export async function updateProduct(
  id: string,
  values: ProductWritePayload,
  imageUrls?: string[],
  variantSync?: SyncVariantsInput & { imageUrls: Map<string, string> }
): Promise<AdminProduct> {
  const supabase = createAdminDbClient()
  const primaryImage = imageUrls?.[0]
  if (!primaryImage) {
    throw new Error("Se requiere al menos una imagen")
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: values.name.trim(),
      slug: values.slug,
      description: values.description.trim(),
      price: values.price,
      stock: values.stock,
      sku: values.sku || null,
      status: values.status,
      discount: values.discount,
      category: values.category,
      category_id: values.categoryId || null,
      type: values.type,
      image: primaryImage,
      specifications: values.specifications ?? {},
      tech_sheet_url: values.techSheetUrl || null,
      has_variants: values.hasVariants ?? false,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  if (imageUrls) {
    await syncProductImages(id, imageUrls)
  }

  if (values.hasVariants && variantSync) {
    await syncProductVariants(id, variantSync, variantSync.imageUrls)
    const agg = await aggregateProductFromVariants(id, values.price)
    await supabase
      .from("products")
      .update({
        has_variants: true,
        price: agg.price,
        stock: agg.stock,
        ...(agg.image ? { image: agg.image } : {}),
      })
      .eq("id", id)
  } else if (!values.hasVariants) {
    await supabase.from("product_variants").delete().eq("product_id", id)
    await supabase.from("product_option_groups").delete().eq("product_id", id)
  }

  return (await getAdminProduct(id))!
}

export async function softDeleteProduct(id: string): Promise<void> {
  const supabase = createAdminDbClient()
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

async function syncProductImages(productId: string, urls: string[]) {
  const supabase = createAdminDbClient()
  await supabase.from("product_images").delete().eq("product_id", productId)

  const rows = urls.map((url, index) => ({
    product_id: productId,
    url,
    sort_order: index,
    is_primary: index === 0,
  }))

  if (rows.length > 0) {
    await supabase.from("product_images").insert(rows)
  }
}

export async function getDashboardProductStats() {
  const supabase = createAdminDbClient()

  const { count: total, error: totalErr } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)

  if (totalErr && isMissingSchemaError(totalErr.message)) {
    return { totalProducts: 0, activeProducts: 0, lowStockProducts: 0 }
  }

  const { count: active } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)
    .eq("status", "active")

  const { count: lowStock } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)
    .lt("stock", 5)
    .eq("status", "active")

  return {
    totalProducts: total ?? 0,
    activeProducts: active ?? 0,
    lowStockProducts: lowStock ?? 0,
  }
}

export async function listCategories() {
  const supabase = createAdminDbClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order")

  if (error && isMissingSchemaError(error.message)) return []
  return (data ?? []).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
}
