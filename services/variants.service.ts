import { createAdminDbClient } from "@/lib/supabase/admin"
import { buildOptionSignature } from "@/lib/utils/option-signature"
import { slugify } from "@/lib/utils/slug"
import type {
  ProductOptionGroup,
  ProductVariant,
  VariantDraft,
  VariantStatus,
} from "@/types/variants"

export interface SyncVariantsInput {
  optionGroupName: string
  optionGroupDisplayName?: string
  variants: VariantDraft[]
}

function mapVariantRow(
  row: {
    id: string
    product_id: string
    title: string
    sku: string | null
    price: number | null
    stock: number
    image_url: string | null
    swatch_color: string | null
    status: string
    position: number
    option_signature: string
  },
  optionValueIds: string[]
): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    title: row.title,
    sku: row.sku,
    price: row.price != null ? Number(row.price) : null,
    stock: row.stock,
    imageUrl: row.image_url,
    swatchColor: row.swatch_color,
    status: row.status as VariantStatus,
    position: row.position,
    optionSignature: row.option_signature,
    optionValueIds,
  }
}

export async function getVariantsForProduct(productId: string): Promise<{
  optionGroups: ProductOptionGroup[]
  variants: ProductVariant[]
}> {
  const supabase = createAdminDbClient()

  const { data: groups } = await supabase
    .from("product_option_groups")
    .select("*")
    .eq("product_id", productId)
    .order("position")

  const groupIds = (groups ?? []).map((g) => g.id)
  let values: Awaited<ReturnType<typeof supabase.from>>["data"] = []

  if (groupIds.length > 0) {
    const { data: vals } = await supabase
      .from("product_option_values")
      .select("*")
      .in("option_group_id", groupIds)
      .order("position")
    values = vals ?? []
  }

  const { data: variantRows } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("position")

  const variantIds = (variantRows ?? []).map((v) => v.id)
  const variantOptionMap: Record<string, string[]> = {}

  if (variantIds.length > 0) {
    const { data: links } = await supabase
      .from("product_variant_options")
      .select("variant_id, option_value_id")
      .in("variant_id", variantIds)

    for (const link of links ?? []) {
      if (!variantOptionMap[link.variant_id]) variantOptionMap[link.variant_id] = []
      variantOptionMap[link.variant_id]!.push(link.option_value_id)
    }
  }

  const valuesByGroup: Record<string, typeof values> = {}
  for (const v of values ?? []) {
    const row = v as { option_group_id: string }
    if (!valuesByGroup[row.option_group_id]) valuesByGroup[row.option_group_id] = []
    valuesByGroup[row.option_group_id]!.push(v)
  }

  const optionGroups: ProductOptionGroup[] = (groups ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    displayName: g.display_name,
    position: g.position,
    values: (valuesByGroup[g.id] ?? []).map((val) => {
      const v = val as {
        id: string
        value: string
        label: string
        swatch_color: string | null
        position: number
      }
      return {
        id: v.id,
        value: v.value,
        label: v.label,
        swatchColor: v.swatch_color,
        position: v.position,
      }
    }),
  }))

  const variants = (variantRows ?? []).map((row) =>
    mapVariantRow(row, variantOptionMap[row.id] ?? [])
  )

  return { optionGroups, variants }
}

export async function syncProductVariants(
  productId: string,
  input: SyncVariantsInput,
  variantImageUrls: Map<string, string>
): Promise<ProductVariant[]> {
  const supabase = createAdminDbClient()
  const groupName = slugify(input.optionGroupName) || "opcion"
  const groupLabel = input.optionGroupDisplayName?.trim() || input.optionGroupName.trim() || "Opción"

  const validVariants = input.variants.filter((v) => v.label.trim())

  if (validVariants.length === 0) {
    throw new Error("Añade al menos una variante con nombre")
  }

  const { data: existingVariants } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)

  if (existingVariants?.length) {
    const ids = existingVariants.map((v) => v.id)
    await supabase.from("product_variant_options").delete().in("variant_id", ids)
    await supabase.from("product_variants").delete().eq("product_id", productId)
  }

  const { data: existingGroups } = await supabase
    .from("product_option_groups")
    .select("id")
    .eq("product_id", productId)

  if (existingGroups?.length) {
    await supabase.from("product_option_groups").delete().eq("product_id", productId)
  }

  const { data: group, error: groupErr } = await supabase
    .from("product_option_groups")
    .insert({
      product_id: productId,
      name: groupName,
      display_name: groupLabel,
      position: 0,
    })
    .select()
    .single()

  if (groupErr || !group) throw new Error(groupErr?.message ?? "Error al crear opción")

  const insertedVariants: ProductVariant[] = []

  for (let i = 0; i < validVariants.length; i++) {
    const draft = validVariants[i]!
    const valueSlug = slugify(draft.label) || `valor-${i}`
    const signature = buildOptionSignature([{ group: groupName, value: valueSlug }])

    const { data: optValue, error: valErr } = await supabase
      .from("product_option_values")
      .insert({
        option_group_id: group.id,
        value: valueSlug,
        label: draft.label.trim(),
        swatch_color: draft.swatchColor?.trim() || null,
        position: i,
      })
      .select()
      .single()

    if (valErr || !optValue) throw new Error(valErr?.message ?? "Error al crear valor de opción")

    const imageUrl =
      variantImageUrls.get(draft.clientId) ??
      (draft.imageUrl?.trim() ? draft.imageUrl.trim() : null)
    const price =
      draft.price.trim() === "" ? null : Math.max(0, Number.parseFloat(draft.price))
    const stock = Math.max(0, Number.parseInt(draft.stock, 10) || 0)

    const { data: variant, error: varErr } = await supabase
      .from("product_variants")
      .insert({
        product_id: productId,
        title: draft.label.trim(),
        sku: draft.sku.trim() || null,
        price: Number.isFinite(price) ? price : null,
        stock,
        image_url: imageUrl,
        swatch_color: draft.swatchColor?.trim() || null,
        status: draft.status,
        position: i,
        option_signature: signature,
      })
      .select()
      .single()

    if (varErr || !variant) throw new Error(varErr?.message ?? "Error al crear variante")

    await supabase.from("product_variant_options").insert({
      variant_id: variant.id,
      option_value_id: optValue.id,
    })

    insertedVariants.push(
      mapVariantRow(variant, [optValue.id])
    )
  }

  return insertedVariants
}

export async function aggregateProductFromVariants(
  productId: string,
  basePrice: number
): Promise<{ price: number; stock: number; image: string | null }> {
  const { variants } = await getVariantsForProduct(productId)
  const active = variants.filter((v) => v.status === "active")

  if (!active.length) {
    return { price: basePrice, stock: 0, image: null }
  }

  const prices = active.map((v) => v.price ?? basePrice)
  const stock = active.reduce((s, v) => s + v.stock, 0)
  const image = active.find((v) => v.imageUrl)?.imageUrl ?? null

  return {
    price: Math.min(...prices),
    stock,
    image,
  }
}
