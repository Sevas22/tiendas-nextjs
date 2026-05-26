"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth/session"
import { productFormSchema } from "@/lib/validators/product"
import {
  createProduct,
  softDeleteProduct,
  updateProduct,
} from "@/services/products.service"
import { uploadProductImage, uploadProductTechSheet } from "@/services/storage.service"
import { normalizeSpecifications } from "@/lib/utils/specifications"
import type { VariantDraft } from "@/types/variants"
import type { ActionResult } from "@/types/admin"

function parseSpecifications(formData: FormData): Record<string, string> {
  const raw = formData.get("specifications")
  if (typeof raw !== "string" || !raw) return {}
  try {
    return normalizeSpecifications(JSON.parse(raw))
  } catch {
    return {}
  }
}

function parseProductForm(formData: FormData) {
  const specifications = parseSpecifications(formData)

  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    sku: formData.get("sku") ?? "",
    status: formData.get("status"),
    discount: formData.get("discount"),
    categoryId: formData.get("categoryId") ?? "",
    category: formData.get("category"),
    type: formData.get("type"),
  })

  if (!parsed.success) return parsed

  const hasVariants = formData.get("hasVariants") === "true"
  const optionGroupName = formData.get("optionGroupName")?.toString() ?? "Opción"

  return {
    success: true as const,
    data: { ...parsed.data, specifications, hasVariants, optionGroupName },
  }
}

function parseVariantDrafts(formData: FormData): VariantDraft[] {
  const raw = formData.get("variants")
  if (typeof raw !== "string" || !raw) return []
  try {
    const parsed = JSON.parse(raw) as VariantDraft[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function uploadVariantImages(
  formData: FormData,
  folderId: string,
  drafts: VariantDraft[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (const draft of drafts) {
    if (draft.imageUrl && !draft.imageFile) {
      map.set(draft.clientId, draft.imageUrl)
      continue
    }
    const file = formData.get(`variantImage_${draft.clientId}`)
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadProductImage(file, `${folderId}/variants`)
      if (!("error" in uploaded)) {
        map.set(draft.clientId, uploaded.url)
      }
    }
  }
  return map
}

function getImageFile(formData: FormData): File | null {
  const file = formData.get("imageFile")
  if (file instanceof File && file.size > 0) return file
  return null
}

function getTechSheetFile(formData: FormData): File | null {
  const file = formData.get("techSheetFile")
  if (file instanceof File && file.size > 0) return file
  return null
}

async function resolveTechSheetUrl(
  formData: FormData,
  folderId: string
): Promise<{ url: string } | { error: string }> {
  const existing = formData.get("existingTechSheetUrl")?.toString() ?? ""
  const file = getTechSheetFile(formData)

  if (file) {
    const uploaded = await uploadProductTechSheet(file, folderId)
    if ("error" in uploaded) return { error: uploaded.error }
    return { url: uploaded.url }
  }

  return { url: existing }
}

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()

    const file = getImageFile(formData)
    if (!file) {
      return { success: false, error: "Debes subir una imagen del producto" }
    }

    const parsed = parseProductForm(formData)
    if (!parsed.success) {
      const first = "error" in parsed ? parsed.error.errors[0] : undefined
      return { success: false, error: first?.message ?? "Validación fallida" }
    }

    const uploadId = randomUUID()

    const uploaded = await uploadProductImage(file, uploadId)
    if ("error" in uploaded) {
      return { success: false, error: uploaded.error }
    }

    const techSheet = await resolveTechSheetUrl(formData, uploadId)
    if ("error" in techSheet) {
      return { success: false, error: techSheet.error }
    }

    const variantDrafts = parseVariantDrafts(formData)
    if (parsed.data.hasVariants && variantDrafts.filter((v) => v.label.trim()).length === 0) {
      return { success: false, error: "Añade al menos una variante con nombre" }
    }

    const variantImageUrls = parsed.data.hasVariants
      ? await uploadVariantImages(formData, uploadId, variantDrafts)
      : new Map<string, string>()

    const product = await createProduct(
      { ...parsed.data, techSheetUrl: techSheet.url || null },
      null,
      [uploaded.url],
      parsed.data.hasVariants
        ? {
            optionGroupName: parsed.data.optionGroupName ?? "Opción",
            variants: variantDrafts,
            imageUrls: variantImageUrls,
          }
        : undefined
    )

    revalidatePath("/admin/products")
    revalidatePath("/products")
    revalidatePath("/store")
    return { success: true, data: { id: product.id } }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al crear producto" }
  }
}

export async function updateProductAction(
  productId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const parsed = parseProductForm(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Validación fallida" }
    }

    const existingImage = formData.get("existingImage")?.toString() ?? ""
    const file = getImageFile(formData)
    let imageUrls: string[] = existingImage ? [existingImage] : []

    if (file) {
      const uploaded = await uploadProductImage(file, productId)
      if ("error" in uploaded) {
        return { success: false, error: uploaded.error }
      }
      imageUrls = [uploaded.url]
    }

    if (!imageUrls.length) {
      return { success: false, error: "El producto debe tener al menos una imagen" }
    }

    const techSheet = await resolveTechSheetUrl(formData, productId)
    if ("error" in techSheet) {
      return { success: false, error: techSheet.error }
    }

    const variantDrafts = parseVariantDrafts(formData)
    if (parsed.data.hasVariants && variantDrafts.filter((v) => v.label.trim()).length === 0) {
      return { success: false, error: "Añade al menos una variante con nombre" }
    }

    const variantImageUrls = parsed.data.hasVariants
      ? await uploadVariantImages(formData, productId, variantDrafts)
      : new Map<string, string>()

    await updateProduct(
      productId,
      { ...parsed.data, techSheetUrl: techSheet.url || null },
      imageUrls,
      parsed.data.hasVariants
        ? {
            optionGroupName: parsed.data.optionGroupName ?? "Opción",
            variants: variantDrafts,
            imageUrls: variantImageUrls,
          }
        : undefined
    )

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${productId}/edit`)
    revalidatePath("/products")
    revalidatePath("/store")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al actualizar" }
  }
}

export async function deleteProductAction(productId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await softDeleteProduct(productId)
    revalidatePath("/admin/products")
    revalidatePath("/products")
    revalidatePath("/store")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al eliminar" }
  }
}
