import { createAnonymousServerClient } from "@/lib/supabase/server"
import { mapPublicProduct } from "@/lib/supabase/mappers"
import { getVariantsForProduct } from "@/services/variants.service"
import type { Product } from "@/lib/types"

export async function getPublicProductDetail(id: string): Promise<Product | null> {
  const supabase = createAnonymousServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle()

  if (error || !data) return null

  const product = mapPublicProduct(data)
  const hasVariants = Boolean((data as { has_variants?: boolean }).has_variants)

  if (!hasVariants) {
    return { ...product, hasVariants: false }
  }

  let optionGroups: Awaited<ReturnType<typeof getVariantsForProduct>>["optionGroups"] = []
  let variants: Awaited<ReturnType<typeof getVariantsForProduct>>["variants"] = []
  try {
    const loaded = await getVariantsForProduct(id)
    optionGroups = loaded.optionGroups
    variants = loaded.variants
  } catch {
    return { ...product, hasVariants: false }
  }

  const activeVariants = variants.filter((v) => v.status === "active")
  const prices = activeVariants.map((v) => v.price ?? product.price)

  return {
    ...product,
    hasVariants: true,
    price: prices.length ? Math.min(...prices) : product.price,
    optionGroups,
    variants: activeVariants,
    defaultVariantId: activeVariants[0]?.id ?? null,
    image: activeVariants.find((v) => v.imageUrl)?.imageUrl ?? product.image,
  }
}
